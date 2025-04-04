"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextSubscriptionManager = void 0;
const tslib_1 = require("tslib");
const debug_1 = tslib_1.__importDefault(require("debug"));
const events_1 = require("events");
const p_event_1 = require("p-event");
const debug = (0, debug_1.default)('loopback:context:subscription');
/**
 * An implementation of `Subscription` interface for context events
 */
class ContextSubscription {
    constructor(context, observer) {
        this.context = context;
        this.observer = observer;
        this._closed = false;
    }
    unsubscribe() {
        this.context.unsubscribe(this.observer);
        this._closed = true;
    }
    get closed() {
        return this._closed;
    }
}
/**
 * Manager for context observer subscriptions
 */
class ContextSubscriptionManager extends events_1.EventEmitter {
    constructor(context) {
        super();
        this.context = context;
        /**
         * Internal counter for pending notification events which are yet to be
         * processed by observers.
         */
        this.pendingNotifications = 0;
        this.setMaxListeners(Infinity);
    }
    /**
     * @internal
     */
    get parentContextEventListener() {
        return this._parentContextEventListener;
    }
    /**
     * @internal
     */
    get observers() {
        return this._observers;
    }
    /**
     * Wrap the debug statement so that it always print out the context name
     * as the prefix
     * @param args - Arguments for the debug
     */
    _debug(...args) {
        /* istanbul ignore if */
        if (!debug.enabled)
            return;
        const formatter = args.shift();
        if (typeof formatter === 'string') {
            debug(`[%s] ${formatter}`, this.context.name, ...args);
        }
        else {
            debug('[%s] ', this.context.name, formatter, ...args);
        }
    }
    /**
     * Set up an internal listener to notify registered observers asynchronously
     * upon `bind` and `unbind` events. This method will be called lazily when
     * the first observer is added.
     */
    setupEventHandlersIfNeeded() {
        if (this.notificationQueue != null)
            return;
        if (this.context.parent != null) {
            /**
             * Add an event listener to its parent context so that this context will
             * be notified of parent events, such as `bind` or `unbind`.
             */
            this._parentContextEventListener = event => {
                this.handleParentEvent(event);
            };
            // Listen on the parent context events
            this.context.parent.on('bind', this._parentContextEventListener);
            this.context.parent.on('unbind', this._parentContextEventListener);
        }
        // The following are two async functions. Returned promises are ignored as
        // they are long-running background tasks.
        this.startNotificationTask().catch(err => {
            this.handleNotificationError(err);
        });
        let ctx = this.context.parent;
        while (ctx) {
            ctx.subscriptionManager.setupEventHandlersIfNeeded();
            ctx = ctx.parent;
        }
    }
    handleParentEvent(event) {
        const { binding, context, type } = event;
        // Propagate the event to this context only if the binding key does not
        // exist in this context. The parent binding is shadowed if there is a
        // binding with the same key in this one.
        if (this.context.contains(binding.key)) {
            this._debug('Event %s %s is not re-emitted from %s to %s', type, binding.key, context.name, this.context.name);
            return;
        }
        this._debug('Re-emitting %s %s from %s to %s', type, binding.key, context.name, this.context.name);
        this.context.emitEvent(type, event);
    }
    /**
     * A strongly-typed method to emit context events
     * @param type Event type
     * @param event Context event
     */
    emitEvent(type, event) {
        this.emit(type, event);
    }
    /**
     * Emit an `error` event
     * @param err Error
     */
    emitError(err) {
        this.emit('error', err);
    }
    /**
     * Start a background task to listen on context events and notify observers
     */
    startNotificationTask() {
        // Set up listeners on `bind` and `unbind` for notifications
        this.setupNotification('bind', 'unbind');
        // Create an async iterator for the `notification` event as a queue
        this.notificationQueue = (0, p_event_1.iterator)(this, 'notification', {
            // Do not end the iterator if an error event is emitted on the
            // subscription manager
            rejectionEvents: [],
        });
        return this.processNotifications();
    }
    /**
     * Publish an event to the registered observers. Please note the
     * notification is queued and performed asynchronously so that we allow fluent
     * APIs such as `ctx.bind('key').to(...).tag(...);` and give observers the
     * fully populated binding.
     *
     * @param event - Context event
     * @param observers - Current set of context observers
     */
    async notifyObservers(event, observers = this._observers) {
        if (!observers || observers.size === 0)
            return;
        const { type, binding, context } = event;
        for (const observer of observers) {
            if (typeof observer === 'function') {
                await observer(type, binding, context);
            }
            else if (!observer.filter || observer.filter(binding)) {
                await observer.observe(type, binding, context);
            }
        }
    }
    /**
     * Process notification events as they arrive on the queue
     */
    async processNotifications() {
        const events = this.notificationQueue;
        if (events == null)
            return;
        for await (const { type, binding, context, observers } of events) {
            // The loop will happen asynchronously upon events
            try {
                // The execution of observers happen in the Promise micro-task queue
                await this.notifyObservers({ type, binding, context }, observers);
                this.pendingNotifications--;
                this._debug('Observers notified for %s of binding %s', type, binding.key);
                this.emitEvent('observersNotified', { type, binding, context });
            }
            catch (err) {
                // Do not reduce the pending notification count so that errors
                // can be captured by waitUntilPendingNotificationsDone
                this._debug('Error caught from observers', err);
                // Errors caught from observers.
                if (this.listenerCount('error') > 0) {
                    // waitUntilPendingNotificationsDone may be called
                    this.emitError(err);
                }
                else {
                    // Emit it to the current context. If no error listeners are
                    // registered, crash the process.
                    this.handleNotificationError(err);
                }
            }
        }
    }
    /**
     * Listen on given event types and emit `notification` event. This method
     * merge multiple event types into one for notification.
     * @param eventTypes - Context event types
     */
    setupNotification(...eventTypes) {
        for (const type of eventTypes) {
            this.context.on(type, ({ binding, context }) => {
                // No need to schedule notifications if no observers are present
                if (!this._observers || this._observers.size === 0)
                    return;
                // Track pending events
                this.pendingNotifications++;
                // Take a snapshot of current observers to ensure notifications of this
                // event will only be sent to current ones. Emit a new event to notify
                // current context observers.
                this.emitEvent('notification', {
                    type,
                    binding,
                    context,
                    observers: new Set(this._observers),
                });
            });
        }
    }
    /**
     * Wait until observers are notified for all of currently pending notification
     * events.
     *
     * This method is for test only to perform assertions after observers are
     * notified for relevant events.
     */
    async waitUntilPendingNotificationsDone(timeout) {
        const count = this.pendingNotifications;
        debug('Number of pending notifications: %d', count);
        if (count === 0)
            return;
        await (0, p_event_1.multiple)(this, 'observersNotified', { count, timeout });
    }
    /**
     * Add a context event observer to the context
     * @param observer - Context observer instance or function
     */
    subscribe(observer) {
        var _a;
        this._observers = (_a = this._observers) !== null && _a !== void 0 ? _a : new Set();
        this.setupEventHandlersIfNeeded();
        this._observers.add(observer);
        return new ContextSubscription(this.context, observer);
    }
    /**
     * Remove the context event observer from the context
     * @param observer - Context event observer
     */
    unsubscribe(observer) {
        if (!this._observers)
            return false;
        return this._observers.delete(observer);
    }
    /**
     * Check if an observer is subscribed to this context
     * @param observer - Context observer
     */
    isSubscribed(observer) {
        if (!this._observers)
            return false;
        return this._observers.has(observer);
    }
    /**
     * Handle errors caught during the notification of observers
     * @param err - Error
     */
    handleNotificationError(err) {
        // Bubbling up the error event over the context chain
        // until we find an error listener
        let ctx = this.context;
        while (ctx) {
            if (ctx.listenerCount('error') === 0) {
                // No error listener found, try its parent
                ctx = ctx.parent;
                continue;
            }
            this._debug('Emitting error to context %s', ctx.name, err);
            ctx.emitError(err);
            return;
        }
        // No context with error listeners found
        this._debug('No error handler is configured for the context chain', err);
        // Let it crash now by emitting an error event
        this.context.emitError(err);
    }
    /**
     * Close the context: clear observers, stop notifications, and remove event
     * listeners from its parent context.
     *
     * @remarks
     * This method MUST be called to avoid memory leaks once a context object is
     * no longer needed and should be recycled. An example is the `RequestContext`,
     * which is created per request.
     */
    close() {
        this._observers = undefined;
        if (this.notificationQueue != null) {
            // Cancel the notification iterator
            this.notificationQueue.return(undefined).catch(err => {
                this.handleNotificationError(err);
            });
            this.notificationQueue = undefined;
        }
        if (this.context.parent && this._parentContextEventListener) {
            this.context.parent.removeListener('bind', this._parentContextEventListener);
            this.context.parent.removeListener('unbind', this._parentContextEventListener);
            this._parentContextEventListener = undefined;
        }
    }
}
exports.ContextSubscriptionManager = ContextSubscriptionManager;
//# sourceMappingURL=context-subscription.js.map
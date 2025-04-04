"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.createViewGetter = exports.ContextView = void 0;
const tslib_1 = require("tslib");
const events_1 = require("events");
const debug_1 = tslib_1.__importDefault(require("debug"));
const resolution_session_1 = require("./resolution-session");
const value_promise_1 = require("./value-promise");
const debug = (0, debug_1.default)('loopback:context:view');
/**
 * `ContextView` provides a view for a given context chain to maintain a live
 * list of matching bindings and their resolved values within the context
 * hierarchy.
 *
 * This class is the key utility to implement dynamic extensions for extension
 * points. For example, the RestServer can react to `controller` bindings even
 * they are added/removed/updated after the application starts.
 *
 * `ContextView` is an event emitter that emits the following events:
 * - 'bind': when a binding is added to the view
 * - 'unbind': when a binding is removed from the view
 * - 'close': when the view is closed (stopped observing context events)
 * - 'refresh': when the view is refreshed as bindings are added/removed
 * - 'resolve': when the cached values are resolved and updated
 */
class ContextView extends events_1.EventEmitter {
    /**
     * Create a context view
     * @param context - Context object to watch
     * @param filter - Binding filter to match bindings of interest
     * @param comparator - Comparator to sort the matched bindings
     */
    constructor(context, filter, comparator, resolutionOptions) {
        super();
        this.context = context;
        this.filter = filter;
        this.comparator = comparator;
        this.resolutionOptions = resolutionOptions;
    }
    /**
     * Update the cached values keyed by binding
     * @param values - An array of resolved values
     */
    updateCachedValues(values) {
        var _a;
        if (this._cachedBindings == null)
            return undefined;
        this._cachedValues = new Map();
        for (let i = 0; i < ((_a = this._cachedBindings) === null || _a === void 0 ? void 0 : _a.length); i++) {
            this._cachedValues.set(this._cachedBindings[i], values[i]);
        }
        return this._cachedValues;
    }
    /**
     * Get an array of cached values
     */
    getCachedValues() {
        var _a, _b;
        return Array.from((_b = (_a = this._cachedValues) === null || _a === void 0 ? void 0 : _a.values()) !== null && _b !== void 0 ? _b : []);
    }
    /**
     * Start listening events from the context
     */
    open() {
        debug('Start listening on changes of context %s', this.context.name);
        if (this.context.isSubscribed(this)) {
            return this._subscription;
        }
        this._subscription = this.context.subscribe(this);
        return this._subscription;
    }
    /**
     * Stop listening events from the context
     */
    close() {
        debug('Stop listening on changes of context %s', this.context.name);
        if (!this._subscription || this._subscription.closed)
            return;
        this._subscription.unsubscribe();
        this._subscription = undefined;
        this.emit('close');
    }
    /**
     * Get the list of matched bindings. If they are not cached, it tries to find
     * them from the context.
     */
    get bindings() {
        debug('Reading bindings');
        if (this._cachedBindings == null) {
            this._cachedBindings = this.findBindings();
        }
        return this._cachedBindings;
    }
    /**
     * Find matching bindings and refresh the cache
     */
    findBindings() {
        debug('Finding matching bindings');
        const found = this.context.find(this.filter);
        if (typeof this.comparator === 'function') {
            found.sort(this.comparator);
        }
        /* istanbul ignore if */
        if (debug.enabled) {
            debug('Bindings found', found.map(b => b.key));
        }
        return found;
    }
    /**
     * Listen on `bind` or `unbind` and invalidate the cache
     */
    observe(event, binding, context) {
        var _a;
        const ctxEvent = {
            context,
            binding,
            type: event,
        };
        debug('Observed event %s %s %s', event, binding.key, context.name);
        if (event === 'unbind') {
            const cachedValue = (_a = this._cachedValues) === null || _a === void 0 ? void 0 : _a.get(binding);
            this.emit(event, { ...ctxEvent, cachedValue });
        }
        else {
            this.emit(event, ctxEvent);
        }
        this.refresh();
    }
    /**
     * Refresh the view by invalidating its cache
     */
    refresh() {
        debug('Refreshing the view by invalidating cache');
        this._cachedBindings = undefined;
        this._cachedValues = undefined;
        this.emit('refresh');
    }
    /**
     * Resolve values for the matching bindings
     * @param session - Resolution session
     */
    resolve(session) {
        debug('Resolving values');
        if (this._cachedValues != null) {
            return this.getCachedValues();
        }
        const bindings = this.bindings;
        let result = (0, value_promise_1.resolveList)(bindings, b => {
            const options = {
                ...this.resolutionOptions,
                ...(0, resolution_session_1.asResolutionOptions)(session),
            };
            // https://github.com/loopbackio/loopback-next/issues/9041
            // We should start with a new session for `view` resolution to avoid
            // possible circular dependencies
            options.session = undefined;
            return b.getValue(this.context, options);
        });
        if ((0, value_promise_1.isPromiseLike)(result)) {
            result = result.then(values => {
                const list = values.filter(v => v != null);
                this.updateCachedValues(list);
                this.emit('resolve', list);
                return list;
            });
        }
        else {
            // Clone the array so that the cached values won't be mutated
            const list = (result = result.filter(v => v != null));
            this.updateCachedValues(list);
            this.emit('resolve', list);
        }
        return result;
    }
    /**
     * Get the list of resolved values. If they are not cached, it tries to find
     * and resolve them.
     */
    async values(session) {
        debug('Reading values');
        // Wait for the next tick so that context event notification can be emitted
        await new Promise(resolve => {
            process.nextTick(() => resolve());
        });
        if (this._cachedValues == null) {
            return this.resolve(session);
        }
        return this.getCachedValues();
    }
    /**
     * As a `Getter` function
     */
    asGetter(session) {
        return () => this.values(session);
    }
    /**
     * Get the single value
     */
    async singleValue(session) {
        const values = await this.values(session);
        if (values.length === 0)
            return undefined;
        if (values.length === 1)
            return values[0];
        throw new Error('The ContextView has more than one value. Use values() to access them.');
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    on(event, listener) {
        return super.on(event, listener);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    once(event, listener) {
        return super.once(event, listener);
    }
}
exports.ContextView = ContextView;
/**
 * Create a context view as a getter
 * @param ctx - Context object
 * @param bindingFilter - A function to match bindings
 * @param bindingComparatorOrSession - A function to sort matched bindings or
 * resolution session if the comparator is not needed
 * @param session - Resolution session if the comparator is provided
 */
function createViewGetter(ctx, bindingFilter, bindingComparatorOrSession, session) {
    let bindingComparator = undefined;
    if (typeof bindingComparatorOrSession === 'function') {
        bindingComparator = bindingComparatorOrSession;
    }
    else if (bindingComparatorOrSession instanceof resolution_session_1.ResolutionSession) {
        session = bindingComparatorOrSession;
    }
    const options = (0, resolution_session_1.asResolutionOptions)(session);
    const view = new ContextView(ctx, bindingFilter, bindingComparator, options);
    view.open();
    return view.asGetter(options);
}
exports.createViewGetter = createViewGetter;
//# sourceMappingURL=context-view.js.map
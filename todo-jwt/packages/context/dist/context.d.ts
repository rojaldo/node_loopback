/// <reference types="node" />
import { Debugger } from 'debug';
import { EventEmitter } from 'events';
import { Binding, BindingInspectOptions, BindingScope, BindingTag } from './binding';
import { ConfigurationResolver } from './binding-config';
import { BindingFilter } from './binding-filter';
import { BindingAddress } from './binding-key';
import { BindingComparator } from './binding-sorter';
import { ContextEvent, ContextEventListener } from './context-event';
import { ContextEventObserver, ContextObserver } from './context-observer';
import { ContextSubscriptionManager, Subscription } from './context-subscription';
import { ContextTagIndexer } from './context-tag-indexer';
import { ContextView } from './context-view';
import { JSONObject } from './json-types';
import { ResolutionOptions, ResolutionOptionsOrSession, ResolutionSession } from './resolution-session';
import { BoundValue, ValueOrPromise } from './value-promise';
/**
 * Context provides an implementation of Inversion of Control (IoC) container
 */
export declare class Context extends EventEmitter {
    /**
     * Name of the context
     */
    readonly name: string;
    /**
     * Key to binding map as the internal registry
     */
    protected readonly registry: Map<string, Binding>;
    /**
     * Indexer for bindings by tag
     */
    protected readonly tagIndexer: ContextTagIndexer;
    /**
     * Manager for observer subscriptions
     */
    readonly subscriptionManager: ContextSubscriptionManager;
    /**
     * Parent context
     */
    protected _parent?: Context;
    /**
     * Configuration resolver
     */
    protected configResolver: ConfigurationResolver;
    /**
     * A debug function which can be overridden by subclasses.
     *
     * @example
     * ```ts
     * import debugFactory from 'debug';
     * const debug = debugFactory('loopback:context:application');
     * export class Application extends Context {
     *   super('application');
     *   this._debug = debug;
     * }
     * ```
     */
    protected _debug: Debugger;
    /**
     * Scope for binding resolution
     */
    scope: BindingScope;
    /**
     * Create a new context.
     *
     * @example
     * ```ts
     * // Create a new root context, let the framework to create a unique name
     * const rootCtx = new Context();
     *
     * // Create a new child context inheriting bindings from `rootCtx`
     * const childCtx = new Context(rootCtx);
     *
     * // Create another root context called "application"
     * const appCtx = new Context('application');
     *
     * // Create a new child context called "request" and inheriting bindings
     * // from `appCtx`
     * const reqCtx = new Context(appCtx, 'request');
     * ```
     * @param _parent - The optional parent context
     * @param name - Name of the context. If not provided, a unique identifier
     * will be generated as the name.
     */
    constructor(_parent?: Context | string, name?: string);
    /**
     * Get the debug namespace for the context class. Subclasses can override
     * this method to supply its own namespace.
     *
     * @example
     * ```ts
     * export class Application extends Context {
     *   super('application');
     * }
     *
     * protected getDebugNamespace() {
     *   return 'loopback:context:application';
     * }
     * ```
     */
    protected getDebugNamespace(): string;
    private generateName;
    /**
     * @internal
     * Getter for ContextSubscriptionManager
     */
    get parent(): Context | undefined;
    /**
     * Wrap the debug statement so that it always print out the context name
     * as the prefix
     * @param args - Arguments for the debug
     */
    protected debug(...args: unknown[]): void;
    /**
     * A strongly-typed method to emit context events
     * @param type Event type
     * @param event Context event
     */
    emitEvent<T extends ContextEvent>(type: string, event: T): void;
    /**
     * Emit an `error` event
     * @param err Error
     */
    emitError(err: unknown): void;
    /**
     * Create a binding with the given key in the context. If a locked binding
     * already exists with the same key, an error will be thrown.
     *
     * @param key - Binding key
     */
    bind<ValueType = BoundValue>(key: BindingAddress<ValueType>): Binding<ValueType>;
    /**
     * Add a binding to the context. If a locked binding already exists with the
     * same key, an error will be thrown.
     * @param binding - The configured binding to be added
     */
    add(binding: Binding<unknown>): this;
    /**
     * Create a corresponding binding for configuration of the target bound by
     * the given key in the context.
     *
     * For example, `ctx.configure('controllers.MyController').to({x: 1})` will
     * create binding `controllers.MyController:$config` with value `{x: 1}`.
     *
     * @param key - The key for the binding to be configured
     */
    configure<ConfigValueType = BoundValue>(key?: BindingAddress): Binding<ConfigValueType>;
    /**
     * Get the value or promise of configuration for a given binding by key
     *
     * @param key - Binding key
     * @param propertyPath - Property path for the option. For example, `x.y`
     * requests for `<config>.x.y`. If not set, the `<config>` object will be
     * returned.
     * @param resolutionOptions - Options for the resolution.
     * - optional: if not set or set to `true`, `undefined` will be returned if
     * no corresponding value is found. Otherwise, an error will be thrown.
     */
    getConfigAsValueOrPromise<ConfigValueType>(key: BindingAddress, propertyPath?: string, resolutionOptions?: ResolutionOptions): ValueOrPromise<ConfigValueType | undefined>;
    /**
     * Set up the configuration resolver if needed
     */
    protected setupConfigurationResolverIfNeeded(): ConfigurationResolver;
    /**
     * Resolve configuration for the binding by key
     *
     * @param key - Binding key
     * @param propertyPath - Property path for the option. For example, `x.y`
     * requests for `<config>.x.y`. If not set, the `<config>` object will be
     * returned.
     * @param resolutionOptions - Options for the resolution.
     */
    getConfig<ConfigValueType>(key: BindingAddress, propertyPath?: string, resolutionOptions?: ResolutionOptions): Promise<ConfigValueType | undefined>;
    /**
     * Resolve configuration synchronously for the binding by key
     *
     * @param key - Binding key
     * @param propertyPath - Property path for the option. For example, `x.y`
     * requests for `config.x.y`. If not set, the `config` object will be
     * returned.
     * @param resolutionOptions - Options for the resolution.
     */
    getConfigSync<ConfigValueType>(key: BindingAddress, propertyPath?: string, resolutionOptions?: ResolutionOptions): ConfigValueType | undefined;
    /**
     * Unbind a binding from the context. No parent contexts will be checked.
     *
     * @remarks
     * If you need to unbind a binding owned by a parent context, use the code
     * below:
     *
     * ```ts
     * const ownerCtx = ctx.getOwnerContext(key);
     * return ownerCtx != null && ownerCtx.unbind(key);
     * ```
     *
     * @param key - Binding key
     * @returns true if the binding key is found and removed from this context
     */
    unbind(key: BindingAddress): boolean;
    /**
     * Add a context event observer to the context
     * @param observer - Context observer instance or function
     */
    subscribe(observer: ContextEventObserver): Subscription;
    /**
     * Remove the context event observer from the context
     * @param observer - Context event observer
     */
    unsubscribe(observer: ContextEventObserver): boolean;
    /**
     * Close the context: clear observers, stop notifications, and remove event
     * listeners from its parent context.
     *
     * @remarks
     * This method MUST be called to avoid memory leaks once a context object is
     * no longer needed and should be recycled. An example is the `RequestContext`,
     * which is created per request.
     */
    close(): void;
    /**
     * Check if an observer is subscribed to this context
     * @param observer - Context observer
     */
    isSubscribed(observer: ContextObserver): boolean;
    /**
     * Create a view of the context chain with the given binding filter
     * @param filter - A function to match bindings
     * @param comparator - A function to sort matched bindings
     * @param options - Resolution options
     */
    createView<T = unknown>(filter: BindingFilter, comparator?: BindingComparator, options?: Omit<ResolutionOptions, 'session'>): ContextView<T>;
    /**
     * Check if a binding exists with the given key in the local context without
     * delegating to the parent context
     * @param key - Binding key
     */
    contains(key: BindingAddress): boolean;
    /**
     * Check if a key is bound in the context or its ancestors
     * @param key - Binding key
     */
    isBound(key: BindingAddress): boolean;
    /**
     * Get the owning context for a binding or its key
     * @param keyOrBinding - Binding object or key
     */
    getOwnerContext(keyOrBinding: BindingAddress | Readonly<Binding<unknown>>): Context | undefined;
    /**
     * Get the context matching the scope
     * @param scope - Binding scope
     */
    getScopedContext(scope: BindingScope.APPLICATION | BindingScope.SERVER | BindingScope.REQUEST): Context | undefined;
    /**
     * Locate the resolution context for the given binding. Only bindings in the
     * resolution context and its ancestors are visible as dependencies to resolve
     * the given binding
     * @param binding - Binding object
     */
    getResolutionContext(binding: Readonly<Binding<unknown>>): Context | undefined;
    /**
     * Check if this context is visible (same or ancestor) to the given one
     * @param ctx - Another context object
     */
    isVisibleTo(ctx: Context): boolean;
    /**
     * Find bindings using a key pattern or filter function
     * @param pattern - A filter function, a regexp or a wildcard pattern with
     * optional `*` and `?`. Find returns such bindings where the key matches
     * the provided pattern.
     *
     * For a wildcard:
     * - `*` matches zero or more characters except `.` and `:`
     * - `?` matches exactly one character except `.` and `:`
     *
     * For a filter function:
     * - return `true` to include the binding in the results
     * - return `false` to exclude it.
     */
    find<ValueType = BoundValue>(pattern?: string | RegExp | BindingFilter): Readonly<Binding<ValueType>>[];
    /**
     * Find bindings using the tag filter. If the filter matches one of the
     * binding tags, the binding is included.
     *
     * @param tagFilter - A filter for tags. It can be in one of the following
     * forms:
     * - A regular expression, such as `/controller/`
     * - A wildcard pattern string with optional `*` and `?`, such as `'con*'`
     *   For a wildcard:
     *   - `*` matches zero or more characters except `.` and `:`
     *   - `?` matches exactly one character except `.` and `:`
     * - An object containing tag name/value pairs, such as
     * `{name: 'my-controller'}`
     */
    findByTag<ValueType = BoundValue>(tagFilter: BindingTag | RegExp): Readonly<Binding<ValueType>>[];
    /**
     * Find bindings by tag leveraging indexes
     * @param tag - Tag name pattern or name/value pairs
     */
    protected _findByTagIndex<ValueType = BoundValue>(tag: BindingTag | RegExp): Readonly<Binding<ValueType>>[];
    protected _mergeWithParent<ValueType>(childList: Readonly<Binding<ValueType>>[], parentList?: Readonly<Binding<ValueType>>[]): Readonly<Binding<ValueType>>[];
    /**
     * Get the value bound to the given key, throw an error when no value is
     * bound for the given key.
     *
     * @example
     *
     * ```ts
     * // get the value bound to "application.instance"
     * const app = await ctx.get<Application>('application.instance');
     *
     * // get "rest" property from the value bound to "config"
     * const config = await ctx.get<RestComponentConfig>('config#rest');
     *
     * // get "a" property of "numbers" property from the value bound to "data"
     * ctx.bind('data').to({numbers: {a: 1, b: 2}, port: 3000});
     * const a = await ctx.get<number>('data#numbers.a');
     * ```
     *
     * @param keyWithPath - The binding key, optionally suffixed with a path to the
     *   (deeply) nested property to retrieve.
     * @param session - Optional session for resolution (accepted for backward
     * compatibility)
     * @returns A promise of the bound value.
     */
    get<ValueType>(keyWithPath: BindingAddress<ValueType>, session?: ResolutionSession): Promise<ValueType>;
    /**
     * Get the value bound to the given key, optionally return a (deep) property
     * of the bound value.
     *
     * @example
     *
     * ```ts
     * // get "rest" property from the value bound to "config"
     * // use `undefined` when no config is provided
     * const config = await ctx.get<RestComponentConfig>('config#rest', {
     *   optional: true
     * });
     * ```
     *
     * @param keyWithPath - The binding key, optionally suffixed with a path to the
     *   (deeply) nested property to retrieve.
     * @param options - Options for resolution.
     * @returns A promise of the bound value, or a promise of undefined when
     * the optional binding is not found.
     */
    get<ValueType>(keyWithPath: BindingAddress<ValueType>, options: ResolutionOptions): Promise<ValueType | undefined>;
    /**
     * Get the synchronous value bound to the given key, optionally
     * return a (deep) property of the bound value.
     *
     * This method throws an error if the bound value requires async computation
     * (returns a promise). You should never rely on sync bindings in production
     * code.
     *
     * @example
     *
     * ```ts
     * // get the value bound to "application.instance"
     * const app = ctx.getSync<Application>('application.instance');
     *
     * // get "rest" property from the value bound to "config"
     * const config = await ctx.getSync<RestComponentConfig>('config#rest');
     * ```
     *
     * @param keyWithPath - The binding key, optionally suffixed with a path to the
     *   (deeply) nested property to retrieve.
     * @param session - Session for resolution (accepted for backward compatibility)
     * @returns A promise of the bound value.
     */
    getSync<ValueType>(keyWithPath: BindingAddress<ValueType>, session?: ResolutionSession): ValueType;
    /**
     * Get the synchronous value bound to the given key, optionally
     * return a (deep) property of the bound value.
     *
     * This method throws an error if the bound value requires async computation
     * (returns a promise). You should never rely on sync bindings in production
     * code.
     *
     * @example
     *
     * ```ts
     * // get "rest" property from the value bound to "config"
     * // use "undefined" when no config is provided
     * const config = await ctx.getSync<RestComponentConfig>('config#rest', {
     *   optional: true
     * });
     * ```
     *
     * @param keyWithPath - The binding key, optionally suffixed with a path to the
     *   (deeply) nested property to retrieve.
     * @param options - Options for resolution.
     * @returns The bound value, or undefined when an optional binding is not found.
     */
    getSync<ValueType>(keyWithPath: BindingAddress<ValueType>, options?: ResolutionOptions): ValueType | undefined;
    /**
     * Look up a binding by key in the context and its ancestors. If no matching
     * binding is found, an error will be thrown.
     *
     * @param key - Binding key
     */
    getBinding<ValueType = BoundValue>(key: BindingAddress<ValueType>): Binding<ValueType>;
    /**
     * Look up a binding by key in the context and its ancestors. If no matching
     * binding is found and `options.optional` is not set to true, an error will
     * be thrown.
     *
     * @param key - Binding key
     * @param options - Options to control if the binding is optional. If
     * `options.optional` is set to true, the method will return `undefined`
     * instead of throwing an error if the binding key is not found.
     */
    getBinding<ValueType>(key: BindingAddress<ValueType>, options?: {
        optional?: boolean;
    }): Binding<ValueType> | undefined;
    /**
     * Find or create a binding for the given key
     * @param key - Binding address
     * @param policy - Binding creation policy
     */
    findOrCreateBinding<T>(key: BindingAddress<T>, policy?: BindingCreationPolicy): Binding<T>;
    /**
     * Get the value bound to the given key.
     *
     * This is an internal version that preserves the dual sync/async result
     * of `Binding#getValue()`. Users should use `get()` or `getSync()` instead.
     *
     * @example
     *
     * ```ts
     * // get the value bound to "application.instance"
     * ctx.getValueOrPromise<Application>('application.instance');
     *
     * // get "rest" property from the value bound to "config"
     * ctx.getValueOrPromise<RestComponentConfig>('config#rest');
     *
     * // get "a" property of "numbers" property from the value bound to "data"
     * ctx.bind('data').to({numbers: {a: 1, b: 2}, port: 3000});
     * ctx.getValueOrPromise<number>('data#numbers.a');
     * ```
     *
     * @param keyWithPath - The binding key, optionally suffixed with a path to the
     *   (deeply) nested property to retrieve.
     * @param optionsOrSession - Options for resolution or a session
     * @returns The bound value or a promise of the bound value, depending
     *   on how the binding is configured.
     * @internal
     */
    getValueOrPromise<ValueType>(keyWithPath: BindingAddress<ValueType>, optionsOrSession?: ResolutionOptionsOrSession): ValueOrPromise<ValueType | undefined>;
    /**
     * Create a plain JSON object for the context
     */
    toJSON(): JSONObject;
    /**
     * Inspect the context and dump out a JSON object representing the context
     * hierarchy
     * @param options - Options for inspect
     */
    inspect(options?: ContextInspectOptions): JSONObject;
    /**
     * Inspect the context hierarchy
     * @param options - Options for inspect
     * @param visitedClasses - A map to keep class to name so that we can have
     * different names for classes with colliding names. The situation can happen
     * when two classes with the same name are bound in different modules.
     */
    private _inspect;
    /**
     * The "bind" event is emitted when a new binding is added to the context.
     * The "unbind" event is emitted when an existing binding is removed.
     *
     * @param eventName The name of the event - always `bind` or `unbind`.
     * @param listener The listener function to call when the event is emitted.
     */
    on(eventName: 'bind' | 'unbind', listener: ContextEventListener): this;
    on(event: string | symbol, listener: (...args: any[]) => void): this;
    /**
     * The "bind" event is emitted when a new binding is added to the context.
     * The "unbind" event is emitted when an existing binding is removed.
     *
     * @param eventName The name of the event - always `bind` or `unbind`.
     * @param listener The listener function to call when the event is emitted.
     */
    once(eventName: 'bind' | 'unbind', listener: ContextEventListener): this;
    once(event: string | symbol, listener: (...args: any[]) => void): this;
}
/**
 * Options for context.inspect()
 */
export interface ContextInspectOptions extends BindingInspectOptions {
    /**
     * The flag to control if parent context should be inspected
     */
    includeParent?: boolean;
}
/**
 * Policy to control if a binding should be created for the context
 */
export declare enum BindingCreationPolicy {
    /**
     * Always create a binding with the key for the context
     */
    ALWAYS_CREATE = "Always",
    /**
     * Never create a binding for the context. If the key is not bound in the
     * context, throw an error.
     */
    NEVER_CREATE = "Never",
    /**
     * Create a binding if the key is not bound in the context. Otherwise, return
     * the existing binding.
     */
    CREATE_IF_NOT_BOUND = "IfNotBound"
}

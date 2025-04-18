/// <reference types="node" />
import { Binding, BindingAddress, Constructor, Context, MixinTarget, Provider } from '@loopback/core';
import { ExpressMiddlewareFactory, ExpressRequestHandler, Middleware, MiddlewareBindingOptions } from '../types';
export declare function MiddlewareMixin<T extends MixinTarget<Context>>(superClass: T): {
    new (...args: any[]): {
        /**
         * Bind an Express middleware to this server context
         *
         * @example
         * ```ts
         * import myExpressMiddlewareFactory from 'my-express-middleware';
         * const myExpressMiddlewareConfig= {};
         * const myExpressMiddleware = myExpressMiddlewareFactory(myExpressMiddlewareConfig);
         * server.expressMiddleware('middleware.express.my', myExpressMiddleware);
         * // Or
         * server.expressMiddleware('middleware.express.my', [myExpressMiddleware]);
         * ```
         * @param key - Middleware binding key
         * @param middleware - Express middleware handler function(s)
         *
         */
        expressMiddleware(key: BindingAddress, middleware: ExpressRequestHandler | ExpressRequestHandler[], options?: MiddlewareBindingOptions): Binding<Middleware>;
        /**
         * Bind an Express middleware to this server context
         *
         * @example
         * ```ts
         * import myExpressMiddlewareFactory from 'my-express-middleware';
         * const myExpressMiddlewareConfig= {};
         * const myExpressMiddleware = myExpressMiddlewareFactory(myExpressMiddlewareConfig);
         * server.expressMiddleware('middleware.express.my', myExpressMiddleware);
         * // Or
         * server.expressMiddleware('middleware.express.my', [myExpressMiddleware]);
         * ```
         * @param key - Middleware binding key
         * @param middleware - Express middleware handler function(s)
         *
         */
        expressMiddleware<CFG>(middlewareFactory: ExpressMiddlewareFactory<CFG>, middlewareConfig?: CFG | undefined, options?: MiddlewareBindingOptions): Binding<Middleware>;
        /**
         * Bind an Express middleware to this server context
         *
         * @example
         * ```ts
         * import myExpressMiddlewareFactory from 'my-express-middleware';
         * const myExpressMiddlewareConfig= {};
         * const myExpressMiddleware = myExpressMiddlewareFactory(myExpressMiddlewareConfig);
         * server.expressMiddleware('middleware.express.my', myExpressMiddleware);
         * // Or
         * server.expressMiddleware('middleware.express.my', [myExpressMiddleware]);
         * ```
         * @param key - Middleware binding key
         * @param middleware - Express middleware handler function(s)
         *
         */
        expressMiddleware<CFG_1>(factoryOrKey: BindingAddress<Middleware> | ExpressMiddlewareFactory<CFG_1>, configOrHandler: CFG_1 | ExpressRequestHandler | ExpressRequestHandler[], options?: MiddlewareBindingOptions): Binding<Middleware>;
        /**
         * Register a middleware function or provider class
         *
         * @example
         * ```ts
         * const log: Middleware = async (requestCtx, next) {
         *   // ...
         * }
         * server.middleware(log);
         * ```
         *
         * @param middleware - Middleware function or provider class
         * @param options - Middleware binding options
         */
        middleware(middleware: Middleware | Constructor<Provider<Middleware>>, options?: MiddlewareBindingOptions): Binding<Middleware>;
        readonly name: string;
        readonly subscriptionManager: import("@loopback/core").ContextSubscriptionManager;
        scope: import("@loopback/core").BindingScope;
        readonly parent: Context | undefined;
        emitEvent: <T extends import("@loopback/core").ContextEvent>(type: string, event: T) => void;
        emitError: (err: unknown) => void;
        bind: <ValueType = any>(key: BindingAddress<ValueType>) => Binding<ValueType>;
        add: (binding: Binding<unknown>) => Context;
        configure: <ConfigValueType = any>(key?: BindingAddress | undefined) => Binding<ConfigValueType>;
        getConfigAsValueOrPromise: <ConfigValueType_1>(key: BindingAddress, propertyPath?: string | undefined, resolutionOptions?: import("@loopback/core").ResolutionOptions | undefined) => import("@loopback/core").ValueOrPromise<ConfigValueType_1 | undefined>;
        getConfig: <ConfigValueType_2>(key: BindingAddress, propertyPath?: string | undefined, resolutionOptions?: import("@loopback/core").ResolutionOptions | undefined) => Promise<ConfigValueType_2 | undefined>;
        getConfigSync: <ConfigValueType_3>(key: BindingAddress, propertyPath?: string | undefined, resolutionOptions?: import("@loopback/core").ResolutionOptions | undefined) => ConfigValueType_3 | undefined;
        unbind: (key: BindingAddress) => boolean;
        subscribe: (observer: import("@loopback/core").ContextEventObserver) => import("@loopback/core").Subscription;
        unsubscribe: (observer: import("@loopback/core").ContextEventObserver) => boolean;
        close: () => void;
        isSubscribed: (observer: import("@loopback/core").ContextObserver) => boolean;
        createView: <T_1 = unknown>(filter: import("@loopback/core").BindingFilter, comparator?: import("@loopback/core").BindingComparator | undefined, options?: Omit<import("@loopback/core").ResolutionOptions, "session"> | undefined) => import("@loopback/core").ContextView<T_1>;
        contains: (key: BindingAddress) => boolean;
        isBound: (key: BindingAddress) => boolean;
        getOwnerContext: (keyOrBinding: BindingAddress | Readonly<Binding<unknown>>) => Context | undefined;
        getScopedContext: (scope: import("@loopback/core").BindingScope.APPLICATION | import("@loopback/core").BindingScope.SERVER | import("@loopback/core").BindingScope.REQUEST) => Context | undefined;
        getResolutionContext: (binding: Readonly<Binding<unknown>>) => Context | undefined;
        isVisibleTo: (ctx: Context) => boolean;
        find: <ValueType_1 = any>(pattern?: string | RegExp | import("@loopback/core").BindingFilter | undefined) => Readonly<Binding<ValueType_1>>[];
        findByTag: <ValueType_2 = any>(tagFilter: RegExp | import("@loopback/core").BindingTag) => Readonly<Binding<ValueType_2>>[];
        get: {
            <ValueType_3>(keyWithPath: BindingAddress<ValueType_3>, session?: import("@loopback/core").ResolutionSession | undefined): Promise<ValueType_3>;
            <ValueType_4>(keyWithPath: BindingAddress<ValueType_4>, options: import("@loopback/core").ResolutionOptions): Promise<ValueType_4 | undefined>;
        };
        getSync: {
            <ValueType_5>(keyWithPath: BindingAddress<ValueType_5>, session?: import("@loopback/core").ResolutionSession | undefined): ValueType_5;
            <ValueType_6>(keyWithPath: BindingAddress<ValueType_6>, options?: import("@loopback/core").ResolutionOptions | undefined): ValueType_6 | undefined;
        };
        getBinding: {
            <ValueType_7 = any>(key: BindingAddress<ValueType_7>): Binding<ValueType_7>;
            <ValueType_8>(key: BindingAddress<ValueType_8>, options?: {
                optional?: boolean | undefined;
            } | undefined): Binding<ValueType_8> | undefined;
        };
        findOrCreateBinding: <T_2>(key: BindingAddress<T_2>, policy?: import("@loopback/core").BindingCreationPolicy | undefined) => Binding<T_2>;
        getValueOrPromise: <ValueType_9>(keyWithPath: BindingAddress<ValueType_9>, optionsOrSession?: import("@loopback/core").ResolutionOptionsOrSession | undefined) => import("@loopback/core").ValueOrPromise<ValueType_9 | undefined>;
        toJSON: () => import("@loopback/core").JSONObject;
        inspect: (options?: import("@loopback/core").ContextInspectOptions | undefined) => import("@loopback/core").JSONObject;
        on: {
            (eventName: "bind" | "unbind", listener: import("@loopback/core").ContextEventListener): Context;
            (event: string | symbol, listener: (...args: any[]) => void): Context;
        };
        once: {
            (eventName: "bind" | "unbind", listener: import("@loopback/core").ContextEventListener): Context;
            (event: string | symbol, listener: (...args: any[]) => void): Context;
        };
        [EventEmitter.captureRejectionSymbol]?: (<K>(error: Error, event: string | symbol, ...args: any[]) => void) | undefined;
        addListener: <K_1>(eventName: string | symbol, listener: (...args: any[]) => void) => Context;
        removeListener: <K_2>(eventName: string | symbol, listener: (...args: any[]) => void) => Context;
        off: <K_3>(eventName: string | symbol, listener: (...args: any[]) => void) => Context;
        removeAllListeners: (event?: string | symbol | undefined) => Context;
        setMaxListeners: (n: number) => Context;
        getMaxListeners: () => number;
        listeners: <K_4>(eventName: string | symbol) => Function[];
        rawListeners: <K_5>(eventName: string | symbol) => Function[];
        emit: <K_6>(eventName: string | symbol, ...args: any[]) => boolean;
        listenerCount: <K_7>(eventName: string | symbol, listener?: Function | undefined) => number;
        prependListener: <K_8>(eventName: string | symbol, listener: (...args: any[]) => void) => Context;
        prependOnceListener: <K_9>(eventName: string | symbol, listener: (...args: any[]) => void) => Context;
        eventNames: () => (string | symbol)[];
    };
} & T;

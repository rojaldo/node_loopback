"use strict";
// Copyright IBM Corp. and LoopBack contributors 2017,2019. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveInjectedProperties = exports.resolveInjectedArguments = exports.instantiateClass = void 0;
const tslib_1 = require("tslib");
const metadata_1 = require("@loopback/metadata");
const assert_1 = tslib_1.__importDefault(require("assert"));
const debug_1 = tslib_1.__importDefault(require("debug"));
const binding_filter_1 = require("./binding-filter");
const inject_1 = require("./inject");
const resolution_session_1 = require("./resolution-session");
const value_promise_1 = require("./value-promise");
const debug = (0, debug_1.default)('loopback:context:resolver');
const getTargetName = metadata_1.DecoratorFactory.getTargetName;
/**
 * Create an instance of a class which constructor has arguments
 * decorated with `@inject`.
 *
 * The function returns a class when all dependencies were
 * resolved synchronously, or a Promise otherwise.
 *
 * @param ctor - The class constructor to call.
 * @param ctx - The context containing values for `@inject` resolution
 * @param session - Optional session for binding and dependency resolution
 * @param nonInjectedArgs - Optional array of args for non-injected parameters
 */
function instantiateClass(ctor, ctx, session, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
nonInjectedArgs) {
    /* istanbul ignore if */
    if (debug.enabled) {
        debug('Instantiating %s', getTargetName(ctor));
        if (nonInjectedArgs === null || nonInjectedArgs === void 0 ? void 0 : nonInjectedArgs.length) {
            debug('Non-injected arguments:', nonInjectedArgs);
        }
    }
    const argsOrPromise = resolveInjectedArguments(ctor, '', ctx, session, nonInjectedArgs);
    const propertiesOrPromise = resolveInjectedProperties(ctor, ctx, session);
    const inst = (0, value_promise_1.transformValueOrPromise)(argsOrPromise, args => {
        /* istanbul ignore if */
        if (debug.enabled) {
            debug('Injected arguments for %s():', ctor.name, args);
        }
        return new ctor(...args);
    });
    return (0, value_promise_1.transformValueOrPromise)(propertiesOrPromise, props => {
        /* istanbul ignore if */
        if (debug.enabled) {
            debug('Injected properties for %s:', ctor.name, props);
        }
        return (0, value_promise_1.transformValueOrPromise)(inst, obj => Object.assign(obj, props));
    });
}
exports.instantiateClass = instantiateClass;
/**
 * If the scope of current binding is `SINGLETON`, reset the context
 * to be the one that owns the current binding to make sure a singleton
 * does not have dependencies injected from child contexts unless the
 * injection is for method (excluding constructor) parameters.
 */
function resolveContext(ctx, injection, session) {
    const currentBinding = session === null || session === void 0 ? void 0 : session.currentBinding;
    if (currentBinding == null) {
        // No current binding
        return ctx;
    }
    const isConstructorOrPropertyInjection = 
    // constructor injection
    !injection.member ||
        // property injection
        typeof injection.methodDescriptorOrParameterIndex !== 'number';
    if (isConstructorOrPropertyInjection) {
        // Set context to the resolution context of the current binding for
        // constructor or property injections against a singleton
        ctx = ctx.getResolutionContext(currentBinding);
    }
    return ctx;
}
/**
 * Resolve the value or promise for a given injection
 * @param ctx - Context
 * @param injection - Descriptor of the injection
 * @param session - Optional session for binding and dependency resolution
 */
function resolve(ctx, injection, session) {
    /* istanbul ignore if */
    if (debug.enabled) {
        debug('Resolving an injection:', resolution_session_1.ResolutionSession.describeInjection(injection));
    }
    ctx = resolveContext(ctx, injection, session);
    const resolved = resolution_session_1.ResolutionSession.runWithInjection(s => {
        if (injection.resolve) {
            // A custom resolve function is provided
            return injection.resolve(ctx, injection, s);
        }
        else {
            // Default to resolve the value from the context by binding key
            (0, assert_1.default)((0, binding_filter_1.isBindingAddress)(injection.bindingSelector), 'The binding selector must be an address (string or BindingKey)');
            const key = injection.bindingSelector;
            const options = {
                session: s,
                ...injection.metadata,
            };
            return ctx.getValueOrPromise(key, options);
        }
    }, injection, session);
    return resolved;
}
/**
 * Given a function with arguments decorated with `@inject`,
 * return the list of arguments resolved using the values
 * bound in `ctx`.

 * The function returns an argument array when all dependencies were
 * resolved synchronously, or a Promise otherwise.
 *
 * @param target - The class for constructor injection or prototype for method
 * injection
 * @param method - The method name. If set to '', the constructor will
 * be used.
 * @param ctx - The context containing values for `@inject` resolution
 * @param session - Optional session for binding and dependency resolution
 * @param nonInjectedArgs - Optional array of args for non-injected parameters
 */
function resolveInjectedArguments(target, method, ctx, session, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
nonInjectedArgs) {
    /* istanbul ignore if */
    if (debug.enabled) {
        debug('Resolving injected arguments for %s', getTargetName(target, method));
    }
    const targetWithMethods = target;
    if (method) {
        (0, assert_1.default)(typeof targetWithMethods[method] === 'function', `Method ${method} not found`);
    }
    // NOTE: the array may be sparse, i.e.
    //   Object.keys(injectedArgs).length !== injectedArgs.length
    // Example value:
    //   [ , 'key1', , 'key2']
    const injectedArgs = (0, inject_1.describeInjectedArguments)(target, method);
    const extraArgs = nonInjectedArgs !== null && nonInjectedArgs !== void 0 ? nonInjectedArgs : [];
    let argLength = metadata_1.DecoratorFactory.getNumberOfParameters(target, method);
    // Please note `injectedArgs` contains `undefined` for non-injected args
    const numberOfInjected = injectedArgs.filter(i => i != null).length;
    if (argLength < numberOfInjected + extraArgs.length) {
        /**
         * `Function.prototype.length` excludes the rest parameter and only includes
         * parameters before the first one with a default value. For example,
         * `hello(@inject('name') name: string = 'John')` gives 0 for argLength
         */
        argLength = numberOfInjected + extraArgs.length;
    }
    let nonInjectedIndex = 0;
    return (0, value_promise_1.resolveList)(new Array(argLength), (val, ix) => {
        // The `val` argument is not used as the resolver only uses `injectedArgs`
        // and `extraArgs` to return the new value
        const injection = ix < injectedArgs.length ? injectedArgs[ix] : undefined;
        if (injection == null ||
            (!injection.bindingSelector && !injection.resolve)) {
            if (nonInjectedIndex < extraArgs.length) {
                // Set the argument from the non-injected list
                return extraArgs[nonInjectedIndex++];
            }
            else {
                const name = getTargetName(target, method, ix);
                throw new resolution_session_1.ResolutionError(`The argument '${name}' is not decorated for dependency injection ` +
                    'but no value was supplied by the caller. Did you forget to apply ' +
                    '@inject() to the argument?', { context: ctx, options: { session } });
            }
        }
        return resolve(ctx, injection, 
        // Clone the session so that multiple arguments can be resolved in parallel
        resolution_session_1.ResolutionSession.fork(session));
    });
}
exports.resolveInjectedArguments = resolveInjectedArguments;
/**
 * Given a class with properties decorated with `@inject`,
 * return the map of properties resolved using the values
 * bound in `ctx`.

 * The function returns an argument array when all dependencies were
 * resolved synchronously, or a Promise otherwise.
 *
 * @param constructor - The class for which properties should be resolved.
 * @param ctx - The context containing values for `@inject` resolution
 * @param session - Optional session for binding and dependency resolution
 */
function resolveInjectedProperties(constructor, ctx, session) {
    /* istanbul ignore if */
    if (debug.enabled) {
        debug('Resolving injected properties for %s', getTargetName(constructor));
    }
    const injectedProperties = (0, inject_1.describeInjectedProperties)(constructor.prototype);
    return (0, value_promise_1.resolveMap)(injectedProperties, injection => resolve(ctx, injection, 
    // Clone the session so that multiple properties can be resolved in parallel
    resolution_session_1.ResolutionSession.fork(session)));
}
exports.resolveInjectedProperties = resolveInjectedProperties;
//# sourceMappingURL=resolver.js.map
"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.invokeMethod = exports.InvocationContext = void 0;
const tslib_1 = require("tslib");
const metadata_1 = require("@loopback/metadata");
const assert_1 = tslib_1.__importDefault(require("assert"));
const debug_1 = tslib_1.__importDefault(require("debug"));
const context_1 = require("./context");
const interceptor_1 = require("./interceptor");
const resolver_1 = require("./resolver");
const value_promise_1 = require("./value-promise");
const debug = (0, debug_1.default)('loopback:context:invocation');
const getTargetName = metadata_1.DecoratorFactory.getTargetName;
/**
 * InvocationContext represents the context to invoke interceptors for a method.
 * The context can be used to access metadata about the invocation as well as
 * other dependencies.
 */
class InvocationContext extends context_1.Context {
    /**
     * Construct a new instance of `InvocationContext`
     * @param parent - Parent context, such as the RequestContext
     * @param target - Target class (for static methods) or prototype/object
     * (for instance methods)
     * @param methodName - Method name
     * @param args - An array of arguments
     */
    constructor(parent, target, methodName, args, source) {
        super(parent);
        this.target = target;
        this.methodName = methodName;
        this.args = args;
        this.source = source;
    }
    /**
     * The target class, such as `OrderController`
     */
    get targetClass() {
        return typeof this.target === 'function'
            ? this.target
            : this.target.constructor;
    }
    /**
     * The target name, such as `OrderController.prototype.cancelOrder`
     */
    get targetName() {
        return getTargetName(this.target, this.methodName);
    }
    /**
     * Description of the invocation
     */
    get description() {
        const source = this.source == null ? '' : `${this.source} => `;
        return `InvocationContext(${this.name}): ${source}${this.targetName}`;
    }
    toString() {
        return this.description;
    }
    /**
     * Assert the method exists on the target. An error will be thrown if otherwise.
     * @param context - Invocation context
     */
    assertMethodExists() {
        const targetWithMethods = this.target;
        if (typeof targetWithMethods[this.methodName] !== 'function') {
            const targetName = getTargetName(this.target, this.methodName);
            (0, assert_1.default)(false, `Method ${targetName} not found`);
        }
        return targetWithMethods;
    }
    /**
     * Invoke the target method with the given context
     * @param context - Invocation context
     * @param options - Options for the invocation
     */
    invokeTargetMethod(options = { skipParameterInjection: true }) {
        const targetWithMethods = this.assertMethodExists();
        if (!options.skipParameterInjection) {
            return invokeTargetMethodWithInjection(this, targetWithMethods, this.methodName, this.args, options.session);
        }
        return invokeTargetMethod(this, targetWithMethods, this.methodName, this.args);
    }
}
exports.InvocationContext = InvocationContext;
/**
 * Invoke a method using dependency injection. Interceptors are invoked as part
 * of the invocation.
 * @param target - Target of the method, it will be the class for a static
 * method, and instance or class prototype for a prototype method
 * @param method - Name of the method
 * @param ctx - Context object
 * @param nonInjectedArgs - Optional array of args for non-injected parameters
 * @param options - Options for the invocation
 */
function invokeMethod(target, method, ctx, nonInjectedArgs = [], options = {}) {
    if (options.skipInterceptors) {
        if (options.skipParameterInjection) {
            // Invoke the target method directly without injection or interception
            return invokeTargetMethod(ctx, target, method, nonInjectedArgs);
        }
        else {
            return invokeTargetMethodWithInjection(ctx, target, method, nonInjectedArgs, options.session);
        }
    }
    // Invoke the target method with interception but no injection
    return (0, interceptor_1.invokeMethodWithInterceptors)(ctx, target, method, nonInjectedArgs, options);
}
exports.invokeMethod = invokeMethod;
/**
 * Invoke a method. Method parameter dependency injection is honored.
 * @param target - Target of the method, it will be the class for a static
 * method, and instance or class prototype for a prototype method
 * @param method - Name of the method
 * @param ctx - Context
 * @param nonInjectedArgs - Optional array of args for non-injected parameters
 */
function invokeTargetMethodWithInjection(ctx, target, method, nonInjectedArgs, session) {
    const methodName = getTargetName(target, method);
    /* istanbul ignore if */
    if (debug.enabled) {
        debug('Invoking method %s', methodName);
        if (nonInjectedArgs === null || nonInjectedArgs === void 0 ? void 0 : nonInjectedArgs.length) {
            debug('Non-injected arguments:', nonInjectedArgs);
        }
    }
    const argsOrPromise = (0, resolver_1.resolveInjectedArguments)(target, method, ctx, session, nonInjectedArgs);
    const targetWithMethods = target;
    (0, assert_1.default)(typeof targetWithMethods[method] === 'function', `Method ${method} not found`);
    return (0, value_promise_1.transformValueOrPromise)(argsOrPromise, args => {
        /* istanbul ignore if */
        if (debug.enabled) {
            debug('Injected arguments for %s:', methodName, args);
        }
        return invokeTargetMethod(ctx, targetWithMethods, method, args);
    });
}
/**
 * Invoke the target method
 * @param ctx - Context object
 * @param target - Target class or object
 * @param methodName - Target method name
 * @param args - Arguments
 */
function invokeTargetMethod(ctx, // Not used
target, methodName, args) {
    const targetWithMethods = target;
    /* istanbul ignore if */
    if (debug.enabled) {
        debug('Invoking method %s', getTargetName(target, methodName), args);
    }
    // Invoke the target method
    const result = targetWithMethods[methodName](...args);
    /* istanbul ignore if */
    if (debug.enabled) {
        debug('Method invoked: %s', getTargetName(target, methodName), result);
    }
    return result;
}
//# sourceMappingURL=invocation.js.map
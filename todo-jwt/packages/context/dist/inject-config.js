"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const binding_key_1 = require("./binding-key");
const context_view_1 = require("./context-view");
const inject_1 = require("./inject");
const value_promise_1 = require("./value-promise");
/**
 * Inject a property from `config` of the current binding. If no corresponding
 * config value is present, `undefined` will be injected as the configuration
 * binding is resolved with `optional: true` by default.
 *
 * @example
 * ```ts
 * class Store {
 *   constructor(
 *     @config('x') public optionX: number,
 *     @config('y') public optionY: string,
 *   ) { }
 * }
 *
 * ctx.configure('store1', { x: 1, y: 'a' });
 * ctx.configure('store2', { x: 2, y: 'b' });
 *
 * ctx.bind('store1').toClass(Store);
 * ctx.bind('store2').toClass(Store);
 *
 * const store1 = ctx.getSync('store1');
 * expect(store1.optionX).to.eql(1);
 * expect(store1.optionY).to.eql('a');
 *
 * const store2 = ctx.getSync('store2');
 * expect(store2.optionX).to.eql(2);
 * expect(store2.optionY).to.eql('b');
 * ```
 *
 * @param propertyPath - Optional property path of the config. If is `''` or not
 * present, the `config` object will be returned.
 * @param metadata - Optional metadata to help the injection
 */
function config(propertyPath, metadata) {
    propertyPath = propertyPath !== null && propertyPath !== void 0 ? propertyPath : '';
    if (typeof propertyPath === 'object') {
        metadata = propertyPath;
        propertyPath = '';
    }
    metadata = Object.assign({ propertyPath, decorator: '@config', optional: true }, metadata);
    return (0, inject_1.inject)('', metadata, resolveFromConfig);
}
exports.config = config;
(function (config) {
    /**
     * `@inject.getter` decorator to inject a config getter function
     * @param propertyPath - Optional property path of the config object
     * @param metadata - Injection metadata
     */
    config.getter = function injectConfigGetter(propertyPath, metadata) {
        propertyPath = propertyPath !== null && propertyPath !== void 0 ? propertyPath : '';
        if (typeof propertyPath === 'object') {
            metadata = propertyPath;
            propertyPath = '';
        }
        metadata = Object.assign({ propertyPath, decorator: '@config.getter', optional: true }, metadata);
        return (0, inject_1.inject)('', metadata, resolveAsGetterFromConfig);
    };
    /**
     * `@inject.view` decorator to inject a config context view to allow dynamic
     * changes in configuration
     * @param propertyPath - Optional property path of the config object
     * @param metadata - Injection metadata
     */
    config.view = function injectConfigView(propertyPath, metadata) {
        propertyPath = propertyPath !== null && propertyPath !== void 0 ? propertyPath : '';
        if (typeof propertyPath === 'object') {
            metadata = propertyPath;
            propertyPath = '';
        }
        metadata = Object.assign({ propertyPath, decorator: '@config.view', optional: true }, metadata);
        return (0, inject_1.inject)('', metadata, resolveAsViewFromConfig);
    };
})(config || (exports.config = config = {}));
/**
 * Get the key for the current binding on which dependency injection is
 * performed
 * @param session - Resolution session
 */
function getCurrentBindingKey(session) {
    var _a;
    // The current binding is not set if `instantiateClass` is invoked directly
    return (_a = session.currentBinding) === null || _a === void 0 ? void 0 : _a.key;
}
/**
 * Get the target binding key from which the configuration should be resolved
 * @param injection - Injection
 * @param session - Resolution session
 */
function getTargetBindingKey(injection, session) {
    return injection.metadata.fromBinding || getCurrentBindingKey(session);
}
/**
 * Resolver for `@config`
 * @param ctx - Context object
 * @param injection - Injection metadata
 * @param session - Resolution session
 */
function resolveFromConfig(ctx, injection, session) {
    const bindingKey = getTargetBindingKey(injection, session);
    // Return `undefined` if no current binding is present
    if (!bindingKey)
        return undefined;
    const meta = injection.metadata;
    return ctx.getConfigAsValueOrPromise(bindingKey, meta.propertyPath, {
        session,
        optional: meta.optional,
    });
}
/**
 * Resolver from `@config.getter`
 * @param ctx - Context object
 * @param injection - Injection metadata
 * @param session - Resolution session
 */
function resolveAsGetterFromConfig(ctx, injection, session) {
    (0, inject_1.assertTargetType)(injection, Function, 'Getter function');
    const bindingKey = getTargetBindingKey(injection, session);
    const meta = injection.metadata;
    return async function getter() {
        // Return `undefined` if no current binding is present
        if (!bindingKey)
            return undefined;
        return ctx.getConfigAsValueOrPromise(bindingKey, meta.propertyPath, {
            // https://github.com/loopbackio/loopback-next/issues/9041
            // We should start with a new session for `getter` resolution to avoid
            // possible circular dependencies
            session: undefined,
            optional: meta.optional,
        });
    };
}
/**
 * Resolver for `@config.view`
 * @param ctx - Context object
 * @param injection - Injection metadata
 * @param session - Resolution session
 */
function resolveAsViewFromConfig(ctx, injection, session) {
    (0, inject_1.assertTargetType)(injection, context_view_1.ContextView);
    const bindingKey = getTargetBindingKey(injection, session);
    // Return `undefined` if no current binding is present
    if (!bindingKey)
        return undefined;
    const view = new ConfigView(ctx, binding => binding.key === binding_key_1.BindingKey.buildKeyForConfig(bindingKey).toString(), injection.metadata.propertyPath);
    view.open();
    return view;
}
/**
 * A subclass of `ContextView` to handle dynamic configuration as its
 * `values()` honors the `propertyPath`.
 */
class ConfigView extends context_view_1.ContextView {
    constructor(ctx, filter, propertyPath) {
        super(ctx, filter);
        this.propertyPath = propertyPath;
    }
    /**
     * Get values for the configuration with a property path
     * @param session - Resolution session
     */
    async values(session) {
        const configValues = await super.values(session);
        const propertyPath = this.propertyPath;
        if (!propertyPath)
            return configValues;
        return configValues.map(v => (0, value_promise_1.getDeepProperty)(v, propertyPath));
    }
}
//# sourceMappingURL=inject-config.js.map
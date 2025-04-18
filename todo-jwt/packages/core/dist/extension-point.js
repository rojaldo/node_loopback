"use strict";
// Copyright IBM Corp. and LoopBack contributors 2017,2020. All Rights Reserved.
// Node module: @loopback/core
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.addExtension = exports.extensionFor = exports.extensionFilter = exports.extensions = exports.extensionPoint = void 0;
const context_1 = require("@loopback/context");
const keys_1 = require("./keys");
/**
 * Decorate a class as a named extension point. If the decoration is not
 * present, the name of the class will be used.
 *
 * @example
 * ```ts
 * import {extensionPoint} from '@loopback/core';
 *
 * @extensionPoint(GREETER_EXTENSION_POINT_NAME)
 * export class GreetingService {
 *   // ...
 * }
 * ```
 *
 * @param name - Name of the extension point
 */
function extensionPoint(name, ...specs) {
    return (0, context_1.injectable)({ tags: { [keys_1.CoreTags.EXTENSION_POINT]: name } }, ...specs);
}
exports.extensionPoint = extensionPoint;
/**
 * Shortcut to inject extensions for the given extension point.
 *
 * @example
 * ```ts
 * import {Getter} from '@loopback/context';
 * import {extensionPoint, extensions} from '@loopback/core';
 *
 * @extensionPoint(GREETER_EXTENSION_POINT_NAME)
 * export class GreetingService {
 *  constructor(
 *    @extensions() // Inject extensions for the extension point
 *    private getGreeters: Getter<Greeter[]>,
 *    // ...
 * ) {
 *   // ...
 * }
 * ```
 *
 * @param extensionPointName - Name of the extension point. If not supplied, we
 * use the `name` tag from the extension point binding or the class name of the
 * extension point class. If a class needs to inject extensions from multiple
 * extension points, use different `extensionPointName` for different types of
 * extensions.
 * @param metadata - Optional injection metadata
 */
function extensions(extensionPointName, metadata) {
    return (0, context_1.inject)('', { ...metadata, decorator: '@extensions' }, (ctx, injection, session) => {
        (0, context_1.assertTargetType)(injection, Function, 'Getter function');
        const bindingFilter = filterByExtensionPoint(injection, session, extensionPointName);
        return (0, context_1.createViewGetter)(ctx, bindingFilter, injection.metadata.bindingComparator, { ...metadata, ...(0, context_1.asResolutionOptions)(session) });
    });
}
exports.extensions = extensions;
(function (extensions) {
    /**
     * Inject a `ContextView` for extensions of the extension point. The view can
     * then be listened on events such as `bind`, `unbind`, or `refresh` to react
     * on changes of extensions.
     *
     * @example
     * ```ts
     * import {extensionPoint, extensions} from '@loopback/core';
     *
     * @extensionPoint(GREETER_EXTENSION_POINT_NAME)
     * export class GreetingService {
     *  constructor(
     *    @extensions.view() // Inject a context view for extensions of the extension point
     *    private greetersView: ContextView<Greeter>,
     *    // ...
     * ) {
     *   // ...
     * }
     * ```
     * @param extensionPointName - Name of the extension point. If not supplied, we
     * use the `name` tag from the extension point binding or the class name of the
     * extension point class. If a class needs to inject extensions from multiple
     * extension points, use different `extensionPointName` for different types of
     * extensions.
     * @param metadata - Optional injection metadata
     */
    function view(extensionPointName, metadata) {
        return (0, context_1.inject)('', { ...metadata, decorator: '@extensions.view' }, (ctx, injection, session) => {
            (0, context_1.assertTargetType)(injection, context_1.ContextView);
            const bindingFilter = filterByExtensionPoint(injection, session, extensionPointName);
            return ctx.createView(bindingFilter, injection.metadata.bindingComparator, metadata);
        });
    }
    extensions.view = view;
    /**
     * Inject an array of resolved extension instances for the extension point.
     * The list is a snapshot of registered extensions when the injection is
     * fulfilled. Extensions added or removed afterward won't impact the list.
     *
     * @example
     * ```ts
     * import {extensionPoint, extensions} from '@loopback/core';
     *
     * @extensionPoint(GREETER_EXTENSION_POINT_NAME)
     * export class GreetingService {
     *  constructor(
     *    @extensions.list() // Inject an array of extensions for the extension point
     *    private greeters: Greeter[],
     *    // ...
     * ) {
     *   // ...
     * }
     * ```
     * @param extensionPointName - Name of the extension point. If not supplied, we
     * use the `name` tag from the extension point binding or the class name of the
     * extension point class. If a class needs to inject extensions from multiple
     * extension points, use different `extensionPointName` for different types of
     * extensions.
     * @param metadata - Optional injection metadata
     */
    function list(extensionPointName, metadata) {
        return (0, context_1.inject)('', { ...metadata, decorator: '@extensions.instances' }, (ctx, injection, session) => {
            (0, context_1.assertTargetType)(injection, Array);
            const bindingFilter = filterByExtensionPoint(injection, session, extensionPointName);
            const viewForExtensions = new context_1.ContextView(ctx, bindingFilter, injection.metadata.bindingComparator);
            return viewForExtensions.resolve({
                ...metadata,
                ...(0, context_1.asResolutionOptions)(session),
            });
        });
    }
    extensions.list = list;
})(extensions || (exports.extensions = extensions = {}));
/**
 * Create a binding filter for `@extensions.*`
 * @param injection - Injection object
 * @param session - Resolution session
 * @param extensionPointName - Extension point name
 */
function filterByExtensionPoint(injection, session, extensionPointName) {
    extensionPointName =
        extensionPointName !== null && extensionPointName !== void 0 ? extensionPointName : inferExtensionPointName(injection.target, session.currentBinding);
    return extensionFilter(extensionPointName);
}
/**
 * Infer the extension point name from binding tags/class name
 * @param injectionTarget - Target class or prototype
 * @param currentBinding - Current binding
 */
function inferExtensionPointName(injectionTarget, currentBinding) {
    if (currentBinding) {
        const name = currentBinding.tagMap[keys_1.CoreTags.EXTENSION_POINT] ||
            currentBinding.tagMap[context_1.ContextTags.NAME];
        if (name)
            return name;
    }
    let target;
    if (typeof injectionTarget === 'function') {
        // Constructor injection
        target = injectionTarget;
    }
    else {
        // Injection on the prototype
        target = injectionTarget.constructor;
    }
    return target.name;
}
/**
 * A factory function to create binding filter for extensions of a named
 * extension point
 * @param extensionPointNames - A list of names of extension points
 */
function extensionFilter(...extensionPointNames) {
    return (0, context_1.filterByTag)({
        [keys_1.CoreTags.EXTENSION_FOR]: (0, context_1.includesTagValue)(...extensionPointNames),
    });
}
exports.extensionFilter = extensionFilter;
/**
 * A factory function to create binding template for extensions of the given
 * extension point
 * @param extensionPointNames - Names of the extension point
 */
function extensionFor(...extensionPointNames) {
    return binding => {
        if (extensionPointNames.length === 0)
            return;
        let extensionPoints = binding.tagMap[keys_1.CoreTags.EXTENSION_FOR];
        // Normalize extensionPoints to string[]
        if (extensionPoints == null) {
            extensionPoints = [];
        }
        else if (typeof extensionPoints === 'string') {
            extensionPoints = [extensionPoints];
        }
        // Add extension points
        for (const extensionPointName of extensionPointNames) {
            if (!extensionPoints.includes(extensionPointName)) {
                extensionPoints.push(extensionPointName);
            }
        }
        if (extensionPoints.length === 1) {
            // Keep the value as string for backward compatibility
            extensionPoints = extensionPoints[0];
        }
        binding.tag({ [keys_1.CoreTags.EXTENSION_FOR]: extensionPoints });
    };
}
exports.extensionFor = extensionFor;
/**
 * Register an extension for the given extension point to the context
 * @param context - Context object
 * @param extensionPointName - Name of the extension point
 * @param extensionClass - Class or a provider for an extension
 * @param options - Options Options for the creation of binding from class
 */
function addExtension(context, extensionPointName, extensionClass, options) {
    const binding = (0, context_1.createBindingFromClass)(extensionClass, options).apply(extensionFor(extensionPointName));
    context.add(binding);
    return binding;
}
exports.addExtension = addExtension;
//# sourceMappingURL=extension-point.js.map
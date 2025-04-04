"use strict";
// Copyright IBM Corp. and LoopBack contributors 2017,2020. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasInjections = exports.inspectInjections = exports.describeInjectedProperties = exports.inspectTargetType = exports.describeInjectedArguments = exports.assertTargetType = exports.Getter = exports.inject = void 0;
const metadata_1 = require("@loopback/metadata");
const binding_1 = require("./binding");
const binding_filter_1 = require("./binding-filter");
const context_view_1 = require("./context-view");
const resolution_session_1 = require("./resolution-session");
const INJECT_PARAMETERS_KEY = metadata_1.MetadataAccessor.create('inject:parameters');
const INJECT_PROPERTIES_KEY = metadata_1.MetadataAccessor.create('inject:properties');
// A key to cache described argument injections
const INJECT_METHODS_KEY = metadata_1.MetadataAccessor.create('inject:methods');
/**
 * A decorator to annotate method arguments for automatic injection
 * by LoopBack IoC container.
 *
 * @example
 * Usage - Typescript:
 *
 * ```ts
 * class InfoController {
 *   @inject('authentication.user') public userName: string;
 *
 *   constructor(@inject('application.name') public appName: string) {
 *   }
 *   // ...
 * }
 * ```
 *
 * Usage - JavaScript:
 *
 *  - TODO(bajtos)
 *
 * @param bindingSelector - What binding to use in order to resolve the value of the
 * decorated constructor parameter or property.
 * @param metadata - Optional metadata to help the injection
 * @param resolve - Optional function to resolve the injection
 *
 */
function inject(bindingSelector, metadata, resolve) {
    if (typeof bindingSelector === 'function' && !resolve) {
        resolve = resolveValuesByFilter;
    }
    const injectionMetadata = Object.assign({ decorator: '@inject' }, metadata);
    if (injectionMetadata.bindingComparator && !resolve) {
        throw new Error('Binding comparator is only allowed with a binding filter');
    }
    if (!bindingSelector && typeof resolve !== 'function') {
        throw new Error('A non-empty binding selector or resolve function is required for @inject');
    }
    return function markParameterOrPropertyAsInjected(target, member, methodDescriptorOrParameterIndex) {
        if (typeof methodDescriptorOrParameterIndex === 'number') {
            // The decorator is applied to a method parameter
            // Please note propertyKey is `undefined` for constructor
            const paramDecorator = metadata_1.ParameterDecoratorFactory.createDecorator(INJECT_PARAMETERS_KEY, {
                target,
                member,
                methodDescriptorOrParameterIndex,
                bindingSelector,
                metadata: injectionMetadata,
                resolve,
            }, 
            // Do not deep clone the spec as only metadata is mutable and it's
            // shallowly cloned
            { cloneInputSpec: false, decoratorName: injectionMetadata.decorator });
            paramDecorator(target, member, methodDescriptorOrParameterIndex);
        }
        else if (member) {
            // Property or method
            if (target instanceof Function) {
                throw new Error('@inject is not supported for a static property: ' +
                    metadata_1.DecoratorFactory.getTargetName(target, member));
            }
            if (methodDescriptorOrParameterIndex) {
                // Method
                throw new Error('@inject cannot be used on a method: ' +
                    metadata_1.DecoratorFactory.getTargetName(target, member, methodDescriptorOrParameterIndex));
            }
            const propDecorator = metadata_1.PropertyDecoratorFactory.createDecorator(INJECT_PROPERTIES_KEY, {
                target,
                member,
                methodDescriptorOrParameterIndex,
                bindingSelector,
                metadata: injectionMetadata,
                resolve,
            }, 
            // Do not deep clone the spec as only metadata is mutable and it's
            // shallowly cloned
            { cloneInputSpec: false, decoratorName: injectionMetadata.decorator });
            propDecorator(target, member);
        }
        else {
            // It won't happen here as `@inject` is not compatible with ClassDecorator
            /* istanbul ignore next */
            throw new Error('@inject can only be used on a property or a method parameter');
        }
    };
}
exports.inject = inject;
var Getter;
(function (Getter) {
    /**
     * Convert a value into a Getter returning that value.
     * @param value
     */
    function fromValue(value) {
        return () => Promise.resolve(value);
    }
    Getter.fromValue = fromValue;
})(Getter || (exports.Getter = Getter = {}));
(function (inject) {
    /**
     * Inject a function for getting the actual bound value.
     *
     * This is useful when implementing Actions, where
     * the action is instantiated for Sequence constructor, but some
     * of action's dependencies become bound only after other actions
     * have been executed by the sequence.
     *
     * See also `Getter<T>`.
     *
     * @param bindingSelector - The binding key or filter we want to eventually get
     * value(s) from.
     * @param metadata - Optional metadata to help the injection
     */
    inject.getter = function injectGetter(bindingSelector, metadata) {
        metadata = Object.assign({ decorator: '@inject.getter' }, metadata);
        return inject(bindingSelector, metadata, (0, binding_filter_1.isBindingAddress)(bindingSelector)
            ? resolveAsGetter
            : resolveAsGetterByFilter);
    };
    /**
     * Inject a function for setting (binding) the given key to a given
     * value. (Only static/constant values are supported, it's not possible
     * to bind a key to a class or a provider.)
     *
     * This is useful e.g. when implementing Actions that are contributing
     * new Elements.
     *
     * See also `Setter<T>`.
     *
     * @param bindingKey - The key of the value we want to set.
     * @param metadata - Optional metadata to help the injection
     */
    inject.setter = function injectSetter(bindingKey, metadata) {
        metadata = Object.assign({ decorator: '@inject.setter' }, metadata);
        return inject(bindingKey, metadata, resolveAsSetter);
    };
    /**
     * Inject the binding object for the given key. This is useful if a binding
     * needs to be set up beyond just a constant value allowed by
     * `@inject.setter`. The injected binding is found or created based on the
     * `metadata.bindingCreation` option. See `BindingCreationPolicy` for more
     * details.
     *
     * @example
     *
     * ```ts
     * class MyAuthAction {
     *   @inject.binding('current-user', {
     *     bindingCreation: BindingCreationPolicy.ALWAYS_CREATE,
     *   })
     *   private userBinding: Binding<UserProfile>;
     *
     *   async authenticate() {
     *     this.userBinding.toDynamicValue(() => {...});
     *   }
     * }
     * ```
     *
     * @param bindingKey - Binding key
     * @param metadata - Metadata for the injection
     */
    inject.binding = function injectBinding(bindingKey, metadata) {
        metadata = Object.assign({ decorator: '@inject.binding' }, metadata);
        return inject(bindingKey !== null && bindingKey !== void 0 ? bindingKey : '', metadata, resolveAsBinding);
    };
    /**
     * Inject an array of values by a tag pattern string or regexp
     *
     * @example
     * ```ts
     * class AuthenticationManager {
     *   constructor(
     *     @inject.tag('authentication.strategy') public strategies: Strategy[],
     *   ) {}
     * }
     * ```
     * @param bindingTag - Tag name, regex or object
     * @param metadata - Optional metadata to help the injection
     */
    inject.tag = function injectByTag(bindingTag, metadata) {
        metadata = Object.assign({ decorator: '@inject.tag', tag: bindingTag }, metadata);
        return inject((0, binding_filter_1.filterByTag)(bindingTag), metadata);
    };
    /**
     * Inject matching bound values by the filter function
     *
     * @example
     * ```ts
     * class MyControllerWithView {
     *   @inject.view(filterByTag('foo'))
     *   view: ContextView<string[]>;
     * }
     * ```
     * @param bindingFilter - A binding filter function
     * @param metadata
     */
    inject.view = function injectContextView(bindingFilter, metadata) {
        metadata = Object.assign({ decorator: '@inject.view' }, metadata);
        return inject(bindingFilter, metadata, resolveAsContextView);
    };
    /**
     * Inject the context object.
     *
     * @example
     * ```ts
     * class MyProvider {
     *  constructor(@inject.context() private ctx: Context) {}
     * }
     * ```
     */
    inject.context = function injectContext() {
        return inject('', { decorator: '@inject.context' }, (ctx) => ctx);
    };
})(inject || (exports.inject = inject = {}));
/**
 * Assert the target type inspected from TypeScript for injection to be the
 * expected type. If the types don't match, an error is thrown.
 * @param injection - Injection information
 * @param expectedType - Expected type
 * @param expectedTypeName - Name of the expected type to be used in the error
 * @returns The name of the target
 */
function assertTargetType(injection, expectedType, expectedTypeName) {
    const targetName = resolution_session_1.ResolutionSession.describeInjection(injection).targetName;
    const targetType = inspectTargetType(injection);
    if (targetType && targetType !== expectedType) {
        expectedTypeName = expectedTypeName !== null && expectedTypeName !== void 0 ? expectedTypeName : expectedType.name;
        throw new Error(`The type of ${targetName} (${targetType.name}) is not ${expectedTypeName}`);
    }
    return targetName;
}
exports.assertTargetType = assertTargetType;
/**
 * Resolver for `@inject.getter`
 * @param ctx
 * @param injection
 * @param session
 */
function resolveAsGetter(ctx, injection, session) {
    assertTargetType(injection, Function, 'Getter function');
    const bindingSelector = injection.bindingSelector;
    const options = {
        // https://github.com/loopbackio/loopback-next/issues/9041
        // We should start with a new session for `getter` resolution to avoid
        // possible circular dependencies
        session: undefined,
        ...injection.metadata,
    };
    return function getter() {
        return ctx.get(bindingSelector, options);
    };
}
/**
 * Resolver for `@inject.setter`
 * @param ctx
 * @param injection
 */
function resolveAsSetter(ctx, injection) {
    const targetName = assertTargetType(injection, Function, 'Setter function');
    const bindingSelector = injection.bindingSelector;
    if (!(0, binding_filter_1.isBindingAddress)(bindingSelector)) {
        throw new Error(`@inject.setter (${targetName}) does not allow BindingFilter.`);
    }
    if (bindingSelector === '') {
        throw new Error('Binding key is not set for @inject.setter');
    }
    // No resolution session should be propagated into the setter
    return function setter(value) {
        const binding = findOrCreateBindingForInjection(ctx, injection);
        binding.to(value);
    };
}
function resolveAsBinding(ctx, injection, session) {
    const targetName = assertTargetType(injection, binding_1.Binding);
    const bindingSelector = injection.bindingSelector;
    if (!(0, binding_filter_1.isBindingAddress)(bindingSelector)) {
        throw new Error(`@inject.binding (${targetName}) does not allow BindingFilter.`);
    }
    return findOrCreateBindingForInjection(ctx, injection, session);
}
function findOrCreateBindingForInjection(ctx, injection, session) {
    if (injection.bindingSelector === '')
        return session === null || session === void 0 ? void 0 : session.currentBinding;
    const bindingCreation = injection.metadata &&
        injection.metadata.bindingCreation;
    const binding = ctx.findOrCreateBinding(injection.bindingSelector, bindingCreation);
    return binding;
}
/**
 * Check if constructor injection should be applied to the base class
 * of the given target class
 *
 * @param targetClass - Target class
 */
function shouldSkipBaseConstructorInjection(targetClass) {
    // FXIME(rfeng): We use the class definition to check certain patterns
    const classDef = targetClass.toString();
    return (
    /*
     * See https://github.com/loopbackio/loopback-next/issues/2946
     * A class decorator can return a new constructor that mixes in
     * additional properties/methods.
     *
     * @example
     * ```ts
     * class extends baseConstructor {
     *   // The constructor calls `super(...arguments)`
     *   constructor() {
     *     super(...arguments);
     *   }
     *   classProperty = 'a classProperty';
     *   classFunction() {
     *     return 'a classFunction';
     *   }
     * };
     * ```
     *
     * We check the following pattern:
     * ```ts
     * constructor() {
     *   super(...arguments);
     * }
     * ```
     */
    !classDef.match(/\s+constructor\s*\(\s*\)\s*\{\s*super\(\.\.\.arguments\)/) &&
        /*
         * See https://github.com/loopbackio/loopback-next/issues/1565
         *
         * @example
         * ```ts
         * class BaseClass {
         *   constructor(@inject('foo') protected foo: string) {}
         *   // ...
         * }
         *
         * class SubClass extends BaseClass {
         *   // No explicit constructor is present
         *
         *   @inject('bar')
         *   private bar: number;
         *   // ...
         * };
         *
         */
        classDef.match(/\s+constructor\s*\([^\)]*\)\s+\{/m));
}
/**
 * Return an array of injection objects for parameters
 * @param target - The target class for constructor or static methods,
 * or the prototype for instance methods
 * @param method - Method name, undefined for constructor
 */
function describeInjectedArguments(target, method) {
    var _a, _b;
    method = method !== null && method !== void 0 ? method : '';
    // Try to read from cache
    const cache = (_a = metadata_1.MetadataInspector.getAllMethodMetadata(INJECT_METHODS_KEY, target, {
        ownMetadataOnly: true,
    })) !== null && _a !== void 0 ? _a : {};
    let meta = cache[method];
    if (meta)
        return meta;
    // Build the description
    const options = {};
    if (method === '') {
        if (shouldSkipBaseConstructorInjection(target)) {
            options.ownMetadataOnly = true;
        }
    }
    else if (Object.prototype.hasOwnProperty.call(target, method)) {
        // The method exists in the target, no injections on the super method
        // should be honored
        options.ownMetadataOnly = true;
    }
    meta =
        (_b = metadata_1.MetadataInspector.getAllParameterMetadata(INJECT_PARAMETERS_KEY, target, method, options)) !== null && _b !== void 0 ? _b : [];
    // Cache the result
    cache[method] = meta;
    metadata_1.MetadataInspector.defineMetadata(INJECT_METHODS_KEY, cache, target);
    return meta;
}
exports.describeInjectedArguments = describeInjectedArguments;
/**
 * Inspect the target type for the injection to find out the corresponding
 * JavaScript type
 * @param injection - Injection information
 */
function inspectTargetType(injection) {
    var _a;
    if (typeof injection.methodDescriptorOrParameterIndex === 'number') {
        const designType = metadata_1.MetadataInspector.getDesignTypeForMethod(injection.target, injection.member);
        return (_a = designType === null || designType === void 0 ? void 0 : designType.parameterTypes) === null || _a === void 0 ? void 0 : _a[injection.methodDescriptorOrParameterIndex];
    }
    return metadata_1.MetadataInspector.getDesignTypeForProperty(injection.target, injection.member);
}
exports.inspectTargetType = inspectTargetType;
/**
 * Resolve an array of bound values matching the filter function for `@inject`.
 * @param ctx - Context object
 * @param injection - Injection information
 * @param session - Resolution session
 */
function resolveValuesByFilter(ctx, injection, session) {
    assertTargetType(injection, Array);
    const bindingFilter = injection.bindingSelector;
    const view = new context_view_1.ContextView(ctx, bindingFilter, injection.metadata.bindingComparator);
    return view.resolve(session);
}
/**
 * Resolve to a getter function that returns an array of bound values matching
 * the filter function for `@inject.getter`.
 *
 * @param ctx - Context object
 * @param injection - Injection information
 * @param session - Resolution session
 */
function resolveAsGetterByFilter(ctx, injection, session) {
    assertTargetType(injection, Function, 'Getter function');
    const bindingFilter = injection.bindingSelector;
    return (0, context_view_1.createViewGetter)(ctx, bindingFilter, injection.metadata.bindingComparator, session);
}
/**
 * Resolve to an instance of `ContextView` by the binding filter function
 * for `@inject.view`
 * @param ctx - Context object
 * @param injection - Injection information
 */
function resolveAsContextView(ctx, injection) {
    assertTargetType(injection, context_view_1.ContextView);
    const bindingFilter = injection.bindingSelector;
    const view = new context_view_1.ContextView(ctx, bindingFilter, injection.metadata.bindingComparator);
    view.open();
    return view;
}
/**
 * Return a map of injection objects for properties
 * @param target - The target class for static properties or
 * prototype for instance properties.
 */
function describeInjectedProperties(target) {
    var _a;
    const metadata = (_a = metadata_1.MetadataInspector.getAllPropertyMetadata(INJECT_PROPERTIES_KEY, target)) !== null && _a !== void 0 ? _a : {};
    return metadata;
}
exports.describeInjectedProperties = describeInjectedProperties;
/**
 * Inspect injections for a binding created with `toClass` or `toProvider`
 * @param binding - Binding object
 */
function inspectInjections(binding) {
    var _a;
    const json = {};
    const ctor = (_a = binding.valueConstructor) !== null && _a !== void 0 ? _a : binding.providerConstructor;
    if (ctor == null)
        return json;
    const constructorInjections = describeInjectedArguments(ctor, '').map(inspectInjection);
    if (constructorInjections.length) {
        json.constructorArguments = constructorInjections;
    }
    const propertyInjections = describeInjectedProperties(ctor.prototype);
    const properties = {};
    for (const p in propertyInjections) {
        properties[p] = inspectInjection(propertyInjections[p]);
    }
    if (Object.keys(properties).length) {
        json.properties = properties;
    }
    return json;
}
exports.inspectInjections = inspectInjections;
/**
 * Inspect an injection
 * @param injection - Injection information
 */
function inspectInjection(injection) {
    var _a, _b;
    const injectionInfo = resolution_session_1.ResolutionSession.describeInjection(injection);
    const descriptor = {};
    if (injectionInfo.targetName) {
        descriptor.targetName = injectionInfo.targetName;
    }
    if ((0, binding_filter_1.isBindingAddress)(injectionInfo.bindingSelector)) {
        // Binding key
        descriptor.bindingKey = injectionInfo.bindingSelector.toString();
    }
    else if ((0, binding_filter_1.isBindingTagFilter)(injectionInfo.bindingSelector)) {
        // Binding tag filter
        descriptor.bindingTagPattern = JSON.parse(JSON.stringify(injectionInfo.bindingSelector.bindingTagPattern));
    }
    else {
        // Binding filter function
        descriptor.bindingFilter =
            (_b = (_a = injectionInfo.bindingSelector) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : '<function>';
    }
    // Inspect metadata
    if (injectionInfo.metadata) {
        if (injectionInfo.metadata.decorator &&
            injectionInfo.metadata.decorator !== '@inject') {
            descriptor.decorator = injectionInfo.metadata.decorator;
        }
        if (injectionInfo.metadata.optional) {
            descriptor.optional = injectionInfo.metadata.optional;
        }
    }
    return descriptor;
}
/**
 * Check if the given class has `@inject` or other decorations that map to
 * `@inject`.
 *
 * @param cls - Class with possible `@inject` decorations
 */
function hasInjections(cls) {
    return (metadata_1.MetadataInspector.getClassMetadata(INJECT_PARAMETERS_KEY, cls) != null ||
        metadata_1.Reflector.getMetadata(INJECT_PARAMETERS_KEY.toString(), cls.prototype) !=
            null ||
        metadata_1.MetadataInspector.getAllPropertyMetadata(INJECT_PROPERTIES_KEY, cls.prototype) != null);
}
exports.hasInjections = hasInjections;
//# sourceMappingURL=inject.js.map
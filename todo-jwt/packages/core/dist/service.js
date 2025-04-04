"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/core
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.asService = exports.createServiceBinding = exports.filterByServiceInterface = exports.service = void 0;
const context_1 = require("@loopback/context");
const keys_1 = require("./keys");
/**
 * `@service` injects a service instance that matches the class or interface.
 *
 * @param serviceInterface - Interface for the service. It can be in one of the
 * following forms:
 *
 * - A class, such as MyService
 * - A string that identifies the interface, such as `'MyService'`
 * - A symbol that identifies the interface, such as `Symbol('MyService')`
 *
 * If not provided, the value is inferred from the design:type of the parameter
 * or property
 *
 * @example
 * ```ts
 *
 * const ctx = new Context();
 * ctx.bind('my-service').toClass(MyService);
 * ctx.bind('logger').toClass(Logger);
 *
 * export class MyController {
 *   constructor(@service(MyService) private myService: MyService) {}
 *
 *   @service()
 *   private logger: Logger;
 * }
 *
 * ctx.bind('my-controller').toClass(MyController);
 * await myController = ctx.get<MyController>('my-controller');
 * ```
 */
function service(serviceInterface, metadata) {
    return (0, context_1.inject)('', { decorator: '@service', ...metadata }, (ctx, injection, session) => {
        var _a;
        let serviceType = serviceInterface;
        if (!serviceType) {
            if (typeof injection.methodDescriptorOrParameterIndex === 'number') {
                serviceType = (_a = context_1.MetadataInspector.getDesignTypeForMethod(injection.target, injection.member)) === null || _a === void 0 ? void 0 : _a.parameterTypes[injection.methodDescriptorOrParameterIndex];
            }
            else {
                serviceType = context_1.MetadataInspector.getDesignTypeForProperty(injection.target, injection.member);
            }
        }
        if (serviceType === undefined) {
            const targetName = context_1.DecoratorFactory.getTargetName(injection.target, injection.member, injection.methodDescriptorOrParameterIndex);
            const msg = `No design-time type metadata found while inspecting ${targetName}. ` +
                'You can either use `@service(ServiceClass)` or ensure `emitDecoratorMetadata` is enabled in your TypeScript configuration. ' +
                'Run `tsc --showConfig` to print the final TypeScript configuration of your project.';
            throw new Error(msg);
        }
        if (serviceType === Object || serviceType === Array) {
            throw new Error('Service class cannot be inferred from design type. Use @service(ServiceClass).');
        }
        const view = new context_1.ContextView(ctx, filterByServiceInterface(serviceType));
        const result = view.resolve({
            optional: metadata === null || metadata === void 0 ? void 0 : metadata.optional,
            asProxyWithInterceptors: metadata === null || metadata === void 0 ? void 0 : metadata.asProxyWithInterceptors,
            session,
        });
        const serviceTypeName = typeof serviceType === 'string'
            ? serviceType
            : typeof serviceType === 'symbol'
                ? serviceType.toString()
                : serviceType.name;
        return (0, context_1.transformValueOrPromise)(result, values => {
            if (values.length === 1)
                return values[0];
            if (values.length >= 1) {
                throw new Error(`More than one bindings found for ${serviceTypeName}`);
            }
            else {
                if (metadata === null || metadata === void 0 ? void 0 : metadata.optional) {
                    return undefined;
                }
                throw new Error(`No binding found for ${serviceTypeName}. Make sure a service ` +
                    `binding is created in context ${ctx.name} with serviceInterface (${serviceTypeName}).`);
            }
        });
    });
}
exports.service = service;
/**
 * Create a binding filter by service class
 * @param serviceInterface - Service class matching the one used by `binding.toClass()`
 * @param options - Options to control if subclasses should be skipped for matching
 */
function filterByServiceInterface(serviceInterface) {
    return binding => binding.valueConstructor === serviceInterface ||
        binding.tagMap[keys_1.CoreTags.SERVICE_INTERFACE] === serviceInterface;
}
exports.filterByServiceInterface = filterByServiceInterface;
/**
 * Create a service binding from a class or provider
 * @param cls - Service class or provider
 * @param options - Service options
 */
function createServiceBinding(cls, options = {}) {
    var _a;
    let name = options.name;
    if (!name && (0, context_1.isProviderClass)(cls)) {
        // Trim `Provider` from the default service name
        // This is needed to keep backward compatibility
        const templateFn = (0, context_1.bindingTemplateFor)(cls);
        const template = context_1.Binding.bind('template').apply(templateFn);
        if (template.tagMap[context_1.ContextTags.PROVIDER] &&
            !template.tagMap[context_1.ContextTags.NAME]) {
            // The class is a provider and no `name` tag is found
            name = cls.name.replace(/Provider$/, '');
        }
    }
    if (!name && (0, context_1.isDynamicValueProviderClass)(cls)) {
        // Trim `Provider` from the default service name
        const templateFn = (0, context_1.bindingTemplateFor)(cls);
        const template = context_1.Binding.bind('template').apply(templateFn);
        if (template.tagMap[context_1.ContextTags.DYNAMIC_VALUE_PROVIDER] &&
            !template.tagMap[context_1.ContextTags.NAME]) {
            // The class is a provider and no `name` tag is found
            name = cls.name.replace(/Provider$/, '');
        }
    }
    const binding = (0, context_1.createBindingFromClass)(cls, {
        name,
        type: keys_1.CoreTags.SERVICE,
        ...options,
    }).apply(asService((_a = options.interface) !== null && _a !== void 0 ? _a : cls));
    return binding;
}
exports.createServiceBinding = createServiceBinding;
/**
 * Create a binding template for a service interface
 * @param serviceInterface - Service interface
 */
function asService(serviceInterface) {
    return function serviceTemplate(binding) {
        binding.tag({
            [context_1.ContextTags.TYPE]: keys_1.CoreTags.SERVICE,
            [keys_1.CoreTags.SERVICE_INTERFACE]: serviceInterface,
        });
    };
}
exports.asService = asService;
//# sourceMappingURL=service.js.map
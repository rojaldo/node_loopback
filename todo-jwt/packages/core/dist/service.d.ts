import { Binding, BindingFilter, BindingFromClassOptions, BindingTemplate, InjectionMetadata } from '@loopback/context';
import { ServiceOrProviderClass } from './application';
/**
 * Representing an interface for services. In TypeScript, the `interface` does
 * not have reflections at runtime. We use a string, a symbol or a Function as
 * the type for the service interface.
 */
export type ServiceInterface = string | symbol | Function;
/**
 * Options to register a service binding
 */
export interface ServiceOptions extends BindingFromClassOptions {
    interface?: ServiceInterface;
}
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
export declare function service(serviceInterface?: ServiceInterface, metadata?: InjectionMetadata): (target: Object, member: string | undefined, methodDescriptorOrParameterIndex?: number | TypedPropertyDescriptor<any> | undefined) => void;
/**
 * Create a binding filter by service class
 * @param serviceInterface - Service class matching the one used by `binding.toClass()`
 * @param options - Options to control if subclasses should be skipped for matching
 */
export declare function filterByServiceInterface(serviceInterface: ServiceInterface): BindingFilter;
/**
 * Create a service binding from a class or provider
 * @param cls - Service class or provider
 * @param options - Service options
 */
export declare function createServiceBinding<S>(cls: ServiceOrProviderClass<S>, options?: ServiceOptions): Binding<S>;
/**
 * Create a binding template for a service interface
 * @param serviceInterface - Service interface
 */
export declare function asService(serviceInterface: ServiceInterface): BindingTemplate;

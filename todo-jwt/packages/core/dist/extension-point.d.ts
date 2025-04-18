import { Binding, BindingFilter, BindingFromClassOptions, BindingSpec, BindingTemplate, Constructor, Context, InjectionMetadata } from '@loopback/context';
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
export declare function extensionPoint(name: string, ...specs: BindingSpec[]): ClassDecorator;
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
export declare function extensions(extensionPointName?: string, metadata?: InjectionMetadata): (target: Object, member: string | undefined, methodDescriptorOrParameterIndex?: number | TypedPropertyDescriptor<any> | undefined) => void;
export declare namespace extensions {
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
    function view(extensionPointName?: string, metadata?: InjectionMetadata): (target: Object, member: string | undefined, methodDescriptorOrParameterIndex?: number | TypedPropertyDescriptor<any> | undefined) => void;
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
    function list(extensionPointName?: string, metadata?: InjectionMetadata): (target: Object, member: string | undefined, methodDescriptorOrParameterIndex?: number | TypedPropertyDescriptor<any> | undefined) => void;
}
/**
 * A factory function to create binding filter for extensions of a named
 * extension point
 * @param extensionPointNames - A list of names of extension points
 */
export declare function extensionFilter(...extensionPointNames: string[]): BindingFilter;
/**
 * A factory function to create binding template for extensions of the given
 * extension point
 * @param extensionPointNames - Names of the extension point
 */
export declare function extensionFor(...extensionPointNames: string[]): BindingTemplate;
/**
 * Register an extension for the given extension point to the context
 * @param context - Context object
 * @param extensionPointName - Name of the extension point
 * @param extensionClass - Class or a provider for an extension
 * @param options - Options Options for the creation of binding from class
 */
export declare function addExtension(context: Context, extensionPointName: string, extensionClass: Constructor<unknown>, options?: BindingFromClassOptions): Binding<unknown>;

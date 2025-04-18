/**
 * Decorator function types
 */
export type DecoratorType = ClassDecorator | PropertyDecorator | MethodDecorator | ParameterDecorator;
/**
 * A strongly-typed metadata accessor via reflection
 * @typeParam T - Type of the metadata value
 * @typeParam D - Type of the decorator
 */
export declare class MetadataAccessor<T, D extends DecoratorType = DecoratorType> {
    readonly key: string;
    private constructor();
    toString(): string;
    /**
     * Create a strongly-typed metadata accessor
     * @param key - The metadata key
     * @typeParam V - Type of the metadata value
     * @typeParam DT - Type of the decorator
     */
    static create<V, DT extends DecoratorType>(key: string): MetadataAccessor<V, DT>;
}
/**
 * Key for metadata access via reflection
 * @typeParam T - Type of the metadata value
 * @typeParam D - Type of the decorator
 */
export type MetadataKey<T, D extends DecoratorType> = MetadataAccessor<T, D> | string;
/**
 * An object mapping keys to corresponding metadata
 */
export interface MetadataMap<T> {
    [propertyOrMethodName: string]: T;
}
/**
 * Design time metadata for a method.
 *
 * @example
 * ```ts
 * class MyController
 * {
 *   myMethod(x: string, y: number, z: MyClass): boolean {
 *     // ...
 *     return true;
 *   }
 * }
 * ```
 *
 * The `myMethod` above has design-time metadata as follows:
 * ```ts
 * {
 *   type: Function,
 *   parameterTypes: [String, Number, MyClass],
 *   returnType: Boolean
 * }
 * ```
 */
export interface DesignTimeMethodMetadata {
    /**
     * Type of the method itself. It is `Function` for methods, `undefined` for the constructor.
     */
    type: Function | undefined;
    /**
     * An array of parameter types.
     */
    parameterTypes: Function[];
    /**
     * Return type, may be `undefined` (e.g. for constructors).
     */
    returnType: Function | undefined;
}

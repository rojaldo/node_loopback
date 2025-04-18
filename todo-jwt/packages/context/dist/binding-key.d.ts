export type BindingAddress<T = unknown> = string | BindingKey<T>;
export declare class BindingKey<ValueType> {
    readonly key: string;
    readonly propertyPath?: string | undefined;
    static readonly PROPERTY_SEPARATOR = "#";
    /**
     * Create a new key for a binding bound to a value of type `ValueType`.
     *
     * @example
     *
     * ```ts
     * BindingKey.create<string>('application.name');
     * BindingKey.create<number>('config', 'rest.port);
     * BindingKey.create<number>('config#rest.port');
     * ```
     *
     * @param key - The binding key. When propertyPath is not provided, the key
     *   is allowed to contain propertyPath as encoded via `BindingKey#toString()`
     * @param propertyPath - Optional path to a deep property of the bound value.
     */
    static create<V>(key: string, propertyPath?: string): BindingKey<V>;
    private constructor();
    toString(): string;
    /**
     * Get a binding address for retrieving a deep property of the object
     * bound to the current binding key.
     *
     * @param propertyPath - A dot-separated path to a (deep) property, e.g. "server.port".
     */
    deepProperty<PropertyValueType>(propertyPath: string): BindingKey<PropertyValueType>;
    /**
     * Validate the binding key format. Please note that `#` is reserved.
     * Returns a string representation of the binding key.
     *
     * @param key - Binding key, such as `a`, `a.b`, `a:b`, or `a/b`
     */
    static validate<T>(key: BindingAddress<T>): string;
    /**
     * Parse a string containing both the binding key and the path to the deeply
     * nested property to retrieve.
     *
     * @param keyWithPath - The key with an optional path,
     *  e.g. "application.instance" or "config#rest.port".
     */
    static parseKeyWithPath<T>(keyWithPath: BindingAddress<T>): BindingKey<T>;
    /**
     * Name space for configuration binding keys
     */
    static CONFIG_NAMESPACE: string;
    /**
     * Build a binding key for the configuration of the given binding.
     * The format is `<key>:$config`
     *
     * @param key - Key of the target binding to be configured
     */
    static buildKeyForConfig<T>(key?: BindingAddress): BindingAddress<T>;
    /**
     * Generate a universally unique binding key.
     *
     * Please note the format of they generated key is not specified, you must
     * not rely on any specific formatting (e.g. UUID style).
     *
     * @param namespace - Namespace for the binding
     */
    static generate<T>(namespace?: string): BindingKey<T>;
}

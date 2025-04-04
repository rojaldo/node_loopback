"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.BindingKey = void 0;
const unique_id_1 = require("./unique-id");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class BindingKey {
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
    static create(key, propertyPath) {
        // TODO(bajtos) allow chaining of propertyPaths, e.g.
        //   BindingKey.create('config#rest', 'port')
        // should create {key: 'config', path: 'rest.port'}
        if (propertyPath) {
            BindingKey.validate(key);
            return new BindingKey(key, propertyPath);
        }
        return BindingKey.parseKeyWithPath(key);
    }
    constructor(key, propertyPath) {
        this.key = key;
        this.propertyPath = propertyPath;
    }
    toString() {
        return this.propertyPath
            ? `${this.key}${BindingKey.PROPERTY_SEPARATOR}${this.propertyPath}`
            : this.key;
    }
    /**
     * Get a binding address for retrieving a deep property of the object
     * bound to the current binding key.
     *
     * @param propertyPath - A dot-separated path to a (deep) property, e.g. "server.port".
     */
    deepProperty(propertyPath) {
        // TODO(bajtos) allow chaining of propertyPaths, e.g.
        //   BindingKey.create('config', 'rest').deepProperty('port')
        // should create {key: 'config', path: 'rest.port'}
        return BindingKey.create(this.key, propertyPath);
    }
    /**
     * Validate the binding key format. Please note that `#` is reserved.
     * Returns a string representation of the binding key.
     *
     * @param key - Binding key, such as `a`, `a.b`, `a:b`, or `a/b`
     */
    static validate(key) {
        if (!key)
            throw new Error('Binding key must be provided.');
        key = key.toString();
        if (key.includes(BindingKey.PROPERTY_SEPARATOR)) {
            throw new Error(`Binding key ${key} cannot contain` +
                ` '${BindingKey.PROPERTY_SEPARATOR}'.`);
        }
        return key;
    }
    /**
     * Parse a string containing both the binding key and the path to the deeply
     * nested property to retrieve.
     *
     * @param keyWithPath - The key with an optional path,
     *  e.g. "application.instance" or "config#rest.port".
     */
    static parseKeyWithPath(keyWithPath) {
        if (typeof keyWithPath !== 'string') {
            return BindingKey.create(keyWithPath.key, keyWithPath.propertyPath);
        }
        const index = keyWithPath.indexOf(BindingKey.PROPERTY_SEPARATOR);
        if (index === -1) {
            return new BindingKey(keyWithPath);
        }
        return BindingKey.create(keyWithPath.slice(0, index).trim(), keyWithPath.slice(index + 1));
    }
    /**
     * Build a binding key for the configuration of the given binding.
     * The format is `<key>:$config`
     *
     * @param key - Key of the target binding to be configured
     */
    static buildKeyForConfig(key = '') {
        const suffix = BindingKey.CONFIG_NAMESPACE;
        const bindingKey = key ? `${key}:${suffix}` : suffix;
        return bindingKey;
    }
    /**
     * Generate a universally unique binding key.
     *
     * Please note the format of they generated key is not specified, you must
     * not rely on any specific formatting (e.g. UUID style).
     *
     * @param namespace - Namespace for the binding
     */
    static generate(namespace = '') {
        const prefix = namespace ? `${namespace}.` : '';
        const name = (0, unique_id_1.generateUniqueId)();
        return BindingKey.create(`${prefix}${name}`);
    }
}
exports.BindingKey = BindingKey;
BindingKey.PROPERTY_SEPARATOR = '#';
/**
 * Name space for configuration binding keys
 */
BindingKey.CONFIG_NAMESPACE = '$config';
//# sourceMappingURL=binding-key.js.map
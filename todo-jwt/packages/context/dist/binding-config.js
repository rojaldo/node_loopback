"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.configBindingKeyFor = exports.DefaultConfigurationResolver = void 0;
const binding_key_1 = require("./binding-key");
/**
 * Resolver for configurations of bindings
 */
class DefaultConfigurationResolver {
    constructor(context) {
        this.context = context;
    }
    getConfigAsValueOrPromise(key, propertyPath, resolutionOptions) {
        propertyPath = propertyPath !== null && propertyPath !== void 0 ? propertyPath : '';
        const configKey = configBindingKeyFor(key, propertyPath);
        const options = Object.assign({ optional: true }, resolutionOptions);
        return this.context.getValueOrPromise(configKey, options);
    }
}
exports.DefaultConfigurationResolver = DefaultConfigurationResolver;
/**
 * Create binding key for configuration of the binding
 * @param key - Binding key for the target binding
 * @param propertyPath - Property path for the configuration
 */
function configBindingKeyFor(key, propertyPath) {
    return binding_key_1.BindingKey.create(binding_key_1.BindingKey.buildKeyForConfig(key).toString(), propertyPath);
}
exports.configBindingKeyFor = configBindingKeyFor;
//# sourceMappingURL=binding-config.js.map
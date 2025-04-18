"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextBindings = exports.LOCAL_INTERCEPTOR_NAMESPACE = exports.GLOBAL_INTERCEPTOR_NAMESPACE = exports.ContextTags = void 0;
const binding_key_1 = require("./binding-key");
/**
 * Namespace for context tags
 */
var ContextTags;
(function (ContextTags) {
    ContextTags.CLASS = 'class';
    ContextTags.PROVIDER = 'provider';
    ContextTags.DYNAMIC_VALUE_PROVIDER = 'dynamicValueProvider';
    /**
     * Type of the artifact
     */
    ContextTags.TYPE = 'type';
    /**
     * Namespace of the artifact
     */
    ContextTags.NAMESPACE = 'namespace';
    /**
     * Name of the artifact
     */
    ContextTags.NAME = 'name';
    /**
     * Binding key for the artifact
     */
    ContextTags.KEY = 'key';
    /**
     * Binding tag to associate a configuration binding with the target binding key
     */
    ContextTags.CONFIGURATION_FOR = 'configurationFor';
    /**
     * Binding tag for global interceptors
     */
    ContextTags.GLOBAL_INTERCEPTOR = 'globalInterceptor';
    /**
     * Binding tag for global interceptors to specify sources of invocations that
     * the interceptor should apply. The tag value can be a string or string[], such
     * as `'route'` or `['route', 'proxy']`.
     */
    ContextTags.GLOBAL_INTERCEPTOR_SOURCE = 'globalInterceptorSource';
    /**
     * Binding tag for group name of global interceptors
     */
    ContextTags.GLOBAL_INTERCEPTOR_GROUP = 'globalInterceptorGroup';
})(ContextTags || (exports.ContextTags = ContextTags = {}));
/**
 * Default namespace for global interceptors
 */
exports.GLOBAL_INTERCEPTOR_NAMESPACE = 'globalInterceptors';
/**
 * Default namespace for local interceptors
 */
exports.LOCAL_INTERCEPTOR_NAMESPACE = 'interceptors';
/**
 * Namespace for context bindings
 */
var ContextBindings;
(function (ContextBindings) {
    /**
     * Binding key for ConfigurationResolver
     */
    ContextBindings.CONFIGURATION_RESOLVER = binding_key_1.BindingKey.create(`${binding_key_1.BindingKey.CONFIG_NAMESPACE}.resolver`);
    /**
     * Binding key for ordered groups of global interceptors
     */
    ContextBindings.GLOBAL_INTERCEPTOR_ORDERED_GROUPS = binding_key_1.BindingKey.create('globalInterceptor.orderedGroups');
})(ContextBindings || (exports.ContextBindings = ContextBindings = {}));
//# sourceMappingURL=keys.js.map
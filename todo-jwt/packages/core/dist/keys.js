"use strict";
// Copyright IBM Corp. and LoopBack contributors 2017,2020. All Rights Reserved.
// Node module: @loopback/core
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreTags = exports.CoreBindings = void 0;
const context_1 = require("@loopback/context");
/**
 * Namespace for core binding keys
 */
var CoreBindings;
(function (CoreBindings) {
    // application
    /**
     * Binding key for application instance itself
     */
    CoreBindings.APPLICATION_INSTANCE = context_1.BindingKey.create('application.instance');
    /**
     * Binding key for application configuration
     */
    CoreBindings.APPLICATION_CONFIG = context_1.BindingKey.create('application.config');
    /**
     * Binding key for the content of `package.json`
     */
    CoreBindings.APPLICATION_METADATA = context_1.BindingKey.create('application.metadata');
    // server
    /**
     * Binding key for servers
     */
    CoreBindings.SERVERS = 'servers';
    // component
    /**
     * Binding key for components
     */
    CoreBindings.COMPONENTS = 'components';
    // controller
    CoreBindings.CONTROLLERS = 'controllers';
    /**
     * Binding key for the controller class resolved in the current request
     * context
     */
    CoreBindings.CONTROLLER_CLASS = context_1.BindingKey.create('controller.current.ctor');
    /**
     * Binding key for the controller method resolved in the current request
     * context
     */
    CoreBindings.CONTROLLER_METHOD_NAME = context_1.BindingKey.create('controller.current.operation');
    /**
     * Binding key for the controller method metadata resolved in the current
     * request context
     */
    CoreBindings.CONTROLLER_METHOD_META = 'controller.method.meta';
    /**
     * Binding key for the controller instance resolved in the current request
     * context
     */
    CoreBindings.CONTROLLER_CURRENT = context_1.BindingKey.create('controller.current');
    CoreBindings.LIFE_CYCLE_OBSERVERS = 'lifeCycleObservers';
    /**
     * Binding key for life cycle observer options
     */
    CoreBindings.LIFE_CYCLE_OBSERVER_REGISTRY = context_1.BindingKey.create('lifeCycleObserver.registry');
    /**
     * Binding key for life cycle observer options
     */
    CoreBindings.LIFE_CYCLE_OBSERVER_OPTIONS = context_1.BindingKey.create('lifeCycleObserver.options');
})(CoreBindings || (exports.CoreBindings = CoreBindings = {}));
var CoreTags;
(function (CoreTags) {
    /**
     * Binding tag for components
     */
    CoreTags.COMPONENT = 'component';
    /**
     * Binding tag for servers
     */
    CoreTags.SERVER = 'server';
    /**
     * Binding tag for controllers
     */
    CoreTags.CONTROLLER = 'controller';
    /**
     * Binding tag for services
     */
    CoreTags.SERVICE = 'service';
    /**
     * Binding tag for the service interface
     */
    CoreTags.SERVICE_INTERFACE = 'serviceInterface';
    /**
     * Binding tag for life cycle observers
     */
    CoreTags.LIFE_CYCLE_OBSERVER = 'lifeCycleObserver';
    /**
     * Binding tag for group name of life cycle observers
     */
    CoreTags.LIFE_CYCLE_OBSERVER_GROUP = 'lifeCycleObserverGroup';
    /**
     * Binding tag for extensions to specify name of the extension point that an
     * extension contributes to.
     */
    CoreTags.EXTENSION_FOR = 'extensionFor';
    /**
     * Binding tag for an extension point to specify name of the extension point
     */
    CoreTags.EXTENSION_POINT = 'extensionPoint';
})(CoreTags || (exports.CoreTags = CoreTags = {}));
//# sourceMappingURL=keys.js.map
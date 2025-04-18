"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/core
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.lifeCycleObserver = exports.lifeCycleObserverFilter = exports.asLifeCycleObserver = exports.isLifeCycleObserverClass = exports.isLifeCycleObserver = void 0;
const context_1 = require("@loopback/context");
const keys_1 = require("./keys");
const lifeCycleMethods = ['init', 'start', 'stop'];
/**
 * Test if an object implements LifeCycleObserver
 * @param obj - An object
 */
function isLifeCycleObserver(obj) {
    const candidate = obj;
    return lifeCycleMethods.some(m => typeof candidate[m] === 'function');
}
exports.isLifeCycleObserver = isLifeCycleObserver;
/**
 * Test if a class implements LifeCycleObserver
 * @param ctor - A class
 */
function isLifeCycleObserverClass(ctor) {
    return ctor.prototype && isLifeCycleObserver(ctor.prototype);
}
exports.isLifeCycleObserverClass = isLifeCycleObserverClass;
/**
 * A `BindingTemplate` function to configure the binding as life cycle observer
 * by tagging it with `CoreTags.LIFE_CYCLE_OBSERVER`.
 *
 * @param binding - Binding object
 */
function asLifeCycleObserver(binding) {
    return binding.tag(keys_1.CoreTags.LIFE_CYCLE_OBSERVER);
}
exports.asLifeCycleObserver = asLifeCycleObserver;
/**
 * Find all life cycle observer bindings. By default, a binding tagged with
 * `CoreTags.LIFE_CYCLE_OBSERVER`. It's used as `BindingFilter`.
 */
exports.lifeCycleObserverFilter = (0, context_1.filterByTag)(keys_1.CoreTags.LIFE_CYCLE_OBSERVER);
/**
 * Sugar decorator to mark a class as life cycle observer
 * @param group - Optional observer group name
 * @param specs - Optional bindings specs
 */
function lifeCycleObserver(group = '', ...specs) {
    return (0, context_1.injectable)(asLifeCycleObserver, {
        tags: {
            [keys_1.CoreTags.LIFE_CYCLE_OBSERVER_GROUP]: group,
        },
    }, ...specs);
}
exports.lifeCycleObserver = lifeCycleObserver;
//# sourceMappingURL=lifecycle.js.map
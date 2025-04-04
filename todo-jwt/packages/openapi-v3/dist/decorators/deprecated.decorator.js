"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/openapi-v3
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.deprecated = void 0;
const core_1 = require("@loopback/core");
const keys_1 = require("../keys");
const debug = require('debug')('loopback:openapi3:metadata:controller-spec:deprecated');
/**
 * Marks an api path as deprecated.  When applied to a class, this decorator
 * marks all paths as deprecated.
 *
 * You can optionally mark all controllers in a class as deprecated, but use
 * `@deprecated(false)` on a specific method to ensure it is not marked
 * as deprecated in the specification.
 *
 * @param isDeprecated - whether or not the path should be marked as deprecated.
 *        This is useful for marking a class as deprecated, but a method as
 *        not deprecated.
 *
 * @example
 * ```ts
 * @oas.deprecated()
 * class MyController {
 *   @get('/greet')
 *   public async function greet() {
 *     return 'Hello, World!'
 *   }
 *
 *   @get('/greet-v2')
 *   @oas.deprecated(false)
 *   public async function greetV2() {
 *     return 'Hello, World!'
 *   }
 * }
 *
 * class MyOtherController {
 *   @get('/echo')
 *   public async function echo() {
 *     return 'Echo!'
 *   }
 * }
 * ```
 */
function deprecated(isDeprecated = true) {
    return function deprecatedDecoratorForClassOrMethod(
    // Class or a prototype
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target, method, 
    // Use `any` to for `TypedPropertyDescriptor`
    // See https://github.com/loopbackio/loopback-next/pull/2704
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    methodDescriptor) {
        debug(target, method, methodDescriptor);
        if (method && methodDescriptor) {
            // Method
            return core_1.MethodDecoratorFactory.createDecorator(keys_1.OAI3Keys.DEPRECATED_METHOD_KEY, isDeprecated, { decoratorName: '@oas.deprecated' })(target, method, methodDescriptor);
        }
        else if (typeof target === 'function' && !method && !methodDescriptor) {
            // Class
            return core_1.ClassDecoratorFactory.createDecorator(keys_1.OAI3Keys.DEPRECATED_CLASS_KEY, isDeprecated, { decoratorName: '@oas.deprecated' })(target);
        }
        else {
            throw new Error('@oas.deprecated cannot be used on a property: ' +
                core_1.DecoratorFactory.getTargetName(target, method, methodDescriptor));
        }
    };
}
exports.deprecated = deprecated;
//# sourceMappingURL=deprecated.decorator.js.map
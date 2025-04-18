"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/openapi-v3
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.operation = exports.del = exports.patch = exports.put = exports.post = exports.get = void 0;
const core_1 = require("@loopback/core");
const keys_1 = require("../keys");
/**
 * Expose a Controller method as a REST API operation
 * mapped to `GET` request method.
 *
 * @param path - The URL path of this operation, e.g. `/product/{id}`
 * @param spec - The OpenAPI specification describing parameters and responses
 *   of this operation.
 */
function get(path, spec) {
    return operation('get', path, spec);
}
exports.get = get;
/**
 * Expose a Controller method as a REST API operation
 * mapped to `POST` request method.
 *
 * @param path - The URL path of this operation, e.g. `/product/{id}`
 * @param spec - The OpenAPI specification describing parameters and responses
 *   of this operation.
 */
function post(path, spec) {
    return operation('post', path, spec);
}
exports.post = post;
/**
 * Expose a Controller method as a REST API operation
 * mapped to `PUT` request method.
 *
 * @param path - The URL path of this operation, e.g. `/product/{id}`
 * @param spec - The OpenAPI specification describing parameters and responses
 *   of this operation.
 */
function put(path, spec) {
    return operation('put', path, spec);
}
exports.put = put;
/**
 * Expose a Controller method as a REST API operation
 * mapped to `PATCH` request method.
 *
 * @param path - The URL path of this operation, e.g. `/product/{id}`
 * @param spec - The OpenAPI specification describing parameters and responses
 *   of this operation.
 */
function patch(path, spec) {
    return operation('patch', path, spec);
}
exports.patch = patch;
/**
 * Expose a Controller method as a REST API operation
 * mapped to `DELETE` request method.
 *
 * @param path - The URL path of this operation, e.g. `/product/{id}`
 * @param spec - The OpenAPI specification describing parameters and responses
 *   of this operation.
 */
function del(path, spec) {
    return operation('delete', path, spec);
}
exports.del = del;
/**
 * Expose a Controller method as a REST API operation.
 *
 * @param verb - HTTP verb, e.g. `GET` or `POST`.
 * @param path - The URL path of this operation, e.g. `/product/{id}`
 * @param spec - The OpenAPI specification describing parameters and responses
 *   of this operation.
 */
function operation(verb, path, spec) {
    return core_1.MethodDecoratorFactory.createDecorator(keys_1.OAI3Keys.METHODS_KEY, {
        verb,
        path,
        spec,
    }, { decoratorName: '@operation' });
}
exports.operation = operation;
//# sourceMappingURL=operation.decorator.js.map
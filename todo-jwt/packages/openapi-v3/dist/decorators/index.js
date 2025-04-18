"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/openapi-v3
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.oas = void 0;
const tslib_1 = require("tslib");
tslib_1.__exportStar(require("./api.decorator"), exports);
tslib_1.__exportStar(require("./deprecated.decorator"), exports);
tslib_1.__exportStar(require("./operation.decorator"), exports);
tslib_1.__exportStar(require("./parameter.decorator"), exports);
tslib_1.__exportStar(require("./request-body.decorator"), exports);
tslib_1.__exportStar(require("./response.decorator"), exports);
tslib_1.__exportStar(require("./tags.decorator"), exports);
tslib_1.__exportStar(require("./visibility.decorator"), exports);
const api_decorator_1 = require("./api.decorator");
const deprecated_decorator_1 = require("./deprecated.decorator");
const operation_decorator_1 = require("./operation.decorator");
const parameter_decorator_1 = require("./parameter.decorator");
const request_body_decorator_1 = require("./request-body.decorator");
const response_decorator_1 = require("./response.decorator");
const tags_decorator_1 = require("./tags.decorator");
const visibility_decorator_1 = require("./visibility.decorator");
exports.oas = {
    api: api_decorator_1.api,
    operation: operation_decorator_1.operation,
    // methods
    get: operation_decorator_1.get,
    post: operation_decorator_1.post,
    del: operation_decorator_1.del,
    patch: operation_decorator_1.patch,
    put: operation_decorator_1.put,
    //param
    param: parameter_decorator_1.param,
    // request body
    requestBody: request_body_decorator_1.requestBody,
    // oas convenience decorators
    deprecated: deprecated_decorator_1.deprecated,
    response: response_decorator_1.response,
    tags: tags_decorator_1.tags,
    visibility: visibility_decorator_1.visibility,
};
//# sourceMappingURL=index.js.map
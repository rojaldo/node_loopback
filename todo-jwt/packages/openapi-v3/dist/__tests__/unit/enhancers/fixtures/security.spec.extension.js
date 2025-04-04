"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/openapi-v3
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecuritySpecEnhancer = exports.SECURITY_SCHEME_SPEC = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const debug_1 = tslib_1.__importDefault(require("debug"));
const util_1 = require("util");
const __1 = require("../../../..");
const types_1 = require("../../../../enhancers/types");
const debug = (0, debug_1.default)('loopback:openapi:spec-enhancer');
exports.SECURITY_SCHEME_SPEC = {
    bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
    },
};
/**
 * A spec enhancer to add bearer token OpenAPI security entry to
 * `spec.component.securitySchemes`
 */
let SecuritySpecEnhancer = class SecuritySpecEnhancer {
    constructor() {
        this.name = 'security';
    }
    modifySpec(spec) {
        const patchSpec = { components: { securitySchemes: exports.SECURITY_SCHEME_SPEC } };
        const mergedSpec = (0, __1.mergeOpenAPISpec)(spec, patchSpec);
        debug(`security spec extension, merged spec: ${(0, util_1.inspect)(mergedSpec)}`);
        return mergedSpec;
    }
};
exports.SecuritySpecEnhancer = SecuritySpecEnhancer;
exports.SecuritySpecEnhancer = SecuritySpecEnhancer = tslib_1.__decorate([
    (0, core_1.injectable)(types_1.asSpecEnhancer)
], SecuritySpecEnhancer);
//# sourceMappingURL=security.spec.extension.js.map
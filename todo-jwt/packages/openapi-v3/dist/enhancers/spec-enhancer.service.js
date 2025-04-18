"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/openapi-v3
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeSecuritySchemeToSpec = exports.mergeOpenAPISpec = exports.OASEnhancerService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const debug_1 = tslib_1.__importDefault(require("debug"));
const _ = tslib_1.__importStar(require("lodash"));
const util_1 = require("util");
const types_1 = require("../types");
const keys_1 = require("./keys");
const jsonmergepatch = require('json-merge-patch');
const debug = (0, debug_1.default)('loopback:openapi:spec-enhancer');
/**
 * An extension point for OpenAPI Spec enhancement
 * This service is used for enhancing an OpenAPI spec by loading and applying one or more
 * registered enhancers.
 *
 * A typical use of it would be generating the OpenAPI spec for the endpoints on a server
 * in the `@loopback/rest` module.
 */
let OASEnhancerService = class OASEnhancerService {
    constructor(getEnhancers, options) {
        this.getEnhancers = getEnhancers;
        this.options = options;
        this._spec = {
            openapi: '3.0.0',
            info: {
                ...types_1.DEFAULT_OPENAPI_SPEC_INFO,
            },
            paths: {},
        };
    }
    /**
     * Getter for `_spec`
     */
    get spec() {
        return this._spec;
    }
    /**
     * Setter for `_spec`
     */
    set spec(value) {
        this._spec = value;
    }
    /**
     * Find an enhancer by its name
     * @param name The name of the enhancer you want to find
     */
    async getEnhancerByName(name) {
        // Get the latest list of enhancers
        const enhancers = await this.getEnhancers();
        return enhancers.find(e => e.name === name);
    }
    /**
     * Apply a given enhancer's merge function. Return the latest _spec.
     * @param name The name of the enhancer you want to apply
     */
    async applyEnhancerByName(name) {
        const enhancer = await this.getEnhancerByName(name);
        if (enhancer)
            this._spec = await enhancer.modifySpec(this._spec);
        return this._spec;
    }
    /**
     * Generate OpenAPI spec by applying ALL registered enhancers
     * TBD: load enhancers by group names
     */
    async applyAllEnhancers(options = {}) {
        const enhancers = await this.getEnhancers();
        if (_.isEmpty(enhancers))
            return this._spec;
        for (const e of enhancers) {
            this._spec = await e.modifySpec(this._spec);
        }
        debug(`Spec enhancer service, generated spec: ${(0, util_1.inspect)(this._spec)}`);
        return this._spec;
    }
};
exports.OASEnhancerService = OASEnhancerService;
exports.OASEnhancerService = OASEnhancerService = tslib_1.__decorate([
    (0, core_1.extensionPoint)(keys_1.OASEnhancerBindings.OAS_ENHANCER_EXTENSION_POINT_NAME),
    tslib_1.__param(0, (0, core_1.extensions)()),
    tslib_1.__param(1, (0, core_1.config)()),
    tslib_1.__metadata("design:paramtypes", [Function, Object])
], OASEnhancerService);
/**
 * The default merge function to patch the current OpenAPI spec.
 * It leverages module `json-merge-patch`'s merge API to merge two json objects.
 * It returns a new merged object without modifying the original one.
 *
 * A list of merging rules can be found in test file:
 * https://github.com/pierreinglebert/json-merge-patch/blob/master/test/lib/merge.js
 *
 * @param currentSpec The original spec
 * @param patchSpec The patch spec to be merged into the original spec
 * @returns A new specification object created by merging the original ones.
 */
function mergeOpenAPISpec(currentSpec, patchSpec) {
    const mergedSpec = jsonmergepatch.merge(currentSpec, patchSpec);
    return mergedSpec;
}
exports.mergeOpenAPISpec = mergeOpenAPISpec;
/**
 * Security scheme merge helper function to patch the current OpenAPI spec.
 * It provides a direct route to add a security schema to the specs components.
 * It returns a new merged object without modifying the original one.
 *
 * @param currentSpec The original spec
 * @param schemeName The name of the security scheme to be added
 * @param schemeSpec The security scheme spec body to be added,
 */
function mergeSecuritySchemeToSpec(spec, schemeName, schemeSpec) {
    const patchSpec = {
        components: {
            securitySchemes: { [schemeName]: schemeSpec },
        },
    };
    const mergedSpec = mergeOpenAPISpec(spec, patchSpec);
    return mergedSpec;
}
exports.mergeSecuritySchemeToSpec = mergeSecuritySchemeToSpec;
//# sourceMappingURL=spec-enhancer.service.js.map
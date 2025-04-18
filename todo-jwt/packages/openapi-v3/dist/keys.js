"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/openapi-v3
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAI3Keys = void 0;
const core_1 = require("@loopback/core");
var OAI3Keys;
(function (OAI3Keys) {
    /**
     * Metadata key used to set or retrieve `@operation` metadata.
     */
    OAI3Keys.METHODS_KEY = core_1.MetadataAccessor.create('openapi-v3:methods');
    /**
     * Metadata key used to set or retrieve `@deprecated` metadata on a method.
     */
    OAI3Keys.DEPRECATED_METHOD_KEY = core_1.MetadataAccessor.create('openapi-v3:methods:deprecated');
    /**
     * Metadata key used to set or retrieve `@deprecated` metadata on a class
     */
    OAI3Keys.DEPRECATED_CLASS_KEY = core_1.MetadataAccessor.create('openapi-v3:class:deprecated');
    /**
     * Metadata key used to set or retrieve `@visibility` metadata on a method.
     */
    OAI3Keys.VISIBILITY_METHOD_KEY = core_1.MetadataAccessor.create('openapi-v3:methods:visibility');
    /**
     * Metadata key used to set or retrieve `@visibility` metadata on a class
     */
    OAI3Keys.VISIBILITY_CLASS_KEY = core_1.MetadataAccessor.create('openapi-v3:class:visibility');
    /*
     * Metadata key used to add to or retrieve an endpoint's responses
     */
    OAI3Keys.RESPONSE_METHOD_KEY = core_1.MetadataAccessor.create('openapi-v3:methods:response');
    /**
     * Metadata key used to set or retrieve `param` decorator metadata
     */
    OAI3Keys.PARAMETERS_KEY = core_1.MetadataAccessor.create('openapi-v3:parameters');
    /**
     * Metadata key used to set or retrieve `@deprecated` metadata on a method.
     */
    OAI3Keys.TAGS_METHOD_KEY = core_1.MetadataAccessor.create('openapi-v3:methods:tags');
    /**
     * Metadata key used to set or retrieve `@deprecated` metadata on a class
     */
    OAI3Keys.TAGS_CLASS_KEY = core_1.MetadataAccessor.create('openapi-v3:class:tags');
    /**
     * Metadata key used to set or retrieve `@api` metadata
     */
    OAI3Keys.CLASS_KEY = core_1.MetadataAccessor.create('openapi-v3:class');
    /**
     * Metadata key used to set or retrieve a controller spec
     */
    OAI3Keys.CONTROLLER_SPEC_KEY = core_1.MetadataAccessor.create('openapi-v3:controller-spec');
    /**
     * Metadata key used to set or retrieve `@requestBody` metadata
     */
    OAI3Keys.REQUEST_BODY_KEY = core_1.MetadataAccessor.create('openapi-v3:request-body');
})(OAI3Keys || (exports.OAI3Keys = OAI3Keys = {}));
//# sourceMappingURL=keys.js.map
"use strict";
// Copyright IBM Corp. and LoopBack contributors 2017,2020. All Rights Reserved.
// Node module: @loopback/openapi-spec-builder
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentsSpecBuilder = exports.OperationSpecBuilder = exports.OpenApiSpecBuilder = exports.BuilderBase = exports.aComponentsSpec = exports.anOperationSpec = exports.anOpenApiSpec = void 0;
const tslib_1 = require("tslib");
const assert_1 = tslib_1.__importDefault(require("assert"));
/**
 * Create a new instance of OpenApiSpecBuilder.
 *
 * @param basePath - The base path on which the API is served.
 */
function anOpenApiSpec() {
    return new OpenApiSpecBuilder();
}
exports.anOpenApiSpec = anOpenApiSpec;
/**
 * Create a new instance of OperationSpecBuilder.
 */
function anOperationSpec() {
    return new OperationSpecBuilder();
}
exports.anOperationSpec = anOperationSpec;
/**
 * Create a new instance of ComponentsSpecBuilder.
 */
function aComponentsSpec() {
    return new ComponentsSpecBuilder();
}
exports.aComponentsSpec = aComponentsSpec;
class BuilderBase {
    constructor(initialSpec) {
        this._spec = initialSpec;
    }
    /**
     * Add a custom (extension) property to the spec object.
     *
     * @param key - The property name starting with "x-".
     * @param value - The property value.
     */
    withExtension(key, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value) {
        (0, assert_1.default)(key.startsWith('x-'), `Invalid extension ${key}, extension keys must be prefixed with "x-"`);
        // `this._spec[key] = value;` is broken in TypeScript 3.5
        // See https://github.com/microsoft/TypeScript/issues/31661
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this._spec[key] = value;
        return this;
    }
    /**
     * Build the spec object.
     */
    build() {
        // TODO(bajtos): deep-clone
        return this._spec;
    }
}
exports.BuilderBase = BuilderBase;
/**
 * A builder for creating OpenApiSpec documents.
 */
class OpenApiSpecBuilder extends BuilderBase {
    /**
     * @param basePath - The base path on which the API is served.
     */
    constructor() {
        super({
            openapi: '3.0.0',
            info: {
                title: 'LoopBack Application',
                version: '1.0.0',
            },
            paths: {},
            servers: [{ url: '/' }],
        });
    }
    /**
     * Define a new OperationObject at the given path and verb (method).
     *
     * @param verb - The HTTP verb.
     * @param path - The path relative to basePath.
     * @param spec - Additional specification of the operation.
     */
    withOperation(verb, path, spec) {
        if (spec instanceof OperationSpecBuilder)
            spec = spec.build();
        if (!this._spec.paths[path])
            this._spec.paths[path] = {};
        this._spec.paths[path][verb] = spec;
        return this;
    }
    /**
     * Define a new operation that returns a string response.
     *
     * @param verb - The HTTP verb.
     * @param path - The path relative to basePath.
     * @param operationName - The name of the controller method implementing
     * this operation (`x-operation-name` field).
     */
    withOperationReturningString(verb, path, operationName) {
        const spec = anOperationSpec().withStringResponse(200);
        if (operationName)
            spec.withOperationName(operationName);
        return this.withOperation(verb, path, spec);
    }
    /**
     * Define a new ComponentsObject.
     *
     * @param spec - Specification of the components.
     */
    withComponents(spec) {
        if (spec instanceof ComponentsSpecBuilder)
            spec = spec.build();
        if (!this._spec.components)
            this._spec.components = spec;
        return this;
    }
}
exports.OpenApiSpecBuilder = OpenApiSpecBuilder;
/**
 * A builder for creating OperationObject specifications.
 */
class OperationSpecBuilder extends BuilderBase {
    constructor() {
        super({
            responses: { '200': { description: 'An undocumented response body.' } },
        });
    }
    /**
     * Describe a response for a given HTTP status code.
     * @param status - HTTP status code or string "default"
     * @param responseSpec - Specification of the response
     */
    withResponse(status, responseSpec) {
        // OpenAPI spec uses string indices, i.e. 200 OK uses "200" as the index
        this._spec.responses[status.toString()] = responseSpec;
        return this;
    }
    withStringResponse(status = 200) {
        return this.withResponse(status, {
            description: 'The string result.',
            content: {
                'text/plain': {
                    schema: { type: 'string' },
                },
            },
        });
    }
    /**
     * Describe one more parameters accepted by the operation.
     * Note that parameters are positional in OpenAPI Spec, therefore
     * the first call of `withParameter` defines the first parameter,
     * the second call defines the second parameter, etc.
     * @param parameterSpecs
     */
    withParameter(...parameterSpecs) {
        if (!this._spec.parameters)
            this._spec.parameters = [];
        this._spec.parameters.push(...parameterSpecs);
        return this;
    }
    withRequestBody(requestBodySpec) {
        this._spec.requestBody = requestBodySpec;
        return this;
    }
    /**
     * Define the operation name (controller method name).
     *
     * @param name - The name of the controller method implementing this operation.
     */
    withOperationName(name) {
        this.withExtension('x-operation-name', name);
        this.setupOperationId();
        return this;
    }
    /**
     * Define the controller name (controller name).
     *
     * @param name - The name of the controller containing this operation.
     */
    withControllerName(name) {
        this.withExtension('x-controller-name', name);
        this.setupOperationId();
        return this;
    }
    /**
     * Set up the `operationId` if not configured
     */
    setupOperationId() {
        if (this._spec.operationId)
            return;
        const controllerName = this._spec['x-controller-name'];
        const operationName = this._spec['x-operation-name'];
        if (controllerName && operationName) {
            // Build the operationId as `<controllerName>.<operationName>`
            // Please note API explorer (https://github.com/swagger-api/swagger-js/)
            // will normalize it as `<controllerName>_<operationName>`
            this._spec.operationId = controllerName + '.' + operationName;
        }
    }
    /**
     * Define the operationId
     * @param operationId - Operation id
     */
    withOperationId(operationId) {
        this._spec.operationId = operationId;
        return this;
    }
    /**
     * Describe tags associated with the operation
     * @param tags
     */
    withTags(tags) {
        if (!this._spec.tags)
            this._spec.tags = [];
        if (typeof tags === 'string')
            tags = [tags];
        this._spec.tags.push(...tags);
        return this;
    }
}
exports.OperationSpecBuilder = OperationSpecBuilder;
/**
 * A builder for creating ComponentsObject specifications.
 */
class ComponentsSpecBuilder extends BuilderBase {
    constructor() {
        super({});
    }
    /**
     * Define a component schema.
     *
     * @param name - The name of the schema
     * @param schema - Specification of the schema
     *
     */
    withSchema(name, schema) {
        if (!this._spec.schemas)
            this._spec.schemas = {};
        this._spec.schemas[name] = schema;
        return this;
    }
    /**
     * Define a component response.
     *
     * @param name - The name of the response
     * @param response - Specification of the response
     *
     */
    withResponse(name, response) {
        if (!this._spec.responses)
            this._spec.responses = {};
        this._spec.responses[name] = response;
        return this;
    }
    /**
     * Define a component parameter.
     *
     * @param name - The name of the parameter
     * @param parameter - Specification of the parameter
     *
     */
    withParameter(name, parameter) {
        if (!this._spec.parameters)
            this._spec.parameters = {};
        this._spec.parameters[name] = parameter;
        return this;
    }
    /**
     * Define a component example.
     *
     * @param name - The name of the example
     * @param example - Specification of the example
     *
     */
    withExample(name, example) {
        if (!this._spec.examples)
            this._spec.examples = {};
        this._spec.examples[name] = example;
        return this;
    }
    /**
     * Define a component request body.
     *
     * @param name - The name of the request body
     * @param requestBody - Specification of the request body
     *
     */
    withRequestBody(name, requestBody) {
        if (!this._spec.requestBodies)
            this._spec.requestBodies = {};
        this._spec.requestBodies[name] = requestBody;
        return this;
    }
    /**
     * Define a component header.
     *
     * @param name - The name of the header
     * @param header - Specification of the header
     *
     */
    withHeader(name, header) {
        if (!this._spec.headers)
            this._spec.headers = {};
        this._spec.headers[name] = header;
        return this;
    }
    /**
     * Define a component security scheme.
     *
     * @param name - The name of the security scheme
     * @param securityScheme - Specification of the security scheme
     *
     */
    withSecurityScheme(name, securityScheme) {
        if (!this._spec.securitySchemes)
            this._spec.securitySchemes = {};
        this._spec.securitySchemes[name] = securityScheme;
        return this;
    }
    /**
     * Define a component link.
     *
     * @param name - The name of the link
     * @param link - Specification of the link
     *
     */
    withLink(name, link) {
        if (!this._spec.links)
            this._spec.links = {};
        this._spec.links[name] = link;
        return this;
    }
    /**
     * Define a component callback.
     *
     * @param name - The name of the callback
     * @param callback - Specification of the callback
     *
     */
    withCallback(name, callback) {
        if (!this._spec.callbacks)
            this._spec.callbacks = {};
        this._spec.callbacks[name] = callback;
        return this;
    }
}
exports.ComponentsSpecBuilder = ComponentsSpecBuilder;
//# sourceMappingURL=openapi-spec-builder.js.map
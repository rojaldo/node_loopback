"use strict";
// Copyright IBM Corp. and LoopBack contributors 2017,2020. All Rights Reserved.
// Node module: @loopback/rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseOperationArgs = void 0;
const tslib_1 = require("tslib");
const openapi_v3_1 = require("@loopback/openapi-v3");
const debug_1 = tslib_1.__importDefault(require("debug"));
const body_parsers_1 = require("./body-parsers");
const coerce_parameter_1 = require("./coercion/coerce-parameter");
const rest_http_error_1 = require("./rest-http-error");
const ajv_factory_provider_1 = require("./validation/ajv-factory.provider");
const request_body_validator_1 = require("./validation/request-body.validator");
const debug = (0, debug_1.default)('loopback:rest:parser');
/**
 * Parses the request to derive arguments to be passed in for the Application
 * controller method
 *
 * @param request - Incoming HTTP request
 * @param route - Resolved Route
 */
async function parseOperationArgs(request, route, requestBodyParser = new body_parsers_1.RequestBodyParser(), options = ajv_factory_provider_1.DEFAULT_AJV_VALIDATION_OPTIONS) {
    debug('Parsing operation arguments for route %s', route.describe());
    const operationSpec = route.spec;
    const pathParams = route.pathParams;
    const body = await requestBodyParser.loadRequestBodyIfNeeded(operationSpec, request);
    return buildOperationArguments(operationSpec, request, pathParams, body, route.schemas, options);
}
exports.parseOperationArgs = parseOperationArgs;
async function buildOperationArguments(operationSpec, request, pathParams, body, globalSchemas, options = ajv_factory_provider_1.DEFAULT_AJV_VALIDATION_OPTIONS) {
    var _a;
    let requestBodyIndex = -1;
    if (operationSpec.requestBody) {
        // the type of `operationSpec.requestBody` could be `RequestBodyObject`
        // or `ReferenceObject`, resolving a `$ref` value is not supported yet.
        if ((0, openapi_v3_1.isReferenceObject)(operationSpec.requestBody)) {
            throw new Error('$ref requestBody is not supported yet.');
        }
        const i = operationSpec.requestBody[openapi_v3_1.REQUEST_BODY_INDEX];
        requestBodyIndex = i !== null && i !== void 0 ? i : 0;
    }
    const paramArgs = [];
    for (const paramSpec of (_a = operationSpec.parameters) !== null && _a !== void 0 ? _a : []) {
        if ((0, openapi_v3_1.isReferenceObject)(paramSpec)) {
            // TODO(bajtos) implement $ref parameters
            // See https://github.com/loopbackio/loopback-next/issues/435
            throw new Error('$ref parameters are not supported yet.');
        }
        const spec = paramSpec;
        const rawValue = getParamFromRequest(spec, request, pathParams);
        const coercedValue = await (0, coerce_parameter_1.coerceParameter)(rawValue, spec, options);
        paramArgs.push(coercedValue);
    }
    debug('Validating request body - value %j', body);
    await (0, request_body_validator_1.validateRequestBody)(body, operationSpec.requestBody, globalSchemas, options);
    if (requestBodyIndex >= 0) {
        paramArgs.splice(requestBodyIndex, 0, body.value);
    }
    return paramArgs;
}
function getParamFromRequest(spec, request, pathParams) {
    switch (spec.in) {
        case 'query':
            return request.query[spec.name];
        case 'path':
            return pathParams[spec.name];
        case 'header':
            // @jannyhou TBD: check edge cases
            return request.headers[spec.name.toLowerCase()];
        // TODO(jannyhou) to support `cookie`,
        // see issue https://github.com/loopbackio/loopback-next/issues/997
        default:
            throw rest_http_error_1.RestHttpErrors.invalidParamLocation(spec.in);
    }
}
//# sourceMappingURL=parser.js.map
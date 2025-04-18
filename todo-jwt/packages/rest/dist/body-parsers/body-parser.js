"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestBodyParser = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const openapi_v3_1 = require("@loopback/openapi-v3");
const debug_1 = tslib_1.__importDefault(require("debug"));
const type_is_1 = require("type-is");
const rest_http_error_1 = require("../rest-http-error");
const body_parser_helpers_1 = require("./body-parser.helpers");
const types_1 = require("./types");
const debug = (0, debug_1.default)('loopback:rest:body-parser');
let RequestBodyParser = class RequestBodyParser {
    constructor(parsers, ctx) {
        this.ctx = ctx;
        this.parsers = sortParsers(parsers !== null && parsers !== void 0 ? parsers : []);
        if (debug.enabled) {
            debug('Body parsers: ', this.parsers.map(p => p.name));
        }
    }
    async loadRequestBodyIfNeeded(operationSpec, request) {
        const { requestBody, customParser } = await this._matchRequestBodySpec(operationSpec, request);
        if (!operationSpec.requestBody)
            return requestBody;
        const matchedMediaType = requestBody.mediaType;
        try {
            if (customParser) {
                // Invoke the custom parser
                const body = await this._invokeCustomParser(customParser, request);
                debug('Parsed request body', body);
                return Object.assign(requestBody, body);
            }
            else {
                const parser = this._findParser(matchedMediaType);
                if (parser) {
                    const body = await parser.parse(request);
                    debug('Parsed request body', body);
                    return Object.assign(requestBody, body);
                }
            }
        }
        catch (err) {
            debug('Request body parsing error', err);
            throw (0, body_parser_helpers_1.normalizeParsingError)(err);
        }
        throw rest_http_error_1.RestHttpErrors.unsupportedMediaType(matchedMediaType);
    }
    /**
     * Match the http request to a given media type of the request body spec
     */
    async _matchRequestBodySpec(operationSpec, request) {
        var _a;
        const requestBody = {
            value: undefined,
        };
        if (!operationSpec.requestBody)
            return { requestBody };
        const contentType = (_a = (0, body_parser_helpers_1.getContentType)(request)) !== null && _a !== void 0 ? _a : 'application/json';
        debug('Loading request body with content type %j', contentType);
        // the type of `operationSpec.requestBody` could be `RequestBodyObject`
        // or `ReferenceObject`, resolving a `$ref` value is not supported yet.
        if ((0, openapi_v3_1.isReferenceObject)(operationSpec.requestBody)) {
            throw new Error('$ref requestBody is not supported yet.');
        }
        let content = operationSpec.requestBody.content || {};
        if (!Object.keys(content).length) {
            content = {
                // default to allow json and urlencoded
                'application/json': { schema: { type: 'object' } },
                'application/x-www-form-urlencoded': { schema: { type: 'object' } },
            };
        }
        // Check of the request content type matches one of the expected media
        // types in the request body spec
        let matchedMediaType = false;
        let customParser = undefined;
        for (const type in content) {
            matchedMediaType = (0, type_is_1.is)(contentType, type);
            if (matchedMediaType) {
                debug('Matched media type: %s -> %s', type, contentType);
                requestBody.mediaType = contentType;
                requestBody.schema = content[type].schema;
                customParser = content[type]['x-parser'];
                break;
            }
        }
        if (!matchedMediaType) {
            // No matching media type found, fail fast
            throw rest_http_error_1.RestHttpErrors.unsupportedMediaType(contentType, Object.keys(content));
        }
        return { requestBody, customParser };
    }
    /**
     * Find a body parser that supports the media type
     * @param matchedMediaType - Media type
     */
    _findParser(matchedMediaType) {
        for (const parser of this.parsers) {
            if (!parser.supports(matchedMediaType)) {
                debug('Body parser %s does not support %s', parser.name, matchedMediaType);
                continue;
            }
            debug('Body parser %s found for %s', parser.name, matchedMediaType);
            return parser;
        }
    }
    /**
     * Resolve and invoke a custom parser
     * @param customParser - The parser name, class or function
     * @param request - Http request
     */
    async _invokeCustomParser(customParser, request) {
        if (typeof customParser === 'string') {
            const parser = this.parsers.find(p => p.name === customParser ||
                p.name === body_parser_helpers_1.builtinParsers.mapping[customParser]);
            if (parser) {
                debug('Using custom parser %s', customParser);
                return parser.parse(request);
            }
        }
        else if (typeof customParser === 'function') {
            if (isBodyParserClass(customParser)) {
                debug('Using custom parser class %s', customParser.name);
                const parser = await (0, core_1.instantiateClass)(customParser, this.ctx);
                return parser.parse(request);
            }
            else {
                debug('Using custom parser function %s', customParser.name);
                return customParser(request);
            }
        }
        throw new Error('Custom parser not found: ' + customParser);
    }
};
exports.RequestBodyParser = RequestBodyParser;
exports.RequestBodyParser = RequestBodyParser = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)((0, core_1.filterByTag)(types_1.REQUEST_BODY_PARSER_TAG), { optional: true })),
    tslib_1.__param(1, core_1.inject.context()),
    tslib_1.__metadata("design:paramtypes", [Array, core_1.Context])
], RequestBodyParser);
/**
 * Test if a function is a body parser class or plain function
 * @param fn
 */
function isBodyParserClass(fn) {
    return fn.toString().startsWith('class ');
}
/**
 * Sort body parsers so that built-in ones are used after extensions
 * @param parsers
 */
function sortParsers(parsers) {
    return parsers.sort((a, b) => (0, core_1.compareByOrder)(a.name, b.name, body_parser_helpers_1.builtinParsers.names));
}
//# sourceMappingURL=body-parser.js.map
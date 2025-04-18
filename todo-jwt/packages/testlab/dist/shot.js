"use strict";
// Copyright IBM Corp. and LoopBack contributors 2017,2019. All Rights Reserved.
// Node module: @loopback/testlab
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.stubExpressContext = exports.stubHandlerContext = exports.stubServerResponse = exports.stubServerRequest = exports.inject = void 0;
const tslib_1 = require("tslib");
/*
 * HTTP Request/Response mocks
 * https://github.com/hapijs/shot
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
const express_1 = tslib_1.__importDefault(require("express"));
const util_1 = tslib_1.__importDefault(require("util"));
const inject = require('@hapi/shot');
exports.inject = inject;
const ShotRequest = require('@hapi/shot/lib/request');
function stubServerRequest(options) {
    const stub = new ShotRequest(options);
    // Hacky workaround for Express, see
    // https://github.com/expressjs/express/blob/4.16.3/lib/middleware/init.js
    // https://github.com/hapijs/shot/issues/82#issuecomment-247943773
    // https://github.com/jfhbrook/pickleback
    Object.assign(stub, ShotRequest.prototype);
    return stub;
}
exports.stubServerRequest = stubServerRequest;
const ShotResponse = require('@hapi/shot/lib/response');
function stubServerResponse(request, onEnd) {
    const stub = new ShotResponse(request, onEnd);
    // Hacky workaround for Express, see
    // https://github.com/expressjs/express/blob/4.16.3/lib/middleware/init.js
    // https://github.com/hapijs/shot/issues/82#issuecomment-247943773
    // https://github.com/jfhbrook/pickleback
    Object.assign(stub, ShotResponse.prototype);
    return stub;
}
exports.stubServerResponse = stubServerResponse;
function stubHandlerContext(requestOptions = { url: '/' }) {
    const request = stubServerRequest(requestOptions);
    let response;
    const result = new Promise(resolve => {
        response = new ShotResponse(request, resolve);
    });
    const context = { request, response: response, result };
    defineCustomContextInspect(context, requestOptions);
    return context;
}
exports.stubHandlerContext = stubHandlerContext;
function stubExpressContext(requestOptions = { url: '/' }) {
    const app = (0, express_1.default)();
    const request = new ShotRequest(requestOptions);
    // mix in Express Request API
    const RequestApi = express_1.default.request;
    for (const key of Object.getOwnPropertyNames(RequestApi)) {
        Object.defineProperty(request, key, Object.getOwnPropertyDescriptor(RequestApi, key));
    }
    request.app = app;
    request.originalUrl = request.url;
    parseQuery(request);
    let response;
    const result = new Promise(resolve => {
        response = new ShotResponse(request, resolve);
        // mix in Express Response API
        Object.assign(response, express_1.default.response);
        const ResponseApi = express_1.default.response;
        for (const key of Object.getOwnPropertyNames(ResponseApi)) {
            Object.defineProperty(response, key, Object.getOwnPropertyDescriptor(ResponseApi, key));
        }
        response.app = app;
        response.req = request;
        request.res = response;
    });
    const context = { app, request, response: response, result };
    defineCustomContextInspect(context, requestOptions);
    return context;
}
exports.stubExpressContext = stubExpressContext;
/**
 * Use `express.query` to parse the query string into `request.query` object
 * @param request - Express http request object
 */
function parseQuery(request) {
    // Use `express.query` to parse the query string
    // See https://github.com/expressjs/express/blob/master/lib/express.js#L79
    // See https://github.com/expressjs/express/blob/master/lib/middleware/query.js
    express_1.default.query()(request, {}, () => { });
}
function defineCustomContextInspect(context, requestOptions) {
    // Setup custom inspect functions to make test error messages easier to read
    const inspectOpts = (depth, opts) => util_1.default.inspect(requestOptions, opts);
    defineCustomInspect(context.request, (depth, opts) => `[RequestStub with options ${inspectOpts(depth, opts)}]`);
    defineCustomInspect(context.response, (depth, opts) => `[ResponseStub for request with options ${inspectOpts(depth, opts)}]`);
    context.result = context.result.then(r => {
        defineCustomInspect(r, (depth, opts) => `[ObservedResponse for request with options ${inspectOpts(depth, opts)}]`);
        return r;
    });
}
// @types/node@v10.17.29 seems to miss the type definition of `util.inspect.custom`
// error TS2339: Property 'custom' does not exist on type 'typeof inspect'.
// Use a workaround for now to access the `custom` symbol for now.
// https://nodejs.org/api/util.html#util_util_inspect_custom
const custom = Symbol.for('nodejs.util.inspect.custom');
function defineCustomInspect(obj, inspectFn) {
    obj[custom] = inspectFn;
}
//# sourceMappingURL=shot.js.map
"use strict";
// Copyright IBM Corp. and LoopBack contributors 2017,2020. All Rights Reserved.
// Node module: @loopback/testlab
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRestAppClient = exports.createClientForHandler = exports.supertest = void 0;
const tslib_1 = require("tslib");
/*
 * HTTP client utilities
 */
const http_1 = tslib_1.__importDefault(require("http"));
const supertest_1 = tslib_1.__importDefault(require("supertest"));
exports.supertest = supertest_1.default;
/**
 * Create a SuperTest client connected to an HTTP server listening
 * on an ephemeral port and calling `handler` to handle incoming requests.
 * @param handler
 */
function createClientForHandler(handler) {
    const server = http_1.default.createServer(handler);
    return (0, supertest_1.default)(server);
}
exports.createClientForHandler = createClientForHandler;
/**
 * Create a SuperTest client for a running RestApplication instance.
 * It is the responsibility of the caller to ensure that the app
 * is running and to stop the application after all tests are done.
 * @param app - A running (listening) instance of a RestApplication.
 */
function createRestAppClient(app) {
    var _a;
    const url = (_a = app.restServer.rootUrl) !== null && _a !== void 0 ? _a : app.restServer.url;
    if (!url) {
        throw new Error(`Cannot create client for ${app.constructor.name}, it is not listening.`);
    }
    return (0, supertest_1.default)(url);
}
exports.createRestAppClient = createRestAppClient;
//# sourceMappingURL=client.js.map
"use strict";
// Copyright IBM Corp. and LoopBack contributors 2017,2020. All Rights Reserved.
// Node module: @loopback/rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeResultToResponse = void 0;
const stream_1 = require("stream");
/**
 * Writes the result from Application controller method
 * into the HTTP response
 *
 * @param response - HTTP Response
 * @param result - Result from the API to write into HTTP Response
 */
function writeResultToResponse(
// not needed and responsibility should be in the sequence.send
response, 
// result returned back from invoking controller method
result) {
    // Bypass response writing if the controller method returns `response` itself
    // or the response headers have been sent
    if (result === response || response.headersSent) {
        return;
    }
    if (result === undefined) {
        response.statusCode = 204;
        response.end();
        return;
    }
    const isStream = result instanceof stream_1.Readable || typeof (result === null || result === void 0 ? void 0 : result.pipe) === 'function';
    if (isStream) {
        response.setHeader('Content-Type', 'application/octet-stream');
        // Stream
        result.pipe(response);
        return;
    }
    switch (typeof result) {
        case 'object':
        case 'boolean':
        case 'number':
            if (Buffer.isBuffer(result)) {
                // Buffer for binary data
                response.setHeader('Content-Type', 'application/octet-stream');
            }
            else {
                // TODO(ritch) remove this, should be configurable
                // See https://github.com/loopbackio/loopback-next/issues/436
                response.setHeader('Content-Type', 'application/json');
                // TODO(bajtos) handle errors - JSON.stringify can throw
                result = JSON.stringify(result);
            }
            break;
        default:
            response.setHeader('Content-Type', 'text/plain');
            result = result.toString();
            break;
    }
    response.end(result);
}
exports.writeResultToResponse = writeResultToResponse;
//# sourceMappingURL=writer.js.map
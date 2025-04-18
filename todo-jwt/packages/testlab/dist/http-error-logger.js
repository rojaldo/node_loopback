"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/testlab
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUnexpectedHttpErrorLogger = void 0;
/**
 * Creates a Logger that logs an Error if the HTTP status code is not expected
 *
 * @param expectedStatusCode - HTTP status code that is expected
 */
function createUnexpectedHttpErrorLogger(expectedStatusCode) {
    return function logUnexpectedHttpError(err, statusCode, req) {
        var _a;
        if (statusCode === expectedStatusCode)
            return;
        /* istanbul ignore next */
        console.error('Unhandled error in %s %s: %s %s', req.method, req.url, statusCode, (_a = err.stack) !== null && _a !== void 0 ? _a : err);
    };
}
exports.createUnexpectedHttpErrorLogger = createUnexpectedHttpErrorLogger;
//# sourceMappingURL=http-error-logger.js.map
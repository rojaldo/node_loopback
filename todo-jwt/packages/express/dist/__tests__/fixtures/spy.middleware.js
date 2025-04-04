"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/express
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testlab_1 = require("@loopback/testlab");
const debug_1 = tslib_1.__importDefault(require("debug"));
const http_errors_1 = tslib_1.__importDefault(require("http-errors"));
const __1 = require("../..");
const types_1 = require("../../types");
const debug = (0, debug_1.default)('loopback:middleware:spy');
/**
 * An Express middleware factory function that creates a handler to spy on
 * requests
 */
const spyMiddlewareFactory = config => {
    const options = { action: 'log', ...config };
    return function spy(req, res, next) {
        var _a;
        (0, testlab_1.expect)(req).to.have.properties(__1.MIDDLEWARE_CONTEXT);
        (0, testlab_1.expect)((_a = (0, types_1.getMiddlewareContext)(req)) === null || _a === void 0 ? void 0 : _a.request).to.equal(req);
        debug('config', options);
        switch (options === null || options === void 0 ? void 0 : options.action) {
            case 'mock':
                debug('spy - MOCK');
                res.set('x-spy-mock', `${req.method} ${req.path}`);
                res.send('Hello, Spy');
                break;
            case 'reject':
                debug('spy - REJECT');
                res.set('x-spy-reject', `${req.method} ${req.path}`);
                next(new http_errors_1.default.BadRequest('Request rejected by spy'));
                break;
            default:
                debug('spy - LOG');
                res.set('x-spy-log', `${req.method} ${req.path}`);
                next();
                break;
        }
    };
};
exports.default = spyMiddlewareFactory;
//# sourceMappingURL=spy.middleware.js.map
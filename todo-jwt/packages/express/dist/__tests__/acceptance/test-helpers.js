"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/express
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestHelper = exports.spy = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const testlab_1 = require("@loopback/testlab");
const body_parser_1 = tslib_1.__importDefault(require("body-parser"));
const express_application_1 = require("../../express.application");
var spy_middleware_1 = require("../fixtures/spy.middleware");
Object.defineProperty(exports, "spy", { enumerable: true, get: function () { return tslib_1.__importDefault(spy_middleware_1).default; } });
function runAsyncWrapper(callback) {
    return function (req, res, next) {
        callback(req, res, next).catch(next);
    };
}
class TestHelper {
    constructor() {
        this.app = new express_application_1.ExpressApplication({
            express: {
                ...(0, testlab_1.givenHttpServerConfig)(),
                settings: {
                    env: 'test',
                },
            },
        });
        this.app.expressServer.expressMiddleware(body_parser_1.default.json, { strict: false }, { key: 'middleware.bodyParser' });
    }
    async start() {
        await this.app.start();
        this.client = (0, testlab_1.supertest)(this.app.expressServer.url);
    }
    stop() {
        return this.app.stop();
    }
    bindController(interceptor) {
        const interceptors = [];
        if (interceptor)
            interceptors.push(interceptor);
        class MyController {
            hello(msg) {
                return `Hello, ${msg}`;
            }
        }
        tslib_1.__decorate([
            (0, core_1.intercept)(...interceptors),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [String]),
            tslib_1.__metadata("design:returntype", void 0)
        ], MyController.prototype, "hello", null);
        const binding = this.app.controller(MyController);
        const handler = runAsyncWrapper(async (req, res, next) => {
            try {
                const controller = await this.app.get(binding.key);
                const proxy = (0, core_1.createProxyWithInterceptors)(controller, this.app.expressServer.getMiddlewareContext(req), undefined, {
                    type: 'route',
                    value: controller,
                });
                res.send(await proxy.hello(req.body));
            }
            catch (err) {
                next(err);
            }
        });
        this.app.expressServer.expressApp.post('/hello', handler);
        this.app.expressServer.expressApp.post('/greet', handler);
    }
    configureSpy(spyBinding, action = 'log') {
        this.app.configure(spyBinding.key).to({ action });
    }
    async testSpyLog(spyBinding, path = '/hello') {
        this.configureSpy(spyBinding);
        await this.assertSpyLog(path);
    }
    async assertSpyLog(path = '/hello') {
        await this.client
            .post(path)
            .send('"World"')
            .set('content-type', 'application/json')
            .expect(200, 'Hello, World')
            .expect('x-spy-log', `POST ${path}`);
    }
    async testSpyMock(spyBinding, path = '/hello') {
        this.configureSpy(spyBinding, 'mock');
        await this.assertSpyMock(path);
    }
    async assertSpyMock(path = '/hello') {
        await this.client
            .post(path)
            .send('"World"')
            .set('content-type', 'application/json')
            .expect(200, 'Hello, Spy')
            .expect('x-spy-mock', `POST ${path}`);
    }
    async testSpyReject(spyBinding, path = '/hello') {
        this.configureSpy(spyBinding, 'reject');
        await this.assertSpyReject(path);
    }
    async assertSpyReject(path = '/hello') {
        await this.client
            .post(path)
            .send('"World"')
            .set('content-type', 'application/json')
            .expect(400)
            .expect('x-spy-reject', `POST ${path}`);
    }
}
exports.TestHelper = TestHelper;
//# sourceMappingURL=test-helpers.js.map
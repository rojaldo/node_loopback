"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/authentication-jwt
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySequence = void 0;
const tslib_1 = require("tslib");
const authentication_1 = require("@loopback/authentication");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const SequenceActions = rest_1.RestBindings.SequenceActions;
let MySequence = class MySequence {
    constructor(ctx, findRoute, parseParams, invoke, send, reject, authenticateRequest) {
        this.ctx = ctx;
        this.findRoute = findRoute;
        this.parseParams = parseParams;
        this.invoke = invoke;
        this.send = send;
        this.reject = reject;
        this.authenticateRequest = authenticateRequest;
    }
    async handle(context) {
        try {
            const { request, response } = context;
            const route = this.findRoute(request);
            // - enable jwt auth -
            // call authentication action
            await this.authenticateRequest(request);
            const args = await this.parseParams(request, route);
            const result = await this.invoke(route, args);
            this.send(response, result);
        }
        catch (error) {
            if (error.code === authentication_1.AUTHENTICATION_STRATEGY_NOT_FOUND ||
                error.code === authentication_1.USER_PROFILE_NOT_FOUND) {
                Object.assign(error, { statusCode: 401 /* Unauthorized */ });
            }
            this.reject(context, error);
        }
    }
};
exports.MySequence = MySequence;
exports.MySequence = MySequence = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)(rest_1.RestBindings.Http.CONTEXT)),
    tslib_1.__param(1, (0, core_1.inject)(SequenceActions.FIND_ROUTE)),
    tslib_1.__param(2, (0, core_1.inject)(SequenceActions.PARSE_PARAMS)),
    tslib_1.__param(3, (0, core_1.inject)(SequenceActions.INVOKE_METHOD)),
    tslib_1.__param(4, (0, core_1.inject)(SequenceActions.SEND)),
    tslib_1.__param(5, (0, core_1.inject)(SequenceActions.REJECT)),
    tslib_1.__param(6, (0, core_1.inject)(authentication_1.AuthenticationBindings.AUTH_ACTION)),
    tslib_1.__metadata("design:paramtypes", [core_1.Context, Function, Function, Function, Function, Function, Function])
], MySequence);
//# sourceMappingURL=sequence.js.map
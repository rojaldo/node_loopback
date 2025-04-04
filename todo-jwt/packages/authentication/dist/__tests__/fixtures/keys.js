"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/authentication
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTAuthenticationStrategyBindings = exports.BasicAuthenticationStrategyBindings = exports.USER_REPO = void 0;
const core_1 = require("@loopback/core");
exports.USER_REPO = core_1.BindingKey.create('authentication.user.repo');
var BasicAuthenticationStrategyBindings;
(function (BasicAuthenticationStrategyBindings) {
    BasicAuthenticationStrategyBindings.USER_SERVICE = core_1.BindingKey.create('services.authentication.basic.user.service');
})(BasicAuthenticationStrategyBindings || (exports.BasicAuthenticationStrategyBindings = BasicAuthenticationStrategyBindings = {}));
var JWTAuthenticationStrategyBindings;
(function (JWTAuthenticationStrategyBindings) {
    JWTAuthenticationStrategyBindings.TOKEN_SECRET = core_1.BindingKey.create('authentication.jwt.secret');
    JWTAuthenticationStrategyBindings.TOKEN_EXPIRES_IN = core_1.BindingKey.create('authentication.jwt.expires.in.seconds');
    JWTAuthenticationStrategyBindings.TOKEN_SERVICE = core_1.BindingKey.create('services.authentication.jwt.tokenservice');
})(JWTAuthenticationStrategyBindings || (exports.JWTAuthenticationStrategyBindings = JWTAuthenticationStrategyBindings = {}));
//# sourceMappingURL=keys.js.map
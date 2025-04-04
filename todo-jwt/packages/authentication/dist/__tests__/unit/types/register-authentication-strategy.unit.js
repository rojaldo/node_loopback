"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/authentication
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const security_1 = require("@loopback/security");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../..");
describe('registerAuthenticationStrategy', () => {
    let ctx;
    beforeEach(givenContext);
    it('adds a binding for the strategy', () => {
        const binding = (0, __1.registerAuthenticationStrategy)(ctx, MyAuthenticationStrategy);
        (0, testlab_1.expect)(binding.tagMap).to.containEql({
            extensionFor: [
                __1.AuthenticationBindings.AUTHENTICATION_STRATEGY_EXTENSION_POINT_NAME,
                rest_1.OASEnhancerBindings.OAS_ENHANCER_EXTENSION_POINT_NAME,
            ],
        });
        (0, testlab_1.expect)(binding.key).to.eql(`${__1.AuthenticationBindings.AUTHENTICATION_STRATEGY_EXTENSION_POINT_NAME}.MyAuthenticationStrategy`);
    });
    it('adds a binding for the strategy and security spec', () => {
        const binding = (0, core_1.createBindingFromClass)(MyAuthenticationStrategy);
        (0, testlab_1.expect)(binding.tagMap).to.containEql({
            extensionFor: [
                __1.AuthenticationBindings.AUTHENTICATION_STRATEGY_EXTENSION_POINT_NAME,
                rest_1.OASEnhancerBindings.OAS_ENHANCER_EXTENSION_POINT_NAME,
            ],
        });
        (0, testlab_1.expect)(binding.key).to.eql(`${rest_1.OASEnhancerBindings.OAS_ENHANCER_EXTENSION_POINT_NAME}.MyAuthenticationStrategy`);
    });
    let MyAuthenticationStrategy = class MyAuthenticationStrategy {
        async authenticate(request) {
            return {
                [security_1.securityId]: 'somebody',
            };
        }
        modifySpec(spec) {
            return {
                openapi: '3.0.0',
                info: { title: 'Test', version: '1.0.0' },
                paths: {},
            };
        }
    };
    MyAuthenticationStrategy = tslib_1.__decorate([
        (0, core_1.injectable)(__1.asAuthStrategy, rest_1.asSpecEnhancer)
    ], MyAuthenticationStrategy);
    function givenContext() {
        ctx = new core_1.Context('app');
    }
});
//# sourceMappingURL=register-authentication-strategy.unit.js.map
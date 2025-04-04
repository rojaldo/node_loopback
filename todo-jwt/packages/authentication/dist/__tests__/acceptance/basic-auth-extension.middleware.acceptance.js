"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/authentication
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const openapi_spec_builder_1 = require("@loopback/openapi-spec-builder");
const rest_1 = require("@loopback/rest");
const security_1 = require("@loopback/security");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
const helper_1 = require("../fixtures/helper");
const keys_1 = require("../fixtures/keys");
const authentication_middleware_sequence_1 = require("../fixtures/sequences/authentication.middleware.sequence");
const basic_auth_user_service_1 = require("../fixtures/services/basic-auth-user-service");
const basic_strategy_1 = require("../fixtures/strategies/basic-strategy");
describe('Basic Authentication', () => {
    let app;
    let server;
    let users;
    let joeUser;
    beforeEach(givenAServer);
    beforeEach(givenControllerInApp);
    beforeEach(givenAuthenticatedSequence);
    beforeEach(givenProviders);
    it(`authenticates successfully for correct credentials of user 'jack'`, async () => {
        const client = whenIMakeRequestTo(server);
        await client
            .get('/whoAmI')
            .set('Authorization', (0, helper_1.createBasicAuthorizationHeaderValue)(joeUser))
            .expect(joeUser.id);
    });
    it('returns error for missing Authorization header', async () => {
        const client = whenIMakeRequestTo(server);
        await client.get('/whoAmI').expect({
            error: {
                message: 'Authorization header not found.',
                name: 'UnauthorizedError',
                statusCode: 401,
            },
        });
    });
    it(`returns error for missing 'Basic ' portion of Authorization header value`, async () => {
        const client = whenIMakeRequestTo(server);
        await client
            .get('/whoAmI')
            .set('Authorization', (0, helper_1.createBasicAuthorizationHeaderValue)(joeUser, { prefix: 'NotB@sic ' }))
            .expect({
            error: {
                message: `Authorization header is not of type 'Basic'.`,
                name: 'UnauthorizedError',
                statusCode: 401,
            },
        });
    });
    it(`returns error for too many parts in Authorization header value`, async () => {
        const client = whenIMakeRequestTo(server);
        await client
            .get('/whoAmI')
            .set('Authorization', (0, helper_1.createBasicAuthorizationHeaderValue)(joeUser) + ' someOtherValue')
            .expect({
            error: {
                message: `Authorization header value has too many parts. It must follow the pattern: 'Basic xxyyzz' where xxyyzz is a base64 string.`,
                name: 'UnauthorizedError',
                statusCode: 401,
            },
        });
    });
    it(`returns error for missing ':' in decrypted Authorization header credentials value`, async () => {
        const client = whenIMakeRequestTo(server);
        await client
            .get('/whoAmI')
            .set('Authorization', (0, helper_1.createBasicAuthorizationHeaderValue)(joeUser, { separator: '|' }))
            .expect({
            error: {
                message: `Authorization header 'Basic' value does not contain two parts separated by ':'.`,
                name: 'UnauthorizedError',
                statusCode: 401,
            },
        });
    });
    it(`returns error for too many parts in decrypted Authorization header credentials value`, async () => {
        const client = whenIMakeRequestTo(server);
        await client
            .get('/whoAmI')
            .set('Authorization', (0, helper_1.createBasicAuthorizationHeaderValue)(joeUser, {
            extraSegment: 'extraPart',
        }))
            .expect({
            error: {
                message: `Authorization header 'Basic' value does not contain two parts separated by ':'.`,
                name: 'UnauthorizedError',
                statusCode: 401,
            },
        });
    });
    it('allows anonymous requests to methods with no decorator', async () => {
        class InfoController {
            status() {
                return { running: true };
            }
        }
        tslib_1.__decorate([
            (0, rest_1.get)('/status'),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", void 0)
        ], InfoController.prototype, "status", null);
        app.controller(InfoController);
        await whenIMakeRequestTo(server)
            .get('/status')
            .expect(200, { running: true });
    });
    it('returns error for unknown authentication strategy', async () => {
        class InfoController {
            status() {
                return { running: true };
            }
        }
        tslib_1.__decorate([
            (0, rest_1.get)('/status'),
            (0, __1.authenticate)('doesnotexist'),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", void 0)
        ], InfoController.prototype, "status", null);
        app.controller(InfoController);
        await whenIMakeRequestTo(server)
            .get('/status')
            .expect({
            error: {
                message: `The strategy 'doesnotexist' is not available.`,
                name: 'Error',
                statusCode: 401,
                code: 'AUTHENTICATION_STRATEGY_NOT_FOUND',
            },
        });
    });
    it('returns error when undefined user profile returned from authentication strategy', async () => {
        class BadBasicStrategy {
            constructor() {
                this.name = 'badbasic';
            }
            async authenticate(request) {
                return undefined;
            }
        }
        (0, __1.registerAuthenticationStrategy)(server, BadBasicStrategy);
        class InfoController {
            status() {
                return { running: true };
            }
        }
        tslib_1.__decorate([
            (0, rest_1.get)('/status'),
            (0, __1.authenticate)('badbasic'),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", void 0)
        ], InfoController.prototype, "status", null);
        app.controller(InfoController);
        await whenIMakeRequestTo(server)
            .get('/status')
            .expect({
            error: {
                message: `User profile not returned from strategy's authenticate function`,
                name: 'Error',
                statusCode: 401,
                code: 'USER_PROFILE_NOT_FOUND',
            },
        });
    });
    it('adds security scheme component to apiSpec', async () => {
        const EXPECTED_SPEC = {
            components: {
                securitySchemes: {
                    basic: {
                        type: 'http',
                        scheme: 'basic',
                    },
                },
            },
        };
        const spec = await server.getApiSpec();
        (0, testlab_1.expect)(spec).to.containDeep(EXPECTED_SPEC);
    });
    async function givenAServer() {
        app = (0, helper_1.getApp)();
        server = await app.getServer(rest_1.RestServer);
    }
    function givenControllerInApp() {
        const apispec = (0, openapi_spec_builder_1.anOpenApiSpec)()
            .withOperation('get', '/whoAmI', {
            'x-operation-name': 'whoAmI',
            responses: {
                '200': {
                    description: '',
                    schema: {
                        type: 'string',
                    },
                },
            },
        })
            .build();
        let MyController = class MyController {
            constructor() { }
            async whoAmI(userProfile) {
                if (!userProfile)
                    return 'userProfile is undefined';
                if (!userProfile[security_1.securityId])
                    return 'userProfile id is undefined';
                return userProfile[security_1.securityId];
            }
        };
        tslib_1.__decorate([
            (0, __1.authenticate)('basic'),
            tslib_1.__param(0, (0, core_1.inject)(security_1.SecurityBindings.USER)),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [Object]),
            tslib_1.__metadata("design:returntype", Promise)
        ], MyController.prototype, "whoAmI", null);
        MyController = tslib_1.__decorate([
            (0, rest_1.api)(apispec),
            tslib_1.__metadata("design:paramtypes", [])
        ], MyController);
        app.controller(MyController);
    }
    function givenAuthenticatedSequence() {
        // bind user defined sequence
        server.sequence(authentication_middleware_sequence_1.AuthenticationMiddlewareSequence);
    }
    function givenProviders() {
        (0, __1.registerAuthenticationStrategy)(server, basic_strategy_1.BasicAuthenticationStrategy);
        server
            .bind(keys_1.BasicAuthenticationStrategyBindings.USER_SERVICE)
            .toClass(basic_auth_user_service_1.BasicAuthenticationUserService);
        users = (0, helper_1.getUserRepository)();
        joeUser = users.list['joe888'];
        server.bind(keys_1.USER_REPO).to(users);
        server
            .bind(__1.AuthenticationBindings.USER_PROFILE_FACTORY)
            .to(helper_1.myUserProfileFactory);
    }
    function whenIMakeRequestTo(restServer) {
        return (0, testlab_1.createClientForHandler)(restServer.requestHandler);
    }
});
//# sourceMappingURL=basic-auth-extension.middleware.acceptance.js.map
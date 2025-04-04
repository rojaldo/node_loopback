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
const __1 = require("../..");
const helper_1 = require("../fixtures/helper");
const keys_1 = require("../fixtures/keys");
const authentication_sequence_1 = require("../fixtures/sequences/authentication.sequence");
const jwt_service_1 = require("../fixtures/services/jwt-service");
const jwt_strategy_1 = require("../fixtures/strategies/jwt-strategy");
const user_repository_1 = require("../fixtures/users/user.repository");
describe('JWT Authentication', () => {
    let app;
    let server;
    let testUsers;
    let joeUser;
    let token;
    const TOKEN_SECRET_VALUE = 'myjwts3cr3t';
    const TOKEN_EXPIRES_IN_VALUE = '600';
    beforeEach(givenAServer);
    beforeEach(givenAuthenticatedSequence);
    beforeEach(givenProviders);
    it('authenticates successfully with valid token', async () => {
        let InfoController = class InfoController {
            constructor(tokenService, users, userProfileFactory) {
                this.tokenService = tokenService;
                this.users = users;
                this.userProfileFactory = userProfileFactory;
            }
            async logIn() {
                //
                // ...Other code for verifying a valid user (e.g. basic or local strategy)...
                //
                // Now with a valid userProfile, let's create a JSON web token
                return this.tokenService.generateToken(this.userProfileFactory(joeUser));
            }
            whoAmI(userProfile) {
                if (!userProfile)
                    return 'userProfile is undefined';
                if (!userProfile[security_1.securityId])
                    return 'userProfile[securityId] is undefined';
                return userProfile[security_1.securityId];
            }
        };
        tslib_1.__decorate([
            (0, rest_1.post)('/login'),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", Promise)
        ], InfoController.prototype, "logIn", null);
        tslib_1.__decorate([
            (0, rest_1.get)('/whoAmI'),
            (0, __1.authenticate)('jwt'),
            tslib_1.__param(0, (0, core_1.inject)(security_1.SecurityBindings.USER)),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [Object]),
            tslib_1.__metadata("design:returntype", void 0)
        ], InfoController.prototype, "whoAmI", null);
        InfoController = tslib_1.__decorate([
            tslib_1.__param(0, (0, core_1.inject)(keys_1.JWTAuthenticationStrategyBindings.TOKEN_SERVICE)),
            tslib_1.__param(1, (0, core_1.inject)(keys_1.USER_REPO)),
            tslib_1.__param(2, (0, core_1.inject)(__1.AuthenticationBindings.USER_PROFILE_FACTORY)),
            tslib_1.__metadata("design:paramtypes", [jwt_service_1.JWTService,
                user_repository_1.UserRepository, Function])
        ], InfoController);
        app.controller(InfoController);
        token = (await whenIMakeRequestTo(server).post('/login').expect(200)).text;
        (0, testlab_1.expect)(token).to.be.not.null();
        (0, testlab_1.expect)(token).to.be.String();
        const id = (await whenIMakeRequestTo(server)
            .get('/whoAmI')
            .set('Authorization', (0, helper_1.createBearerAuthorizationHeaderValue)(token))
            .expect(200)).text;
        (0, testlab_1.expect)(id).to.equal(joeUser.id);
    });
    it('returns error for missing Authorization header', async () => {
        let InfoController = class InfoController {
            constructor(tokenService, users, userProfileFactory) {
                this.tokenService = tokenService;
                this.users = users;
                this.userProfileFactory = userProfileFactory;
            }
            async logIn() {
                //
                // ...Other code for verifying a valid user (e.g. basic or local strategy)...
                //
                // Now with a valid userProfile, let's create a JSON web token
                return this.tokenService.generateToken(this.userProfileFactory(joeUser));
            }
            whoAmI(userProfile) {
                if (!userProfile)
                    return 'userProfile is undefined';
                if (!userProfile[security_1.securityId])
                    return 'userProfile[securityId] is undefined';
                return userProfile[security_1.securityId];
            }
        };
        tslib_1.__decorate([
            (0, rest_1.post)('/login'),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", Promise)
        ], InfoController.prototype, "logIn", null);
        tslib_1.__decorate([
            (0, rest_1.get)('/whoAmI'),
            (0, __1.authenticate)('jwt'),
            tslib_1.__param(0, (0, core_1.inject)(security_1.SecurityBindings.USER)),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [Object]),
            tslib_1.__metadata("design:returntype", void 0)
        ], InfoController.prototype, "whoAmI", null);
        InfoController = tslib_1.__decorate([
            tslib_1.__param(0, (0, core_1.inject)(keys_1.JWTAuthenticationStrategyBindings.TOKEN_SERVICE)),
            tslib_1.__param(1, (0, core_1.inject)(keys_1.USER_REPO)),
            tslib_1.__param(2, (0, core_1.inject)(__1.AuthenticationBindings.USER_PROFILE_FACTORY)),
            tslib_1.__metadata("design:paramtypes", [jwt_service_1.JWTService,
                user_repository_1.UserRepository, Function])
        ], InfoController);
        app.controller(InfoController);
        token = (await whenIMakeRequestTo(server).post('/login').expect(200)).text;
        (0, testlab_1.expect)(token).to.be.not.null();
        (0, testlab_1.expect)(token).to.be.String();
        await whenIMakeRequestTo(server)
            .get('/whoAmI')
            .expect({
            error: {
                message: 'Authorization header not found.',
                name: 'UnauthorizedError',
                statusCode: 401,
            },
        });
    });
    it(`returns error for invalid 'Bearer ' portion of Authorization header value`, async () => {
        let InfoController = class InfoController {
            constructor(tokenService, users, userProfileFactory) {
                this.tokenService = tokenService;
                this.users = users;
                this.userProfileFactory = userProfileFactory;
            }
            async logIn() {
                //
                // ...Other code for verifying a valid user (e.g. basic or local strategy)...
                //
                // Now with a valid userProfile, let's create a JSON web token
                return this.tokenService.generateToken(this.userProfileFactory(joeUser));
            }
            whoAmI(userProfile) {
                if (!userProfile)
                    return 'userProfile is undefined';
                if (!userProfile[security_1.securityId])
                    return 'userProfile[securityId] is undefined';
                return userProfile[security_1.securityId];
            }
        };
        tslib_1.__decorate([
            (0, rest_1.post)('/login'),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", Promise)
        ], InfoController.prototype, "logIn", null);
        tslib_1.__decorate([
            (0, rest_1.get)('/whoAmI'),
            (0, __1.authenticate)('jwt'),
            tslib_1.__param(0, (0, core_1.inject)(security_1.SecurityBindings.USER)),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [Object]),
            tslib_1.__metadata("design:returntype", void 0)
        ], InfoController.prototype, "whoAmI", null);
        InfoController = tslib_1.__decorate([
            tslib_1.__param(0, (0, core_1.inject)(keys_1.JWTAuthenticationStrategyBindings.TOKEN_SERVICE)),
            tslib_1.__param(1, (0, core_1.inject)(keys_1.USER_REPO)),
            tslib_1.__param(2, (0, core_1.inject)(__1.AuthenticationBindings.USER_PROFILE_FACTORY)),
            tslib_1.__metadata("design:paramtypes", [jwt_service_1.JWTService,
                user_repository_1.UserRepository, Function])
        ], InfoController);
        app.controller(InfoController);
        token = (await whenIMakeRequestTo(server).post('/login').expect(200)).text;
        (0, testlab_1.expect)(token).to.be.not.null();
        (0, testlab_1.expect)(token).to.be.String();
        await whenIMakeRequestTo(server)
            .get('/whoAmI')
            .set('Authorization', (0, helper_1.createBearerAuthorizationHeaderValue)(token, 'NotB3ar3r '))
            .expect({
            error: {
                message: `Authorization header is not of type 'Bearer'.`,
                name: 'UnauthorizedError',
                statusCode: 401,
            },
        });
    });
    it(`returns error for too many parts in Authorization header value`, async () => {
        let InfoController = class InfoController {
            constructor(tokenService, users, userProfileFactory) {
                this.tokenService = tokenService;
                this.users = users;
                this.userProfileFactory = userProfileFactory;
            }
            async logIn() {
                //
                // ...Other code for verifying a valid user (e.g. basic or local strategy)...
                //
                return this.tokenService.generateToken(this.userProfileFactory(joeUser));
            }
            whoAmI(userProfile) {
                if (!userProfile)
                    return 'userProfile is undefined';
                if (!userProfile[security_1.securityId])
                    return 'userProfile[securityId] is undefined';
                return userProfile[security_1.securityId];
            }
        };
        tslib_1.__decorate([
            (0, rest_1.post)('/login'),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", Promise)
        ], InfoController.prototype, "logIn", null);
        tslib_1.__decorate([
            (0, rest_1.get)('/whoAmI'),
            (0, __1.authenticate)('jwt'),
            tslib_1.__param(0, (0, core_1.inject)(security_1.SecurityBindings.USER)),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [Object]),
            tslib_1.__metadata("design:returntype", void 0)
        ], InfoController.prototype, "whoAmI", null);
        InfoController = tslib_1.__decorate([
            tslib_1.__param(0, (0, core_1.inject)(keys_1.JWTAuthenticationStrategyBindings.TOKEN_SERVICE)),
            tslib_1.__param(1, (0, core_1.inject)(keys_1.USER_REPO)),
            tslib_1.__param(2, (0, core_1.inject)(__1.AuthenticationBindings.USER_PROFILE_FACTORY)),
            tslib_1.__metadata("design:paramtypes", [jwt_service_1.JWTService,
                user_repository_1.UserRepository, Function])
        ], InfoController);
        app.controller(InfoController);
        token = (await whenIMakeRequestTo(server).post('/login').expect(200)).text;
        (0, testlab_1.expect)(token).to.be.not.null();
        (0, testlab_1.expect)(token).to.be.String();
        await whenIMakeRequestTo(server)
            .get('/whoAmI')
            .set('Authorization', (0, helper_1.createBearerAuthorizationHeaderValue)(token) + ' someOtherValue')
            .expect({
            error: {
                message: `Authorization header value has too many parts. It must follow the pattern: 'Bearer xx.yy.zz' where xx.yy.zz is a valid JWT token.`,
                name: 'UnauthorizedError',
                statusCode: 401,
            },
        });
    });
    it('returns error due to expired token', async () => {
        class InfoController {
            constructor() { }
            whoAmI(userProfile) {
                if (!userProfile)
                    return 'userProfile is undefined';
                if (!userProfile[security_1.securityId])
                    return 'userProfile[securityId] is undefined';
                return userProfile[security_1.securityId];
            }
        }
        tslib_1.__decorate([
            (0, rest_1.get)('/whoAmI'),
            (0, __1.authenticate)('jwt'),
            tslib_1.__param(0, (0, core_1.inject)(security_1.SecurityBindings.USER)),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [Object]),
            tslib_1.__metadata("design:returntype", void 0)
        ], InfoController.prototype, "whoAmI", null);
        app.controller(InfoController);
        const expiredToken = await getExpiredToken();
        await whenIMakeRequestTo(server)
            .get('/whoAmI')
            .set('Authorization', (0, helper_1.createBearerAuthorizationHeaderValue)(expiredToken))
            .expect({
            error: {
                message: `Error verifying token : jwt expired`,
                name: 'UnauthorizedError',
                statusCode: 401,
            },
        });
    });
    it('returns error due to invalid token #1', async () => {
        class InfoController {
            constructor() { }
            whoAmI(userProfile) {
                if (!userProfile)
                    return 'userProfile is undefined';
                if (!userProfile[security_1.securityId])
                    return 'userProfile[securityId] is undefined';
                return userProfile[security_1.securityId];
            }
        }
        tslib_1.__decorate([
            (0, rest_1.get)('/whoAmI'),
            (0, __1.authenticate)('jwt'),
            tslib_1.__param(0, (0, core_1.inject)(security_1.SecurityBindings.USER)),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [Object]),
            tslib_1.__metadata("design:returntype", void 0)
        ], InfoController.prototype, "whoAmI", null);
        app.controller(InfoController);
        const invalidToken = 'aaa.bbb.ccc';
        await whenIMakeRequestTo(server)
            .get('/whoAmI')
            .set('Authorization', (0, helper_1.createBearerAuthorizationHeaderValue)(invalidToken))
            .expect({
            error: {
                message: 'Error verifying token : invalid token',
                name: 'UnauthorizedError',
                statusCode: 401,
            },
        });
    });
    it('returns error due to invalid token #2', async () => {
        class InfoController {
            constructor() { }
            whoAmI(userProfile) {
                if (!userProfile)
                    return 'userProfile is undefined';
                if (!userProfile[security_1.securityId])
                    return 'userProfile[securityId] is undefined';
                return userProfile[security_1.securityId];
            }
        }
        tslib_1.__decorate([
            (0, rest_1.get)('/whoAmI'),
            (0, __1.authenticate)('jwt'),
            tslib_1.__param(0, (0, core_1.inject)(security_1.SecurityBindings.USER)),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [Object]),
            tslib_1.__metadata("design:returntype", void 0)
        ], InfoController.prototype, "whoAmI", null);
        app.controller(InfoController);
        const invalidToken = 'aaa.bbb.ccc.ddd';
        await whenIMakeRequestTo(server)
            .get('/whoAmI')
            .set('Authorization', (0, helper_1.createBearerAuthorizationHeaderValue)(invalidToken))
            .expect({
            error: {
                message: 'Error verifying token : jwt malformed',
                name: 'UnauthorizedError',
                statusCode: 401,
            },
        });
    });
    it('creates a json web token and throws error for userProfile that is undefined', async () => {
        let InfoController = class InfoController {
            constructor(tokenService, users, userProfileFactory) {
                this.tokenService = tokenService;
                this.users = users;
                this.userProfileFactory = userProfileFactory;
            }
            async createToken() {
                return this.tokenService.generateToken(undefined);
            }
        };
        tslib_1.__decorate([
            (0, rest_1.get)('/createtoken'),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", Promise)
        ], InfoController.prototype, "createToken", null);
        InfoController = tslib_1.__decorate([
            tslib_1.__param(0, (0, core_1.inject)(keys_1.JWTAuthenticationStrategyBindings.TOKEN_SERVICE)),
            tslib_1.__param(1, (0, core_1.inject)(keys_1.USER_REPO)),
            tslib_1.__param(2, (0, core_1.inject)(__1.AuthenticationBindings.USER_PROFILE_FACTORY)),
            tslib_1.__metadata("design:paramtypes", [jwt_service_1.JWTService,
                user_repository_1.UserRepository, Function])
        ], InfoController);
        app.controller(InfoController);
        await whenIMakeRequestTo(server)
            .get('/createtoken')
            .expect({
            error: {
                message: `Error generating token : userProfile is null`,
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
        class BadJWTStrategy {
            constructor() {
                this.name = 'badjwt';
            }
            async authenticate(request) {
                return undefined;
            }
        }
        (0, __1.registerAuthenticationStrategy)(server, BadJWTStrategy);
        class InfoController {
            status() {
                return { running: true };
            }
        }
        tslib_1.__decorate([
            (0, rest_1.get)('/status'),
            (0, __1.authenticate)('badjwt'),
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
                    jwt: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
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
    /**
     * Creates an expired token
     *
     * Specifying a negative value for 'expiresIn' so the
     * token is automatically expired
     */
    async function getExpiredToken() {
        const userProfile = (0, helper_1.myUserProfileFactory)(joeUser);
        const tokenService = new jwt_service_1.JWTService(TOKEN_SECRET_VALUE, '-10');
        return tokenService.generateToken(userProfile);
    }
    function givenAuthenticatedSequence() {
        // bind user defined sequence
        server.sequence(authentication_sequence_1.MyAuthenticationSequence);
    }
    function givenProviders() {
        (0, __1.registerAuthenticationStrategy)(server, jwt_strategy_1.JWTAuthenticationStrategy);
        server
            .bind(keys_1.JWTAuthenticationStrategyBindings.TOKEN_SECRET)
            .to(TOKEN_SECRET_VALUE);
        server
            .bind(keys_1.JWTAuthenticationStrategyBindings.TOKEN_EXPIRES_IN)
            .to(TOKEN_EXPIRES_IN_VALUE);
        server
            .bind(keys_1.JWTAuthenticationStrategyBindings.TOKEN_SERVICE)
            .toClass(jwt_service_1.JWTService);
        testUsers = (0, helper_1.getUserRepository)();
        joeUser = testUsers.list['joe888'];
        server.bind(keys_1.USER_REPO).to(testUsers);
        server
            .bind(__1.AuthenticationBindings.USER_PROFILE_FACTORY)
            .to(helper_1.myUserProfileFactory);
    }
    function whenIMakeRequestTo(restServer) {
        return (0, testlab_1.createClientForHandler)(restServer.requestHandler);
    }
});
//# sourceMappingURL=jwt-auth-extension.acceptance.js.map
"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/authentication
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@loopback/core");
const security_1 = require("@loopback/security");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../..");
const providers_1 = require("../../../providers");
const mock_strategy_1 = require("../fixtures/mock-strategy");
describe('AuthenticateActionProvider', () => {
    describe('constructor()', () => {
        it('instantiateClass injects authentication.strategy in the constructor', async () => {
            const context = new core_1.Context();
            const strategy = new mock_strategy_1.MockStrategy();
            context.bind(__1.AuthenticationBindings.STRATEGY).to(strategy);
            const provider = await (0, core_1.instantiateClass)(providers_1.AuthenticateActionProvider, context);
            (0, testlab_1.expect)(await provider.getStrategies()).to.be.equal(strategy);
        });
        it('should inject multiple strategies in the constructor on instantiation', async () => {
            const context = new core_1.Context();
            const strategies = [new mock_strategy_1.MockStrategy(), new mock_strategy_1.MockStrategy2()];
            context.bind(__1.AuthenticationBindings.STRATEGY).to(strategies);
            const provider = await (0, core_1.instantiateClass)(providers_1.AuthenticateActionProvider, context);
            (0, testlab_1.expect)(await provider.getStrategies()).to.deepEqual(strategies);
        });
    });
    describe('value()', () => {
        let provider;
        let strategy;
        let strategy2;
        let currentUser;
        const mockUser = { name: 'user-name', [security_1.securityId]: 'mock-id' };
        beforeEach(() => {
            givenAuthenticateActionProvider();
        });
        it('returns a function which authenticates a request and returns a user', async () => {
            const authenticate = await Promise.resolve(provider.value());
            const request = {};
            const user = await authenticate(request);
            (0, testlab_1.expect)(user).to.be.equal(mockUser);
        });
        it('updates current user', async () => {
            const authenticate = await Promise.resolve(provider.value());
            const request = {};
            await authenticate(request);
            (0, testlab_1.expect)(currentUser).to.equal(mockUser);
        });
        it('should return a function that throws an error if authentication fails', async () => {
            givenAuthenticateActionProvider([strategy]);
            const authenticate = await Promise.resolve(provider.value());
            const request = {};
            request.headers = { testState: 'fail' };
            await (0, testlab_1.expect)(authenticate(request)).to.be.rejected();
        });
        it('should return a function that throws an error if both authentication strategies fail', async () => {
            givenAuthenticateActionProvider([strategy, strategy2]);
            const authenticate = await Promise.resolve(provider.value());
            const request = {};
            request.headers = { testState: 'fail', testState2: 'fail' };
            await (0, testlab_1.expect)(authenticate(request)).to.be.rejected();
        });
        it('should return a function that does not throw an error if one authentication strategy succeeds', async () => {
            givenAuthenticateActionProvider([strategy, strategy2]);
            let authenticate = await Promise.resolve(provider.value());
            const request = {};
            request.headers = { testState: 'fail' };
            // 1st one fails
            await (0, testlab_1.expect)(authenticate(request)).to.not.be.rejected();
            givenAuthenticateActionProvider([strategy, strategy2]);
            authenticate = await Promise.resolve(provider.value());
            request.headers = { testState2: 'fail' };
            // 1st one succeeds but 2nd one fails
            await (0, testlab_1.expect)(authenticate(request)).to.not.be.rejected();
        });
        it('should return a function that throws an error if one authentication strategy fails', async () => {
            givenAuthenticateActionProvider([strategy, strategy2], {
                failOnError: true,
            });
            let authenticate = await Promise.resolve(provider.value());
            const request = {};
            request.headers = { testState: 'fail' };
            // 1st one fails
            await (0, testlab_1.expect)(authenticate(request)).to.be.rejected();
            givenAuthenticateActionProvider([strategy, strategy2], {
                failOnError: true,
            });
            authenticate = await Promise.resolve(provider.value());
            request.headers = { testState2: 'fail' };
            // 1st one succeeds but 2nd one fails
            await (0, testlab_1.expect)(authenticate(request)).to.not.be.rejected();
        });
        describe('context.get(provider_key)', () => {
            it('returns a function which authenticates a request and returns a user', async () => {
                const context = new core_1.Context();
                context.bind(__1.AuthenticationBindings.STRATEGY).to(strategy);
                context
                    .bind(__1.AuthenticationBindings.AUTH_ACTION)
                    .toProvider(providers_1.AuthenticateActionProvider);
                const request = {};
                const authenticate = await context.get(__1.AuthenticationBindings.AUTH_ACTION);
                const user = await authenticate(request);
                (0, testlab_1.expect)(user).to.be.equal(mockUser);
            });
            it('throws an error if the injected strategy is not valid', async () => {
                const context = new core_1.Context();
                context
                    .bind(__1.AuthenticationBindings.STRATEGY)
                    .to({});
                context
                    .bind(__1.AuthenticationBindings.AUTH_ACTION)
                    .toProvider(providers_1.AuthenticateActionProvider);
                const authenticate = await context.get(__1.AuthenticationBindings.AUTH_ACTION);
                const request = {};
                let error;
                try {
                    await authenticate(request);
                }
                catch (exception) {
                    error = exception;
                }
                (0, testlab_1.expect)(error).to.have.property('message', 'strategy.authenticate is not a function');
            });
            it('throws Unauthorized error when authentication fails', async () => {
                const context = new core_1.Context();
                context.bind(__1.AuthenticationBindings.STRATEGY).to(strategy);
                context
                    .bind(__1.AuthenticationBindings.AUTH_ACTION)
                    .toProvider(providers_1.AuthenticateActionProvider);
                const authenticate = await context.get(__1.AuthenticationBindings.AUTH_ACTION);
                const request = {};
                request.headers = { testState: 'fail' };
                let error;
                try {
                    await authenticate(request);
                }
                catch (err) {
                    error = err;
                }
                (0, testlab_1.expect)(error).to.have.property('statusCode', 401);
            });
            it('throws USER_PROFILE_NOT_FOUND error when userprofile not returned', async () => {
                const context = new core_1.Context();
                context.bind(__1.AuthenticationBindings.STRATEGY).to(strategy);
                context
                    .bind(__1.AuthenticationBindings.AUTH_ACTION)
                    .toProvider(providers_1.AuthenticateActionProvider);
                const authenticate = await context.get(__1.AuthenticationBindings.AUTH_ACTION);
                const request = {};
                request.headers = { testState: 'empty' };
                let error;
                try {
                    await authenticate(request);
                }
                catch (err) {
                    error = err;
                }
                (0, testlab_1.expect)(error).to.have.property('code', 'USER_PROFILE_NOT_FOUND');
            });
        });
        function givenAuthenticateActionProvider(strategies, options = {}) {
            strategy = new mock_strategy_1.MockStrategy();
            strategy.setMockUser(mockUser);
            strategy2 = new mock_strategy_1.MockStrategy2();
            provider = new providers_1.AuthenticateActionProvider(() => Promise.resolve(strategies !== null && strategies !== void 0 ? strategies : strategy), u => (currentUser = u), url => url, status => status, options);
            currentUser = undefined;
        }
    });
});
//# sourceMappingURL=authentication.provider.unit.js.map
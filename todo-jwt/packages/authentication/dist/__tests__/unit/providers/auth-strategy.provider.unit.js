"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/authentication
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@loopback/core");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../..");
const mock_metadata_1 = require("../fixtures/mock-metadata");
const mock_strategy_1 = require("../fixtures/mock-strategy");
describe('AuthStrategyProvider', () => {
    let strategyProvider;
    const mockStrategy = new mock_strategy_1.MockStrategy();
    const mockStrategy2 = new mock_strategy_1.MockStrategy2();
    beforeEach(() => {
        givenAuthenticationStrategyProvider([mockStrategy, mockStrategy2], [mock_metadata_1.mockAuthenticationMetadata, mock_metadata_1.mockAuthenticationMetadata2]);
    });
    describe('value()', () => {
        it('should return the authentication strategies', async () => {
            const strategies = await strategyProvider.value();
            (0, testlab_1.expect)(strategies).to.not.be.undefined();
            (0, testlab_1.expect)(strategies === null || strategies === void 0 ? void 0 : strategies[0]).to.be.equal(mockStrategy);
            (0, testlab_1.expect)(strategies === null || strategies === void 0 ? void 0 : strategies[1]).to.be.equal(mockStrategy2);
        });
        it('should only return the authentication strategy specified in the authentication metadata', async () => {
            givenAuthenticationStrategyProvider([mockStrategy, mockStrategy2], [mock_metadata_1.mockAuthenticationMetadata]);
            const strategies = await strategyProvider.value();
            (0, testlab_1.expect)(strategies === null || strategies === void 0 ? void 0 : strategies.length).to.be.equal(1);
            (0, testlab_1.expect)(strategies === null || strategies === void 0 ? void 0 : strategies[0]).to.be.equal(mockStrategy);
        });
        it('should return undefined if the authentication metadata is not available', async () => {
            givenAuthenticationStrategyProvider([mockStrategy], undefined);
            const strategies = await strategyProvider.value();
            (0, testlab_1.expect)(strategies).to.be.undefined();
        });
        it('should throw an error if the authentication strategy is not available', async () => {
            givenAuthenticationStrategyProvider([], [mock_metadata_1.mockAuthenticationMetadata]);
            await (0, testlab_1.expect)(strategyProvider.value()).to.be.rejected();
            givenAuthenticationStrategyProvider([], [mock_metadata_1.mockAuthenticationMetadata2]);
            await (0, testlab_1.expect)(strategyProvider.value()).to.be.rejected();
        });
    });
    describe('context.get(bindingKey)', () => {
        it('should return the authentication strategies', async () => {
            const context = new core_1.Context();
            context
                .bind(__1.AuthenticationBindings.STRATEGY)
                .to([mockStrategy, mockStrategy2]);
            const strategies = await context.get(__1.AuthenticationBindings.STRATEGY);
            (0, testlab_1.expect)(strategies[0]).to.be.equal(mockStrategy);
            (0, testlab_1.expect)(strategies[1]).to.be.equal(mockStrategy2);
        });
        it('should return undefined if no authentication strategies are defined', async () => {
            const context = new core_1.Context();
            context.bind(__1.AuthenticationBindings.STRATEGY).to(undefined);
            const strategies = await context.get(__1.AuthenticationBindings.STRATEGY);
            (0, testlab_1.expect)(strategies).to.be.undefined();
        });
    });
    function givenAuthenticationStrategyProvider(strategies, metadata) {
        strategyProvider = new __1.AuthenticationStrategyProvider(() => Promise.resolve(strategies), metadata);
    }
});
//# sourceMappingURL=auth-strategy.provider.unit.js.map
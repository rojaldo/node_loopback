"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/authentication
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../..");
const keys_1 = require("../../../keys");
const providers_1 = require("../../../providers");
describe('AuthMetadataProvider', () => {
    let provider;
    class TestController {
        whoAmI() { }
        hello() { }
    }
    tslib_1.__decorate([
        (0, __1.authenticate)('my-strategy'),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", []),
        tslib_1.__metadata("design:returntype", void 0)
    ], TestController.prototype, "whoAmI", null);
    tslib_1.__decorate([
        __1.authenticate.skip(),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", []),
        tslib_1.__metadata("design:returntype", void 0)
    ], TestController.prototype, "hello", null);
    class ControllerWithNoMetadata {
        whoAmI() { }
    }
    beforeEach(givenAuthMetadataProvider);
    describe('value()', () => {
        it('returns the auth metadata of a controller method', async () => {
            const authMetadata = await provider.value();
            (0, testlab_1.expect)(authMetadata === null || authMetadata === void 0 ? void 0 : authMetadata[0]).to.be.eql({
                strategy: 'my-strategy',
            });
        });
        describe('context.get(provider_key)', () => {
            it('returns the auth metadata of a controller method', async () => {
                const context = new core_1.Context();
                context.bind(core_1.CoreBindings.CONTROLLER_CLASS).to(TestController);
                context.bind(core_1.CoreBindings.CONTROLLER_METHOD_NAME).to('whoAmI');
                context
                    .bind(core_1.CoreBindings.CONTROLLER_METHOD_META)
                    .toProvider(providers_1.AuthMetadataProvider);
                const authMetadata = await context.get(core_1.CoreBindings.CONTROLLER_METHOD_META);
                (0, testlab_1.expect)(authMetadata === null || authMetadata === void 0 ? void 0 : authMetadata[0]).to.be.eql({
                    strategy: 'my-strategy',
                });
            });
            it('returns undefined for a method decorated with @authenticate.skip', async () => {
                const context = new core_1.Context();
                context.bind(core_1.CoreBindings.CONTROLLER_CLASS).to(TestController);
                context.bind(core_1.CoreBindings.CONTROLLER_METHOD_NAME).to('hello');
                context
                    .bind(core_1.CoreBindings.CONTROLLER_METHOD_META)
                    .toProvider(providers_1.AuthMetadataProvider);
                const authMetadata = await context.get(core_1.CoreBindings.CONTROLLER_METHOD_META);
                (0, testlab_1.expect)(authMetadata === null || authMetadata === void 0 ? void 0 : authMetadata[0]).to.be.undefined();
            });
            it('returns undefined for a method decorated with @authenticate.skip even with default metadata', async () => {
                const context = new core_1.Context();
                context.bind(core_1.CoreBindings.CONTROLLER_CLASS).to(TestController);
                context.bind(core_1.CoreBindings.CONTROLLER_METHOD_NAME).to('hello');
                context
                    .bind(core_1.CoreBindings.CONTROLLER_METHOD_META)
                    .toProvider(providers_1.AuthMetadataProvider);
                context
                    .configure(keys_1.AuthenticationBindings.COMPONENT)
                    .to({ defaultMetadata: [{ strategy: 'xyz' }] });
                const authMetadata = await context.get(core_1.CoreBindings.CONTROLLER_METHOD_META);
                (0, testlab_1.expect)(authMetadata === null || authMetadata === void 0 ? void 0 : authMetadata[0]).to.be.undefined();
            });
            it('returns undefined if no auth metadata is defined', async () => {
                const context = new core_1.Context();
                context
                    .bind(core_1.CoreBindings.CONTROLLER_CLASS)
                    .to(ControllerWithNoMetadata);
                context.bind(core_1.CoreBindings.CONTROLLER_METHOD_NAME).to('whoAmI');
                context
                    .bind(core_1.CoreBindings.CONTROLLER_METHOD_META)
                    .toProvider(providers_1.AuthMetadataProvider);
                const authMetadata = await context.get(core_1.CoreBindings.CONTROLLER_METHOD_META);
                (0, testlab_1.expect)(authMetadata === null || authMetadata === void 0 ? void 0 : authMetadata[0]).to.be.undefined();
            });
            it('returns default metadata if no auth metadata is defined', async () => {
                const context = new core_1.Context();
                context
                    .bind(core_1.CoreBindings.CONTROLLER_CLASS)
                    .to(ControllerWithNoMetadata);
                context.bind(core_1.CoreBindings.CONTROLLER_METHOD_NAME).to('whoAmI');
                context
                    .configure(keys_1.AuthenticationBindings.COMPONENT)
                    .to({ defaultMetadata: [{ strategy: 'xyz' }] });
                context
                    .bind(core_1.CoreBindings.CONTROLLER_METHOD_META)
                    .toProvider(providers_1.AuthMetadataProvider);
                const authMetadata = await context.get(core_1.CoreBindings.CONTROLLER_METHOD_META);
                (0, testlab_1.expect)(authMetadata === null || authMetadata === void 0 ? void 0 : authMetadata[0]).to.be.eql({ strategy: 'xyz' });
            });
            it('returns undefined when the class or method is missing', async () => {
                const context = new core_1.Context();
                context
                    .bind(core_1.CoreBindings.CONTROLLER_METHOD_META)
                    .toProvider(providers_1.AuthMetadataProvider);
                const authMetadata = await context.get(core_1.CoreBindings.CONTROLLER_METHOD_META);
                (0, testlab_1.expect)(authMetadata === null || authMetadata === void 0 ? void 0 : authMetadata[0]).to.be.undefined();
            });
        });
    });
    function givenAuthMetadataProvider() {
        provider = new providers_1.AuthMetadataProvider(TestController, 'whoAmI');
    }
});
//# sourceMappingURL=auth-metadata.provider.unit.js.map
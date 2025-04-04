"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/boot
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@loopback/core");
const service_proxy_1 = require("@loopback/service-proxy");
const testlab_1 = require("@loopback/testlab");
const path_1 = require("path");
const __1 = require("../../..");
describe('service booter unit tests', () => {
    const sandbox = new testlab_1.TestSandbox((0, path_1.resolve)(__dirname, '../../../.sandbox'));
    const SERVICES_PREFIX = 'services';
    const SERVICES_TAG = 'service';
    class AppWithRepo extends (0, service_proxy_1.ServiceMixin)(core_1.Application) {
    }
    let app;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let stub;
    beforeEach('reset sandbox', () => sandbox.reset());
    beforeEach(getApp);
    beforeEach(createStub);
    afterEach(restoreStub);
    it('does not require service mixin', async () => {
        const normalApp = new core_1.Application();
        await sandbox.copyFile((0, path_1.resolve)(__dirname, '../../fixtures/service-provider.artifact.js'));
        const booterInst = new __1.ServiceBooter(normalApp, sandbox.path);
        booterInst.discovered = [
            (0, path_1.resolve)(sandbox.path, 'service-provider.artifact.js'),
        ];
        await booterInst.load();
        testlab_1.sinon.assert.notCalled(stub);
    });
    it(`uses ServiceDefaults for 'options' if none are given`, () => {
        const booterInst = new __1.ServiceBooter(app, sandbox.path);
        (0, testlab_1.expect)(booterInst.options).to.deepEqual(__1.ServiceDefaults);
    });
    it('overrides defaults with provided options and uses defaults for the rest', () => {
        const options = {
            dirs: ['test'],
            extensions: ['.ext1'],
        };
        const expected = Object.assign({}, options, {
            nested: __1.ServiceDefaults.nested,
        });
        const booterInst = new __1.ServiceBooter(app, sandbox.path, options);
        (0, testlab_1.expect)(booterInst.options).to.deepEqual(expected);
    });
    it('binds services during the load phase', async () => {
        const expected = [`${SERVICES_PREFIX}.GeocoderService`];
        await sandbox.copyFile((0, path_1.resolve)(__dirname, '../../fixtures/service-provider.artifact.js'));
        const booterInst = new __1.ServiceBooter(app, sandbox.path);
        const NUM_CLASSES = 1; // 1 class in above file.
        booterInst.discovered = [
            (0, path_1.resolve)(sandbox.path, 'service-provider.artifact.js'),
        ];
        await booterInst.load();
        const services = app.findByTag(SERVICES_TAG);
        const keys = services.map(binding => binding.key);
        (0, testlab_1.expect)(keys).to.have.lengthOf(NUM_CLASSES);
        (0, testlab_1.expect)(keys.sort()).to.eql(expected.sort());
    });
    function getApp() {
        app = new AppWithRepo();
    }
    function restoreStub() {
        stub.restore();
    }
    function createStub() {
        stub = testlab_1.sinon.stub(console, 'warn');
    }
});
//# sourceMappingURL=service.booter.unit.js.map
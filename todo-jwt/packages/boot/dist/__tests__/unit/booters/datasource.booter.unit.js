"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/boot
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const testlab_1 = require("@loopback/testlab");
const path_1 = require("path");
const __1 = require("../../..");
describe('datasource booter unit tests', () => {
    const sandbox = new testlab_1.TestSandbox((0, path_1.resolve)(__dirname, '../../../.sandbox'));
    const DATASOURCES_PREFIX = 'datasources';
    const DATASOURCES_TAG = 'datasource';
    class AppWithRepo extends (0, repository_1.RepositoryMixin)(core_1.Application) {
    }
    let app;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let stub;
    beforeEach('reset sandbox', () => sandbox.reset());
    beforeEach(getApp);
    beforeEach(createStub);
    afterEach(restoreStub);
    it('gives a warning if called on an app without RepositoryMixin', async () => {
        const normalApp = new core_1.Application();
        await sandbox.copyFile((0, path_1.resolve)(__dirname, '../../fixtures/datasource.artifact.js'));
        const booterInst = new __1.DataSourceBooter(normalApp, sandbox.path);
        booterInst.discovered = [(0, path_1.resolve)(sandbox.path, 'datasource.artifact.js')];
        await booterInst.load();
        testlab_1.sinon.assert.calledOnce(stub);
        testlab_1.sinon.assert.calledWith(stub, 'app.dataSource() function is needed for DataSourceBooter. You can add ' +
            'it to your Application using RepositoryMixin from @loopback/repository.');
    });
    it(`uses DataSourceDefaults for 'options' if none are given`, () => {
        const booterInst = new __1.DataSourceBooter(app, sandbox.path);
        (0, testlab_1.expect)(booterInst.options).to.deepEqual(__1.DataSourceDefaults);
    });
    it('overrides defaults with provided options and uses defaults for the rest', () => {
        const options = {
            dirs: ['test'],
            extensions: ['.ext1'],
        };
        const expected = Object.assign({}, options, {
            nested: __1.DataSourceDefaults.nested,
        });
        const booterInst = new __1.DataSourceBooter(app, sandbox.path, options);
        (0, testlab_1.expect)(booterInst.options).to.deepEqual(expected);
    });
    it('binds datasources during the load phase', async () => {
        const expected = [`${DATASOURCES_PREFIX}.db`];
        await sandbox.copyFile((0, path_1.resolve)(__dirname, '../../fixtures/datasource.artifact.js'));
        const booterInst = new __1.DataSourceBooter(app, sandbox.path);
        const NUM_CLASSES = 1; // 1 class in above file.
        booterInst.discovered = [(0, path_1.resolve)(sandbox.path, 'datasource.artifact.js')];
        await booterInst.load();
        const datasources = app.findByTag(DATASOURCES_TAG);
        const keys = datasources.map(binding => binding.key);
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
//# sourceMappingURL=datasource.booter.unit.js.map
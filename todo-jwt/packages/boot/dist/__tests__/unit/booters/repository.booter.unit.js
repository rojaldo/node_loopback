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
describe('repository booter unit tests', () => {
    const sandbox = new testlab_1.TestSandbox((0, path_1.resolve)(__dirname, '../../../.sandbox'));
    const REPOSITORIES_PREFIX = 'repositories';
    const REPOSITORIES_TAG = 'repository';
    class RepoApp extends (0, repository_1.RepositoryMixin)(core_1.Application) {
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
        await sandbox.copyFile((0, path_1.resolve)(__dirname, '../../fixtures/multiple.artifact.js'));
        const booterInst = new __1.RepositoryBooter(normalApp, sandbox.path);
        // Load uses discovered property
        booterInst.discovered = [(0, path_1.resolve)(sandbox.path, 'multiple.artifact.js')];
        await booterInst.load();
        testlab_1.sinon.assert.calledOnce(stub);
        testlab_1.sinon.assert.calledWith(stub, 'app.repository() function is needed for RepositoryBooter. You can add it ' +
            'to your Application using RepositoryMixin from @loopback/repository.');
    });
    it(`uses RepositoryDefaults for 'options' if none are give`, () => {
        const booterInst = new __1.RepositoryBooter(app, sandbox.path);
        (0, testlab_1.expect)(booterInst.options).to.deepEqual(__1.RepositoryDefaults);
    });
    it('overrides defaults with provided options and uses defaults for the rest', () => {
        const options = {
            dirs: ['test'],
            extensions: ['.ext1'],
        };
        const expected = Object.assign({}, options, {
            nested: __1.RepositoryDefaults.nested,
        });
        const booterInst = new __1.RepositoryBooter(app, sandbox.path, options);
        (0, testlab_1.expect)(booterInst.options).to.deepEqual(expected);
    });
    it('binds repositories during the load phase', async () => {
        const expected = [
            `${REPOSITORIES_PREFIX}.ArtifactOne`,
            `${REPOSITORIES_PREFIX}.ArtifactTwo`,
        ];
        await sandbox.copyFile((0, path_1.resolve)(__dirname, '../../fixtures/multiple.artifact.js'));
        const booterInst = new __1.RepositoryBooter(app, sandbox.path);
        const NUM_CLASSES = 2; // 2 classes in above file.
        // Load uses discovered property
        booterInst.discovered = [(0, path_1.resolve)(sandbox.path, 'multiple.artifact.js')];
        await booterInst.load();
        const repos = app.findByTag(REPOSITORIES_TAG);
        const keys = repos.map(binding => binding.key);
        (0, testlab_1.expect)(keys).to.have.lengthOf(NUM_CLASSES);
        (0, testlab_1.expect)(keys.sort()).to.eql(expected.sort());
    });
    function restoreStub() {
        stub.restore();
    }
    function createStub() {
        stub = testlab_1.sinon.stub(console, 'warn');
    }
    function getApp() {
        app = new RepoApp();
    }
});
//# sourceMappingURL=repository.booter.unit.js.map
"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/boot
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@loopback/core");
const testlab_1 = require("@loopback/testlab");
const path_1 = require("path");
const __1 = require("../../..");
describe('controller booter unit tests', () => {
    const sandbox = new testlab_1.TestSandbox((0, path_1.resolve)(__dirname, '../../../.sandbox'));
    const CONTROLLERS_PREFIX = 'controllers';
    const CONTROLLERS_TAG = 'controller';
    let app;
    beforeEach('reset sandbox', () => sandbox.reset());
    beforeEach(getApp);
    it(`constructor uses ControllerDefaults for 'options' if none are given`, () => {
        const booterInst = new __1.ControllerBooter(app, sandbox.path);
        (0, testlab_1.expect)(booterInst.options).to.deepEqual(__1.ControllerDefaults);
    });
    it('overrides defaults with provided options and uses defaults for rest', () => {
        const options = {
            dirs: ['test', 'test2'],
            extensions: ['.ext1', 'ext2'],
        };
        const expected = Object.assign({}, options, {
            nested: __1.ControllerDefaults.nested,
        });
        const booterInst = new __1.ControllerBooter(app, sandbox.path, options);
        (0, testlab_1.expect)(booterInst.options).to.deepEqual(expected);
    });
    it('binds controllers during load phase', async () => {
        const expected = [
            `${CONTROLLERS_PREFIX}.ArtifactOne`,
            `${CONTROLLERS_PREFIX}.ArtifactTwo`,
        ];
        await sandbox.copyFile((0, path_1.resolve)(__dirname, '../../fixtures/multiple.artifact.js'));
        const booterInst = new __1.ControllerBooter(app, sandbox.path);
        const NUM_CLASSES = 2; // 2 classes in above file.
        // Load uses discovered property
        booterInst.discovered = [(0, path_1.resolve)(sandbox.path, 'multiple.artifact.js')];
        await booterInst.load();
        const ctrls = app.findByTag(CONTROLLERS_TAG);
        const keys = ctrls.map(binding => binding.key);
        (0, testlab_1.expect)(keys).to.have.lengthOf(NUM_CLASSES);
        (0, testlab_1.expect)(keys.sort()).to.eql(expected.sort());
    });
    function getApp() {
        app = new core_1.Application();
    }
});
//# sourceMappingURL=controller.booter.unit.js.map
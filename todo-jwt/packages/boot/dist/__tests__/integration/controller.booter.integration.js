"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/boot
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const path_1 = require("path");
describe('controller booter integration tests', () => {
    const sandbox = new testlab_1.TestSandbox((0, path_1.resolve)(__dirname, '../../.sandbox'));
    // Remnants from Refactor -- need to add these to core
    const CONTROLLERS_PREFIX = 'controllers';
    const CONTROLLERS_TAG = 'controller';
    let app;
    beforeEach('reset sandbox', () => sandbox.reset());
    beforeEach(getApp);
    it('boots controllers when app.boot() is called', async () => {
        const expectedBindings = [
            `${CONTROLLERS_PREFIX}.ArtifactOne`,
            `${CONTROLLERS_PREFIX}.ArtifactTwo`,
        ];
        await app.boot();
        const bindings = app.findByTag(CONTROLLERS_TAG).map(b => b.key);
        (0, testlab_1.expect)(bindings.sort()).to.eql(expectedBindings.sort());
    });
    async function getApp() {
        await sandbox.copyFile((0, path_1.resolve)(__dirname, '../fixtures/application.js'));
        await sandbox.copyFile((0, path_1.resolve)(__dirname, '../fixtures/multiple.artifact.js'), 'controllers/multiple.controller.js');
        const MyApp = require((0, path_1.resolve)(sandbox.path, 'application.js')).BooterApp;
        app = new MyApp();
    }
});
//# sourceMappingURL=controller.booter.integration.js.map
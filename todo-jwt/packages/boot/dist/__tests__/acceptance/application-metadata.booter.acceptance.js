"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/boot
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@loopback/core");
const testlab_1 = require("@loopback/testlab");
const path_1 = require("path");
describe('application metadata booter acceptance tests', () => {
    let app;
    const sandbox = new testlab_1.TestSandbox((0, path_1.resolve)(__dirname, '../../.sandbox'));
    beforeEach('reset sandbox', () => sandbox.reset());
    beforeEach(getApp);
    it('binds content of package.json to application metadata', async () => {
        await app.boot();
        const metadata = await app.get(core_1.CoreBindings.APPLICATION_METADATA);
        (0, testlab_1.expect)(metadata).containEql({
            name: 'boot-test-app',
            version: '1.0.0',
            description: 'boot-test-app',
        });
    });
    async function getApp() {
        // Add the following files
        // - package.json
        // - dist/application.js
        await sandbox.copyFile((0, path_1.resolve)(__dirname, '../fixtures/application.js'), 'dist/application.js', 
        // Adjust the relative path for `import`
        content => content.replace('../..', '../../..'));
        await sandbox.copyFile((0, path_1.resolve)(__dirname, '../fixtures/package.json'));
        const MyApp = require((0, path_1.resolve)(sandbox.path, 'dist/application.js')).BooterApp;
        app = new MyApp({
            rest: (0, testlab_1.givenHttpServerConfig)(),
        });
    }
});
//# sourceMappingURL=application-metadata.booter.acceptance.js.map
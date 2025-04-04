"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/boot
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const path_1 = require("path");
describe('controller booter acceptance tests', () => {
    let app;
    const sandbox = new testlab_1.TestSandbox((0, path_1.resolve)(__dirname, '../../.sandbox'));
    beforeEach('reset sandbox', () => sandbox.reset());
    beforeEach(getApp);
    afterEach(stopApp);
    it('binds controllers using ControllerDefaults and REST endpoints work', async () => {
        await app.boot();
        await app.start();
        const client = (0, testlab_1.createRestAppClient)(app);
        // Default Controllers = /controllers with .controller.js ending (nested = true);
        await client.get('/one').expect(200, 'ControllerOne.one()');
        await client.get('/two').expect(200, 'ControllerTwo.two()');
    });
    async function getApp() {
        await sandbox.copyFile((0, path_1.resolve)(__dirname, '../fixtures/package.json'));
        await sandbox.copyFile((0, path_1.resolve)(__dirname, '../fixtures/application.js'));
        await sandbox.copyFile((0, path_1.resolve)(__dirname, '../fixtures/multiple.artifact.js'), 'controllers/multiple.controller.js');
        const MyApp = require((0, path_1.resolve)(sandbox.path, 'application.js')).BooterApp;
        app = new MyApp({
            rest: (0, testlab_1.givenHttpServerConfig)(),
        });
    }
    async function stopApp() {
        await (app === null || app === void 0 ? void 0 : app.stop());
    }
});
//# sourceMappingURL=controller.booter.acceptance.js.map
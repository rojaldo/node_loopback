"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/boot
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@loopback/core");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../");
describe('boot.component unit tests', () => {
    class BootableApp extends (0, __1.BootMixin)(core_1.Application) {
    }
    let app;
    beforeEach(getApp);
    it('binds BootStrapper class', async () => {
        const bootstrapper = await app.get(__1.BootBindings.BOOTSTRAPPER_KEY);
        (0, testlab_1.expect)(bootstrapper).to.be.an.instanceOf(__1.Bootstrapper);
    });
    it('ControllerBooter is bound as a booter by default', async () => {
        const booterInst = await app.get(`${__1.BootBindings.BOOTERS}.ControllerBooter`);
        (0, testlab_1.expect)(booterInst).to.be.an.instanceOf(__1.ControllerBooter);
    });
    it('RepositoryBooter is bound as a booter by default', async () => {
        const booterInst = await app.get(`${__1.BootBindings.BOOTERS}.RepositoryBooter`);
        (0, testlab_1.expect)(booterInst).to.be.an.instanceOf(__1.RepositoryBooter);
    });
    it('DataSourceBooter is bound as a booter by default', async () => {
        const booterInst = await app.get(`${__1.BootBindings.BOOTERS}.DataSourceBooter`);
        (0, testlab_1.expect)(booterInst).to.be.an.instanceOf(__1.DataSourceBooter);
    });
    it('ServiceBooter is bound as a booter by default', async () => {
        const booterInst = await app.get(`${__1.BootBindings.BOOTERS}.ServiceBooter`);
        (0, testlab_1.expect)(booterInst).to.be.an.instanceOf(__1.ServiceBooter);
    });
    function getApp() {
        app = new BootableApp();
        app.bind(__1.BootBindings.PROJECT_ROOT).to(__dirname);
    }
});
//# sourceMappingURL=boot.component.unit.js.map
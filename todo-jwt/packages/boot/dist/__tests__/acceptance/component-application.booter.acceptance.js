"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/boot
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@loopback/core");
const testlab_1 = require("@loopback/testlab");
const path_1 = require("path");
const __1 = require("../..");
const booters_1 = require("../../booters");
const application_1 = require("../fixtures/application");
describe('component application booter acceptance tests', () => {
    let app;
    const sandbox = new testlab_1.TestSandbox((0, path_1.resolve)(__dirname, '../../.sandbox'));
    beforeEach('reset sandbox', () => sandbox.reset());
    beforeEach(getApp);
    it('binds artifacts booted from the component application', async () => {
        class BooterAppComponent {
            constructor() {
                this.bindings = [(0, __1.createComponentApplicationBooterBinding)(app)];
            }
        }
        const mainApp = new MainApp();
        mainApp.component(BooterAppComponent);
        await testSubAppBoot(mainApp);
    });
    it('binds artifacts booted from the sub application', async () => {
        const mainApp = new MainAppWithSubAppBooter();
        await testSubAppBoot(mainApp);
    });
    it('binds artifacts booted from the component application by filter', async () => {
        class BooterAppComponent {
            constructor() {
                this.bindings = [
                    (0, __1.createComponentApplicationBooterBinding)(app, binding => {
                        return binding.key === 'controllers.ArtifactOne';
                    }),
                ];
            }
        }
        const mainApp = new MainApp();
        mainApp.component(BooterAppComponent);
        await mainApp.boot();
        const controllers = mainApp.find('controllers.*').map(b => b.key);
        (0, testlab_1.expect)(controllers).to.eql(['controllers.ArtifactOne']);
    });
    it('does not override locked bindings', async () => {
        class BooterAppComponent {
            constructor() {
                this.bindings = [(0, __1.createComponentApplicationBooterBinding)(app)];
            }
        }
        const mainApp = new MainApp();
        const lockedBinding = mainApp
            .bind('controllers.ArtifactTwo')
            .to('-locked-')
            .lock();
        mainApp.component(BooterAppComponent);
        await mainApp.boot();
        const current = mainApp.getBinding('controllers.ArtifactTwo', {
            optional: true,
        });
        (0, testlab_1.expect)(current).to.be.exactly(lockedBinding);
    });
    it('creates binding key based on application name', () => {
        const binding = (0, __1.createComponentApplicationBooterBinding)(app);
        (0, testlab_1.expect)(binding.key).to.eql(`booters.${app.name}`);
    });
    it('creates unique bindings for different applications', () => {
        const binding1 = (0, __1.createComponentApplicationBooterBinding)(new application_1.BooterApp());
        const binding2 = (0, __1.createComponentApplicationBooterBinding)(new application_1.BooterApp());
        (0, testlab_1.expect)(binding1.key).to.not.eql(binding2.key);
    });
    class MainApp extends (0, __1.BootMixin)(core_1.Application) {
        constructor() {
            super();
            this.projectRoot = __dirname;
        }
    }
    class MainAppWithSubAppBooter extends (0, __1.BootMixin)(core_1.Application) {
        constructor() {
            super();
            this.projectRoot = __dirname;
            this.applicationBooter(app);
        }
    }
    async function getApp() {
        await sandbox.copyFile((0, path_1.resolve)(__dirname, '../fixtures/application.js'), 'application.js', 
        // Adjust the relative path for `import`
        content => content.replace('../..', '../../..'));
        await sandbox.copyFile((0, path_1.resolve)(__dirname, '../fixtures/package.json'));
        await sandbox.copyFile((0, path_1.resolve)(__dirname, '../fixtures/multiple.artifact.js'), 'controllers/multiple.controller.js');
        const MyApp = require((0, path_1.resolve)(sandbox.path, 'application.js')).BooterApp;
        app = new MyApp({
            rest: (0, testlab_1.givenHttpServerConfig)(),
        });
    }
    async function testSubAppBoot(mainApp) {
        const appBindingsBeforeBoot = mainApp.find(
        // Exclude boot related bindings
        binding => !booters_1.bindingKeysExcludedFromSubApp.includes(binding.key));
        await mainApp.boot();
        const controllers = mainApp.find('controllers.*').map(b => b.key);
        (0, testlab_1.expect)(controllers).to.eql([
            'controllers.ArtifactOne',
            'controllers.ArtifactTwo',
        ]);
        // Assert main app bindings before boot are not overridden
        const appBindingsAfterBoot = mainApp.find(binding => appBindingsBeforeBoot.includes(binding));
        (0, testlab_1.expect)(appBindingsAfterBoot.map(b => b.key)).to.eql(appBindingsBeforeBoot.map(b => b.key));
    }
});
//# sourceMappingURL=component-application.booter.acceptance.js.map
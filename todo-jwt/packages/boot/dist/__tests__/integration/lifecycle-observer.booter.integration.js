"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/boot
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@loopback/core");
const testlab_1 = require("@loopback/testlab");
const path_1 = require("path");
describe('lifecycle script booter integration tests', () => {
    const sandbox = new testlab_1.TestSandbox((0, path_1.resolve)(__dirname, '../../.sandbox'));
    const OBSERVER_PREFIX = core_1.CoreBindings.LIFE_CYCLE_OBSERVERS;
    const OBSERVER_TAG = core_1.CoreTags.LIFE_CYCLE_OBSERVER;
    let app;
    beforeEach('reset sandbox', () => sandbox.reset());
    beforeEach(getApp);
    it('boots life cycle observers when app.boot() is called', async () => {
        const expectedBinding = {
            key: `${OBSERVER_PREFIX}.MyLifeCycleObserver`,
            tags: [core_1.ContextTags.TYPE, OBSERVER_TAG],
            scope: core_1.BindingScope.SINGLETON,
        };
        await app.boot();
        const bindings = app
            .findByTag(OBSERVER_TAG)
            .map(b => ({ key: b.key, tags: b.tagNames, scope: b.scope }));
        (0, testlab_1.expect)(bindings).to.containEql(expectedBinding);
    });
    async function getApp() {
        await sandbox.copyFile((0, path_1.resolve)(__dirname, '../fixtures/application.js'));
        await sandbox.copyFile((0, path_1.resolve)(__dirname, '../fixtures/lifecycle-observer.artifact.js'), 'observers/lifecycle-observer.observer.js');
        const MyApp = require((0, path_1.resolve)(sandbox.path, 'application.js')).BooterApp;
        app = new MyApp();
    }
});
//# sourceMappingURL=lifecycle-observer.booter.integration.js.map
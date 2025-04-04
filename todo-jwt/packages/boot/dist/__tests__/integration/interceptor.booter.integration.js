"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/boot
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@loopback/core");
const testlab_1 = require("@loopback/testlab");
const path_1 = require("path");
describe('interceptor script booter integration tests', () => {
    const sandbox = new testlab_1.TestSandbox((0, path_1.resolve)(__dirname, '../../.sandbox'));
    let app;
    beforeEach('reset sandbox', () => sandbox.reset());
    beforeEach(buildAppWithInterceptors);
    it('boots global interceptors when app.boot() is called', async () => {
        const expectedBinding = {
            key: `${core_1.GLOBAL_INTERCEPTOR_NAMESPACE}.myGlobalInterceptor`,
            tags: [
                core_1.ContextTags.PROVIDER,
                core_1.ContextTags.TYPE,
                core_1.ContextTags.GLOBAL_INTERCEPTOR,
                core_1.ContextTags.NAMESPACE,
                core_1.ContextTags.GLOBAL_INTERCEPTOR_GROUP,
                core_1.ContextTags.NAME,
            ],
            scope: core_1.BindingScope.TRANSIENT,
        };
        await app.boot();
        const bindings = app
            .findByTag(core_1.ContextTags.GLOBAL_INTERCEPTOR)
            .map(b => ({ key: b.key, tags: b.tagNames, scope: b.scope }));
        (0, testlab_1.expect)(bindings).to.containEql(expectedBinding);
    });
    it('boots non-global interceptors when app.boot() is called', async () => {
        const expectedBinding = {
            key: `interceptors.myInterceptor`,
            tags: [
                core_1.ContextTags.PROVIDER,
                core_1.ContextTags.TYPE,
                core_1.ContextTags.NAMESPACE,
                core_1.ContextTags.NAME,
            ],
            scope: core_1.BindingScope.TRANSIENT,
        };
        await app.boot();
        const binding = app.getBinding('interceptors.myInterceptor');
        (0, testlab_1.expect)({
            key: binding.key,
            tags: binding.tagNames,
            scope: binding.scope,
        }).to.eql(expectedBinding);
    });
    async function buildAppWithInterceptors() {
        await sandbox.copyFile((0, path_1.resolve)(__dirname, '../fixtures/application.js'));
        await sandbox.copyFile((0, path_1.resolve)(__dirname, '../fixtures/interceptor.artifact.js'), 'interceptors/interceptor.interceptor.js');
        await sandbox.copyFile((0, path_1.resolve)(__dirname, '../fixtures/non-global-interceptor.artifact.js'), 'interceptors/non-global-interceptor.interceptor.js');
        const MyApp = require((0, path_1.resolve)(sandbox.path, 'application.js')).BooterApp;
        app = new MyApp();
    }
});
//# sourceMappingURL=interceptor.booter.integration.js.map
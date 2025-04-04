"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/boot
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const path_1 = require("path");
describe('service booter integration tests', () => {
    const sandbox = new testlab_1.TestSandbox((0, path_1.resolve)(__dirname, '../../.sandbox'));
    const SERVICES_PREFIX = 'services';
    const SERVICES_TAG = 'service';
    let app;
    beforeEach('reset sandbox', () => sandbox.reset());
    beforeEach(getApp);
    it('boots services when app.boot() is called', async () => {
        const expectedBindings = [
            'services.BindableGreetingService',
            'services.CurrentDate',
            'services.GeocoderService',
            'services.NotBindableDate',
            'services.DynamicDate',
            'services.ServiceWithConstructorInject',
            'services.ServiceWithPropertyInject',
            'services.ServiceWithMethodInject',
        ];
        await app.boot();
        const bindings = app.findByTag(SERVICES_TAG).map(b => b.key);
        (0, testlab_1.expect)(bindings.sort()).to.eql(expectedBindings.sort());
    });
    it('boots bindable classes when app.boot() is called', async () => {
        const expectedBindings = [
            `${SERVICES_PREFIX}.CurrentDate`,
            `${SERVICES_PREFIX}.BindableGreetingService`,
        ];
        await app.boot();
        const bindings = app.findByTag({ serviceType: 'local' }).map(b => b.key);
        (0, testlab_1.expect)(bindings.sort()).to.eql(expectedBindings.sort());
    });
    async function getApp() {
        await sandbox.copyFile((0, path_1.resolve)(__dirname, '../fixtures/application.js'));
        await sandbox.copyFile((0, path_1.resolve)(__dirname, '../fixtures/service-provider.artifact.js'), 'services/geocoder.service.js');
        await sandbox.copyFile((0, path_1.resolve)(__dirname, '../fixtures/service-dynamic-value-provider.artifact.js'), 'services/date.service.js');
        await sandbox.copyFile((0, path_1.resolve)(__dirname, '../fixtures/service-class.artifact.js'), 'services/greeting.service.js');
        await sandbox.copyFile((0, path_1.resolve)(__dirname, '../fixtures/bindable-classes.artifact.js'), 'services/bindable-classes.service.js');
        const MyApp = require((0, path_1.resolve)(sandbox.path, 'application.js')).BooterApp;
        app = new MyApp();
    }
});
//# sourceMappingURL=service.booter.integration.js.map
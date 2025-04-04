"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/boot
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../");
const booters_1 = require("../../booters");
describe('boot.component unit tests', () => {
    it('binds a component with the custom binding key', async () => {
        const app = getApp();
        app.component(CustomBoundComponent);
        await app.boot();
        const bootstrapper = await app.get(CustomBinding);
        (0, testlab_1.expect)(bootstrapper).to.be.an.instanceOf(CustomBoundComponent);
    });
    it('binds mounts booters from an instance', async () => {
        const app = getApp();
        const component = new ClassicComponent(__dirname, {});
        app.bind('components.ClassicComponent').to(component);
        // covers the resolveComponentInstance functionality
        app.mountComponentBooters(ClassicComponent);
        await app.boot();
        const bootstrapper = await app.get('components.ClassicComponent');
        (0, testlab_1.expect)(bootstrapper).to.be.an.instanceOf(ClassicComponent);
    });
    function getApp() {
        const app = new BootableApp();
        app.bind(__1.BootBindings.PROJECT_ROOT).to(__dirname);
        return app;
    }
    class BootableApp extends (0, __1.BootMixin)(core_1.Application) {
    }
    const CustomBinding = core_1.BindingKey.create('io.loopback.custom.binding.CustomBoundComponent');
    let CustomBoundComponent = class CustomBoundComponent {
        constructor() {
            this.configured = false;
        }
        async configure() {
            this.configured = true;
        }
    };
    CustomBoundComponent = tslib_1.__decorate([
        (0, core_1.injectable)({
            tags: { [core_1.ContextTags.KEY]: CustomBinding },
            scope: core_1.BindingScope.SINGLETON,
        })
    ], CustomBoundComponent);
    class ClassicComponent extends booters_1.BaseArtifactBooter {
        constructor() {
            super(...arguments);
            this.configured = false;
            this.booters = [];
        }
        async configure() {
            this.configured = true;
        }
    }
});
//# sourceMappingURL=boot.custom-binding.component.unit.js.map
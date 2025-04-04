"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/boot
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../..");
describe('BootMixin unit tests', () => {
    let app;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let stub;
    beforeEach(getApp);
    beforeEach(createStub);
    afterEach(restoreStub);
    it('mixes into the target class', () => {
        (0, testlab_1.expect)(app.boot).to.be.a.Function();
        (0, testlab_1.expect)(app.booters).to.be.a.Function();
    });
    it('adds BootComponent to target class', () => {
        const boundComponent = app.find('components.*').map(b => b.key);
        (0, testlab_1.expect)(boundComponent).to.containEql('components.BootComponent');
    });
    it('binds booter from app.booters()', async () => {
        app.booters(TestBooter);
        const booter = await app.get(`${__1.BootBindings.BOOTERS}.TestBooter`);
        (0, testlab_1.expect)(booter).to.be.an.instanceOf(TestBooter);
    });
    it('binds booter with `@injectable` from app.booters()', async () => {
        app.booters(TestBooterWithBind);
        const booterBinding = app.getBinding(`${__1.BootBindings.BOOTERS}.TestBooterWithBind`);
        (0, testlab_1.expect)(booterBinding.tagMap).to.containEql({ artifactType: 'xsd' });
    });
    it('binds booter with `@injectable` using a custom binding key', async () => {
        const testApp = new AppWithBootMixin();
        testApp.bind(__1.BootBindings.PROJECT_ROOT).to(__dirname);
        testApp.booters(TestBooterWithCustomBindingKey);
        await testApp.boot();
        const booterBinding = testApp.getBinding(`io.loopback.custom.binding.TestBooterWithCustomBindingKey`);
        const component = await testApp.get(`io.loopback.custom.binding.TestBooterWithCustomBindingKey`);
        (0, testlab_1.expect)(booterBinding.tagMap).to.containEql({ artifactType: 'bmp' });
        (0, testlab_1.expect)(component.configured).true();
    });
    it('binds booter from app.booters() as singletons by default', async () => {
        app.booters(TestBooter);
        const booter1 = await app.get(`${__1.BootBindings.BOOTERS}.TestBooter`);
        const booter2 = await app.get(`${__1.BootBindings.BOOTERS}.TestBooter`);
        (0, testlab_1.expect)(booter1).to.be.exactly(booter2);
    });
    it('binds multiple booter classes from app.booters()', async () => {
        app.booters(TestBooter, AnotherTestBooter);
        const booter = await app.get(`${__1.BootBindings.BOOTERS}.TestBooter`);
        (0, testlab_1.expect)(booter).to.be.an.instanceOf(TestBooter);
        const anotherBooter = await app.get(`${__1.BootBindings.BOOTERS}.AnotherTestBooter`);
        (0, testlab_1.expect)(anotherBooter).to.be.an.instanceOf(AnotherTestBooter);
    });
    it('binds user defined component without a booter', async () => {
        class EmptyTestComponent {
        }
        app.component(EmptyTestComponent);
        const compInstance = await app.get('components.EmptyTestComponent');
        (0, testlab_1.expect)(compInstance).to.be.an.instanceOf(EmptyTestComponent);
    });
    it('binds a user defined component with a booter from .component()', async () => {
        class TestComponent {
            constructor() {
                this.booters = [TestBooter];
            }
        }
        app.component(TestComponent);
        const compInstance = await app.get('components.TestComponent');
        (0, testlab_1.expect)(compInstance).to.be.an.instanceOf(TestComponent);
        const booterInst = await app.get(`${__1.BootBindings.BOOTERS}.TestBooter`);
        (0, testlab_1.expect)(booterInst).to.be.an.instanceOf(TestBooter);
    });
    it('warns if app is started without booting', async () => {
        await app.start();
        testlab_1.sinon.assert.calledWith(stub, 'App started without booting. Did you forget to call `await app.boot()`?');
    });
    class TestBooter {
        constructor() {
            this.configured = false;
        }
        async configure() {
            this.configured = true;
        }
    }
    let TestBooterWithBind = class TestBooterWithBind {
        constructor() {
            this.configured = false;
        }
        async configure() {
            this.configured = true;
        }
    };
    TestBooterWithBind = tslib_1.__decorate([
        (0, core_1.injectable)({ tags: { artifactType: 'xsd' } })
    ], TestBooterWithBind);
    const CustomBinding = core_1.BindingKey.create('io.loopback.custom.binding.TestBooterWithCustomBindingKey');
    let TestBooterWithCustomBindingKey = class TestBooterWithCustomBindingKey {
        constructor() {
            this.configured = false;
        }
        async configure() {
            this.configured = true;
        }
    };
    TestBooterWithCustomBindingKey = tslib_1.__decorate([
        (0, core_1.injectable)({
            tags: {
                [core_1.ContextTags.KEY]: CustomBinding,
                artifactType: 'bmp',
            },
        })
    ], TestBooterWithCustomBindingKey);
    class AnotherTestBooter {
        constructor() {
            this.discovered = false;
        }
        async discover() {
            this.discovered = true;
        }
    }
    class AppWithBootMixin extends (0, __1.BootMixin)(core_1.Application) {
    }
    function getApp() {
        app = new AppWithBootMixin();
    }
    function restoreStub() {
        stub.restore();
    }
    function createStub() {
        stub = testlab_1.sinon.stub(process, 'emitWarning');
    }
});
//# sourceMappingURL=boot.mixin.unit.js.map
"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/boot
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
describe('boot-strapper unit tests', () => {
    // RepositoryMixin is added to avoid warning message printed logged to console
    // due to the fact that RepositoryBooter is a default Booter loaded via BootMixin.
    class BootApp extends (0, __1.BootMixin)((0, repository_1.RepositoryMixin)(core_1.Application)) {
    }
    let app;
    let bootstrapper;
    const booterKey = `${__1.BootBindings.BOOTERS}.TestBooter`;
    const anotherBooterKey = `${__1.BootBindings.BOOTERS}.AnotherBooter`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let stub;
    beforeEach(getApplication);
    beforeEach(getBootStrapper);
    beforeEach(createStub);
    afterEach(restoreStub);
    it('finds and runs registered booters', async () => {
        const ctx = await bootstrapper.boot();
        const booterInst = await ctx.get(booterKey);
        (0, testlab_1.expect)(booterInst.phasesCalled).to.eql([
            'TestBooter:configure',
            'TestBooter:load',
        ]);
    });
    it('binds booters passed in BootExecutionOptions', async () => {
        const ctx = await bootstrapper.boot({ booters: [AnotherBooter] });
        const anotherBooterInst = await ctx.get(anotherBooterKey);
        (0, testlab_1.expect)(anotherBooterInst).to.be.instanceof(AnotherBooter);
        (0, testlab_1.expect)(anotherBooterInst.phasesCalled).to.eql(['AnotherBooter:configure']);
    });
    it('no booters run when BootOptions.filter.booters is []', async () => {
        const ctx = await bootstrapper.boot({ filter: { booters: [] } });
        const booterInst = await ctx.get(booterKey);
        (0, testlab_1.expect)(booterInst.phasesCalled).to.eql([]);
    });
    it('only runs booters passed in via BootOptions.filter.booters', async () => {
        const ctx = await bootstrapper.boot({
            booters: [AnotherBooter],
            filter: { booters: ['AnotherBooter'] },
        });
        const testBooterInst = await ctx.get(booterKey);
        const anotherBooterInst = await ctx.get(anotherBooterKey);
        const phasesCalled = testBooterInst.phasesCalled.concat(anotherBooterInst.phasesCalled);
        (0, testlab_1.expect)(phasesCalled).to.eql(['AnotherBooter:configure']);
    });
    it('only runs phases passed in via BootOptions.filter.phases', async () => {
        const ctx = await bootstrapper.boot({ filter: { phases: ['configure'] } });
        const booterInst = await ctx.get(booterKey);
        (0, testlab_1.expect)(booterInst.phasesCalled).to.eql(['TestBooter:configure']);
    });
    it('sets application states', async () => {
        const boot = app.boot();
        (0, testlab_1.expect)(app.state).to.eql('booting');
        await boot;
        (0, testlab_1.expect)(app.state).to.eql('booted');
        // No-op
        await app.boot();
        (0, testlab_1.expect)(app.state).to.eql('booted');
        const start = app.start();
        (0, testlab_1.expect)(app.state).to.equal('initializing');
        await start;
        (0, testlab_1.expect)(app.state).to.equal('started');
        const stop = app.stop();
        (0, testlab_1.expect)(app.state).to.equal('stopping');
        await stop;
        (0, testlab_1.expect)(app.state).to.equal('stopped');
    });
    it('awaits booted if the application is booting', async () => {
        const boot = app.boot();
        (0, testlab_1.expect)(app.state).to.eql('booting');
        const bootAgain = app.boot();
        await boot;
        await bootAgain;
        (0, testlab_1.expect)(app.state).to.eql('booted');
    });
    it('throws error with invalid application states', async () => {
        await app.start();
        await (0, testlab_1.expect)(app.boot()).to.be.rejectedWith(/Cannot boot the application as it is started\. Valid states are created,booted\./);
    });
    /**
     * Sets 'app' as a new instance of Application. Registers TestBooter as a booter.
     */
    function getApplication() {
        app = new BootApp();
        app.booters(TestBooter);
    }
    /**
     * Sets 'bootstrapper' as a new instance of a Bootstrapper
     */
    function getBootStrapper() {
        bootstrapper = new __1.Bootstrapper(app, __dirname);
    }
    /**
     * A TestBooter for testing purposes. Implements configure and load.
     */
    class TestBooter {
        constructor() {
            this.configureCalled = false;
            this.loadCalled = false;
        }
        async configure() {
            this.configureCalled = true;
        }
        async load() {
            this.loadCalled = true;
        }
        get phasesCalled() {
            const result = [];
            if (this.configureCalled)
                result.push('TestBooter:configure');
            if (this.loadCalled)
                result.push('TestBooter:load');
            return result;
        }
    }
    /**
     * A TestBooter for testing purposes. Implements configure.
     */
    class AnotherBooter {
        constructor() {
            this.configureCalled = false;
        }
        async configure() {
            this.configureCalled = true;
        }
        get phasesCalled() {
            const result = [];
            if (this.configureCalled)
                result.push('AnotherBooter:configure');
            return result;
        }
    }
    function restoreStub() {
        stub.restore();
    }
    function createStub() {
        stub = testlab_1.sinon.stub(process, 'emitWarning');
    }
});
//# sourceMappingURL=bootstrapper.unit.js.map
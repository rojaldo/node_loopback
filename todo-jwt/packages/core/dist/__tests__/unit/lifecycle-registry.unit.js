"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/core
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const context_1 = require("@loopback/context");
const testlab_1 = require("@loopback/testlab");
const util_1 = require("util");
const __1 = require("../..");
const lifecycle_registry_1 = require("../../lifecycle-registry");
const sleep = (0, util_1.promisify)(setTimeout);
describe('LifeCycleRegistry', () => {
    let context;
    let registry;
    const events = [];
    beforeEach(() => events.splice(0, events.length));
    beforeEach(givenContext);
    beforeEach(givenLifeCycleRegistry);
    it('starts all registered observers', async () => {
        givenObserver('1');
        givenObserver('2');
        await registry.start();
        (0, testlab_1.expect)(events).to.eql(['1-start', '2-start']);
    });
    it('skips notification of disabled groups', async () => {
        givenObserver('1', 'a');
        givenObserver('2', 'b');
        registry.setDisabledGroups(['a']);
        await registry.start();
        (0, testlab_1.expect)(events).to.eql(['2-start']);
    });
    it('starts/stops all registered observers with param injections', async () => {
        givenObserverWithParamInjection('1');
        givenObserverWithParamInjection('2');
        context.bind('prefix').to('***');
        await registry.start();
        (0, testlab_1.expect)(events).to.eql(['***:1-start', '***:2-start']);
        context.bind('prefix').to('###');
        events.splice(0, events.length);
        await registry.stop();
        (0, testlab_1.expect)(events).to.eql(['###:2-stop', '###:1-stop']);
    });
    it('reports error for observers with param injections if key is not bound', async () => {
        givenObserverWithParamInjection('1');
        await (0, testlab_1.expect)(registry.start()).to.be.rejectedWith(/The key 'prefix' is not bound to any value in context app/);
    });
    it('starts all registered async observers', async () => {
        givenAsyncObserver('1', 'g1');
        givenAsyncObserver('2', 'g2');
        registry.setOrderedGroups(['g1', 'g2']);
        await registry.start();
        (0, testlab_1.expect)(events).to.eql(['1-start', '2-start']);
    });
    it('stops all registered observers in reverse order', async () => {
        givenObserver('1');
        givenObserver('2');
        await registry.stop();
        (0, testlab_1.expect)(events).to.eql(['2-stop', '1-stop']);
    });
    it('stops all registered async observers in reverse order', async () => {
        givenAsyncObserver('1', 'g1');
        givenAsyncObserver('2', 'g2');
        registry.setOrderedGroups(['g1', 'g2']);
        await registry.stop();
        (0, testlab_1.expect)(events).to.eql(['2-stop', '1-stop']);
    });
    it('starts all registered observers by group', async () => {
        givenObserver('1', 'g1');
        givenObserver('2', 'g2');
        givenObserver('3', 'g1');
        registry.setOrderedGroups(['g1', 'g2']);
        const groups = registry.getOrderedGroups();
        (0, testlab_1.expect)(groups).to.eql(['g1', 'g2']);
        await registry.start();
        (0, testlab_1.expect)(events).to.eql(['1-start', '3-start', '2-start']);
    });
    it('stops all registered observers in reverse order by group', async () => {
        givenObserver('1', 'g1');
        givenObserver('2', 'g2');
        givenObserver('3', 'g1');
        registry.setOrderedGroups(['g1', 'g2']);
        await registry.stop();
        (0, testlab_1.expect)(events).to.eql(['2-stop', '3-stop', '1-stop']);
    });
    it('starts observers by alphabetical groups if no order is configured', async () => {
        givenObserver('1', 'g1');
        givenObserver('2', 'g2');
        givenObserver('3', 'g1');
        givenObserver('4', 'g0');
        const groups = registry.getOrderedGroups();
        (0, testlab_1.expect)(groups).to.eql(['g0', 'g1', 'g2']);
        await registry.start();
        (0, testlab_1.expect)(events).to.eql(['4-start', '1-start', '3-start', '2-start']);
    });
    it('runs all registered observers within the same group in parallel', async () => {
        // 1st group: g1-1 takes 20 ms more than g1-2 to finish
        givenAsyncObserver('g1-1', 'g1', 20);
        givenAsyncObserver('g1-2', 'g1', 0);
        // 2nd group: g2-1 takes 20 ms more than g2-2 to finish
        givenAsyncObserver('g2-1', 'g2', 20);
        givenAsyncObserver('g2-2', 'g2', 0);
        registry.setOrderedGroups(['g1', 'g2']);
        registry.setParallel(true);
        await registry.start();
        (0, testlab_1.expect)(events.length).to.equal(4);
        // 1st group: g1-1, g1-2
        const group1 = events.slice(0, 2);
        (0, testlab_1.expect)(group1.sort()).to.eql(['g1-1-start', 'g1-2-start']);
        // 2nd group: g2-1, g2-2
        const group2 = events.slice(2, 4);
        (0, testlab_1.expect)(group2.sort()).to.eql(['g2-1-start', 'g2-2-start']);
    });
    it('runs all registered observers within the same group in serial', async () => {
        // 1st group: g1-1 takes 20 ms more than g1-2 to finish
        givenAsyncObserver('g1-1', 'g1', 20);
        givenAsyncObserver('g1-2', 'g1', 0);
        // 2nd group: g2-1 takes 20 ms more than g2-2 to finish
        givenAsyncObserver('g2-1', 'g2', 20);
        givenAsyncObserver('g2-2', 'g2', 0);
        registry.setOrderedGroups(['g1', 'g2']);
        registry.setParallel(false);
        await registry.start();
        (0, testlab_1.expect)(events.length).to.equal(4);
        (0, testlab_1.expect)(events).to.eql([
            'g1-1-start',
            'g1-2-start',
            'g2-1-start',
            'g2-2-start',
        ]);
    });
    function givenContext() {
        context = new context_1.Context('app');
    }
    /**
     * Create a subclass to expose some protected properties/methods for testing
     */
    class TestObserverRegistry extends __1.LifeCycleObserverRegistry {
        getOrderedGroups() {
            return super.getObserverGroupsByOrder().map(g => g.group);
        }
        setParallel(parallel) {
            this.options.parallel = parallel;
        }
        setDisabledGroups(groups) {
            this.options.disabledGroups = groups;
        }
    }
    async function givenLifeCycleRegistry() {
        context.bind(__1.CoreBindings.LIFE_CYCLE_OBSERVER_OPTIONS).to({
            orderedGroups: lifecycle_registry_1.DEFAULT_ORDERED_GROUPS,
            parallel: false,
        });
        context
            .bind(__1.CoreBindings.LIFE_CYCLE_OBSERVER_REGISTRY)
            .toClass(TestObserverRegistry)
            .inScope(context_1.BindingScope.SINGLETON);
        registry = (await context.get(__1.CoreBindings.LIFE_CYCLE_OBSERVER_REGISTRY));
    }
    function givenObserver(name, group = '') {
        let MyObserver = class MyObserver {
            start() {
                events.push(`${name}-start`);
            }
            stop() {
                events.push(`${name}-stop`);
            }
        };
        MyObserver = tslib_1.__decorate([
            (0, context_1.injectable)({ tags: { [__1.CoreTags.LIFE_CYCLE_OBSERVER_GROUP]: group } })
        ], MyObserver);
        const binding = (0, context_1.createBindingFromClass)(MyObserver, {
            key: `observers.observer-${name}`,
        }).apply(__1.asLifeCycleObserver);
        context.add(binding);
        return MyObserver;
    }
    function givenObserverWithParamInjection(name, group = '') {
        let MyObserver = class MyObserver {
            start(prefix) {
                events.push(`${prefix}:${name}-start`);
            }
            stop(prefix) {
                events.push(`${prefix}:${name}-stop`);
            }
        };
        tslib_1.__decorate([
            tslib_1.__param(0, (0, context_1.inject)('prefix')),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [String]),
            tslib_1.__metadata("design:returntype", void 0)
        ], MyObserver.prototype, "start", null);
        tslib_1.__decorate([
            tslib_1.__param(0, (0, context_1.inject)('prefix')),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [String]),
            tslib_1.__metadata("design:returntype", void 0)
        ], MyObserver.prototype, "stop", null);
        MyObserver = tslib_1.__decorate([
            (0, context_1.injectable)({ tags: { [__1.CoreTags.LIFE_CYCLE_OBSERVER_GROUP]: group } })
        ], MyObserver);
        const binding = (0, context_1.createBindingFromClass)(MyObserver, {
            key: `observers.observer-${name}`,
        }).apply(__1.asLifeCycleObserver);
        context.add(binding);
        return MyObserver;
    }
    function givenAsyncObserver(name, group = '', delayInMs = 0) {
        let MyAsyncObserver = class MyAsyncObserver {
            async start() {
                await sleep(delayInMs);
                events.push(`${name}-start`);
            }
            async stop() {
                await sleep(delayInMs);
                events.push(`${name}-stop`);
            }
        };
        MyAsyncObserver = tslib_1.__decorate([
            (0, context_1.injectable)({ tags: { [__1.CoreTags.LIFE_CYCLE_OBSERVER_GROUP]: group } })
        ], MyAsyncObserver);
        const binding = (0, context_1.createBindingFromClass)(MyAsyncObserver, {
            key: `observers.observer-${name}`,
        }).apply(__1.asLifeCycleObserver);
        context.add(binding);
        return MyAsyncObserver;
    }
});
//# sourceMappingURL=lifecycle-registry.unit.js.map
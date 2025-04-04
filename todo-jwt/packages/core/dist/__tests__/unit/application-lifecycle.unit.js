"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/core
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const context_1 = require("@loopback/context");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
describe('Application life cycle', () => {
    describe('state', () => {
        it('updates application state', async () => {
            const app = new __1.Application();
            (0, testlab_1.expect)(app.state).to.equal('created');
            const initialize = app.init();
            (0, testlab_1.expect)(app.state).to.equal('initializing');
            await initialize;
            (0, testlab_1.expect)(app.state).to.equal('initialized');
            const start = app.start();
            await start;
            (0, testlab_1.expect)(app.state).to.equal('started');
            const stop = app.stop();
            (0, testlab_1.expect)(app.state).to.equal('stopping');
            await stop;
            (0, testlab_1.expect)(app.state).to.equal('stopped');
        });
        it('calls init by start only once', async () => {
            const app = new __1.Application();
            let start = app.start();
            (0, testlab_1.expect)(app.state).to.equal('initializing');
            await start;
            (0, testlab_1.expect)(app.state).to.equal('started');
            const stop = app.stop();
            (0, testlab_1.expect)(app.state).to.equal('stopping');
            await stop;
            (0, testlab_1.expect)(app.state).to.equal('stopped');
            start = app.start();
            (0, testlab_1.expect)(app.state).to.equal('starting');
            await start;
            (0, testlab_1.expect)(app.state).to.equal('started');
            await app.stop();
        });
        it('emits state change events', async () => {
            const app = new __1.Application();
            const events = [];
            app.on('stateChanged', event => {
                events.push(`${event.from} -> ${event.to}`);
            });
            const start = app.start();
            (0, testlab_1.expect)(events).to.eql(['created -> initializing']);
            await start;
            (0, testlab_1.expect)(events).to.eql([
                'created -> initializing',
                'initializing -> initialized',
                'initialized -> starting',
                'starting -> started',
            ]);
            const stop = app.stop();
            (0, testlab_1.expect)(events).to.eql([
                'created -> initializing',
                'initializing -> initialized',
                'initialized -> starting',
                'starting -> started',
                'started -> stopping',
            ]);
            await stop;
            (0, testlab_1.expect)(events).to.eql([
                'created -> initializing',
                'initializing -> initialized',
                'initialized -> starting',
                'starting -> started',
                'started -> stopping',
                'stopping -> stopped',
            ]);
        });
        it('emits state events', async () => {
            const app = new __1.Application();
            const events = [];
            for (const e of [
                'initializing',
                'initialized',
                'starting',
                'started',
                'stopping',
                'stopped',
            ]) {
                app.on(e, event => {
                    events.push(e);
                });
            }
            const start = app.start();
            (0, testlab_1.expect)(events).to.eql(['initializing']);
            await start;
            (0, testlab_1.expect)(events).to.eql([
                'initializing',
                'initialized',
                'starting',
                'started',
            ]);
            const stop = app.stop();
            (0, testlab_1.expect)(events).to.eql([
                'initializing',
                'initialized',
                'starting',
                'started',
                'stopping',
            ]);
            await stop;
            (0, testlab_1.expect)(events).to.eql([
                'initializing',
                'initialized',
                'starting',
                'started',
                'stopping',
                'stopped',
            ]);
        });
        it('allows application.stop when it is created', async () => {
            const app = new __1.Application();
            await app.stop(); // no-op
            (0, testlab_1.expect)(app.state).to.equal('created');
        });
        it('allows application.stop when it is initialized', async () => {
            const app = new __1.Application();
            await app.init();
            (0, testlab_1.expect)(app.state).to.equal('initialized');
            await app.stop();
            (0, testlab_1.expect)(app.state).to.equal('stopped');
        });
        it('await application.stop when it is stopping', async () => {
            const app = new __1.Application();
            await app.start();
            const stop = app.stop();
            const stopAgain = app.stop();
            await stop;
            await stopAgain;
            (0, testlab_1.expect)(app.state).to.equal('stopped');
        });
        it('await application.start when it is starting', async () => {
            const app = new __1.Application();
            const start = app.start();
            const startAgain = app.start();
            await start;
            await startAgain;
            (0, testlab_1.expect)(app.state).to.equal('started');
        });
    });
    describe('start', () => {
        it('starts all injected servers', async () => {
            const app = new __1.Application();
            app.component(ObservingComponentWithServers);
            const component = await app.get(`${__1.CoreBindings.COMPONENTS}.ObservingComponentWithServers`);
            (0, testlab_1.expect)(component.status).to.equal('not-initialized');
            await app.start();
            const server = await app.getServer(ObservingServer);
            (0, testlab_1.expect)(server).to.not.be.null();
            (0, testlab_1.expect)(server.listening).to.equal(true);
            (0, testlab_1.expect)(component.status).to.equal('started');
            await app.stop();
        });
        it('starts servers bound with `LIFE_CYCLE_OBSERVER` tag', async () => {
            const app = new __1.Application();
            app
                .bind('fake-server')
                .toClass(ObservingServer)
                .tag(__1.CoreTags.LIFE_CYCLE_OBSERVER, __1.CoreTags.SERVER)
                .inScope(context_1.BindingScope.SINGLETON);
            await app.start();
            const server = await app.get('fake-server');
            (0, testlab_1.expect)(server).to.not.be.null();
            (0, testlab_1.expect)(server.listening).to.equal(true);
            await app.stop();
        });
        it('starts/stops all registered components', async () => {
            const app = new __1.Application();
            app.component(ObservingComponentWithServers);
            const component = await app.get(`${__1.CoreBindings.COMPONENTS}.ObservingComponentWithServers`);
            (0, testlab_1.expect)(component.status).to.equal('not-initialized');
            await app.start();
            (0, testlab_1.expect)(component.status).to.equal('started');
            await app.stop();
            (0, testlab_1.expect)(component.status).to.equal('stopped');
        });
        it('initializes all registered components', async () => {
            const app = new __1.Application();
            app.component(ObservingComponentWithServers);
            const component = await app.get(`${__1.CoreBindings.COMPONENTS}.ObservingComponentWithServers`);
            (0, testlab_1.expect)(component.status).to.equal('not-initialized');
            await app.init();
            (0, testlab_1.expect)(component.status).to.equal('initialized');
            (0, testlab_1.expect)(component.initialized).to.be.true();
        });
        it('initializes all registered components by start', async () => {
            const app = new __1.Application();
            app.component(ObservingComponentWithServers);
            const component = await app.get(`${__1.CoreBindings.COMPONENTS}.ObservingComponentWithServers`);
            (0, testlab_1.expect)(component.status).to.equal('not-initialized');
            await app.start();
            (0, testlab_1.expect)(component.status).to.equal('started');
            (0, testlab_1.expect)(component.initialized).to.be.true();
        });
        it('starts/stops all observers from the component', async () => {
            const app = new __1.Application();
            app.component(ComponentWithObservers);
            const observer = await app.get('lifeCycleObservers.MyObserver');
            const observerWithDecorator = await app.get('lifeCycleObservers.MyObserverWithDecorator');
            (0, testlab_1.expect)(observer.status).to.equal('not-initialized');
            (0, testlab_1.expect)(observerWithDecorator.status).to.equal('not-initialized');
            await app.start();
            (0, testlab_1.expect)(observer.status).to.equal('started');
            (0, testlab_1.expect)(observerWithDecorator.status).to.equal('started');
            await app.stop();
            (0, testlab_1.expect)(observer.status).to.equal('stopped');
            (0, testlab_1.expect)(observerWithDecorator.status).to.equal('stopped');
        });
        it('starts/stops all registered life cycle observers', async () => {
            const app = new __1.Application();
            app.lifeCycleObserver(MyObserver, 'my-observer');
            const observer = await app.get('lifeCycleObservers.my-observer');
            (0, testlab_1.expect)(observer.status).to.equal('not-initialized');
            await app.start();
            (0, testlab_1.expect)(observer.status).to.equal('started');
            await app.stop();
            (0, testlab_1.expect)(observer.status).to.equal('stopped');
        });
        it('starts/stops all registered life cycle observers with param injections', async () => {
            const app = new __1.Application();
            app.lifeCycleObserver(MyObserverWithMethodInjection, 'my-observer');
            const observer = await app.get('lifeCycleObservers.my-observer');
            app.bind('prefix').to('***');
            (0, testlab_1.expect)(observer.status).to.equal('not-initialized');
            await app.init();
            (0, testlab_1.expect)(observer.status).to.equal('***:initialized');
            await app.start();
            (0, testlab_1.expect)(observer.status).to.equal('***:started');
            app.bind('prefix').to('###');
            await app.stop();
            (0, testlab_1.expect)(observer.status).to.equal('###:stopped');
        });
        it('registers life cycle observers with options', async () => {
            const app = new __1.Application();
            const binding = app.lifeCycleObserver(MyObserver, {
                name: 'my-observer',
                namespace: 'my-observers',
            });
            (0, testlab_1.expect)(binding.key).to.eql('my-observers.my-observer');
        });
        it('honors @injectable', async () => {
            let MyObserverWithBind = class MyObserverWithBind {
                constructor() {
                    this.status = 'not-initialized';
                }
                start() {
                    this.status = 'started';
                }
                stop() {
                    this.status = 'stopped';
                }
            };
            MyObserverWithBind = tslib_1.__decorate([
                (0, context_1.injectable)({
                    tags: {
                        [__1.CoreTags.LIFE_CYCLE_OBSERVER]: __1.CoreTags.LIFE_CYCLE_OBSERVER,
                        [__1.CoreTags.LIFE_CYCLE_OBSERVER_GROUP]: 'my-group',
                        namespace: __1.CoreBindings.LIFE_CYCLE_OBSERVERS,
                    },
                    scope: context_1.BindingScope.SINGLETON,
                })
            ], MyObserverWithBind);
            const app = new __1.Application();
            const binding = (0, context_1.createBindingFromClass)(MyObserverWithBind);
            app.add(binding);
            (0, testlab_1.expect)(binding.tagMap[__1.CoreTags.LIFE_CYCLE_OBSERVER_GROUP]).to.eql('my-group');
            const observer = await app.get(binding.key);
            (0, testlab_1.expect)(observer.status).to.equal('not-initialized');
            await app.start();
            (0, testlab_1.expect)(observer.status).to.equal('started');
            await app.stop();
            (0, testlab_1.expect)(observer.status).to.equal('stopped');
        });
        it('honors @lifeCycleObserver', async () => {
            const app = new __1.Application();
            const binding = (0, context_1.createBindingFromClass)(MyObserverWithDecorator);
            app.add(binding);
            (0, testlab_1.expect)(binding.tagMap[__1.CoreTags.LIFE_CYCLE_OBSERVER_GROUP]).to.eql('my-group');
            (0, testlab_1.expect)(binding.scope).to.eql(context_1.BindingScope.SINGLETON);
            const observer = await app.get(binding.key);
            (0, testlab_1.expect)(observer.status).to.equal('not-initialized');
            await app.start();
            (0, testlab_1.expect)(observer.status).to.equal('started');
            await app.stop();
            (0, testlab_1.expect)(observer.status).to.equal('stopped');
        });
        it('does not attempt to start poorly named bindings', async () => {
            const app = new __1.Application();
            let startInvoked = false;
            let stopInvoked = false;
            // The app.start should not attempt to start this binding.
            app.bind('controllers.servers').to({
                start: () => {
                    startInvoked = true;
                },
                stop: () => {
                    stopInvoked = true;
                },
            });
            await app.start();
            (0, testlab_1.expect)(startInvoked).to.be.false(); // not invoked
            await app.stop();
            (0, testlab_1.expect)(stopInvoked).to.be.false(); // not invoked
        });
    });
    describe('app.onInit()', () => {
        it('registers the handler as "init" lifecycle observer', async () => {
            const app = new __1.Application();
            let invoked = false;
            const binding = app.onInit(async function doSomething() {
                // delay the actual observer code to the next tick to
                // verify that the promise returned by an async observer
                // is correctly forwarded by LifeCycle wrapper
                await Promise.resolve();
                invoked = true;
            });
            (0, testlab_1.expect)(binding.key).to.match(/^lifeCycleObservers.doSomething/);
            await app.start();
            (0, testlab_1.expect)(invoked).to.be.true();
        });
        it('registers multiple handlers with the same name', async () => {
            const app = new __1.Application();
            const invoked = [];
            app.onInit(() => {
                invoked.push('first');
            });
            app.onInit(() => {
                invoked.push('second');
            });
            await app.init();
            (0, testlab_1.expect)(invoked).to.deepEqual(['first', 'second']);
        });
    });
    describe('app.onStart()', () => {
        it('registers the handler as "start" lifecycle observer', async () => {
            const app = new __1.Application();
            let invoked = false;
            const binding = app.onStart(async function doSomething() {
                // delay the actual observer code to the next tick to
                // verify that the promise returned by an async observer
                // is correctly forwarded by LifeCycle wrapper
                await Promise.resolve();
                invoked = true;
            });
            (0, testlab_1.expect)(binding.key).to.match(/^lifeCycleObservers.doSomething/);
            await app.start();
            (0, testlab_1.expect)(invoked).to.be.true();
        });
        it('registers multiple handlers with the same name', async () => {
            const app = new __1.Application();
            const invoked = [];
            app.onStart(() => {
                invoked.push('first');
            });
            app.onStart(() => {
                invoked.push('second');
            });
            await app.start();
            (0, testlab_1.expect)(invoked).to.deepEqual(['first', 'second']);
        });
    });
    describe('app.onStop()', () => {
        it('registers the handler as "stop" lifecycle observer', async () => {
            const app = new __1.Application();
            let invoked = false;
            const binding = app.onStop(async function doSomething() {
                // delay the actual observer code to the next tick to
                // verify that the promise returned by an async observer
                // is correctly forwarded by LifeCycle wrapper
                await Promise.resolve();
                invoked = true;
            });
            (0, testlab_1.expect)(binding.key).to.match(/^lifeCycleObservers.doSomething/);
            await app.start();
            (0, testlab_1.expect)(invoked).to.be.false();
            await app.stop();
            (0, testlab_1.expect)(invoked).to.be.true();
        });
        it('registers multiple handlers with the same name', async () => {
            const app = new __1.Application();
            const invoked = [];
            app.onStop(() => {
                invoked.push('first');
            });
            app.onStop(() => {
                invoked.push('second');
            });
            await app.start();
            (0, testlab_1.expect)(invoked).to.be.empty();
            await app.stop();
            // `stop` observers are invoked in reverse order
            (0, testlab_1.expect)(invoked).to.deepEqual(['second', 'first']);
        });
    });
});
class ObservingComponentWithServers {
    constructor() {
        this.status = 'not-initialized';
        this.initialized = false;
        this.servers = {
            ObservingServer: ObservingServer,
            ObservingServer2: ObservingServer,
        };
    }
    init() {
        this.status = 'initialized';
        this.initialized = true;
    }
    start() {
        this.status = 'started';
    }
    stop() {
        this.status = 'stopped';
    }
}
class ObservingServer extends context_1.Context {
    constructor() {
        super();
        this.listening = false;
    }
    async start() {
        this.listening = true;
    }
    async stop() {
        this.listening = false;
    }
}
class MyObserver {
    constructor() {
        this.status = 'not-initialized';
    }
    start() {
        this.status = 'started';
    }
    stop() {
        this.status = 'stopped';
    }
}
class MyObserverWithMethodInjection {
    constructor() {
        this.status = 'not-initialized';
    }
    init(prefix) {
        this.status = `${prefix}:initialized`;
    }
    start(prefix) {
        this.status = `${prefix}:started`;
    }
    stop(prefix) {
        this.status = `${prefix}:stopped`;
    }
}
tslib_1.__decorate([
    tslib_1.__param(0, (0, context_1.inject)('prefix')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], MyObserverWithMethodInjection.prototype, "init", null);
tslib_1.__decorate([
    tslib_1.__param(0, (0, context_1.inject)('prefix')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], MyObserverWithMethodInjection.prototype, "start", null);
tslib_1.__decorate([
    tslib_1.__param(0, (0, context_1.inject)('prefix')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], MyObserverWithMethodInjection.prototype, "stop", null);
let MyObserverWithDecorator = class MyObserverWithDecorator {
    constructor() {
        this.status = 'not-initialized';
    }
    start() {
        this.status = 'started';
    }
    stop() {
        this.status = 'stopped';
    }
};
MyObserverWithDecorator = tslib_1.__decorate([
    (0, __1.lifeCycleObserver)('my-group', { scope: context_1.BindingScope.SINGLETON })
], MyObserverWithDecorator);
class ComponentWithObservers {
    constructor() {
        this.lifeCycleObservers = [MyObserver, MyObserverWithDecorator];
    }
}
//# sourceMappingURL=application-lifecycle.unit.js.map
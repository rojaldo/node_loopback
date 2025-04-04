"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/core
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const context_1 = require("@loopback/context");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
describe('Application', () => {
    let app;
    afterEach('clean up application', () => app.stop());
    describe('app bindings', () => {
        it('binds the application itself', () => {
            app = new __1.Application();
            (0, testlab_1.expect)(app.getSync(__1.CoreBindings.APPLICATION_INSTANCE)).to.equal(app);
        });
        it('binds the application config', () => {
            const myAppConfig = { name: 'my-app', port: 3000 };
            app = new __1.Application(myAppConfig);
            (0, testlab_1.expect)(app.getSync(__1.CoreBindings.APPLICATION_CONFIG)).to.equal(myAppConfig);
        });
        it('configures the application', () => {
            const myAppConfig = { name: 'my-app', port: 3000 };
            app = new __1.Application(myAppConfig);
            (0, testlab_1.expect)(app.getConfigSync(__1.CoreBindings.APPLICATION_INSTANCE)).to.equal(myAppConfig);
        });
    });
    describe('controller binding', () => {
        beforeEach(givenApp);
        class MyController {
        }
        it('binds a controller', () => {
            const binding = app.controller(MyController);
            (0, testlab_1.expect)(Array.from(binding.tagNames)).to.containEql(__1.CoreTags.CONTROLLER);
            (0, testlab_1.expect)(binding.key).to.equal('controllers.MyController');
            (0, testlab_1.expect)(binding.scope).to.equal(context_1.BindingScope.TRANSIENT);
            (0, testlab_1.expect)(findKeysByTag(app, __1.CoreTags.CONTROLLER)).to.containEql(binding.key);
        });
        it('binds a controller with custom name', () => {
            const binding = app.controller(MyController, 'my-controller');
            (0, testlab_1.expect)(Array.from(binding.tagNames)).to.containEql(__1.CoreTags.CONTROLLER);
            (0, testlab_1.expect)(binding.key).to.equal('controllers.my-controller');
            (0, testlab_1.expect)(findKeysByTag(app, __1.CoreTags.CONTROLLER)).to.containEql(binding.key);
        });
        it('binds a controller with custom options', () => {
            const binding = app.controller(MyController, {
                name: 'my-controller',
                namespace: 'my-controllers',
            });
            (0, testlab_1.expect)(binding.key).to.eql('my-controllers.my-controller');
        });
        it('binds a singleton controller', () => {
            let MySingletonController = class MySingletonController {
            };
            MySingletonController = tslib_1.__decorate([
                (0, context_1.injectable)({ scope: context_1.BindingScope.SINGLETON })
            ], MySingletonController);
            const binding = app.controller(MySingletonController);
            (0, testlab_1.expect)(binding.scope).to.equal(context_1.BindingScope.SINGLETON);
            (0, testlab_1.expect)(findKeysByTag(app, 'controller')).to.containEql(binding.key);
        });
    });
    describe('component binding', () => {
        beforeEach(givenApp);
        class MyComponent {
        }
        it('binds a component', () => {
            const binding = app.component(MyComponent);
            (0, testlab_1.expect)(binding.scope).to.equal(context_1.BindingScope.SINGLETON);
            (0, testlab_1.expect)(findKeysByTag(app, __1.CoreTags.COMPONENT)).to.containEql('components.MyComponent');
        });
        it('binds a component with custom name', () => {
            app.component(MyComponent, 'my-component');
            (0, testlab_1.expect)(findKeysByTag(app, __1.CoreTags.COMPONENT)).to.containEql('components.my-component');
        });
        it('binds a component with custom namespace', () => {
            const binding = app.component(MyComponent, {
                name: 'my-component',
                namespace: 'my-components',
            });
            (0, testlab_1.expect)(binding.key).to.eql('my-components.my-component');
        });
        it('binds a transient component', () => {
            let MyTransientComponent = class MyTransientComponent {
            };
            MyTransientComponent = tslib_1.__decorate([
                (0, context_1.injectable)({ scope: context_1.BindingScope.TRANSIENT })
            ], MyTransientComponent);
            const binding = app.component(MyTransientComponent);
            (0, testlab_1.expect)(binding.scope).to.equal(context_1.BindingScope.TRANSIENT);
        });
        it('binds controllers from a component', () => {
            class MyController {
            }
            class MyComponentWithControllers {
                constructor() {
                    this.controllers = [MyController];
                }
            }
            app.component(MyComponentWithControllers);
            (0, testlab_1.expect)(app.getBinding('controllers.MyController').valueConstructor).to.be.exactly(MyController);
        });
        it('binds bindings from a component', () => {
            const binding = context_1.Binding.bind('foo');
            class MyComponentWithBindings {
                constructor() {
                    this.bindings = [binding];
                }
            }
            app.component(MyComponentWithBindings);
            (0, testlab_1.expect)(app.getBinding('foo')).to.be.exactly(binding);
        });
        it('binds classes from a component', () => {
            class MyClass {
            }
            class MyComponentWithClasses {
                constructor() {
                    this.classes = { 'my-class': MyClass };
                }
            }
            app.component(MyComponentWithClasses);
            (0, testlab_1.expect)(app.contains('my-class')).to.be.true();
            (0, testlab_1.expect)(app.getBinding('my-class').valueConstructor).to.be.exactly(MyClass);
            (0, testlab_1.expect)(app.getSync('my-class')).to.be.instanceof(MyClass);
        });
        it('binds providers from a component', () => {
            class MyProvider {
                value() {
                    return 'my-str';
                }
            }
            class MyComponentWithProviders {
                constructor() {
                    this.providers = { 'my-provider': MyProvider };
                }
            }
            app.component(MyComponentWithProviders);
            (0, testlab_1.expect)(app.contains('my-provider')).to.be.true();
            (0, testlab_1.expect)(app.getSync('my-provider')).to.be.eql('my-str');
        });
        it('binds classes with @injectable from a component', () => {
            let MyClass = class MyClass {
            };
            MyClass = tslib_1.__decorate([
                (0, context_1.injectable)({ scope: context_1.BindingScope.SINGLETON, tags: ['foo'] })
            ], MyClass);
            class MyComponentWithClasses {
                constructor() {
                    this.classes = { 'my-class': MyClass };
                }
            }
            app.component(MyComponentWithClasses);
            const binding = app.getBinding('my-class');
            (0, testlab_1.expect)(binding.scope).to.eql(context_1.BindingScope.SINGLETON);
            (0, testlab_1.expect)(binding.tagNames).to.containEql('foo');
        });
        it('binds services from a component', () => {
            class MyService {
            }
            class MyComponentWithServices {
                constructor() {
                    this.services = [MyService];
                }
            }
            app.component(MyComponentWithServices);
            (0, testlab_1.expect)(app.getBinding('services.MyService').valueConstructor).to.be.exactly(MyService);
        });
        it('binds services with @injectable from a component', () => {
            let MyService = class MyService {
            };
            MyService = tslib_1.__decorate([
                (0, context_1.injectable)({ scope: context_1.BindingScope.TRANSIENT, tags: ['foo'] })
            ], MyService);
            class MyComponentWithServices {
                constructor() {
                    this.services = [MyService];
                }
            }
            app.component(MyComponentWithServices);
            const binding = app.getBinding('services.MyService');
            (0, testlab_1.expect)(binding.scope).to.eql(context_1.BindingScope.TRANSIENT);
            (0, testlab_1.expect)(binding.tagNames).to.containEql('foo');
        });
        it('honors tags when binding providers from a component', () => {
            let MyProvider = class MyProvider {
                value() {
                    return 'my-str';
                }
            };
            MyProvider = tslib_1.__decorate([
                (0, context_1.injectable)({ tags: ['foo'] })
            ], MyProvider);
            class MyComponentWithProviders {
                constructor() {
                    this.providers = { 'my-provider': MyProvider };
                }
            }
            app.component(MyComponentWithProviders);
            const binding = app.getBinding('my-provider');
            (0, testlab_1.expect)(binding.tagNames).to.containEql('foo');
        });
        it('binds from a component constructor', () => {
            let MyComponentWithDI = class MyComponentWithDI {
                constructor(ctx) {
                    // Programmatically bind to the context
                    ctx.bind('foo').to('bar');
                }
            };
            MyComponentWithDI = tslib_1.__decorate([
                tslib_1.__param(0, (0, context_1.inject)(__1.CoreBindings.APPLICATION_INSTANCE)),
                tslib_1.__metadata("design:paramtypes", [context_1.Context])
            ], MyComponentWithDI);
            app.component(MyComponentWithDI);
            (0, testlab_1.expect)(app.contains('foo')).to.be.true();
            (0, testlab_1.expect)(app.getSync('foo')).to.be.eql('bar');
        });
    });
    describe('server binding', () => {
        beforeEach(givenApp);
        it('defaults to constructor name', async () => {
            const binding = app.server(FakeServer);
            (0, testlab_1.expect)(binding.scope).to.equal(context_1.BindingScope.SINGLETON);
            (0, testlab_1.expect)(Array.from(binding.tagNames)).to.containEql(__1.CoreTags.SERVER);
            const result = await app.getServer(FakeServer.name);
            (0, testlab_1.expect)(result.constructor.name).to.equal(FakeServer.name);
        });
        it('binds a server with a different scope than SINGLETON', async () => {
            let TransientServer = class TransientServer extends FakeServer {
            };
            TransientServer = tslib_1.__decorate([
                (0, context_1.injectable)({ scope: context_1.BindingScope.TRANSIENT })
            ], TransientServer);
            const binding = app.server(TransientServer);
            (0, testlab_1.expect)(binding.scope).to.equal(context_1.BindingScope.TRANSIENT);
        });
        it('allows custom name', async () => {
            const name = 'customName';
            app.server(FakeServer, name);
            const result = await app.getServer(name);
            (0, testlab_1.expect)(result.constructor.name).to.equal(FakeServer.name);
        });
        it('allows custom namespace', async () => {
            const name = 'customName';
            const binding = app.server(FakeServer, { name, namespace: 'my-servers' });
            (0, testlab_1.expect)(binding.key).to.eql('my-servers.customName');
        });
        it('allows binding of multiple servers as an array', async () => {
            const bindings = app.servers([FakeServer, AnotherServer]);
            (0, testlab_1.expect)(Array.from(bindings[0].tagNames)).to.containEql(__1.CoreTags.SERVER);
            (0, testlab_1.expect)(Array.from(bindings[1].tagNames)).to.containEql(__1.CoreTags.SERVER);
            const fakeResult = await app.getServer(FakeServer);
            (0, testlab_1.expect)(fakeResult.constructor.name).to.equal(FakeServer.name);
            const AnotherResult = await app.getServer(AnotherServer);
            (0, testlab_1.expect)(AnotherResult.constructor.name).to.equal(AnotherServer.name);
        });
    });
    describe('service binding', () => {
        beforeEach(givenApp);
        class MyService {
        }
        it('binds a service', () => {
            const binding = app.service(MyService);
            (0, testlab_1.expect)(Array.from(binding.tagNames)).to.containEql(__1.CoreTags.SERVICE);
            (0, testlab_1.expect)(binding.key).to.equal('services.MyService');
            (0, testlab_1.expect)(binding.scope).to.equal(context_1.BindingScope.TRANSIENT);
            (0, testlab_1.expect)(findKeysByTag(app, __1.CoreTags.SERVICE)).to.containEql(binding.key);
        });
        it('binds a service with custom name', () => {
            const binding = app.service(MyService, 'my-service');
            (0, testlab_1.expect)(Array.from(binding.tagNames)).to.containEql(__1.CoreTags.SERVICE);
            (0, testlab_1.expect)(binding.key).to.equal('services.my-service');
            (0, testlab_1.expect)(findKeysByTag(app, __1.CoreTags.SERVICE)).to.containEql(binding.key);
        });
        it('binds a service with custom namespace', () => {
            const binding = app.service(MyService, {
                namespace: 'my-services',
                name: 'my-service',
            });
            (0, testlab_1.expect)(Array.from(binding.tagNames)).to.containEql(__1.CoreTags.SERVICE);
            (0, testlab_1.expect)(binding.key).to.equal('my-services.my-service');
            (0, testlab_1.expect)(findKeysByTag(app, __1.CoreTags.SERVICE)).to.containEql(binding.key);
        });
        it('binds a service with custom interface - string', () => {
            const binding = app.service(MyService, { interface: 'MyService' });
            (0, testlab_1.expect)(Array.from(binding.tagNames)).to.containEql(__1.CoreTags.SERVICE);
            (0, testlab_1.expect)(binding.tagMap[__1.CoreTags.SERVICE_INTERFACE]).to.eql('MyService');
        });
        it('binds a service with custom interface - symbol', () => {
            const MyServiceInterface = Symbol('MyService');
            const binding = app.service(MyService, { interface: MyServiceInterface });
            (0, testlab_1.expect)(Array.from(binding.tagNames)).to.containEql(__1.CoreTags.SERVICE);
            (0, testlab_1.expect)(binding.tagMap[__1.CoreTags.SERVICE_INTERFACE]).to.eql(MyServiceInterface);
        });
        it('binds a singleton service', () => {
            let MySingletonService = class MySingletonService {
            };
            MySingletonService = tslib_1.__decorate([
                (0, context_1.injectable)({ scope: context_1.BindingScope.SINGLETON })
            ], MySingletonService);
            const binding = app.service(MySingletonService);
            (0, testlab_1.expect)(binding.scope).to.equal(context_1.BindingScope.SINGLETON);
            (0, testlab_1.expect)(findKeysByTag(app, 'service')).to.containEql(binding.key);
        });
        it('binds a service provider', () => {
            let MyServiceProvider = class MyServiceProvider {
                value() {
                    return new Date();
                }
            };
            MyServiceProvider = tslib_1.__decorate([
                (0, context_1.injectable)({ tags: { date: 'now', namespace: 'localServices' } })
            ], MyServiceProvider);
            const binding = app.service(MyServiceProvider);
            (0, testlab_1.expect)(Array.from(binding.tagNames)).to.containEql(__1.CoreTags.SERVICE);
            (0, testlab_1.expect)(binding.tagMap.date).to.eql('now');
            (0, testlab_1.expect)(binding.key).to.equal('localServices.MyService');
            (0, testlab_1.expect)(binding.scope).to.equal(context_1.BindingScope.TRANSIENT);
            (0, testlab_1.expect)(findKeysByTag(app, 'service')).to.containEql(binding.key);
        });
        it('binds a service provider with name tag', () => {
            let MyServiceProvider = class MyServiceProvider {
                value() {
                    return new Date();
                }
            };
            MyServiceProvider = tslib_1.__decorate([
                (0, context_1.injectable)({ tags: { date: 'now', name: 'my-service' } })
            ], MyServiceProvider);
            const binding = app.service(MyServiceProvider);
            (0, testlab_1.expect)(Array.from(binding.tagNames)).to.containEql(__1.CoreTags.SERVICE);
            (0, testlab_1.expect)(binding.tagMap.date).to.eql('now');
            (0, testlab_1.expect)(binding.key).to.equal('services.my-service');
            (0, testlab_1.expect)(findKeysByTag(app, 'service')).to.containEql(binding.key);
        });
        it('binds subclasses of a service without mutating base class', () => {
            var _a, _b, _c;
            let BaseService = class BaseService {
            };
            BaseService = tslib_1.__decorate([
                (0, context_1.injectable)({ scope: context_1.BindingScope.SINGLETON })
            ], BaseService);
            class SubService extends BaseService {
            }
            const templates = (_a = (0, context_1.getBindingMetadata)(BaseService)) === null || _a === void 0 ? void 0 : _a.templates;
            app.service(BaseService, {
                defaultScope: context_1.BindingScope.SINGLETON,
            });
            app.service(SubService, {
                defaultScope: context_1.BindingScope.SINGLETON,
            });
            (0, testlab_1.expect)((_c = (_b = (0, context_1.getBindingMetadata)(BaseService)) === null || _b === void 0 ? void 0 : _b.templates) === null || _c === void 0 ? void 0 : _c.length).to.equal(templates === null || templates === void 0 ? void 0 : templates.length);
        });
    });
    describe('shutdown signal listener', () => {
        beforeEach(givenApp);
        it('registers a SIGTERM listener when app starts', async () => {
            const count = getListeners().length;
            await app.start();
            (0, testlab_1.expect)(getListeners().length).to.eql(count + 1);
        });
        it('does not impact SIGTERM listener when app stops without start', async () => {
            const count = getListeners().length;
            await app.stop();
            (0, testlab_1.expect)(getListeners().length).to.eql(count);
        });
        it('registers/removes a SIGTERM listener by start/stop', async () => {
            await app.start();
            const count = getListeners().length;
            await app.stop();
            (0, testlab_1.expect)(getListeners().length).to.eql(count - 1);
            // Restart
            await app.start();
            (0, testlab_1.expect)(getListeners().length).to.eql(count);
        });
        it('does not register a SIGTERM listener when app is created', async () => {
            const count = getListeners().length;
            // Create another application
            new __1.Application();
            (0, testlab_1.expect)(getListeners().length).to.eql(count);
        });
        function getListeners() {
            return process.listeners('SIGTERM');
        }
    });
    describe('interceptor binding', () => {
        beforeEach(givenApp);
        it('registers a function as local interceptor', () => {
            const binding = app.interceptor(logInterceptor, {
                name: 'logInterceptor',
            });
            (0, testlab_1.expect)(binding).to.containDeep({
                key: 'interceptors.logInterceptor',
            });
            (0, testlab_1.expect)(binding.tagMap[context_1.ContextTags.GLOBAL_INTERCEPTOR]).to.be.undefined();
        });
        it('registers a provider class as local interceptor', () => {
            const binding = app.interceptor(LogInterceptorProviderWithoutDecoration, {
                name: 'logInterceptor',
            });
            (0, testlab_1.expect)(binding).to.containDeep({
                key: 'interceptors.logInterceptor',
            });
            (0, testlab_1.expect)(binding.tagMap[context_1.ContextTags.GLOBAL_INTERCEPTOR]).to.be.undefined();
        });
        it('registers a function as global interceptor', () => {
            const binding = app.interceptor(logInterceptor, {
                global: true,
                group: 'log',
                source: ['route', 'proxy'],
                name: 'logInterceptor',
            });
            (0, testlab_1.expect)(binding).to.containDeep({
                key: 'globalInterceptors.logInterceptor',
                tagMap: {
                    [context_1.ContextTags.GLOBAL_INTERCEPTOR_GROUP]: 'log',
                    [context_1.ContextTags.GLOBAL_INTERCEPTOR_SOURCE]: ['route', 'proxy'],
                    [context_1.ContextTags.GLOBAL_INTERCEPTOR]: context_1.ContextTags.GLOBAL_INTERCEPTOR,
                },
            });
        });
        it('registers a provider class as global interceptor', () => {
            const binding = app.interceptor(LogInterceptorProvider, {
                group: 'log',
                source: ['route', 'proxy'],
                name: 'logInterceptor',
            });
            (0, testlab_1.expect)(binding).to.containDeep({
                key: 'globalInterceptors.logInterceptor',
                tagMap: {
                    [context_1.ContextTags.GLOBAL_INTERCEPTOR_GROUP]: 'log',
                    [context_1.ContextTags.GLOBAL_INTERCEPTOR_SOURCE]: ['route', 'proxy'],
                    [context_1.ContextTags.GLOBAL_INTERCEPTOR]: context_1.ContextTags.GLOBAL_INTERCEPTOR,
                },
            });
        });
        it('registers a provider class without decoration as global interceptor', () => {
            const binding = app.interceptor(LogInterceptorProviderWithoutDecoration, {
                global: true,
                group: 'log',
                source: ['route', 'proxy'],
                name: 'logInterceptor',
            });
            (0, testlab_1.expect)(binding).to.containDeep({
                key: 'globalInterceptors.logInterceptor',
                tagMap: {
                    [context_1.ContextTags.GLOBAL_INTERCEPTOR_GROUP]: 'log',
                    [context_1.ContextTags.GLOBAL_INTERCEPTOR_SOURCE]: ['route', 'proxy'],
                    [context_1.ContextTags.GLOBAL_INTERCEPTOR]: context_1.ContextTags.GLOBAL_INTERCEPTOR,
                },
            });
        });
        function logInterceptor(ctx, next) {
            return undefined;
        }
        let LogInterceptorProvider = class LogInterceptorProvider {
            value() {
                return logInterceptor;
            }
        };
        LogInterceptorProvider = tslib_1.__decorate([
            (0, context_1.injectable)((0, context_1.asGlobalInterceptor)())
        ], LogInterceptorProvider);
        class LogInterceptorProviderWithoutDecoration {
            value() {
                return logInterceptor;
            }
        }
    });
    function findKeysByTag(ctx, tag) {
        return ctx.findByTag(tag).map(binding => binding.key);
    }
    function givenApp() {
        app = new __1.Application();
    }
});
describe('Application constructor', () => {
    it('accepts config and parent context', () => {
        const ctx = new context_1.Context();
        const app = new __1.Application({ name: 'my-app' }, ctx);
        (0, testlab_1.expect)(app.parent).to.eql(ctx);
        (0, testlab_1.expect)(app.options).to.eql({ name: 'my-app' });
    });
    it('accepts parent context without config', () => {
        const ctx = new context_1.Context();
        const app = new __1.Application(ctx);
        (0, testlab_1.expect)(app.parent).to.eql(ctx);
    });
    it('uses application name as the context name', () => {
        const app = new __1.Application({ name: 'my-app' });
        (0, testlab_1.expect)(app.name).to.eql('my-app');
    });
    it('uses Application-<uuid> as the context name', () => {
        const app = new __1.Application();
        (0, testlab_1.expect)(app.name).to.match(/Application-/);
    });
});
class FakeServer extends context_1.Context {
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
class AnotherServer extends FakeServer {
}
//# sourceMappingURL=application.unit.js.map
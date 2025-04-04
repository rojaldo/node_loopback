"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
const binding_1 = require("../../binding");
describe('Interception proxy', () => {
    let ctx;
    beforeEach(givenContextAndEvents);
    it('invokes async interceptors on an async method', async () => {
        // Apply `log` to all methods on the class
        let MyController = class MyController {
            // Apply multiple interceptors. The order of `log` will be preserved as it
            // explicitly listed at method level
            async greet(name) {
                return `Hello, ${name}`;
            }
        };
        tslib_1.__decorate([
            (0, __1.intercept)(convertName, log),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [String]),
            tslib_1.__metadata("design:returntype", Promise)
        ], MyController.prototype, "greet", null);
        MyController = tslib_1.__decorate([
            (0, __1.intercept)(log)
        ], MyController);
        const proxy = (0, __1.createProxyWithInterceptors)(new MyController(), ctx);
        const msg = await proxy.greet('John');
        (0, testlab_1.expect)(msg).to.equal('Hello, JOHN');
        (0, testlab_1.expect)(events).to.eql([
            'convertName: before-greet',
            'log: before-greet',
            'log: after-greet',
            'convertName: after-greet',
        ]);
    });
    it('creates a proxy that converts sync method to be async', async () => {
        // Apply `log` to all methods on the class
        let MyController = class MyController {
            // Apply multiple interceptors. The order of `log` will be preserved as it
            // explicitly listed at method level
            greet(name) {
                return `Hello, ${name}`;
            }
        };
        tslib_1.__decorate([
            (0, __1.intercept)(convertName, log),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [String]),
            tslib_1.__metadata("design:returntype", void 0)
        ], MyController.prototype, "greet", null);
        MyController = tslib_1.__decorate([
            (0, __1.intercept)(log)
        ], MyController);
        const proxy = (0, __1.createProxyWithInterceptors)(new MyController(), ctx);
        const msg = await proxy.greet('John');
        (0, testlab_1.expect)(msg).to.equal('Hello, JOHN');
        (0, testlab_1.expect)(events).to.eql([
            'convertName: before-greet',
            'log: before-greet',
            'log: after-greet',
            'convertName: after-greet',
        ]);
        // Make sure `greet` always return Promise now
        (0, testlab_1.expect)(proxy.greet('Jane')).to.be.instanceOf(Promise);
    });
    it('creates async methods for the proxy', async () => {
        class MyController {
            greet(name) {
                return `Hello, ${name}`;
            }
            async hello(name) {
                return `Hello, ${name}`;
            }
        }
        const proxy = (0, __1.createProxyWithInterceptors)(new MyController(), ctx);
        const greeting = await proxy.greet('John');
        (0, testlab_1.expect)(greeting).to.eql('Hello, John');
        // Enforce compile time check to ensure the AsyncProxy typing works for TS
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const check = proxy;
    });
    it('invokes interceptors on a static method', async () => {
        // Apply `log` to all methods on the class
        let MyController = class MyController {
            // The class level `log` will be applied
            static greetStatic(name) {
                return `Hello, ${name}`;
            }
        };
        MyController = tslib_1.__decorate([
            (0, __1.intercept)(log)
        ], MyController);
        ctx.bind('name').to('John');
        const proxy = (0, __1.createProxyWithInterceptors)(MyController, ctx);
        const msg = await proxy.greetStatic('John');
        (0, testlab_1.expect)(msg).to.equal('Hello, John');
        (0, testlab_1.expect)(events).to.eql([
            'log: before-greetStatic',
            'log: after-greetStatic',
        ]);
    });
    it('accesses properties on the proxy', () => {
        class MyController {
            constructor(prefix) {
                this.prefix = prefix;
            }
            greet() {
                return `${this.prefix}: Hello`;
            }
        }
        const proxy = (0, __1.createProxyWithInterceptors)(new MyController('abc'), ctx);
        (0, testlab_1.expect)(proxy.prefix).to.eql('abc');
        proxy.prefix = 'xyz';
        (0, testlab_1.expect)(proxy.prefix).to.eql('xyz');
    });
    it('accesses static properties on the proxy', () => {
        class MyController {
        }
        MyController.count = 0;
        const proxyForClass = (0, __1.createProxyWithInterceptors)(MyController, ctx);
        (0, testlab_1.expect)(proxyForClass.count).to.eql(0);
        proxyForClass.count = 3;
        (0, testlab_1.expect)(proxyForClass.count).to.eql(3);
    });
    it('supports asProxyWithInterceptors resolution option', async () => {
        // Apply `log` to all methods on the class
        let MyController = class MyController {
            // Apply multiple interceptors. The order of `log` will be preserved as it
            // explicitly listed at method level
            async greet(name) {
                return `Hello, ${name}`;
            }
        };
        tslib_1.__decorate([
            (0, __1.intercept)(convertName, log),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [String]),
            tslib_1.__metadata("design:returntype", Promise)
        ], MyController.prototype, "greet", null);
        MyController = tslib_1.__decorate([
            (0, __1.intercept)(log)
        ], MyController);
        ctx.bind('my-controller').toClass(MyController);
        const proxy = await ctx.get('my-controller', {
            asProxyWithInterceptors: true,
        });
        const msg = await proxy.greet('John');
        (0, testlab_1.expect)(msg).to.equal('Hello, JOHN');
        (0, testlab_1.expect)(events).to.eql([
            'convertName: before-greet',
            'log: [my-controller] before-greet',
            'log: [my-controller] after-greet',
            'convertName: after-greet',
        ]);
    });
    it('supports asProxyWithInterceptors resolution option for singletons', async () => {
        // Apply `log` to all methods on the class
        let MyController = class MyController {
            // Apply multiple interceptors. The order of `log` will be preserved as it
            // explicitly listed at method level
            async greet(name) {
                return `Hello, ${name}`;
            }
        };
        tslib_1.__decorate([
            (0, __1.intercept)(convertName, log),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [String]),
            tslib_1.__metadata("design:returntype", Promise)
        ], MyController.prototype, "greet", null);
        MyController = tslib_1.__decorate([
            (0, __1.intercept)(log)
        ], MyController);
        ctx
            .bind('my-controller')
            .toClass(MyController)
            .inScope(binding_1.BindingScope.SINGLETON);
        // Proxy version
        let proxy = await ctx.get('my-controller', {
            asProxyWithInterceptors: true,
        });
        let msg = await proxy.greet('John');
        (0, testlab_1.expect)(msg).to.equal('Hello, JOHN');
        // Non proxy version
        const inst = await ctx.get('my-controller');
        msg = await inst.greet('John');
        (0, testlab_1.expect)(msg).to.equal('Hello, John');
        // Try the proxy again
        proxy = await ctx.get('my-controller', {
            asProxyWithInterceptors: true,
        });
        msg = await proxy.greet('John');
        (0, testlab_1.expect)(msg).to.equal('Hello, JOHN');
    });
    it('supports asProxyWithInterceptors resolution option for dynamic value', async () => {
        // Apply `log` to all methods on the class
        let MyController = class MyController {
            // Apply multiple interceptors. The order of `log` will be preserved as it
            // explicitly listed at method level
            async greet(name) {
                return `Hello, ${name}`;
            }
        };
        tslib_1.__decorate([
            (0, __1.intercept)(convertName, log),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [String]),
            tslib_1.__metadata("design:returntype", Promise)
        ], MyController.prototype, "greet", null);
        MyController = tslib_1.__decorate([
            (0, __1.intercept)(log)
        ], MyController);
        ctx.bind('my-controller').toDynamicValue(() => new MyController());
        const proxy = await ctx.get('my-controller', {
            asProxyWithInterceptors: true,
        });
        const msg = await proxy.greet('John');
        (0, testlab_1.expect)(msg).to.equal('Hello, JOHN');
        (0, testlab_1.expect)(events).to.eql([
            'convertName: before-greet',
            'log: [my-controller] before-greet',
            'log: [my-controller] after-greet',
            'convertName: after-greet',
        ]);
    });
    it('supports asProxyWithInterceptors resolution option for provider', async () => {
        // Apply `log` to all methods on the class
        let MyController = class MyController {
            // Apply multiple interceptors. The order of `log` will be preserved as it
            // explicitly listed at method level
            async greet(name) {
                return `Hello, ${name}`;
            }
        };
        tslib_1.__decorate([
            (0, __1.intercept)(convertName, log),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [String]),
            tslib_1.__metadata("design:returntype", Promise)
        ], MyController.prototype, "greet", null);
        MyController = tslib_1.__decorate([
            (0, __1.intercept)(log)
        ], MyController);
        class MyControllerProvider {
            value() {
                return new MyController();
            }
        }
        ctx.bind('my-controller').toProvider(MyControllerProvider);
        const proxy = await ctx.get('my-controller', {
            asProxyWithInterceptors: true,
        });
        const msg = await proxy.greet('John');
        (0, testlab_1.expect)(msg).to.equal('Hello, JOHN');
        (0, testlab_1.expect)(events).to.eql([
            'convertName: before-greet',
            'log: [my-controller] before-greet',
            'log: [my-controller] after-greet',
            'convertName: after-greet',
        ]);
    });
    it('allows asProxyWithInterceptors for non-object value', async () => {
        ctx.bind('my-value').toDynamicValue(() => 'my-value');
        const value = await ctx.get('my-value', {
            asProxyWithInterceptors: true,
        });
        (0, testlab_1.expect)(value).to.eql('my-value');
    });
    it('supports asProxyWithInterceptors resolution option for @inject', async () => {
        // Apply `log` to all methods on the class
        let MyController = class MyController {
            // Apply multiple interceptors. The order of `log` will be preserved as it
            // explicitly listed at method level
            async greet(name) {
                return `Hello, ${name}`;
            }
        };
        tslib_1.__decorate([
            (0, __1.intercept)(convertName, log),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [String]),
            tslib_1.__metadata("design:returntype", Promise)
        ], MyController.prototype, "greet", null);
        MyController = tslib_1.__decorate([
            (0, __1.intercept)(log)
        ], MyController);
        let DummyController = class DummyController {
            constructor(myController) {
                this.myController = myController;
            }
        };
        DummyController = tslib_1.__decorate([
            tslib_1.__param(0, (0, __1.inject)('my-controller', { asProxyWithInterceptors: true })),
            tslib_1.__metadata("design:paramtypes", [Object])
        ], DummyController);
        ctx.bind('my-controller').toClass(MyController);
        ctx.bind('dummy-controller').toClass(DummyController);
        const dummyController = await ctx.get('dummy-controller');
        const msg = await dummyController.myController.greet('John');
        (0, testlab_1.expect)(msg).to.equal('Hello, JOHN');
        (0, testlab_1.expect)(events).to.eql([
            'convertName: before-greet',
            'log: [dummy-controller --> my-controller] before-greet',
            'log: [dummy-controller --> my-controller] after-greet',
            'convertName: after-greet',
        ]);
    });
    let events;
    const log = async (invocationCtx, next) => {
        let source;
        if (invocationCtx.source instanceof __1.ResolutionSession) {
            source = `[${invocationCtx.source.getBindingPath()}] `;
        }
        else {
            source = invocationCtx.source ? `[${invocationCtx.source}] ` : '';
        }
        events.push(`log: ${source}before-${invocationCtx.methodName}`);
        const result = await next();
        events.push(`log: ${source}after-${invocationCtx.methodName}`);
        return result;
    };
    // An interceptor to convert the 1st arg to upper case
    const convertName = async (invocationCtx, next) => {
        events.push('convertName: before-' + invocationCtx.methodName);
        invocationCtx.args[0] = invocationCtx.args[0].toUpperCase();
        const result = await next();
        events.push('convertName: after-' + invocationCtx.methodName);
        return result;
    };
    function givenContextAndEvents() {
        ctx = new __1.Context();
        events = [];
    }
});
//# sourceMappingURL=interception-proxy.acceptance.js.map
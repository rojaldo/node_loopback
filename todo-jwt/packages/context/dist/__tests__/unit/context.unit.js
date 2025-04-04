"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testlab_1 = require("@loopback/testlab");
const util_1 = require("util");
const __1 = require("../..");
const unique_id_1 = require("../../unique-id");
/**
 * Create a subclass of context so that we can access parents and registry
 * for assertions
 */
class TestContext extends __1.Context {
    get observers() {
        return this.subscriptionManager.observers;
    }
    // Make parentEventListener public for testing purpose
    get parentEventListener() {
        return this.subscriptionManager.parentContextEventListener;
    }
    get parent() {
        return this._parent;
    }
    get debugInstance() {
        return this._debug;
    }
    get bindingMap() {
        const map = new Map(this.registry);
        return map;
    }
}
describe('Context constructor', () => {
    it('generates uuid name if not provided', () => {
        const ctx = new __1.Context();
        (0, testlab_1.expect)(ctx.name).to.match(new RegExp(`^${unique_id_1.UNIQUE_ID_PATTERN.source}$`));
    });
    it('adds subclass name as the prefix', () => {
        const ctx = new TestContext();
        (0, testlab_1.expect)(ctx.name).to.match(new RegExp(`^TestContext-${unique_id_1.UNIQUE_ID_PATTERN.source}$`, 'i'));
    });
    it('generates unique names for different instances', () => {
        const ctx1 = new __1.Context();
        const ctx2 = new __1.Context();
        (0, testlab_1.expect)(ctx1.name).to.not.eql(ctx2.name);
    });
    it('accepts a name', () => {
        const ctx = new __1.Context('my-context');
        (0, testlab_1.expect)(ctx.name).to.eql('my-context');
    });
    it('accepts a parent context', () => {
        const c1 = new __1.Context('c1');
        const ctx = new TestContext(c1);
        (0, testlab_1.expect)(ctx.parent).to.eql(c1);
    });
    it('accepts a parent context and a name', () => {
        const c1 = new __1.Context('c1');
        const ctx = new TestContext(c1, 'c2');
        (0, testlab_1.expect)(ctx.name).to.eql('c2');
        (0, testlab_1.expect)(ctx.parent).to.eql(c1);
    });
});
describe('Context', () => {
    let ctx;
    beforeEach('given a context', createContext);
    describe('bind', () => {
        it('adds a binding into the registry', () => {
            ctx.bind('foo');
            const result = ctx.contains('foo');
            (0, testlab_1.expect)(result).to.be.true();
        });
        it('returns a binding', () => {
            const binding = ctx.bind('foo');
            (0, testlab_1.expect)(binding).to.be.instanceOf(__1.Binding);
        });
        it('rejects a key containing property separator', () => {
            const key = 'a' + __1.BindingKey.PROPERTY_SEPARATOR + 'b';
            (0, testlab_1.expect)(() => ctx.bind(key)).to.throw(/Binding key .* cannot contain/);
        });
        it('rejects rebinding of a locked key', () => {
            ctx.bind('foo').lock();
            (0, testlab_1.expect)(() => ctx.bind('foo')).to.throw('Cannot rebind key "foo" to a locked binding');
        });
    });
    describe('add', () => {
        it('accepts a binding', () => {
            const binding = new __1.Binding('foo').to('bar');
            ctx.add(binding);
            (0, testlab_1.expect)(ctx.getBinding(binding.key)).to.be.exactly(binding);
            const result = ctx.contains('foo');
            (0, testlab_1.expect)(result).to.be.true();
        });
        it('rejects rebinding of a locked key', () => {
            ctx.bind('foo').lock();
            (0, testlab_1.expect)(() => ctx.add(new __1.Binding('foo'))).to.throw('Cannot rebind key "foo" to a locked binding');
        });
    });
    describe('contains', () => {
        it('returns true when the key is the registry', () => {
            ctx.bind('foo');
            const result = ctx.contains('foo');
            (0, testlab_1.expect)(result).to.be.true();
        });
        it('returns false when the key is not in the registry', () => {
            const result = ctx.contains('bar');
            (0, testlab_1.expect)(result).to.be.false();
        });
        it('returns false when the key is only in the parent context', () => {
            ctx.bind('foo');
            const childCtx = new __1.Context(ctx);
            const result = childCtx.contains('foo');
            (0, testlab_1.expect)(result).to.be.false();
        });
    });
    describe('isBound', () => {
        it('returns true when the key is bound in the context', () => {
            ctx.bind('foo');
            const result = ctx.isBound('foo');
            (0, testlab_1.expect)(result).to.be.true();
        });
        it('returns false when the key is not bound in the context', () => {
            const result = ctx.isBound('bar');
            (0, testlab_1.expect)(result).to.be.false();
        });
        it('returns true when the key is bound in the context hierarchy', () => {
            ctx.bind('foo');
            const childCtx = new __1.Context(ctx);
            const result = childCtx.isBound('foo');
            (0, testlab_1.expect)(result).to.be.true();
        });
        it('returns false when the key is not bound in the context hierarchy', () => {
            ctx.bind('foo');
            const childCtx = new __1.Context(ctx);
            const result = childCtx.isBound('bar');
            (0, testlab_1.expect)(result).to.be.false();
        });
    });
    describe('unbind', () => {
        it('removes a binding', () => {
            ctx.bind('foo');
            const result = ctx.unbind('foo');
            (0, testlab_1.expect)(result).to.be.true();
            (0, testlab_1.expect)(ctx.contains('foo')).to.be.false();
        });
        it('returns false if the binding key does not exist', () => {
            ctx.bind('foo');
            const result = ctx.unbind('bar');
            (0, testlab_1.expect)(result).to.be.false();
        });
        it('cannot unbind a locked binding', () => {
            ctx.bind('foo').to('a').lock();
            (0, testlab_1.expect)(() => ctx.unbind('foo')).to.throw(`Cannot unbind key "foo" of a locked binding`);
        });
        it('does not remove a binding from parent contexts', () => {
            ctx.bind('foo');
            const childCtx = new __1.Context(ctx);
            const result = childCtx.unbind('foo');
            (0, testlab_1.expect)(result).to.be.false();
            (0, testlab_1.expect)(ctx.contains('foo')).to.be.true();
        });
    });
    describe('find', () => {
        it('returns matching binding', () => {
            const b1 = ctx.bind('foo');
            ctx.bind('bar');
            const result = ctx.find('foo');
            (0, testlab_1.expect)(result).to.be.eql([b1]);
        });
        it('returns matching binding with *', () => {
            const b1 = ctx.bind('foo');
            const b2 = ctx.bind('bar');
            const b3 = ctx.bind('baz');
            let result = ctx.find('*');
            (0, testlab_1.expect)(result).to.be.eql([b1, b2, b3]);
            result = ctx.find('ba*');
            (0, testlab_1.expect)(result).to.be.eql([b2, b3]);
        });
        it('returns matching binding with * respecting key separators', () => {
            const b1 = ctx.bind('foo');
            const b2 = ctx.bind('foo.bar');
            const b3 = ctx.bind('foo:bar');
            let result = ctx.find('*');
            (0, testlab_1.expect)(result).to.be.eql([b1]);
            result = ctx.find('*.*');
            (0, testlab_1.expect)(result).to.be.eql([b2]);
            result = ctx.find('*:ba*');
            (0, testlab_1.expect)(result).to.be.eql([b3]);
        });
        it('returns matching binding with ? respecting separators', () => {
            const b1 = ctx.bind('foo');
            const b2 = ctx.bind('foo.bar');
            const b3 = ctx.bind('foo:bar');
            let result = ctx.find('???');
            (0, testlab_1.expect)(result).to.be.eql([b1]);
            result = ctx.find('???.???');
            (0, testlab_1.expect)(result).to.be.eql([b2]);
            result = ctx.find('???:???');
            (0, testlab_1.expect)(result).to.be.eql([b3]);
            result = ctx.find('?');
            (0, testlab_1.expect)(result).to.be.eql([]);
            result = ctx.find('???????');
            (0, testlab_1.expect)(result).to.be.eql([]);
        });
        it('escapes reserved chars for regexp', () => {
            ctx.bind('foo');
            const b2 = ctx.bind('foo+bar');
            const b3 = ctx.bind('foo|baz');
            let result = ctx.find('fo+');
            (0, testlab_1.expect)(result).to.be.eql([]);
            result = ctx.find('foo+bar');
            (0, testlab_1.expect)(result).to.be.eql([b2]);
            result = ctx.find('foo|baz');
            (0, testlab_1.expect)(result).to.be.eql([b3]);
        });
        it('returns matching binding with regexp', () => {
            const b1 = ctx.bind('foo');
            const b2 = ctx.bind('bar');
            const b3 = ctx.bind('baz');
            let result = ctx.find(/\w+/);
            (0, testlab_1.expect)(result).to.be.eql([b1, b2, b3]);
            result = ctx.find(/ba/);
            (0, testlab_1.expect)(result).to.be.eql([b2, b3]);
        });
        it('returns matching binding with filter', () => {
            const b1 = ctx.bind('foo').inScope(__1.BindingScope.SINGLETON);
            const b2 = ctx.bind('bar').tag('b');
            const b3 = ctx.bind('baz').tag('b');
            let result = ctx.find(() => true);
            (0, testlab_1.expect)(result).to.be.eql([b1, b2, b3]);
            result = ctx.find(() => false);
            (0, testlab_1.expect)(result).to.be.eql([]);
            result = ctx.find(binding => binding.key.startsWith('ba'));
            (0, testlab_1.expect)(result).to.be.eql([b2, b3]);
            result = ctx.find(binding => binding.scope === __1.BindingScope.SINGLETON);
            (0, testlab_1.expect)(result).to.be.eql([b1]);
            result = ctx.find(binding => binding.tagNames.includes('b'));
            (0, testlab_1.expect)(result).to.be.eql([b2, b3]);
        });
    });
    describe('findByTag with name pattern', () => {
        it('returns matching binding', () => {
            const b1 = ctx.bind('controllers.ProductController').tag('controller');
            ctx.bind('repositories.ProductRepository').tag('repository');
            const result = ctx.findByTag('controller');
            (0, testlab_1.expect)(result).to.be.eql([b1]);
        });
        it('returns matching binding with *', () => {
            const b1 = ctx.bind('controllers.ProductController').tag('controller');
            const b2 = ctx.bind('controllers.OrderController').tag('controller');
            const result = ctx.findByTag('c*');
            (0, testlab_1.expect)(result).to.be.eql([b1, b2]);
        });
        it('returns matching binding with regexp', () => {
            const b1 = ctx.bind('controllers.ProductController').tag('controller');
            const b2 = ctx
                .bind('controllers.OrderController')
                .tag('controller', 'rest');
            let result = ctx.findByTag(/controller/);
            (0, testlab_1.expect)(result).to.be.eql([b1, b2]);
            result = ctx.findByTag(/rest/);
            (0, testlab_1.expect)(result).to.be.eql([b2]);
        });
    });
    describe('findByTag with name/value filter', () => {
        it('returns matching binding', () => {
            const b1 = ctx
                .bind('controllers.ProductController')
                .tag({ name: 'my-controller' });
            ctx.bind('controllers.OrderController').tag('controller');
            ctx.bind('dataSources.mysql').tag({ dbType: 'mysql' });
            const result = ctx.findByTag({ name: 'my-controller' });
            (0, testlab_1.expect)(result).to.be.eql([b1]);
        });
        it('returns matching binding for multiple tags', () => {
            const b1 = ctx
                .bind('controllers.ProductController')
                .tag({ name: 'my-controller' })
                .tag('controller');
            ctx.bind('controllers.OrderController').tag('controller');
            ctx.bind('dataSources.mysql').tag({ dbType: 'mysql' });
            const result = ctx.findByTag({
                name: 'my-controller',
                controller: 'controller',
            });
            (0, testlab_1.expect)(result).to.be.eql([b1]);
        });
        it('returns empty array if one of the tags does not match', () => {
            ctx
                .bind('controllers.ProductController')
                .tag({ name: 'my-controller' })
                .tag('controller');
            ctx.bind('controllers.OrderController').tag('controller');
            ctx.bind('dataSources.mysql').tag({ dbType: 'mysql' });
            const result = ctx.findByTag({
                controller: 'controller',
                name: 'your-controller',
            });
            (0, testlab_1.expect)(result).to.be.eql([]);
        });
        it('returns empty array if no matching tag value is found', () => {
            ctx.bind('controllers.ProductController').tag({ name: 'my-controller' });
            ctx.bind('controllers.OrderController').tag('controller');
            ctx.bind('dataSources.mysql').tag({ dbType: 'mysql' });
            const result = ctx.findByTag({ name: 'your-controller' });
            (0, testlab_1.expect)(result).to.be.eql([]);
        });
    });
    describe('getBinding', () => {
        it('returns the binding object registered under the given key', () => {
            const expected = ctx.bind('foo');
            const actual = ctx.getBinding('foo');
            (0, testlab_1.expect)(actual).to.equal(expected);
        });
        it('reports an error when binding is not found', () => {
            (0, testlab_1.expect)(() => ctx.getBinding('unknown-key')).to.throw(/unknown-key/);
        });
        it('returns undefined if an optional binding is not found', () => {
            const actual = ctx.getBinding('unknown-key', { optional: true });
            (0, testlab_1.expect)(actual).to.be.undefined();
        });
        it('rejects a key containing property separator', () => {
            const key = 'a' + __1.BindingKey.PROPERTY_SEPARATOR + 'b';
            (0, testlab_1.expect)(() => ctx.getBinding(key)).to.throw(/Binding key .* cannot contain/);
        });
    });
    describe('findOrCreateBinding', () => {
        context('with BindingCreationPolicy.ALWAYS_CREATE', () => {
            it('creates a new binding even the key is bound', () => {
                const current = ctx.bind('foo');
                const actual = ctx.findOrCreateBinding('foo', __1.BindingCreationPolicy.ALWAYS_CREATE);
                (0, testlab_1.expect)(actual).to.be.not.exactly(current);
            });
            it('creates a new binding if not bound', () => {
                const binding = ctx.findOrCreateBinding('a-new-key', __1.BindingCreationPolicy.ALWAYS_CREATE);
                (0, testlab_1.expect)(binding.key).to.eql('a-new-key');
            });
        });
        context('with BindingCreationPolicy.NEVER_CREATE', () => {
            it('returns the exiting binding if the key is bound', () => {
                const current = ctx.bind('foo');
                const actual = ctx.findOrCreateBinding('foo', __1.BindingCreationPolicy.NEVER_CREATE);
                (0, testlab_1.expect)(actual).to.be.exactly(current);
            });
            it('throws an error if the key is not bound', () => {
                (0, testlab_1.expect)(() => ctx.findOrCreateBinding('a-new-key', __1.BindingCreationPolicy.NEVER_CREATE)).to.throw(/The key 'a-new-key' is not bound to any value in context/);
            });
        });
        context('with BindingCreationPolicy.CREATE_IF_NOT_BOUND', () => {
            it('returns the binding object registered under the given key', () => {
                const expected = ctx.bind('foo');
                const actual = ctx.findOrCreateBinding('foo', __1.BindingCreationPolicy.CREATE_IF_NOT_BOUND);
                (0, testlab_1.expect)(actual).to.be.exactly(expected);
            });
            it('creates a new binding if the key is not bound', () => {
                const binding = ctx.findOrCreateBinding('a-new-key', __1.BindingCreationPolicy.CREATE_IF_NOT_BOUND);
                (0, testlab_1.expect)(binding.key).to.eql('a-new-key');
            });
        });
        context('without bindingCreationPolicy (default: CREATE_IF_NOT_BOUND)', () => {
            it('returns the binding object registered under the given key', () => {
                const expected = ctx.bind('foo');
                const actual = ctx.findOrCreateBinding('foo');
                (0, testlab_1.expect)(actual).to.be.exactly(expected);
            });
            it('creates a new binding if the key is not bound', () => {
                const binding = ctx.findOrCreateBinding('a-new-key');
                (0, testlab_1.expect)(binding.key).to.eql('a-new-key');
            });
        });
        it('rejects a key containing property separator', () => {
            const key = 'a' + __1.BindingKey.PROPERTY_SEPARATOR + 'b';
            (0, testlab_1.expect)(() => ctx.findOrCreateBinding(key)).to.throw(/Binding key .* cannot contain/);
        });
    });
    describe('getSync', () => {
        it('returns the value immediately when the binding is sync', () => {
            ctx.bind('foo').to('bar');
            const result = ctx.getSync('foo');
            (0, testlab_1.expect)(result).to.equal('bar');
        });
        it('returns undefined if an optional binding is not found', () => {
            (0, testlab_1.expect)(ctx.getSync('unknown-key', { optional: true })).to.be.undefined();
        });
        it('returns the value with property separator', () => {
            const SEP = __1.BindingKey.PROPERTY_SEPARATOR;
            const val = { x: { y: 'Y' } };
            ctx.bind('foo').to(val);
            const value = ctx.getSync(`foo${SEP}x`);
            (0, testlab_1.expect)(value).to.eql({ y: 'Y' });
        });
        it('throws a helpful error when the binding is async', () => {
            ctx.bind('foo').toDynamicValue(() => Promise.resolve('bar'));
            (0, testlab_1.expect)(() => ctx.getSync('foo')).to.throw(/foo.*the value is a promise/);
        });
        it('returns singleton value', () => {
            let count = 0;
            ctx
                .bind('foo')
                .toDynamicValue(() => count++)
                .inScope(__1.BindingScope.SINGLETON);
            expectFooValue(ctx, 0);
            const childCtx = new __1.Context(ctx);
            expectFooValue(childCtx, 0);
            expectFooValue(ctx, 0);
        });
        it('returns singleton value triggered by the child context', () => {
            let count = 0;
            ctx
                .bind('foo')
                .toDynamicValue(() => count++)
                .inScope(__1.BindingScope.SINGLETON);
            const childCtx = new __1.Context(ctx);
            // Calculate the singleton value at child level 1st
            expectFooValue(childCtx, 0);
            // Try twice from the parent ctx
            expectFooValue(ctx, 0);
            expectFooValue(ctx, 0);
            // Try again from the child ctx
            expectFooValue(childCtx, 0);
        });
        it('refreshes singleton-scoped binding', () => {
            let count = 0;
            const binding = ctx
                .bind('foo')
                .toDynamicValue(() => count++)
                .inScope(__1.BindingScope.SINGLETON);
            const childCtx = new __1.Context(ctx);
            // Calculate the singleton value at child level 1st
            expectFooValue(childCtx, 0);
            // Try from the parent ctx
            expectFooValue(ctx, 0);
            // Now refresh the binding
            binding.refresh(childCtx);
            // A new value is produced
            expectFooValue(childCtx, 1);
            // Try from the parent ctx
            // The value stays the same as it's cached by the 1st call
            expectFooValue(ctx, 1);
        });
        it('returns transient value', () => {
            let count = 0;
            ctx
                .bind('foo')
                .toDynamicValue(() => count++)
                .inScope(__1.BindingScope.TRANSIENT);
            expectFooValue(ctx, 0);
            expectFooValue(ctx, 1);
            const childCtx = new __1.Context(ctx);
            expectFooValue(childCtx, 2);
        });
        it('returns context value', () => {
            let count = 0;
            ctx
                .bind('foo')
                .toDynamicValue(() => count++)
                .inScope(__1.BindingScope.CONTEXT);
            expectFooValue(ctx, 0);
            // It's now cached
            expectFooValue(ctx, 0);
        });
        it('returns context value from a child context', () => {
            let count = 0;
            ctx
                .bind('foo')
                .toDynamicValue(() => count++)
                .inScope(__1.BindingScope.CONTEXT);
            expectFooValue(ctx, 0);
            const childCtx = new __1.Context(ctx);
            expectFooValue(childCtx, 1);
            expectFooValue(childCtx, 1);
            const childCtx2 = new __1.Context(ctx);
            expectFooValue(childCtx2, 2);
            expectFooValue(childCtx, 1);
        });
        it('refreshes context-scoped binding', () => {
            let count = 0;
            const binding = ctx
                .bind('foo')
                .toDynamicValue(() => count++)
                .inScope(__1.BindingScope.CONTEXT);
            expectFooValue(ctx, 0);
            const childCtx = new __1.Context(ctx);
            // New value for the childCtx
            expectFooValue(childCtx, 1);
            // Now it's cached
            expectFooValue(childCtx, 1);
            // Refresh the binding for childCtx
            binding.refresh(childCtx);
            expectFooValue(childCtx, 2);
            // Parent value is not touched
            expectFooValue(ctx, 0);
        });
        function expectFooValue(context, val) {
            (0, testlab_1.expect)(context.getSync('foo')).to.equal(val);
        }
    });
    describe('getOwnerContext', () => {
        it('returns owner context', () => {
            ctx.bind('foo').to('bar');
            (0, testlab_1.expect)(ctx.getOwnerContext('foo')).to.equal(ctx);
        });
        it('returns owner context by binding', () => {
            const binding = ctx.bind('foo').to('bar');
            (0, testlab_1.expect)(ctx.getOwnerContext(binding)).to.equal(ctx);
        });
        it('returns undefined if the contained binding is not the same', () => {
            ctx.bind('foo').to('bar');
            // An orphan binding with the same key
            const binding = __1.Binding.bind('foo');
            (0, testlab_1.expect)(ctx.getOwnerContext(binding)).to.be.undefined();
        });
        it('returns owner context with parent', () => {
            ctx.bind('foo').to('bar');
            const childCtx = new __1.Context(ctx, 'child');
            childCtx.bind('xyz').to('abc');
            (0, testlab_1.expect)(childCtx.getOwnerContext('foo')).to.equal(ctx);
            (0, testlab_1.expect)(childCtx.getOwnerContext('xyz')).to.equal(childCtx);
        });
    });
    describe('getScopedContext', () => {
        it('returns scoped context', () => {
            ctx.scope = __1.BindingScope.APPLICATION;
            (0, testlab_1.expect)(ctx.getScopedContext(__1.BindingScope.APPLICATION)).to.equal(ctx);
            (0, testlab_1.expect)(ctx.getScopedContext(__1.BindingScope.SERVER)).to.be.undefined();
        });
        it('returns scoped context with parent', () => {
            ctx.scope = __1.BindingScope.APPLICATION;
            const childCtx = new __1.Context(ctx, 'child');
            childCtx.scope = __1.BindingScope.SERVER;
            (0, testlab_1.expect)(childCtx.getScopedContext(__1.BindingScope.APPLICATION)).to.equal(ctx);
            (0, testlab_1.expect)(childCtx.getScopedContext(__1.BindingScope.SERVER)).to.equal(childCtx);
            (0, testlab_1.expect)(childCtx.getScopedContext(__1.BindingScope.REQUEST)).to.be.undefined();
        });
    });
    describe('getResolutionContext', () => {
        let app;
        let server;
        let request;
        let bindingInApp;
        let bindingInServer;
        let bindingInRequest;
        beforeEach(setupContextChain);
        it('returns resolution context for singleton bindings', () => {
            setupBindings(__1.BindingScope.SINGLETON);
            (0, testlab_1.expect)(request.getResolutionContext(bindingInRequest)).to.equal(request);
            (0, testlab_1.expect)(request.getResolutionContext(bindingInServer)).to.equal(server);
            (0, testlab_1.expect)(request.getResolutionContext(bindingInApp)).to.equal(app);
        });
        it('returns resolution context for context bindings', () => {
            setupBindings(__1.BindingScope.CONTEXT);
            (0, testlab_1.expect)(request.getResolutionContext(bindingInRequest)).to.equal(request);
            (0, testlab_1.expect)(request.getResolutionContext(bindingInServer)).to.equal(request);
            (0, testlab_1.expect)(request.getResolutionContext(bindingInApp)).to.equal(request);
            (0, testlab_1.expect)(server.getResolutionContext(bindingInApp)).to.equal(server);
            (0, testlab_1.expect)(app.getResolutionContext(bindingInApp)).to.equal(app);
        });
        it('returns resolution context for transient bindings', () => {
            setupBindings(__1.BindingScope.TRANSIENT);
            (0, testlab_1.expect)(request.getResolutionContext(bindingInRequest)).to.equal(request);
            (0, testlab_1.expect)(request.getResolutionContext(bindingInServer)).to.equal(request);
            (0, testlab_1.expect)(request.getResolutionContext(bindingInApp)).to.equal(request);
            (0, testlab_1.expect)(server.getResolutionContext(bindingInApp)).to.equal(server);
            (0, testlab_1.expect)(app.getResolutionContext(bindingInApp)).to.equal(app);
        });
        it('returns resolution context for application bindings', () => {
            setupBindings(__1.BindingScope.APPLICATION);
            (0, testlab_1.expect)(request.getResolutionContext(bindingInRequest)).to.equal(app);
            (0, testlab_1.expect)(request.getResolutionContext(bindingInServer)).to.equal(app);
            (0, testlab_1.expect)(request.getResolutionContext(bindingInApp)).to.equal(app);
        });
        it('returns resolution context for server bindings', () => {
            setupBindings(__1.BindingScope.SERVER);
            (0, testlab_1.expect)(request.getResolutionContext(bindingInRequest)).to.equal(server);
            (0, testlab_1.expect)(request.getResolutionContext(bindingInServer)).to.equal(server);
            (0, testlab_1.expect)(request.getResolutionContext(bindingInApp)).to.equal(server);
            (0, testlab_1.expect)(server.getResolutionContext(bindingInApp)).to.equal(server);
            (0, testlab_1.expect)(server.getResolutionContext(bindingInServer)).to.equal(server);
            (0, testlab_1.expect)(app.getResolutionContext(bindingInApp)).to.be.undefined();
        });
        it('returns resolution context for request bindings', () => {
            setupBindings(__1.BindingScope.REQUEST);
            (0, testlab_1.expect)(request.getResolutionContext(bindingInRequest)).to.equal(request);
            (0, testlab_1.expect)(request.getResolutionContext(bindingInServer)).to.equal(request);
            (0, testlab_1.expect)(request.getResolutionContext(bindingInApp)).to.equal(request);
            // Fall back to the current context if no `request` scope exists in the
            // chain
            (0, testlab_1.expect)(server.getResolutionContext(bindingInServer)).to.equal(server);
            (0, testlab_1.expect)(server.getResolutionContext(bindingInApp)).to.equal(server);
        });
        it('checks visibility', () => {
            (0, testlab_1.expect)(app.isVisibleTo(app)).to.be.true();
            (0, testlab_1.expect)(app.isVisibleTo(server)).to.be.true();
            (0, testlab_1.expect)(app.isVisibleTo(request)).to.be.true();
            (0, testlab_1.expect)(request.isVisibleTo(server)).to.be.false();
            (0, testlab_1.expect)(request.isVisibleTo(app)).to.be.false();
            (0, testlab_1.expect)(app.isVisibleTo(new __1.Context())).to.be.false();
            (0, testlab_1.expect)(new __1.Context().isVisibleTo(app)).to.be.false();
        });
        function setupContextChain() {
            app = ctx;
            app.scope = __1.BindingScope.APPLICATION;
            server = new __1.Context(app, 'server');
            server.scope = __1.BindingScope.SERVER;
            request = new __1.Context(server, 'request');
            request.scope = __1.BindingScope.REQUEST;
        }
        function setupBindings(scope) {
            bindingInApp = app.bind(`app.foo.${scope}`).to('app.bar').inScope(scope);
            bindingInServer = server
                .bind(`server.foo.${scope}`)
                .to('server.bar')
                .inScope(scope);
            bindingInRequest = request
                .bind(`request.foo.${scope}`)
                .to('request.bar')
                .inScope(scope);
        }
    });
    describe('get', () => {
        it('returns a promise when the binding is async', async () => {
            ctx.bind('foo').toDynamicValue(() => Promise.resolve('bar'));
            const result = await ctx.get('foo');
            (0, testlab_1.expect)(result).to.equal('bar');
        });
        it('returns undefined if an optional binding is not found', async () => {
            (0, testlab_1.expect)(await ctx.get('unknown-key', { optional: true })).to.be.undefined();
        });
        it('returns the value with property separator', async () => {
            const SEP = __1.BindingKey.PROPERTY_SEPARATOR;
            const val = { x: { y: 'Y' } };
            ctx.bind('foo').toDynamicValue(() => Promise.resolve(val));
            const value = await ctx.get(`foo${SEP}x`);
            (0, testlab_1.expect)(value).to.eql({ y: 'Y' });
        });
        it('returns singleton value', async () => {
            let count = 0;
            ctx
                .bind('foo')
                .toDynamicValue(() => Promise.resolve(count++))
                .inScope(__1.BindingScope.SINGLETON);
            let result = await ctx.get('foo');
            (0, testlab_1.expect)(result).to.equal(0);
            result = await ctx.get('foo');
            (0, testlab_1.expect)(result).to.equal(0);
            const childCtx = new __1.Context(ctx);
            result = await childCtx.get('foo');
            (0, testlab_1.expect)(result).to.equal(0);
        });
        it('returns context value', async () => {
            let count = 0;
            ctx
                .bind('foo')
                .toDynamicValue(() => Promise.resolve(count++))
                .inScope(__1.BindingScope.CONTEXT);
            let result = await ctx.get('foo');
            (0, testlab_1.expect)(result).to.equal(0);
            result = await ctx.get('foo');
            (0, testlab_1.expect)(result).to.equal(0);
        });
        it('returns context value from a child context', async () => {
            let count = 0;
            ctx
                .bind('foo')
                .toDynamicValue(() => Promise.resolve(count++))
                .inScope(__1.BindingScope.CONTEXT);
            let result = await ctx.get('foo');
            const childCtx = new __1.Context(ctx);
            (0, testlab_1.expect)(result).to.equal(0);
            result = await childCtx.get('foo');
            (0, testlab_1.expect)(result).to.equal(1);
            result = await childCtx.get('foo');
            (0, testlab_1.expect)(result).to.equal(1);
            const childCtx2 = new __1.Context(ctx);
            result = await childCtx2.get('foo');
            (0, testlab_1.expect)(result).to.equal(2);
            result = await childCtx.get('foo');
            (0, testlab_1.expect)(result).to.equal(1);
        });
        it('returns transient value', async () => {
            let count = 0;
            ctx
                .bind('foo')
                .toDynamicValue(() => Promise.resolve(count++))
                .inScope(__1.BindingScope.TRANSIENT);
            let result = await ctx.get('foo');
            (0, testlab_1.expect)(result).to.equal(0);
            result = await ctx.get('foo');
            (0, testlab_1.expect)(result).to.equal(1);
            const childCtx = new __1.Context(ctx);
            result = await childCtx.get('foo');
            (0, testlab_1.expect)(result).to.equal(2);
        });
        describe('application/server/request scopes', () => {
            let app;
            let server;
            let request;
            let bindingInApp;
            let bindingInServer;
            let bindingInRequest;
            beforeEach(setupContextChain);
            it('returns value for application bindings', async () => {
                setupBindings(__1.BindingScope.APPLICATION);
                let value = await request.get(bindingInRequest.key, { optional: true });
                (0, testlab_1.expect)(value).to.be.undefined();
                value = await request.get(bindingInServer.key, { optional: true });
                (0, testlab_1.expect)(value).to.be.undefined();
                value = await request.get(bindingInApp.key, { optional: true });
                (0, testlab_1.expect)(value).to.eql('app.bar');
                await (0, testlab_1.expect)(request.get(bindingInRequest.key)).to.be.rejectedWith('Resolution context "app" does not have visibility to binding ' +
                    '"request.foo.Application (scope:Application)" in context "request"');
            });
            it('returns value for server bindings', async () => {
                setupBindings(__1.BindingScope.SERVER);
                let value = await request.get(bindingInRequest.key, { optional: true });
                (0, testlab_1.expect)(value).to.be.undefined();
                value = await request.get(bindingInServer.key, { optional: true });
                (0, testlab_1.expect)(value).to.eql('server.bar');
                value = await request.get(bindingInApp.key, { optional: true });
                (0, testlab_1.expect)(value).to.eql('app.bar');
                await (0, testlab_1.expect)(request.get(bindingInRequest.key)).to.be.rejectedWith('Resolution context "server" does not have visibility to binding ' +
                    '"request.foo.Server (scope:Server)" in context "request"');
            });
            it('returns value for request bindings', async () => {
                setupBindings(__1.BindingScope.REQUEST);
                let value = await request.get(bindingInRequest.key, { optional: true });
                (0, testlab_1.expect)(value).to.eql('request.bar');
                value = await request.get(bindingInServer.key, { optional: true });
                (0, testlab_1.expect)(value).to.eql('server.bar');
                value = await request.get(bindingInApp.key, { optional: true });
                (0, testlab_1.expect)(value).to.eql('app.bar');
            });
            function setupContextChain() {
                app = ctx;
                app.scope = __1.BindingScope.APPLICATION;
                server = new __1.Context(app, 'server');
                server.scope = __1.BindingScope.SERVER;
                request = new __1.Context(server, 'request');
                request.scope = __1.BindingScope.REQUEST;
            }
            function setupBindings(scope) {
                bindingInApp = app
                    .bind(`app.foo.${scope}`)
                    .to('app.bar')
                    .inScope(scope);
                bindingInServer = server
                    .bind(`server.foo.${scope}`)
                    .to('server.bar')
                    .inScope(scope);
                bindingInRequest = request
                    .bind(`request.foo.${scope}`)
                    .to('request.bar')
                    .inScope(scope);
            }
        });
    });
    describe('getValueOrPromise', () => {
        it('returns synchronously for constant values', () => {
            ctx.bind('key').to('value');
            const valueOrPromise = ctx.getValueOrPromise('key');
            (0, testlab_1.expect)(valueOrPromise).to.equal('value');
        });
        it('returns undefined if an optional binding is not found', () => {
            (0, testlab_1.expect)(ctx.getValueOrPromise('unknown-key', { optional: true })).to.be.undefined();
        });
        it('returns promise for async values', async () => {
            ctx.bind('key').toDynamicValue(() => Promise.resolve('value'));
            const valueOrPromise = ctx.getValueOrPromise('key');
            (0, testlab_1.expect)((0, __1.isPromiseLike)(valueOrPromise)).to.be.true();
            const value = await valueOrPromise;
            (0, testlab_1.expect)(value).to.equal('value');
        });
        it('returns nested property (synchronously)', () => {
            ctx.bind('key').to({ test: 'test-value' });
            const value = ctx.getValueOrPromise('key#test');
            (0, testlab_1.expect)(value).to.equal('test-value');
        });
        it('returns nested property (asynchronously)', async () => {
            ctx
                .bind('key')
                .toDynamicValue(() => Promise.resolve({ test: 'test-value' }));
            const valueOrPromise = ctx.getValueOrPromise('key#test');
            (0, testlab_1.expect)((0, __1.isPromiseLike)(valueOrPromise)).to.be.true();
            const value = await valueOrPromise;
            (0, testlab_1.expect)(value).to.equal('test-value');
        });
        it('supports deeply nested property path', () => {
            ctx.bind('key').to({ x: { y: 'z' } });
            const value = ctx.getValueOrPromise('key#x.y');
            (0, testlab_1.expect)(value).to.equal('z');
        });
        it('returns undefined when nested property does not exist', () => {
            ctx.bind('key').to({ test: 'test-value' });
            const value = ctx.getValueOrPromise('key#x.y');
            (0, testlab_1.expect)(value).to.equal(undefined);
        });
        it('honours TRANSIENT scope when retrieving a nested property', () => {
            const state = { count: 0 };
            ctx
                .bind('state')
                .toDynamicValue(() => {
                state.count++;
                return state;
            })
                .inScope(__1.BindingScope.TRANSIENT);
            // verify the initial state & populate the cache
            (0, testlab_1.expect)(ctx.getSync('state')).to.deepEqual({ count: 1 });
            // retrieve a nested property (expect a new value)
            (0, testlab_1.expect)(ctx.getSync('state#count')).to.equal(2);
            // retrieve the full object again (expect another new value)
            (0, testlab_1.expect)(ctx.getSync('state')).to.deepEqual({ count: 3 });
        });
        it('honours CONTEXT scope when retrieving a nested property', () => {
            const state = { count: 0 };
            ctx
                .bind('state')
                .toDynamicValue(() => {
                state.count++;
                return state;
            })
                .inScope(__1.BindingScope.CONTEXT);
            // verify the initial state & populate the cache
            (0, testlab_1.expect)(ctx.getSync('state')).to.deepEqual({ count: 1 });
            // retrieve a nested property (expect the cached value)
            (0, testlab_1.expect)(ctx.getSync('state#count')).to.equal(1);
            // retrieve the full object again (verify that cache was not modified)
            (0, testlab_1.expect)(ctx.getSync('state')).to.deepEqual({ count: 1 });
        });
        it('honours SINGLETON scope when retrieving a nested property', () => {
            const state = { count: 0 };
            ctx
                .bind('state')
                .toDynamicValue(() => {
                state.count++;
                return state;
            })
                .inScope(__1.BindingScope.SINGLETON);
            // verify the initial state & populate the cache
            (0, testlab_1.expect)(ctx.getSync('state')).to.deepEqual({ count: 1 });
            // retrieve a nested property from a child context
            const childContext1 = new __1.Context(ctx);
            (0, testlab_1.expect)(childContext1.getValueOrPromise('state#count')).to.equal(1);
            // retrieve a nested property from another child context
            const childContext2 = new __1.Context(ctx);
            (0, testlab_1.expect)(childContext2.getValueOrPromise('state#count')).to.equal(1);
            // retrieve the full object again (verify that cache was not modified)
            (0, testlab_1.expect)(ctx.getSync('state')).to.deepEqual({ count: 1 });
        });
        it('honours APPLICATION scope when retrieving a nested property', () => {
            const state = { count: 0 };
            ctx.scope = __1.BindingScope.APPLICATION;
            ctx
                .bind('state')
                .toDynamicValue(() => {
                state.count++;
                return state;
            })
                .inScope(__1.BindingScope.APPLICATION);
            // verify the initial state & populate the cache
            (0, testlab_1.expect)(ctx.getSync('state')).to.deepEqual({ count: 1 });
            // retrieve a nested property from a child context
            const childContext1 = new __1.Context(ctx);
            (0, testlab_1.expect)(childContext1.getValueOrPromise('state#count')).to.equal(1);
            // retrieve a nested property from another child context
            const childContext2 = new __1.Context(ctx);
            (0, testlab_1.expect)(childContext2.getValueOrPromise('state#count')).to.equal(1);
            // retrieve the full object again (verify that cache was not modified)
            (0, testlab_1.expect)(ctx.getSync('state')).to.deepEqual({ count: 1 });
        });
    });
    it('honours SERVER scope when retrieving a nested property', () => {
        const state = { count: 0 };
        ctx.scope = __1.BindingScope.APPLICATION;
        ctx
            .bind('state')
            .toDynamicValue(() => {
            state.count++;
            return state;
        })
            .inScope(__1.BindingScope.SERVER);
        // Cannot be resolved in the app
        (0, testlab_1.expect)(() => ctx.getSync('state')).to.throw(/Binding "state" in context "app" cannot be resolved in scope "Server"/);
        const serverCtx = new __1.Context(ctx);
        serverCtx.scope = __1.BindingScope.SERVER;
        // retrieve a nested property from a child context
        const childContext1 = new __1.Context(serverCtx);
        (0, testlab_1.expect)(childContext1.getValueOrPromise('state#count')).to.equal(1);
        // retrieve a nested property from another child context
        const childContext2 = new __1.Context(serverCtx);
        (0, testlab_1.expect)(childContext2.getValueOrPromise('state#count')).to.equal(1);
        // retrieve the full object again (verify that cache was not modified)
        (0, testlab_1.expect)(serverCtx.getSync('state')).to.deepEqual({ count: 1 });
    });
    it('honours REQUEST scope when retrieving a nested property', () => {
        const state = { count: 0 };
        ctx.scope = __1.BindingScope.SERVER;
        ctx
            .bind('state')
            .toDynamicValue(() => {
            return { count: ++state.count };
        })
            .inScope(__1.BindingScope.REQUEST);
        // No `request` scope exists in the chain, fall back to the current
        // context
        (0, testlab_1.expect)(ctx.getSync('state#count')).to.equal(1);
        const requestCtx = new __1.Context(ctx);
        requestCtx.scope = __1.BindingScope.REQUEST;
        // retrieve a nested property from a child context
        const childContext1 = new __1.Context(requestCtx);
        (0, testlab_1.expect)(childContext1.getValueOrPromise('state#count')).to.equal(2);
        // retrieve a nested property from another child context
        const childContext2 = new __1.Context(requestCtx);
        (0, testlab_1.expect)(childContext2.getValueOrPromise('state#count')).to.equal(2);
        // retrieve the full object again (verify that cache was not modified)
        (0, testlab_1.expect)(ctx.getSync('state')).to.deepEqual({ count: 1 });
    });
    describe('close()', () => {
        it('clears all observers', () => {
            const childCtx = new TestContext(ctx);
            childCtx.subscribe(() => { });
            (0, testlab_1.expect)(childCtx.observers.size).to.eql(1);
            childCtx.close();
            (0, testlab_1.expect)(childCtx.observers).to.be.undefined();
        });
        it('removes listeners from parent context', () => {
            const childCtx = new TestContext(ctx);
            childCtx.subscribe(() => { });
            // Now we have one observer
            (0, testlab_1.expect)(childCtx.observers.size).to.eql(1);
            (0, testlab_1.expect)(childCtx.parentEventListener).to.be.a.Function();
            // Now clear subscriptions
            childCtx.close();
            // observers are gone
            (0, testlab_1.expect)(childCtx.observers).to.be.undefined();
            // listeners are removed from parent context
            (0, testlab_1.expect)(childCtx.parentEventListener).to.be.undefined();
        });
        it('keeps parent and bindings', () => {
            const childCtx = new TestContext(ctx);
            childCtx.bind('foo').to('foo-value');
            childCtx.close();
            (0, testlab_1.expect)(childCtx.parent).to.equal(ctx);
            (0, testlab_1.expect)(childCtx.contains('foo'));
        });
    });
    describe('maxListeners', () => {
        it('defaults to Infinity', () => {
            (0, testlab_1.expect)(ctx.getMaxListeners()).to.equal(Infinity);
        });
        it('can be changed', () => {
            ctx.setMaxListeners(128);
            (0, testlab_1.expect)(ctx.getMaxListeners()).to.equal(128);
        });
    });
    describe('debug', () => {
        it('allows override of debug from subclasses', () => {
            let debugOutput = '';
            const myDebug = (formatter, ...args) => {
                debugOutput = (0, util_1.format)(formatter, ...args);
            };
            myDebug.enabled = true;
            class MyContext extends __1.Context {
                constructor() {
                    super('my-context');
                    this._debug = myDebug;
                }
                debug(formatter, ...args) {
                    super.debug(formatter, ...args);
                }
            }
            const myCtx = new MyContext();
            myCtx.debug('%s %d', 'number of bindings', 10);
            (0, testlab_1.expect)(debugOutput).to.eql(`[${myCtx.name}] number of bindings 10`);
        });
        it('sets up debug for subclasses with the class name', () => {
            class MyContext extends __1.Context {
                constructor() {
                    super('my-context');
                }
                get debugFn() {
                    return this._debug;
                }
            }
            const myCtx = new MyContext();
            (0, testlab_1.expect)(myCtx.debugFn.namespace).to.eql('loopback:context:mycontext');
        });
        it('allows debug namespace for subclasses', () => {
            class MyContext extends __1.Context {
                constructor() {
                    super('my-context');
                }
                getDebugNamespace() {
                    return 'myapp:my-context';
                }
                get debugFn() {
                    return this._debug;
                }
            }
            const myCtx = new MyContext();
            (0, testlab_1.expect)(myCtx.debugFn.namespace).to.eql('myapp:my-context');
        });
    });
    describe('toJSON() and inspect()', () => {
        beforeEach(setupBindings);
        const expectedBindings = {
            a: {
                key: 'a',
                scope: __1.BindingScope.TRANSIENT,
                tags: {},
                isLocked: true,
                type: __1.BindingType.CONSTANT,
            },
            b: {
                key: 'b',
                scope: __1.BindingScope.SINGLETON,
                tags: { X: 'X', Y: 'Y' },
                isLocked: false,
                type: __1.BindingType.DYNAMIC_VALUE,
            },
            c: {
                key: 'c',
                scope: __1.BindingScope.TRANSIENT,
                tags: { Z: 'Z', a: 1 },
                isLocked: false,
                type: __1.BindingType.CONSTANT,
            },
            d: {
                key: 'd',
                scope: __1.BindingScope.TRANSIENT,
                tags: {},
                isLocked: false,
                type: __1.BindingType.CLASS,
                valueConstructor: 'MyService',
            },
            e: {
                key: 'e',
                scope: __1.BindingScope.TRANSIENT,
                tags: {},
                isLocked: false,
                type: __1.BindingType.PROVIDER,
                providerConstructor: 'MyServiceProvider',
            },
        };
        it('converts to plain JSON object', () => {
            (0, testlab_1.expect)(ctx.toJSON()).to.eql(expectedBindings);
        });
        it('inspects as plain JSON object', () => {
            (0, testlab_1.expect)(ctx.inspect()).to.eql({
                name: 'app',
                bindings: expectedBindings,
            });
        });
        it('inspects as plain JSON object to include parent', () => {
            const childCtx = new TestContext(ctx, 'server');
            childCtx.bind('foo').to('foo-value');
            (0, testlab_1.expect)(childCtx.inspect()).to.eql({
                name: 'server',
                bindings: childCtx.toJSON(),
                parent: {
                    name: 'app',
                    bindings: expectedBindings,
                },
            });
        });
        it('inspects as plain JSON object to not include parent', () => {
            const childCtx = new TestContext(ctx, 'server');
            childCtx.bind('foo').to('foo-value');
            (0, testlab_1.expect)(childCtx.inspect({ includeParent: false })).to.eql({
                name: 'server',
                bindings: childCtx.toJSON(),
            });
        });
        it('inspects as plain JSON object with class name conflicts', () => {
            const childCtx = new TestContext(ctx, 'server');
            // We intentionally declare classes with colliding names to verify
            // they are represented with unique names in JSON object produced
            // by `inspect()`
            class MyService {
            }
            class MyServiceProvider {
                value() {
                    return new MyService();
                }
            }
            childCtx.bind('child.MyService').toClass(MyService);
            childCtx.bind('child.MyServiceProvider').toProvider(MyServiceProvider);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const json = childCtx.inspect();
            (0, testlab_1.expect)(json.bindings['child.MyService'].valueConstructor).to.eql('MyService');
            (0, testlab_1.expect)(json.bindings['child.MyServiceProvider'].providerConstructor).to.eql('MyServiceProvider');
            const parentBindings = json.parent.bindings;
            (0, testlab_1.expect)(parentBindings['d'].valueConstructor).to.eql('MyService #1');
            (0, testlab_1.expect)(parentBindings['e'].providerConstructor).to.eql('MyServiceProvider #1');
        });
        it('inspects as plain JSON object to include injections', () => {
            const childCtx = new TestContext(ctx, 'server');
            childCtx.bind('foo').to('foo-value');
            const expectedJSON = {
                name: 'server',
                bindings: {
                    foo: {
                        key: 'foo',
                        scope: 'Transient',
                        tags: {},
                        isLocked: false,
                        type: 'Constant',
                    },
                },
                parent: {
                    name: 'app',
                    bindings: {
                        a: {
                            key: 'a',
                            scope: 'Transient',
                            tags: {},
                            isLocked: true,
                            type: 'Constant',
                        },
                        b: {
                            key: 'b',
                            scope: 'Singleton',
                            tags: { X: 'X', Y: 'Y' },
                            isLocked: false,
                            type: 'DynamicValue',
                        },
                        c: {
                            key: 'c',
                            scope: 'Transient',
                            tags: { Z: 'Z', a: 1 },
                            isLocked: false,
                            type: 'Constant',
                        },
                        d: {
                            key: 'd',
                            scope: 'Transient',
                            tags: {},
                            isLocked: false,
                            type: 'Class',
                            valueConstructor: 'MyService',
                            injections: {
                                constructorArguments: [
                                    { targetName: 'MyService.constructor[0]', bindingKey: 'x' },
                                ],
                            },
                        },
                        e: {
                            key: 'e',
                            scope: 'Transient',
                            tags: {},
                            isLocked: false,
                            type: 'Provider',
                            providerConstructor: 'MyServiceProvider',
                            injections: {
                                properties: {
                                    x: {
                                        targetName: 'MyServiceProvider.prototype.x',
                                        bindingKey: 'x',
                                    },
                                },
                            },
                        },
                    },
                },
            };
            const json = childCtx.inspect({ includeInjections: true });
            (0, testlab_1.expect)(json).to.eql(expectedJSON);
        });
        let MyService = class MyService {
            constructor(x) {
                this.x = x;
            }
        };
        MyService = tslib_1.__decorate([
            tslib_1.__param(0, (0, __1.inject)('x')),
            tslib_1.__metadata("design:paramtypes", [String])
        ], MyService);
        class MyServiceProvider {
            value() {
                return new MyService(this.x);
            }
        }
        tslib_1.__decorate([
            (0, __1.inject)('x'),
            tslib_1.__metadata("design:type", String)
        ], MyServiceProvider.prototype, "x", void 0);
        function setupBindings() {
            ctx.bind('a').to('1').lock();
            ctx
                .bind('b')
                .toDynamicValue(() => 2)
                .inScope(__1.BindingScope.SINGLETON)
                .tag('X', 'Y');
            ctx.bind('c').to(3).tag('Z', { a: 1 });
            ctx.bind('d').toClass(MyService);
            ctx.bind('e').toProvider(MyServiceProvider);
        }
    });
    function createContext() {
        ctx = new TestContext('app');
    }
});
//# sourceMappingURL=context.unit.js.map
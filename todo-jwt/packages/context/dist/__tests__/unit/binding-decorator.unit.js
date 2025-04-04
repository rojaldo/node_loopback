"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
const binding_inspector_1 = require("../../binding-inspector");
function testBindingDecorator(injectable, name) {
    describe(name, () => {
        const expectedScopeAndTags = {
            tags: { rest: 'rest' },
            scope: __1.BindingScope.SINGLETON,
        };
        it('decorates a class', () => {
            const spec = {
                tags: ['rest'],
                scope: __1.BindingScope.SINGLETON,
            };
            let MyController = class MyController {
            };
            MyController = tslib_1.__decorate([
                injectable(spec)
            ], MyController);
            (0, testlab_1.expect)(inspectScopeAndTags(MyController)).to.eql(expectedScopeAndTags);
        });
        it('allows inheritance for certain tags and scope', () => {
            const spec = {
                tags: ['rest'],
                scope: __1.BindingScope.SINGLETON,
            };
            let MyController = class MyController {
            };
            MyController = tslib_1.__decorate([
                injectable(spec)
            ], MyController);
            class MySubController extends MyController {
            }
            (0, testlab_1.expect)(inspectScopeAndTags(MySubController)).to.eql(expectedScopeAndTags);
        });
        it('allows subclass to not have @injectable', () => {
            var _a;
            const spec = {
                tags: ['rest'],
                scope: __1.BindingScope.SINGLETON,
            };
            let MyController = class MyController {
            };
            MyController = tslib_1.__decorate([
                injectable(spec)
            ], MyController);
            class MySubController extends MyController {
            }
            const binding = (0, binding_inspector_1.createBindingFromClass)(MySubController);
            (0, testlab_1.expect)((_a = binding.source) === null || _a === void 0 ? void 0 : _a.value).to.eql(MySubController);
        });
        it('ignores `name` and `key` from base class', () => {
            const spec = {
                tags: [
                    'rest',
                    {
                        name: 'my-controller',
                        key: 'controllers.my-controller',
                    },
                ],
                scope: __1.BindingScope.SINGLETON,
            };
            let MyController = class MyController {
            };
            MyController = tslib_1.__decorate([
                injectable(spec)
            ], MyController);
            let MySubController = class MySubController extends MyController {
            };
            MySubController = tslib_1.__decorate([
                injectable()
            ], MySubController);
            const result = inspectScopeAndTags(MySubController);
            (0, testlab_1.expect)(result).to.containEql(expectedScopeAndTags);
            (0, testlab_1.expect)(result.tags).to.not.containEql({
                name: 'my-controller',
            });
            (0, testlab_1.expect)(result.tags).to.not.containEql({
                key: 'controllers.my-controller',
            });
        });
        it('accepts template functions', () => {
            const spec = binding => {
                binding.tag('rest').inScope(__1.BindingScope.SINGLETON);
            };
            let MyController = class MyController {
            };
            MyController = tslib_1.__decorate([
                injectable(spec)
            ], MyController);
            (0, testlab_1.expect)(inspectScopeAndTags(MyController)).to.eql(expectedScopeAndTags);
        });
        it('accepts multiple scope/tags', () => {
            let MyController = class MyController {
            };
            MyController = tslib_1.__decorate([
                injectable({ tags: 'rest' }, { scope: __1.BindingScope.SINGLETON })
            ], MyController);
            (0, testlab_1.expect)(inspectScopeAndTags(MyController)).to.eql(expectedScopeAndTags);
        });
        it('accepts multiple template functions', () => {
            let MyController = class MyController {
            };
            MyController = tslib_1.__decorate([
                injectable(binding => binding.tag('rest'), binding => binding.inScope(__1.BindingScope.SINGLETON))
            ], MyController);
            (0, testlab_1.expect)(inspectScopeAndTags(MyController)).to.eql(expectedScopeAndTags);
        });
        it('accepts both template functions and tag/scopes', () => {
            const spec = binding => {
                binding.tag('rest').inScope(__1.BindingScope.SINGLETON);
            };
            let MyController = class MyController {
            };
            MyController = tslib_1.__decorate([
                injectable(spec, { tags: [{ name: 'my-controller' }] })
            ], MyController);
            (0, testlab_1.expect)(inspectScopeAndTags(MyController)).to.eql({
                tags: { rest: 'rest', name: 'my-controller' },
                scope: __1.BindingScope.SINGLETON,
            });
        });
        it('allows the decorator to be applied multiple times', () => {
            const spec = binding => {
                binding.tag('rest').inScope(__1.BindingScope.SINGLETON);
            };
            let MyController = class MyController {
            };
            MyController = tslib_1.__decorate([
                injectable(spec),
                injectable({ tags: [{ name: 'my-controller' }] })
            ], MyController);
            (0, testlab_1.expect)(inspectScopeAndTags(MyController)).to.eql({
                tags: { rest: 'rest', name: 'my-controller' },
                scope: __1.BindingScope.SINGLETON,
            });
        });
        it('allows the decorator to override metadata from others', () => {
            let MyController = class MyController {
            };
            MyController = tslib_1.__decorate([
                injectable({
                    scope: __1.BindingScope.SINGLETON,
                    tags: { rest: 'rest', grpc: false },
                }),
                injectable({
                    scope: __1.BindingScope.TRANSIENT,
                    tags: { name: 'my-controller', grpc: true },
                })
            ], MyController);
            (0, testlab_1.expect)(inspectScopeAndTags(MyController)).to.eql({
                tags: { rest: 'rest', name: 'my-controller', grpc: false },
                scope: __1.BindingScope.SINGLETON,
            });
        });
        it('decorates a provider classes', () => {
            const spec = {
                tags: ['rest'],
                scope: __1.BindingScope.CONTEXT,
            };
            let MyProvider = class MyProvider {
                value() {
                    return 'my-value';
                }
            };
            MyProvider = tslib_1.__decorate([
                injectable.provider(spec)
            ], MyProvider);
            (0, testlab_1.expect)(inspectScopeAndTags(MyProvider)).to.eql({
                tags: { rest: 'rest', type: 'provider', provider: 'provider' },
                scope: __1.BindingScope.CONTEXT,
            });
        });
        it('recognizes provider classes', () => {
            const spec = {
                tags: ['rest', { type: 'provider' }],
                scope: __1.BindingScope.CONTEXT,
            };
            let MyProvider = class MyProvider {
                value() {
                    return 'my-value';
                }
            };
            MyProvider = tslib_1.__decorate([
                injectable(spec)
            ], MyProvider);
            (0, testlab_1.expect)(inspectScopeAndTags(MyProvider)).to.eql({
                tags: { rest: 'rest', type: 'provider', provider: 'provider' },
                scope: __1.BindingScope.CONTEXT,
            });
        });
        function inspectScopeAndTags(cls) {
            const templateFn = (0, __1.bindingTemplateFor)(cls);
            const bindingTemplate = new __1.Binding('template').apply(templateFn);
            return {
                scope: bindingTemplate.scope,
                tags: bindingTemplate.tagMap,
            };
        }
    });
}
// Test @injectable
testBindingDecorator(__1.injectable, '@injectable');
// Test @bind
testBindingDecorator(__1.bind, '@bind');
//# sourceMappingURL=binding-decorator.unit.js.map
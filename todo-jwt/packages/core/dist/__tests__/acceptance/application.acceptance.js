"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/core
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const context_1 = require("@loopback/context");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
describe('Bootstrapping the application', () => {
    context('with user-defined components', () => {
        it('binds all user-defined components to the application context', () => {
            class AuditComponent {
            }
            const app = new __1.Application();
            app.component(AuditComponent);
            const componentKeys = app.find('components.*').map(b => b.key);
            (0, testlab_1.expect)(componentKeys).to.containEql('components.AuditComponent');
            const componentInstance = app.getSync('components.AuditComponent');
            (0, testlab_1.expect)(componentInstance).to.be.instanceOf(AuditComponent);
        });
        it('register all child components from a component', () => {
            let componentACreated = 0;
            class ComponentA {
                constructor() {
                    componentACreated++;
                }
            }
            class ComponentB {
            }
            class ParentComponent {
                constructor() {
                    this.components = [ComponentA, ComponentB];
                }
            }
            const app = new __1.Application();
            app.component(ParentComponent);
            const componentKeys = app.find('components.*').map(b => b.key);
            (0, testlab_1.expect)(componentKeys).to.containEql('components.ComponentA');
            (0, testlab_1.expect)(componentKeys).to.containEql('components.ComponentB');
            (0, testlab_1.expect)(componentKeys).to.containEql('components.ParentComponent');
            // Re-registration of ComponentA does not have side effects
            app.component(ComponentA);
            (0, testlab_1.expect)(componentACreated).to.eql(1);
        });
        it('registers all providers from components', () => {
            class FooProvider {
                value() {
                    return 'bar';
                }
            }
            class FooComponent {
                constructor() {
                    this.providers = { foo: FooProvider };
                }
            }
            const app = new __1.Application();
            app.component(FooComponent);
            const value = app.getSync('foo');
            (0, testlab_1.expect)(value).to.equal('bar');
        });
        it('registers all controllers from components', async () => {
            // TODO(bajtos) Beef up this test. Create a real controller with
            // a public API endpoint and verify that this endpoint can be invoked
            // via HTTP/REST API.
            class ProductController {
            }
            class ProductComponent {
                constructor() {
                    this.controllers = [ProductController];
                }
            }
            const app = new __1.Application();
            app.component(ProductComponent);
            (0, testlab_1.expect)(app.find('controllers.*').map(b => b.key)).to.eql([
                'controllers.ProductController',
            ]);
        });
        it('allows parent context', async () => {
            class ProductController {
            }
            class ProductComponent {
                constructor() {
                    this.controllers = [ProductController];
                }
            }
            const parent = new __1.Application();
            parent.component(ProductComponent);
            const app = new __1.Application(parent);
            (0, testlab_1.expect)(app.find('controllers.*').map(b => b.key)).to.eql([
                'controllers.ProductController',
            ]);
            const app2 = new __1.Application({}, parent);
            (0, testlab_1.expect)(app2.find('controllers.*').map(b => b.key)).to.eql([
                'controllers.ProductController',
            ]);
            const app3 = new __1.Application();
            (0, testlab_1.expect)(app3.find('controllers.*').map(b => b.key)).to.not.containEql([
                'controllers.ProductController',
            ]);
        });
        it('injects component dependencies', () => {
            class ConfigComponent {
                constructor() {
                    this.providers = {
                        greetBriefly: class HelloProvider {
                            value() {
                                return true;
                            }
                        },
                    };
                }
            }
            class BriefGreetingProvider {
                value() {
                    return 'Hi!';
                }
            }
            class LongGreetingProvider {
                value() {
                    return 'Hello!';
                }
            }
            let GreetingComponent = class GreetingComponent {
                constructor(greetBriefly) {
                    this.providers = {
                        greeting: greetBriefly
                            ? BriefGreetingProvider
                            : LongGreetingProvider,
                    };
                }
            };
            GreetingComponent = tslib_1.__decorate([
                tslib_1.__param(0, (0, context_1.inject)('greetBriefly')),
                tslib_1.__metadata("design:paramtypes", [Boolean])
            ], GreetingComponent);
            const app = new __1.Application();
            app.component(ConfigComponent);
            app.component(GreetingComponent);
            (0, testlab_1.expect)(app.getSync('greeting')).to.equal('Hi!');
        });
    });
});
//# sourceMappingURL=application.acceptance.js.map
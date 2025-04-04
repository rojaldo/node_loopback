"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/openapi-v3
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const openapi_spec_builder_1 = require("@loopback/openapi-spec-builder");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../..");
describe('Routing metadata', () => {
    it('returns spec defined via @api()', () => {
        const expectedSpec = (0, openapi_spec_builder_1.anOpenApiSpec)()
            .withOperationReturningString('get', '/greet', 'greet')
            .build();
        let MyController = class MyController {
            greet() {
                return 'Hello world!';
            }
        };
        MyController = tslib_1.__decorate([
            (0, __1.api)(expectedSpec)
        ], MyController);
        const actualSpec = (0, __1.getControllerSpec)(MyController);
        (0, testlab_1.expect)(actualSpec).to.eql(expectedSpec);
    });
    it('caches controller spec', () => {
        const expectedSpec = (0, openapi_spec_builder_1.anOpenApiSpec)()
            .withOperationReturningString('get', '/greet', 'greet')
            .build();
        let MyController = class MyController {
            greet() {
                return 'Hello world!';
            }
        };
        MyController = tslib_1.__decorate([
            (0, __1.api)(expectedSpec)
        ], MyController);
        const spec1 = (0, __1.getControllerSpec)(MyController);
        const spec2 = (0, __1.getControllerSpec)(MyController);
        (0, testlab_1.expect)(spec2).to.be.exactly(spec1);
    });
    it('returns spec defined via @get decorator', () => {
        const operationSpec = (0, openapi_spec_builder_1.anOperationSpec)().withStringResponse().build();
        class MyController {
            greet() {
                return 'Hello world!';
            }
        }
        tslib_1.__decorate([
            (0, __1.get)('/greet', operationSpec),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", void 0)
        ], MyController.prototype, "greet", null);
        const actualSpec = (0, __1.getControllerSpec)(MyController);
        (0, testlab_1.expect)(actualSpec).to.eql({
            paths: {
                '/greet': {
                    get: {
                        'x-controller-name': 'MyController',
                        'x-operation-name': 'greet',
                        operationId: 'MyController.greet',
                        ...operationSpec,
                    },
                },
            },
        });
    });
    it('returns spec defined via @post decorator', () => {
        const operationSpec = (0, openapi_spec_builder_1.anOperationSpec)().withStringResponse().build();
        class MyController {
            createGreeting() { }
        }
        tslib_1.__decorate([
            (0, __1.post)('/greeting', operationSpec),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", void 0)
        ], MyController.prototype, "createGreeting", null);
        const actualSpec = (0, __1.getControllerSpec)(MyController);
        (0, testlab_1.expect)(actualSpec).to.eql({
            paths: {
                '/greeting': {
                    post: {
                        'x-controller-name': 'MyController',
                        'x-operation-name': 'createGreeting',
                        operationId: 'MyController.createGreeting',
                        ...operationSpec,
                    },
                },
            },
        });
    });
    it('returns spec defined via @put decorator', () => {
        const operationSpec = (0, openapi_spec_builder_1.anOperationSpec)().withStringResponse().build();
        class MyController {
            updateGreeting() { }
        }
        tslib_1.__decorate([
            (0, __1.put)('/greeting', operationSpec),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", void 0)
        ], MyController.prototype, "updateGreeting", null);
        const actualSpec = (0, __1.getControllerSpec)(MyController);
        (0, testlab_1.expect)(actualSpec).to.eql({
            paths: {
                '/greeting': {
                    put: {
                        'x-controller-name': 'MyController',
                        'x-operation-name': 'updateGreeting',
                        operationId: 'MyController.updateGreeting',
                        ...operationSpec,
                    },
                },
            },
        });
    });
    it('returns spec defined via @patch decorator', () => {
        const operationSpec = (0, openapi_spec_builder_1.anOperationSpec)().withStringResponse().build();
        class MyController {
            patchGreeting() { }
        }
        tslib_1.__decorate([
            (0, __1.patch)('/greeting', operationSpec),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", void 0)
        ], MyController.prototype, "patchGreeting", null);
        const actualSpec = (0, __1.getControllerSpec)(MyController);
        (0, testlab_1.expect)(actualSpec).to.eql({
            paths: {
                '/greeting': {
                    patch: {
                        'x-controller-name': 'MyController',
                        'x-operation-name': 'patchGreeting',
                        operationId: 'MyController.patchGreeting',
                        ...operationSpec,
                    },
                },
            },
        });
    });
    it('returns spec defined via @del decorator', () => {
        const operationSpec = (0, openapi_spec_builder_1.anOperationSpec)().withStringResponse().build();
        class MyController {
            deleteGreeting() { }
        }
        tslib_1.__decorate([
            (0, __1.del)('/greeting', operationSpec),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", void 0)
        ], MyController.prototype, "deleteGreeting", null);
        const actualSpec = (0, __1.getControllerSpec)(MyController);
        (0, testlab_1.expect)(actualSpec).to.eql({
            paths: {
                '/greeting': {
                    delete: {
                        'x-controller-name': 'MyController',
                        'x-operation-name': 'deleteGreeting',
                        operationId: 'MyController.deleteGreeting',
                        ...operationSpec,
                    },
                },
            },
        });
    });
    it('returns spec defined via @operation decorator', () => {
        const operationSpec = (0, openapi_spec_builder_1.anOperationSpec)().withStringResponse().build();
        class MyController {
            createGreeting() { }
        }
        tslib_1.__decorate([
            (0, __1.operation)('post', '/greeting', operationSpec),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", void 0)
        ], MyController.prototype, "createGreeting", null);
        const actualSpec = (0, __1.getControllerSpec)(MyController);
        (0, testlab_1.expect)(actualSpec).to.eql({
            paths: {
                '/greeting': {
                    post: {
                        'x-controller-name': 'MyController',
                        'x-operation-name': 'createGreeting',
                        operationId: 'MyController.createGreeting',
                        ...operationSpec,
                    },
                },
            },
        });
    });
    it('returns default spec for @get with no spec', () => {
        class MyController {
            greet() { }
        }
        tslib_1.__decorate([
            (0, __1.get)('/greet'),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", void 0)
        ], MyController.prototype, "greet", null);
        const actualSpec = (0, __1.getControllerSpec)(MyController);
        (0, testlab_1.expect)(actualSpec.paths['/greet']['get']).to.eql({
            'x-controller-name': 'MyController',
            'x-operation-name': 'greet',
            operationId: 'MyController.greet',
            responses: { '200': { description: 'Return value of MyController.greet' } },
        });
    });
    it('returns default spec for @operation with no spec', () => {
        class MyController {
            createGreeting() { }
        }
        tslib_1.__decorate([
            (0, __1.operation)('post', '/greeting'),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", void 0)
        ], MyController.prototype, "createGreeting", null);
        const actualSpec = (0, __1.getControllerSpec)(MyController);
        (0, testlab_1.expect)(actualSpec.paths['/greeting']['post']).to.eql({
            'x-controller-name': 'MyController',
            'x-operation-name': 'createGreeting',
            operationId: 'MyController.createGreeting',
            responses: {
                '200': { description: 'Return value of MyController.createGreeting' },
            },
        });
    });
    it('honours specifications from inherited methods', () => {
        const operationSpec = (0, openapi_spec_builder_1.anOperationSpec)().withStringResponse().build();
        class Parent {
            getParentName() {
                return 'The Parent';
            }
        }
        tslib_1.__decorate([
            (0, __1.get)('/parent', operationSpec),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", void 0)
        ], Parent.prototype, "getParentName", null);
        class Child extends Parent {
            getChildName() {
                return 'The Child';
            }
        }
        tslib_1.__decorate([
            (0, __1.get)('/child', operationSpec),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", void 0)
        ], Child.prototype, "getChildName", null);
        const actualSpec = (0, __1.getControllerSpec)(Child);
        (0, testlab_1.expect)(actualSpec).to.eql({
            paths: {
                '/parent': {
                    get: {
                        'x-controller-name': 'Child',
                        'x-operation-name': 'getParentName',
                        operationId: 'Child.getParentName',
                        ...operationSpec,
                    },
                },
                '/child': {
                    get: {
                        'x-controller-name': 'Child',
                        'x-operation-name': 'getChildName',
                        operationId: 'Child.getChildName',
                        ...operationSpec,
                    },
                },
            },
        });
    });
    it('allows children to override parent REST endpoints', () => {
        const operationSpec = (0, openapi_spec_builder_1.anOperationSpec)().withStringResponse().build();
        class Parent {
            getParentName() {
                return 'The Parent';
            }
        }
        tslib_1.__decorate([
            (0, __1.get)('/name', operationSpec),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", void 0)
        ], Parent.prototype, "getParentName", null);
        class Child extends Parent {
            getChildName() {
                return 'The Child';
            }
        }
        tslib_1.__decorate([
            (0, __1.get)('/name', operationSpec),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", void 0)
        ], Child.prototype, "getChildName", null);
        const actualSpec = (0, __1.getControllerSpec)(Child);
        (0, testlab_1.expect)(actualSpec.paths['/name']['get']).to.have.property('x-operation-name', 'getChildName');
    });
    it('allows children to override parent REST operations', () => {
        const operationSpec = (0, openapi_spec_builder_1.anOperationSpec)().withStringResponse().build();
        class Parent {
            getName() {
                return 'The Parent';
            }
        }
        tslib_1.__decorate([
            (0, __1.get)('/parent-name', operationSpec),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", void 0)
        ], Parent.prototype, "getName", null);
        class Child extends Parent {
            getName() {
                return 'The Child';
            }
        }
        tslib_1.__decorate([
            (0, __1.get)('/child-name', operationSpec),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", void 0)
        ], Child.prototype, "getName", null);
        const childSpec = (0, __1.getControllerSpec)(Child);
        const parentSpec = (0, __1.getControllerSpec)(Parent);
        (0, testlab_1.expect)(childSpec.paths['/child-name']['get']).to.have.property('x-operation-name', 'getName');
        // The parent endpoint has been overridden
        (0, testlab_1.expect)(childSpec.paths).to.not.have.property('/parent-name');
        (0, testlab_1.expect)(parentSpec.paths['/parent-name']['get']).to.have.property('x-operation-name', 'getName');
        // The parent endpoint should not be polluted
        (0, testlab_1.expect)(parentSpec.paths).to.not.have.property('/child-name');
    });
    it('allows children to override parent REST parameters', () => {
        const operationSpec = (0, openapi_spec_builder_1.anOperationSpec)().withStringResponse().build();
        class Parent {
            greet(msg) {
                return `Parent: ${msg}`;
            }
        }
        tslib_1.__decorate([
            (0, __1.get)('/greet', operationSpec),
            tslib_1.__param(0, __1.param.query.string('msg')),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [String]),
            tslib_1.__metadata("design:returntype", void 0)
        ], Parent.prototype, "greet", null);
        class Child extends Parent {
            greet(msg) {
                return `Child: ${msg}`;
            }
        }
        tslib_1.__decorate([
            tslib_1.__param(0, __1.param.query.string('message')),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [String]),
            tslib_1.__metadata("design:returntype", void 0)
        ], Child.prototype, "greet", null);
        const childSpec = (0, __1.getControllerSpec)(Child);
        const parentSpec = (0, __1.getControllerSpec)(Parent);
        const childGreet = childSpec.paths['/greet']['get'];
        (0, testlab_1.expect)(childGreet).to.have.property('x-operation-name', 'greet');
        (0, testlab_1.expect)(childGreet.parameters).to.have.property('length', 1);
        (0, testlab_1.expect)(childGreet.parameters[0]).to.containEql({
            name: 'message',
            in: 'query',
        });
        const parentGreet = parentSpec.paths['/greet']['get'];
        (0, testlab_1.expect)(parentGreet).to.have.property('x-operation-name', 'greet');
        (0, testlab_1.expect)(parentGreet.parameters).to.have.property('length', 1);
        (0, testlab_1.expect)(parentGreet.parameters[0]).to.containEql({
            name: 'msg',
            in: 'query',
        });
    });
});
//# sourceMappingURL=operation.decorator.unit.js.map
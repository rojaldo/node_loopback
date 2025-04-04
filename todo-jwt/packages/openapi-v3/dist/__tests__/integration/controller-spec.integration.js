"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/openapi-v3
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
const decorators_1 = require("../../decorators");
describe('controller spec', () => {
    it('adds property schemas in components.schemas', () => {
        let Bar = class Bar {
        };
        tslib_1.__decorate([
            (0, repository_1.property)(),
            tslib_1.__metadata("design:type", String)
        ], Bar.prototype, "name", void 0);
        Bar = tslib_1.__decorate([
            (0, repository_1.model)()
        ], Bar);
        let Baz = class Baz {
        };
        tslib_1.__decorate([
            (0, repository_1.property)(),
            tslib_1.__metadata("design:type", String)
        ], Baz.prototype, "name", void 0);
        Baz = tslib_1.__decorate([
            (0, repository_1.model)()
        ], Baz);
        let Foo = class Foo {
        };
        tslib_1.__decorate([
            (0, repository_1.property)(),
            tslib_1.__metadata("design:type", Bar)
        ], Foo.prototype, "bar", void 0);
        tslib_1.__decorate([
            (0, repository_1.property)(),
            tslib_1.__metadata("design:type", Baz)
        ], Foo.prototype, "baz", void 0);
        Foo = tslib_1.__decorate([
            (0, repository_1.model)()
        ], Foo);
        class FooController {
            create(foo) { }
        }
        tslib_1.__decorate([
            (0, __1.post)('/foo'),
            tslib_1.__param(0, (0, __1.requestBody)({ description: 'a foo instance', required: true })),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [Foo]),
            tslib_1.__metadata("design:returntype", void 0)
        ], FooController.prototype, "create", null);
        const expectedSpec = {
            paths: {
                '/foo': {
                    post: {
                        responses: {
                            '200': {
                                description: 'Return value of FooController.create',
                            },
                        },
                        requestBody: {
                            description: 'a foo instance',
                            required: true,
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Foo' },
                                },
                            },
                        },
                        'x-controller-name': 'FooController',
                        'x-operation-name': 'create',
                        operationId: 'FooController.create',
                    },
                },
            },
            components: {
                schemas: {
                    Bar: {
                        title: 'Bar',
                        type: 'object',
                        properties: { name: { type: 'string' } },
                        additionalProperties: false,
                    },
                    Baz: {
                        title: 'Baz',
                        type: 'object',
                        properties: { name: { type: 'string' } },
                        additionalProperties: false,
                    },
                    Foo: {
                        // guarantee `definition` is deleted
                        title: 'Foo',
                        type: 'object',
                        properties: {
                            bar: { $ref: '#/components/schemas/Bar' },
                            baz: { $ref: '#/components/schemas/Baz' },
                        },
                        additionalProperties: false,
                    },
                },
            },
        };
        (0, testlab_1.expect)((0, __1.getControllerSpec)(FooController)).to.eql(expectedSpec);
    });
    it('does not produce nested definitions', () => {
        const paramSpec = {
            name: 'foo',
            in: 'query',
        };
        let Foo = class Foo {
        };
        tslib_1.__decorate([
            (0, repository_1.property)(),
            tslib_1.__metadata("design:type", Number)
        ], Foo.prototype, "bar", void 0);
        Foo = tslib_1.__decorate([
            (0, repository_1.model)()
        ], Foo);
        let MyParam = class MyParam {
        };
        tslib_1.__decorate([
            (0, repository_1.property)(),
            tslib_1.__metadata("design:type", String)
        ], MyParam.prototype, "name", void 0);
        tslib_1.__decorate([
            (0, repository_1.property)(),
            tslib_1.__metadata("design:type", Foo)
        ], MyParam.prototype, "foo", void 0);
        MyParam = tslib_1.__decorate([
            (0, repository_1.model)()
        ], MyParam);
        class MyController {
            foo(body) { }
        }
        tslib_1.__decorate([
            (0, __1.post)('/foo'),
            tslib_1.__param(0, (0, __1.param)(paramSpec)),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [MyParam]),
            tslib_1.__metadata("design:returntype", void 0)
        ], MyController.prototype, "foo", null);
        const components = (0, __1.getControllerSpec)(MyController).components;
        const schemas = components.schemas;
        (0, testlab_1.expect)(schemas).to.have.keys('MyParam', 'Foo');
        (0, testlab_1.expect)(schemas.MyParam).to.not.have.key('definitions');
    });
    it('infers no properties if no property metadata is present', () => {
        const paramSpec = {
            name: 'foo',
            in: 'query',
        };
        let MyParam = class MyParam {
        };
        MyParam = tslib_1.__decorate([
            (0, repository_1.model)()
        ], MyParam);
        class MyController {
            foo(foo) { }
        }
        tslib_1.__decorate([
            (0, __1.post)('/foo'),
            tslib_1.__param(0, (0, __1.param)(paramSpec)),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [MyParam]),
            tslib_1.__metadata("design:returntype", void 0)
        ], MyController.prototype, "foo", null);
        const components = (0, __1.getControllerSpec)(MyController).components;
        const schemas = components.schemas;
        (0, testlab_1.expect)(schemas).to.have.key('MyParam');
        (0, testlab_1.expect)(schemas.MyParam).to.not.have.key('properties');
    });
    it('does not infer definition if no class metadata is present', () => {
        const paramSpec = {
            name: 'foo',
            in: 'query',
        };
        class MyParam {
        }
        tslib_1.__decorate([
            (0, repository_1.property)(),
            tslib_1.__metadata("design:type", String)
        ], MyParam.prototype, "name", void 0);
        class MyController {
            foo(foo) { }
        }
        tslib_1.__decorate([
            (0, __1.post)('/foo'),
            tslib_1.__param(0, (0, __1.param)(paramSpec)),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [MyParam]),
            tslib_1.__metadata("design:returntype", void 0)
        ], MyController.prototype, "foo", null);
        const components = (0, __1.getControllerSpec)(MyController).components;
        const schemas = components.schemas;
        (0, testlab_1.expect)(schemas).to.have.key('MyParam');
        (0, testlab_1.expect)(schemas.MyParam).to.deepEqual({});
    });
    it('generates a default responses object if not set', () => {
        class MyController {
            hello() {
                return 'hello world';
            }
        }
        tslib_1.__decorate([
            (0, __1.get)('/'),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", void 0)
        ], MyController.prototype, "hello", null);
        const spec = (0, __1.getControllerSpec)(MyController);
        (0, testlab_1.expect)(spec.paths['/'].get).to.have.property('responses');
        (0, testlab_1.expect)(spec.paths['/'].get.responses).to.eql({
            '200': {
                description: 'Return value of MyController.hello',
            },
        });
    });
    it('generates relative body index if it is not the 1st arg', () => {
        class MyController {
            hello(name, body, id) {
                return 'hello world';
            }
        }
        tslib_1.__decorate([
            (0, __1.post)('/{id}'),
            tslib_1.__param(0, (0, core_1.inject)('name')),
            tslib_1.__param(1, (0, __1.requestBody)()),
            tslib_1.__param(2, __1.param.path.string('id')),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [String, Object, String]),
            tslib_1.__metadata("design:returntype", void 0)
        ], MyController.prototype, "hello", null);
        const spec = (0, __1.getControllerSpec)(MyController);
        (0, testlab_1.expect)(spec.paths['/{id}'].post.requestBody[decorators_1.REQUEST_BODY_INDEX]).to.be.undefined(); // skip the extension if index is 0
    });
    it('generates relative body index if it comes after a param', () => {
        class MyController {
            hello(name, id, body) {
                return 'hello world';
            }
        }
        tslib_1.__decorate([
            (0, __1.post)('/{id}'),
            tslib_1.__param(0, (0, core_1.inject)('name')),
            tslib_1.__param(1, __1.param.path.string('id')),
            tslib_1.__param(2, (0, __1.requestBody)()),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [String, String, Object]),
            tslib_1.__metadata("design:returntype", void 0)
        ], MyController.prototype, "hello", null);
        const spec = (0, __1.getControllerSpec)(MyController);
        (0, testlab_1.expect)(spec.paths['/{id}'].post.requestBody[decorators_1.REQUEST_BODY_INDEX]).to.equal(1);
    });
    it('generates relative body index if it comes before a param', () => {
        class MyController {
            hello(name, id, body, lang) {
                return 'hello world';
            }
        }
        tslib_1.__decorate([
            (0, __1.post)('/{id}'),
            tslib_1.__param(0, (0, core_1.inject)('name')),
            tslib_1.__param(1, __1.param.path.string('id')),
            tslib_1.__param(2, (0, __1.requestBody)()),
            tslib_1.__param(3, __1.param.query.string('lang')),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [String, String, Object, String]),
            tslib_1.__metadata("design:returntype", void 0)
        ], MyController.prototype, "hello", null);
        const spec = (0, __1.getControllerSpec)(MyController);
        (0, testlab_1.expect)(spec.paths['/{id}'].post.requestBody[decorators_1.REQUEST_BODY_INDEX]).to.equal(1);
    });
    it('generates a response given no content property', () => {
        class MyController {
            hello() {
                return 'hello world';
            }
        }
        tslib_1.__decorate([
            (0, __1.get)('/', {
                responses: {
                    '200': {
                        description: 'hello world',
                    },
                },
            }),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", void 0)
        ], MyController.prototype, "hello", null);
        const spec = (0, __1.getControllerSpec)(MyController);
        (0, testlab_1.expect)(spec.paths['/'].get).to.have.property('responses');
        (0, testlab_1.expect)(spec.paths['/'].get.responses).to.eql({
            '200': {
                description: 'hello world',
            },
        });
    });
    context('reference models via spec', () => {
        it('allows operations to provide definitions of referenced models through #/components/schema', () => {
            var _a;
            class MyController {
                async find() {
                    return []; // dummy implementation, it's never called
                }
            }
            tslib_1.__decorate([
                (0, __1.get)('/todos', {
                    responses: {
                        '200': {
                            description: 'Array of Category model instances',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Todo',
                                        definitions: {
                                            Todo: {
                                                title: 'Todo',
                                                properties: {
                                                    title: { type: 'string' },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                }),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", []),
                tslib_1.__metadata("design:returntype", Promise)
            ], MyController.prototype, "find", null);
            const spec = (0, __1.getControllerSpec)(MyController);
            const opSpec = spec.paths['/todos'].get;
            const responseSpec = opSpec.responses['200'].content['application/json'];
            (0, testlab_1.expect)(responseSpec.schema).to.deepEqual({
                $ref: '#/components/schemas/Todo',
            });
            const globalSchemas = (_a = spec.components) === null || _a === void 0 ? void 0 : _a.schemas;
            (0, testlab_1.expect)(globalSchemas).to.deepEqual({
                Todo: {
                    title: 'Todo',
                    properties: {
                        title: {
                            type: 'string',
                        },
                    },
                },
            });
        });
        it('allows operations to provide definitions of referenced models through #/definitions', () => {
            var _a;
            class MyController {
                async find() {
                    return []; // dummy implementation, it's never called
                }
            }
            tslib_1.__decorate([
                (0, __1.get)('/todos', {
                    responses: {
                        '200': {
                            description: 'Array of Category model instances',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/definitions/Todo',
                                        definitions: {
                                            Todo: {
                                                title: 'Todo',
                                                properties: {
                                                    title: { type: 'string' },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                }),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", []),
                tslib_1.__metadata("design:returntype", Promise)
            ], MyController.prototype, "find", null);
            const spec = (0, __1.getControllerSpec)(MyController);
            const opSpec = spec.paths['/todos'].get;
            const responseSpec = opSpec.responses['200'].content['application/json'];
            (0, testlab_1.expect)(responseSpec.schema).to.deepEqual({
                $ref: '#/definitions/Todo',
            });
            const globalSchemas = (_a = spec.components) === null || _a === void 0 ? void 0 : _a.schemas;
            (0, testlab_1.expect)(globalSchemas).to.deepEqual({
                Todo: {
                    title: 'Todo',
                    properties: {
                        title: {
                            type: 'string',
                        },
                    },
                },
            });
        });
        it('allows operations to get definitions of models when defined through a different method', async () => {
            let Todo = class Todo extends repository_1.Entity {
            };
            tslib_1.__decorate([
                (0, repository_1.property)({
                    type: 'string',
                    required: true,
                }),
                tslib_1.__metadata("design:type", String)
            ], Todo.prototype, "title", void 0);
            Todo = tslib_1.__decorate([
                (0, repository_1.model)()
            ], Todo);
            class MyController {
                async find() {
                    return []; // dummy implementation, it's never called
                }
                async findById() {
                    return new Todo();
                }
            }
            tslib_1.__decorate([
                (0, __1.get)('/todos', {
                    responses: {
                        '200': {
                            description: 'Array of Category model instances',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/definitions/Todo',
                                        definitions: {
                                            Todo: {
                                                title: 'Todo',
                                                properties: {
                                                    title: { type: 'string' },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                }),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", []),
                tslib_1.__metadata("design:returntype", Promise)
            ], MyController.prototype, "find", null);
            tslib_1.__decorate([
                (0, __1.get)('/todos/{id}', {
                    responses: {
                        '200': {
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Todo' },
                                },
                            },
                        },
                    },
                }),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", []),
                tslib_1.__metadata("design:returntype", Promise)
            ], MyController.prototype, "findById", null);
            const spec = (0, __1.getControllerSpec)(MyController);
            const opSpec = spec.paths['/todos/{id}'].get;
            const responseSpec = opSpec.responses['200'].content['application/json'];
            (0, testlab_1.expect)(responseSpec.schema).to.deepEqual({
                $ref: '#/components/schemas/Todo',
            });
            const controller = new MyController();
            const todo = await controller.findById();
            (0, testlab_1.expect)(todo instanceof Todo).to.be.true();
        });
        it('returns undefined when it cannot find definition of referenced model', () => {
            var _a;
            class MyController {
                async find() {
                    return []; // dummy implementation, it's never called
                }
            }
            tslib_1.__decorate([
                (0, __1.get)('/todos', {
                    responses: {
                        '200': {
                            description: 'Array of Category model instances',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/definitions/Todo',
                                    },
                                },
                            },
                        },
                    },
                }),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", []),
                tslib_1.__metadata("design:returntype", Promise)
            ], MyController.prototype, "find", null);
            const spec = (0, __1.getControllerSpec)(MyController);
            const globalSchemas = (_a = spec.components) === null || _a === void 0 ? void 0 : _a.schemas;
            (0, testlab_1.expect)(globalSchemas).to.be.undefined();
        });
        it('gets definition from outside the method decorator when it is not provided', () => {
            var _a, _b;
            let MyController = class MyController {
                async find() {
                    return []; // dummy implementation, it's never called
                }
            };
            tslib_1.__decorate([
                (0, __1.get)('/todos', {
                    responses: {
                        '200': {
                            description: 'Array of Category model instances',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/definitions/Todo',
                                    },
                                },
                            },
                        },
                    },
                }),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", []),
                tslib_1.__metadata("design:returntype", Promise)
            ], MyController.prototype, "find", null);
            MyController = tslib_1.__decorate([
                (0, __1.api)({
                    paths: {},
                    components: {
                        parameters: {
                            limit: {
                                name: 'limit',
                                in: 'query',
                                description: 'Maximum number of items to return',
                                required: false,
                                schema: {
                                    type: 'integer',
                                },
                            },
                        },
                        schemas: {
                            Todo: {
                                title: 'Todo',
                                properties: {
                                    title: {
                                        type: 'string',
                                    },
                                },
                            },
                        },
                    },
                })
            ], MyController);
            const spec = (0, __1.getControllerSpec)(MyController);
            const opSpec = spec.paths['/todos'].get;
            const responseSpec = opSpec.responses['200'].content['application/json'];
            (0, testlab_1.expect)(responseSpec.schema).to.deepEqual({
                $ref: '#/definitions/Todo',
            });
            // We are not losing other components than schemas
            (0, testlab_1.expect)((_a = spec.components) === null || _a === void 0 ? void 0 : _a.parameters).to.eql({
                limit: {
                    name: 'limit',
                    in: 'query',
                    description: 'Maximum number of items to return',
                    required: false,
                    schema: {
                        type: 'integer',
                    },
                },
            });
            const globalSchemas = (_b = spec.components) === null || _b === void 0 ? void 0 : _b.schemas;
            (0, testlab_1.expect)(globalSchemas).to.deepEqual({
                Todo: {
                    title: 'Todo',
                    properties: {
                        title: {
                            type: 'string',
                        },
                    },
                },
            });
        });
        it('allows a class to reference schemas at @api level', () => {
            var _a;
            let MyController = class MyController {
                async find() {
                    return []; // dummy implementation, it's never called
                }
            };
            MyController = tslib_1.__decorate([
                (0, __1.api)({
                    paths: {
                        '/todos': {
                            get: {
                                'x-operation-name': 'find',
                                'x-controller-name': 'MyController',
                                responses: {
                                    '200': {
                                        content: {
                                            'application/json': {
                                                schema: {
                                                    $ref: '#/components/schemas/Todo',
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    components: {
                        schemas: {
                            Todo: {
                                title: 'Todo',
                                properties: {
                                    title: {
                                        type: 'string',
                                    },
                                },
                            },
                        },
                    },
                })
            ], MyController);
            const spec = (0, __1.getControllerSpec)(MyController);
            const opSpec = spec.paths['/todos'].get;
            const responseSpec = opSpec.responses['200'].content['application/json'];
            (0, testlab_1.expect)(responseSpec.schema).to.deepEqual({
                $ref: '#/components/schemas/Todo',
            });
            const globalSchemas = (_a = spec.components) === null || _a === void 0 ? void 0 : _a.schemas;
            (0, testlab_1.expect)(globalSchemas).to.deepEqual({
                Todo: {
                    title: 'Todo',
                    properties: {
                        title: {
                            type: 'string',
                        },
                    },
                },
            });
        });
    });
    describe('x-ts-type', () => {
        let MyModel = class MyModel {
        };
        tslib_1.__decorate([
            (0, repository_1.property)(),
            tslib_1.__metadata("design:type", String)
        ], MyModel.prototype, "name", void 0);
        MyModel = tslib_1.__decorate([
            (0, repository_1.model)()
        ], MyModel);
        const myModelSchema = {
            properties: {
                name: {
                    type: 'string',
                },
            },
            additionalProperties: false,
            title: 'MyModel',
            type: 'object',
        };
        it('generates schema for response content', () => {
            const controllerClass = givenControllerWithResponseSchema({
                'x-ts-type': String,
            });
            const spec = (0, __1.getControllerSpec)(controllerClass);
            (0, testlab_1.expect)(spec.paths['/'].get).to.have.property('responses');
            (0, testlab_1.expect)(spec.paths['/'].get.responses).to.eql({
                '200': {
                    description: 'hello world',
                    content: { 'application/json': { schema: { type: 'string' } } },
                },
            });
        });
        it('generates schema for a model in response', () => {
            const controllerClass = givenControllerWithResponseSchema({
                'x-ts-type': MyModel,
            });
            const spec = (0, __1.getControllerSpec)(controllerClass);
            (0, testlab_1.expect)(spec.paths['/'].get).to.have.property('responses');
            (0, testlab_1.expect)(spec.paths['/'].get.responses).to.eql({
                '200': {
                    description: 'hello world',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/MyModel' },
                        },
                    },
                },
            });
            assertMyModelSchemaInSpec(spec);
        });
        it('generates schema for an array in response', () => {
            const controllerClass = givenControllerWithResponseSchema({
                type: 'array',
                items: { 'x-ts-type': String },
            });
            const spec = (0, __1.getControllerSpec)(controllerClass);
            (0, testlab_1.expect)(spec.paths['/'].get).to.have.property('responses');
            (0, testlab_1.expect)(spec.paths['/'].get.responses).to.eql({
                '200': {
                    description: 'hello world',
                    content: {
                        'application/json': {
                            schema: { type: 'array', items: { type: 'string' } },
                        },
                    },
                },
            });
        });
        it('generates schema for a model array in response', () => {
            const controllerClass = givenControllerWithResponseSchema({
                type: 'array',
                items: { 'x-ts-type': MyModel },
            });
            const spec = (0, __1.getControllerSpec)(controllerClass);
            (0, testlab_1.expect)(spec.paths['/'].get).to.have.property('responses');
            (0, testlab_1.expect)(spec.paths['/'].get.responses).to.eql({
                '200': {
                    description: 'hello world',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: { $ref: '#/components/schemas/MyModel' },
                            },
                        },
                    },
                },
            });
            assertMyModelSchemaInSpec(spec);
        });
        it('generates schema for a nesting model array in response', () => {
            const controllerClass = givenControllerWithResponseSchema({
                type: 'array',
                items: {
                    type: 'array',
                    items: {
                        'x-ts-type': MyModel,
                    },
                },
            });
            const spec = (0, __1.getControllerSpec)(controllerClass);
            (0, testlab_1.expect)(spec.paths['/'].get).to.have.property('responses');
            (0, testlab_1.expect)(spec.paths['/'].get.responses).to.eql({
                '200': {
                    description: 'hello world',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/MyModel' },
                                },
                            },
                        },
                    },
                },
            });
            assertMyModelSchemaInSpec(spec);
        });
        it('generates schema for a model property in response', () => {
            const controllerClass = givenControllerWithResponseSchema({
                type: 'object',
                properties: {
                    myModel: {
                        'x-ts-type': MyModel,
                    },
                },
            });
            const spec = (0, __1.getControllerSpec)(controllerClass);
            (0, testlab_1.expect)(spec.paths['/'].get).to.have.property('responses');
            (0, testlab_1.expect)(spec.paths['/'].get.responses).to.eql({
                '200': {
                    description: 'hello world',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: { myModel: { $ref: '#/components/schemas/MyModel' } },
                            },
                        },
                    },
                },
            });
            assertMyModelSchemaInSpec(spec);
        });
        it('generates schema for a type in request', () => {
            const controllerClass = givenControllerWithRequestSchema({
                'x-ts-type': String,
            });
            const spec = (0, __1.getControllerSpec)(controllerClass);
            (0, testlab_1.expect)(spec.paths['/'].post).to.have.property('requestBody');
            (0, testlab_1.expect)(spec.paths['/'].post.requestBody).to.eql({
                content: {
                    'application/json': { schema: { type: 'string' } },
                },
            });
        });
        it('generates schema for a model in request', () => {
            const controllerClass = givenControllerWithRequestSchema({
                'x-ts-type': MyModel,
            });
            const spec = (0, __1.getControllerSpec)(controllerClass);
            (0, testlab_1.expect)(spec.paths['/'].post).to.have.property('requestBody');
            (0, testlab_1.expect)(spec.paths['/'].post.requestBody).to.eql({
                content: {
                    'application/json': { schema: { $ref: '#/components/schemas/MyModel' } },
                },
            });
            assertMyModelSchemaInSpec(spec);
        });
        function assertMyModelSchemaInSpec(spec) {
            (0, testlab_1.expect)(spec.components).to.eql({ schemas: { MyModel: myModelSchema } });
        }
        function givenControllerWithResponseSchema(schema) {
            class MyController {
                hello() {
                    return 'hello world';
                }
            }
            tslib_1.__decorate([
                (0, __1.get)('/', {
                    responses: {
                        '200': {
                            description: 'hello world',
                            content: { 'application/json': { schema } },
                        },
                    },
                }),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", []),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "hello", null);
            return MyController;
        }
        function givenControllerWithRequestSchema(schema) {
            class MyController {
                hello(body) {
                    return `hello ${body.name}`;
                }
            }
            tslib_1.__decorate([
                (0, __1.post)('/'),
                tslib_1.__param(0, (0, __1.requestBody)({
                    content: { 'application/json': { schema } },
                })),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [MyModel]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "hello", null);
            return MyController;
        }
    });
    describe('getModelSchemaRef', () => {
        it('creates spec referencing shared model schema', () => {
            var _a;
            let MyModel = class MyModel {
            };
            tslib_1.__decorate([
                (0, repository_1.property)(),
                tslib_1.__metadata("design:type", String)
            ], MyModel.prototype, "name", void 0);
            MyModel = tslib_1.__decorate([
                (0, repository_1.model)()
            ], MyModel);
            class MyController {
                async find() {
                    return [];
                }
            }
            tslib_1.__decorate([
                (0, __1.get)('/my', {
                    responses: {
                        '200': {
                            description: 'Array of MyModel model instances',
                            content: {
                                'application/json': {
                                    schema: (0, __1.getModelSchemaRef)(MyModel),
                                },
                            },
                        },
                    },
                }),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", []),
                tslib_1.__metadata("design:returntype", Promise)
            ], MyController.prototype, "find", null);
            const spec = (0, __1.getControllerSpec)(MyController);
            const opSpec = spec.paths['/my'].get;
            const responseSpec = opSpec.responses['200'].content['application/json'];
            (0, testlab_1.expect)(responseSpec.schema).to.deepEqual({
                $ref: '#/components/schemas/MyModel',
            });
            const globalSchemas = (_a = spec.components) === null || _a === void 0 ? void 0 : _a.schemas;
            (0, testlab_1.expect)(globalSchemas).to.deepEqual({
                MyModel: {
                    title: 'MyModel',
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                        },
                    },
                    additionalProperties: false,
                },
            });
        });
    });
});
//# sourceMappingURL=controller-spec.integration.js.map
"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/openapi-v3
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const openapi_spec_builder_1 = require("@loopback/openapi-spec-builder");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../../../");
describe('Routing metadata for parameters', () => {
    describe('@param', () => {
        it('defines a new parameter', () => {
            const paramSpec = {
                name: 'name',
                schema: {
                    type: 'string',
                },
                in: 'query',
            };
            class MyController {
                greet(name) { }
            }
            tslib_1.__decorate([
                (0, __1.get)('/greet'),
                tslib_1.__param(0, (0, __1.param)(paramSpec)),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const actualSpec = (0, __1.getControllerSpec)(MyController);
            const expectedSpec = (0, openapi_spec_builder_1.anOperationSpec)()
                .withOperationName('greet')
                .withControllerName('MyController')
                .withParameter(paramSpec)
                .withResponse(200, { description: 'Return value of MyController.greet' })
                .build();
            (0, testlab_1.expect)(actualSpec.paths['/greet']['get']).to.eql(expectedSpec);
        });
        it('infers ts primitive types', () => {
            class MyController {
                update(id, name, age, vip, tags, address) { }
            }
            tslib_1.__decorate([
                (0, __1.patch)('/update/{id}'),
                tslib_1.__param(0, (0, __1.param)({
                    name: 'id',
                    in: 'path',
                    required: true,
                })),
                tslib_1.__param(1, (0, __1.param)({
                    name: 'name',
                    in: 'query',
                })),
                tslib_1.__param(2, (0, __1.param)({
                    name: 'age',
                    in: 'query',
                })),
                tslib_1.__param(3, (0, __1.param)({
                    name: 'vip',
                    in: 'query',
                })),
                tslib_1.__param(4, __1.param.array('tags', 'query', { type: 'string' })),
                tslib_1.__param(5, (0, __1.param)({
                    name: 'address',
                    in: 'query',
                })),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String, String, Number, Boolean, Array, Object]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "update", null);
            const actualSpec = (0, __1.getControllerSpec)(MyController);
            const expectedSpec = (0, openapi_spec_builder_1.anOperationSpec)()
                .withOperationName('update')
                .withControllerName('MyController')
                .withResponse(200, { description: 'Return value of MyController.update' })
                .withParameter({
                name: 'id',
                schema: {
                    type: 'string',
                },
                in: 'path',
                required: true,
            })
                .withParameter({
                name: 'name',
                schema: {
                    type: 'string',
                },
                in: 'query',
            })
                .withParameter({
                name: 'age',
                schema: {
                    type: 'number',
                },
                in: 'query',
            })
                .withParameter({
                name: 'vip',
                schema: {
                    type: 'boolean',
                },
                in: 'query',
            })
                .withParameter({
                name: 'tags',
                schema: {
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                },
                in: 'query',
            })
                .withParameter({
                name: 'address',
                schema: {
                    type: 'object',
                },
                in: 'query',
            })
                .build();
            (0, testlab_1.expect)(actualSpec.paths['/update/{id}']['patch']).to.eql(expectedSpec);
        });
        it('infers array type without explicit type', () => {
            class MyController {
                greet(names) { }
            }
            tslib_1.__decorate([
                (0, __1.get)('/greet'),
                tslib_1.__param(0, (0, __1.param)({
                    name: 'names',
                    in: 'query',
                    schema: { items: { type: 'string' } },
                })),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [Array]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const actualSpec = (0, __1.getControllerSpec)(MyController);
            const expectedSpec = (0, openapi_spec_builder_1.anOperationSpec)()
                .withOperationName('greet')
                .withControllerName('MyController')
                .withResponse(200, { description: 'Return value of MyController.greet' })
                .withParameter({
                name: 'names',
                schema: {
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                },
                in: 'query',
            })
                .build();
            (0, testlab_1.expect)(actualSpec.paths['/greet']['get']).to.eql(expectedSpec);
        });
        it('reports error if an array parameter type is not Array', () => {
            testlab_1.expect.throws(() => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                class MyController {
                    greet(names) { }
                }
                tslib_1.__decorate([
                    (0, __1.get)('/greet'),
                    tslib_1.__param(0, __1.param.array('names', 'query', { type: 'string' })),
                    tslib_1.__metadata("design:type", Function),
                    tslib_1.__metadata("design:paramtypes", [String]),
                    tslib_1.__metadata("design:returntype", void 0)
                ], MyController.prototype, "greet", null);
            }, Error, `The parameter type is set to 'array' but the JavaScript type is String`);
        });
        it('infers array parameter type with `any`', () => {
            class MyController {
                greet(names) { }
            }
            tslib_1.__decorate([
                (0, __1.get)('/greet'),
                tslib_1.__param(0, __1.param.array('names', 'query', { type: 'string' })),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [Object]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const actualSpec = (0, __1.getControllerSpec)(MyController);
            const expectedSpec = (0, openapi_spec_builder_1.anOperationSpec)()
                .withOperationName('greet')
                .withControllerName('MyController')
                .withResponse(200, { description: 'Return value of MyController.greet' })
                .withParameter({
                name: 'names',
                schema: {
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                },
                in: 'query',
            })
                .build();
            (0, testlab_1.expect)(actualSpec.paths['/greet']['get']).to.eql(expectedSpec);
        });
        it('adds to existing spec provided via @operation', () => {
            const offsetSpec = {
                name: 'offset',
                in: 'query',
                schema: {
                    type: 'number',
                },
            };
            const pageSizeSpec = {
                name: 'pageSize',
                in: 'query',
                schema: {
                    type: 'number',
                },
            };
            const responses = {
                200: {
                    content: {
                        '*/*': {
                            schema: {
                                type: 'string',
                            },
                        },
                    },
                    description: 'a string response',
                },
            };
            class MyController {
                list(offset, pageSize) { }
            }
            tslib_1.__decorate([
                (0, __1.operation)('get', '/', { responses }),
                tslib_1.__param(0, __1.param.query.number('offset')),
                tslib_1.__param(1, __1.param.query.number('pageSize')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [Number, Number]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "list", null);
            const apiSpec = (0, __1.getControllerSpec)(MyController);
            const opSpec = apiSpec.paths['/']['get'];
            (0, testlab_1.expect)(opSpec.responses).to.eql(responses);
            (0, testlab_1.expect)(opSpec.parameters).to.eql([offsetSpec, pageSizeSpec]);
        });
    });
});
//# sourceMappingURL=param.decorator.unit.js.map
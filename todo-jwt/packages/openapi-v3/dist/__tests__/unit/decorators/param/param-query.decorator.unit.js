"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/openapi-v3
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../../..");
describe('Routing metadata for parameters', () => {
    describe('@param.query.string', () => {
        it('defines a parameter with in:query type:string', () => {
            class MyController {
                greet(name) { }
            }
            tslib_1.__decorate([
                (0, __1.get)('/greet'),
                tslib_1.__param(0, __1.param.query.string('name')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const expectedParamSpec = {
                name: 'name',
                in: 'query',
                schema: {
                    type: 'string',
                },
            };
            expectSpecToBeEqual(MyController, expectedParamSpec);
        });
    });
    describe('@param.query.number', () => {
        it('defines a parameter with in:query type:number', () => {
            class MyController {
                greet(name) { }
            }
            tslib_1.__decorate([
                (0, __1.get)('/greet'),
                tslib_1.__param(0, __1.param.query.number('name')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [Number]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const expectedParamSpec = {
                name: 'name',
                in: 'query',
                schema: {
                    type: 'number',
                },
            };
            expectSpecToBeEqual(MyController, expectedParamSpec);
        });
    });
    describe('@param.query.integer', () => {
        it('defines a parameter with in:query type:integer', () => {
            class MyController {
                greet(name) { }
            }
            tslib_1.__decorate([
                (0, __1.get)('/greet'),
                tslib_1.__param(0, __1.param.query.integer('name')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [Number]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const expectedParamSpec = {
                name: 'name',
                in: 'query',
                schema: {
                    type: 'integer',
                    format: 'int32',
                },
            };
            expectSpecToBeEqual(MyController, expectedParamSpec);
        });
    });
    describe('@param.query.boolean', () => {
        it('defines a parameter with in:query type:boolean', () => {
            class MyController {
                greet(name) { }
            }
            tslib_1.__decorate([
                (0, __1.get)('/greet'),
                tslib_1.__param(0, __1.param.query.boolean('name')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [Boolean]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const expectedParamSpec = {
                name: 'name',
                in: 'query',
                schema: {
                    type: 'boolean',
                },
            };
            expectSpecToBeEqual(MyController, expectedParamSpec);
        });
    });
    describe('@param.query.long', () => {
        it('defines a parameter with in:query type:long', () => {
            class MyController {
                greet(name) { }
            }
            tslib_1.__decorate([
                (0, __1.get)('/greet'),
                tslib_1.__param(0, __1.param.query.long('name')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [Number]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const expectedParamSpec = {
                name: 'name',
                in: 'query',
                schema: {
                    type: 'integer',
                    format: 'int64',
                },
            };
            expectSpecToBeEqual(MyController, expectedParamSpec);
        });
    });
    describe('@param.query.float', () => {
        it('defines a parameter with in:query type:float', () => {
            class MyController {
                greet(name) { }
            }
            tslib_1.__decorate([
                (0, __1.get)('/greet'),
                tslib_1.__param(0, __1.param.query.float('name')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [Number]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const expectedParamSpec = {
                name: 'name',
                in: 'query',
                schema: {
                    type: 'number',
                    format: 'float',
                },
            };
            expectSpecToBeEqual(MyController, expectedParamSpec);
        });
    });
    describe('@param.query.double', () => {
        it('defines a parameter with in:query type:double', () => {
            class MyController {
                greet(name) { }
            }
            tslib_1.__decorate([
                (0, __1.get)('/greet'),
                tslib_1.__param(0, __1.param.query.double('name')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [Number]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const expectedParamSpec = {
                name: 'name',
                in: 'query',
                schema: {
                    type: 'number',
                    format: 'double',
                },
            };
            expectSpecToBeEqual(MyController, expectedParamSpec);
        });
    });
    describe('@param.query.byte', () => {
        it('defines a parameter with in:query type:byte', () => {
            class MyController {
                greet(name) { }
            }
            tslib_1.__decorate([
                (0, __1.get)('/greet'),
                tslib_1.__param(0, __1.param.query.byte('name')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const expectedParamSpec = {
                name: 'name',
                in: 'query',
                schema: {
                    type: 'string',
                    format: 'byte',
                },
            };
            expectSpecToBeEqual(MyController, expectedParamSpec);
        });
    });
    describe('@param.query.binary', () => {
        it('defines a parameter with in:query type:binary', () => {
            class MyController {
                greet(name) { }
            }
            tslib_1.__decorate([
                (0, __1.get)('/greet'),
                tslib_1.__param(0, __1.param.query.binary('name')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const expectedParamSpec = {
                name: 'name',
                in: 'query',
                schema: {
                    type: 'string',
                    format: 'binary',
                },
            };
            expectSpecToBeEqual(MyController, expectedParamSpec);
        });
    });
    describe('@param.query.date', () => {
        it('defines a parameter with in:query type:date', () => {
            class MyController {
                greet(name) { }
            }
            tslib_1.__decorate([
                (0, __1.get)('/greet'),
                tslib_1.__param(0, __1.param.query.date('name')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const expectedParamSpec = {
                name: 'name',
                in: 'query',
                schema: {
                    type: 'string',
                    format: 'date',
                },
            };
            expectSpecToBeEqual(MyController, expectedParamSpec);
        });
    });
    describe('@param.query.dateTime', () => {
        it('defines a parameter with in:query type:dateTime', () => {
            class MyController {
                greet(name) { }
            }
            tslib_1.__decorate([
                (0, __1.get)('/greet'),
                tslib_1.__param(0, __1.param.query.dateTime('name')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const expectedParamSpec = {
                name: 'name',
                in: 'query',
                schema: {
                    type: 'string',
                    format: 'date-time',
                },
            };
            expectSpecToBeEqual(MyController, expectedParamSpec);
        });
    });
    describe('@param.query.password', () => {
        it('defines a parameter with in:query type:password', () => {
            class MyController {
                greet(name) { }
            }
            tslib_1.__decorate([
                (0, __1.get)('/greet'),
                tslib_1.__param(0, __1.param.query.password('name')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const expectedParamSpec = {
                name: 'name',
                in: 'query',
                schema: {
                    type: 'string',
                    format: 'password',
                },
            };
            expectSpecToBeEqual(MyController, expectedParamSpec);
        });
    });
    describe('@param.query.object', () => {
        it('sets in:query and content["application/json"]', () => {
            class MyController {
                greet(filter) { }
            }
            tslib_1.__decorate([
                (0, __1.get)('/greet'),
                tslib_1.__param(0, __1.param.query.object('filter')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [Object]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const expectedParamSpec = {
                name: 'filter',
                in: 'query',
                content: {
                    'application/json': {
                        schema: { type: 'object', additionalProperties: true },
                    },
                },
            };
            expectSpecToBeEqual(MyController, expectedParamSpec);
        });
        it('supports user-defined schema', () => {
            class MyController {
                greet(filter) { }
            }
            tslib_1.__decorate([
                (0, __1.get)('/greet'),
                tslib_1.__param(0, __1.param.query.object('filter', {
                    type: 'object',
                    properties: {
                        where: { type: 'object', additionalProperties: true },
                        limit: { type: 'number' },
                    },
                })),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [Object]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const expectedParamSpec = {
                name: 'filter',
                in: 'query',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                where: { type: 'object', additionalProperties: true },
                                limit: { type: 'number' },
                            },
                        },
                    },
                },
            };
            expectSpecToBeEqual(MyController, expectedParamSpec);
        });
    });
    it('allows additional properties for parameter object', () => {
        class MyController {
            greet(name) { }
        }
        tslib_1.__decorate([
            (0, __1.get)('/greet'),
            tslib_1.__param(0, __1.param.query.string('name', { description: 'Name' })),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [String]),
            tslib_1.__metadata("design:returntype", void 0)
        ], MyController.prototype, "greet", null);
        const expectedParamSpec = {
            name: 'name',
            in: 'query',
            description: 'Name',
            schema: {
                type: 'string',
            },
        };
        expectSpecToBeEqual(MyController, expectedParamSpec);
    });
    it('allows additional spec properties for @param.query.object', () => {
        class MyController {
            greet(filter) { }
        }
        tslib_1.__decorate([
            (0, __1.get)('/greet'),
            tslib_1.__param(0, __1.param.query.object('filter', undefined, {
                description: 'Search criteria',
            })),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [Object]),
            tslib_1.__metadata("design:returntype", void 0)
        ], MyController.prototype, "greet", null);
        const expectedParamSpec = {
            name: 'filter',
            in: 'query',
            description: 'Search criteria',
            content: {
                'application/json': {
                    schema: { type: 'object', additionalProperties: true },
                },
            },
        };
        expectSpecToBeEqual(MyController, expectedParamSpec);
    });
});
function expectSpecToBeEqual(controller, paramSpec) {
    const actualSpec = (0, __1.getControllerSpec)(controller);
    (0, testlab_1.expect)(actualSpec.paths['/greet']['get'].parameters).to.eql([paramSpec]);
}
//# sourceMappingURL=param-query.decorator.unit.js.map
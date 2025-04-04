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
    describe('@param.path.string', () => {
        it('defines a parameter with in:path type:string', () => {
            class MyController {
                greet(name) { }
            }
            tslib_1.__decorate([
                (0, __1.get)('/greet/{name}'),
                tslib_1.__param(0, __1.param.path.string('name')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const expectedParamSpec = {
                name: 'name',
                in: 'path',
                required: true,
                schema: {
                    type: 'string',
                },
            };
            expectSpecToBeEqual(MyController, expectedParamSpec);
        });
        it('allows additional spec properties with in:path type:string', () => {
            class MyController {
                greet(name) { }
            }
            tslib_1.__decorate([
                (0, __1.get)('/greet/{name}'),
                tslib_1.__param(0, __1.param.path.string('name', { description: 'Name' })),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const expectedParamSpec = {
                name: 'name',
                in: 'path',
                description: 'Name',
                required: true,
                schema: {
                    type: 'string',
                },
            };
            expectSpecToBeEqual(MyController, expectedParamSpec);
        });
    });
    describe('@param.path.number', () => {
        it('defines a parameter with in:path type:number', () => {
            class MyController {
                greet(name) { }
            }
            tslib_1.__decorate([
                (0, __1.get)('/greet/{name}'),
                tslib_1.__param(0, __1.param.path.number('name')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [Number]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const expectedParamSpec = {
                name: 'name',
                in: 'path',
                required: true,
                schema: {
                    type: 'number',
                },
            };
            expectSpecToBeEqual(MyController, expectedParamSpec);
        });
    });
    describe('@param.path.integer', () => {
        it('defines a parameter with in:path type:integer', () => {
            class MyController {
                greet(name) { }
            }
            tslib_1.__decorate([
                (0, __1.get)('/greet/{name}'),
                tslib_1.__param(0, __1.param.path.integer('name')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [Number]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const expectedParamSpec = {
                name: 'name',
                in: 'path',
                required: true,
                schema: {
                    type: 'integer',
                    format: 'int32',
                },
            };
            expectSpecToBeEqual(MyController, expectedParamSpec);
        });
    });
    describe('@param.path.boolean', () => {
        it('defines a parameter with in:path type:boolean', () => {
            class MyController {
                greet(name) { }
            }
            tslib_1.__decorate([
                (0, __1.get)('/greet/{name}'),
                tslib_1.__param(0, __1.param.path.boolean('name')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [Boolean]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const actualSpec = (0, __1.getControllerSpec)(MyController);
            (0, testlab_1.expect)(actualSpec.paths['/greet/{name}']['get'].parameters).to.eql([
                {
                    name: 'name',
                    in: 'path',
                    required: true,
                    schema: {
                        type: 'boolean',
                    },
                },
            ]);
        });
    });
    describe('@param.path.long', () => {
        it('defines a parameter with in:path type:long', () => {
            class MyController {
                greet(name) { }
            }
            tslib_1.__decorate([
                (0, __1.get)('/greet/{name}'),
                tslib_1.__param(0, __1.param.path.long('name')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [Number]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const expectedParamSpec = {
                name: 'name',
                in: 'path',
                required: true,
                schema: {
                    type: 'integer',
                    format: 'int64',
                },
            };
            expectSpecToBeEqual(MyController, expectedParamSpec);
        });
    });
    describe('@param.path.float', () => {
        it('defines a parameter with in:path type:float', () => {
            class MyController {
                greet(name) { }
            }
            tslib_1.__decorate([
                (0, __1.get)('/greet/{name}'),
                tslib_1.__param(0, __1.param.path.float('name')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [Number]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const expectedParamSpec = {
                name: 'name',
                in: 'path',
                required: true,
                schema: {
                    type: 'number',
                    format: 'float',
                },
            };
            expectSpecToBeEqual(MyController, expectedParamSpec);
        });
    });
    describe('@param.path.double', () => {
        it('defines a parameter with in:path type:double', () => {
            class MyController {
                greet(name) { }
            }
            tslib_1.__decorate([
                (0, __1.get)('/greet/{name}'),
                tslib_1.__param(0, __1.param.path.double('name')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [Number]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const expectedParamSpec = {
                name: 'name',
                in: 'path',
                required: true,
                schema: {
                    type: 'number',
                    format: 'double',
                },
            };
            expectSpecToBeEqual(MyController, expectedParamSpec);
        });
    });
    describe('@param.path.byte', () => {
        it('defines a parameter with in:path type:byte', () => {
            class MyController {
                greet(name) { }
            }
            tslib_1.__decorate([
                (0, __1.get)('/greet/{name}'),
                tslib_1.__param(0, __1.param.path.byte('name')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const expectedParamSpec = {
                name: 'name',
                in: 'path',
                required: true,
                schema: {
                    type: 'string',
                    format: 'byte',
                },
            };
            expectSpecToBeEqual(MyController, expectedParamSpec);
        });
    });
    describe('@param.path.binary', () => {
        it('defines a parameter with in:path type:binary', () => {
            class MyController {
                greet(name) { }
            }
            tslib_1.__decorate([
                (0, __1.get)('/greet/{name}'),
                tslib_1.__param(0, __1.param.path.binary('name')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const expectedParamSpec = {
                name: 'name',
                in: 'path',
                required: true,
                schema: {
                    type: 'string',
                    format: 'binary',
                },
            };
            expectSpecToBeEqual(MyController, expectedParamSpec);
        });
    });
    describe('@param.path.date', () => {
        it('defines a parameter with in:path type:date', () => {
            class MyController {
                greet(name) { }
            }
            tslib_1.__decorate([
                (0, __1.get)('/greet/{name}'),
                tslib_1.__param(0, __1.param.path.date('name')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const expectedParamSpec = {
                name: 'name',
                in: 'path',
                required: true,
                schema: {
                    type: 'string',
                    format: 'date',
                },
            };
            expectSpecToBeEqual(MyController, expectedParamSpec);
        });
    });
    describe('@param.path.dateTime', () => {
        it('defines a parameter with in:path type:dateTime', () => {
            class MyController {
                greet(name) { }
            }
            tslib_1.__decorate([
                (0, __1.get)('/greet/{name}'),
                tslib_1.__param(0, __1.param.path.dateTime('name')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const expectedParamSpec = {
                name: 'name',
                in: 'path',
                required: true,
                schema: {
                    type: 'string',
                    format: 'date-time',
                },
            };
            expectSpecToBeEqual(MyController, expectedParamSpec);
        });
    });
    describe('@param.path.password', () => {
        it('defines a parameter with in:path type:password', () => {
            class MyController {
                greet(name) { }
            }
            tslib_1.__decorate([
                (0, __1.get)('/greet/{name}'),
                tslib_1.__param(0, __1.param.path.password('name')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const expectedParamSpec = {
                name: 'name',
                in: 'path',
                required: true,
                schema: {
                    type: 'string',
                    format: 'password',
                },
            };
            expectSpecToBeEqual(MyController, expectedParamSpec);
        });
    });
});
function expectSpecToBeEqual(controller, paramSpec) {
    const actualSpec = (0, __1.getControllerSpec)(controller);
    (0, testlab_1.expect)(actualSpec.paths['/greet/{name}']['get'].parameters).to.eql([
        paramSpec,
    ]);
}
//# sourceMappingURL=param-path.decorator.unit.js.map
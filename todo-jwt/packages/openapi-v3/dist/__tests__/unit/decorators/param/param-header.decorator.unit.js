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
    describe('@param.header.string', () => {
        it('defines a parameter with in:header type:string', () => {
            class MyController {
                greet(name) { }
            }
            tslib_1.__decorate([
                (0, __1.get)('/greet'),
                tslib_1.__param(0, __1.param.header.string('name')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const expectedParamSpec = {
                name: 'name',
                in: 'header',
                schema: {
                    type: 'string',
                },
            };
            expectSpecToBeEqual(MyController, expectedParamSpec);
        });
        it('allows additional spec properties with in:header type:string', () => {
            class MyController {
                greet(name) { }
            }
            tslib_1.__decorate([
                (0, __1.get)('/greet'),
                tslib_1.__param(0, __1.param.header.string('name', { description: 'Name' })),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const expectedParamSpec = {
                name: 'name',
                in: 'header',
                description: 'Name',
                schema: {
                    type: 'string',
                },
            };
            expectSpecToBeEqual(MyController, expectedParamSpec);
        });
    });
    describe('@param.header.number', () => {
        it('defines a parameter with in:header type:number', () => {
            class MyController {
                greet(name) { }
            }
            tslib_1.__decorate([
                (0, __1.get)('/greet'),
                tslib_1.__param(0, __1.param.header.number('name')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [Number]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const expectedParamSpec = {
                name: 'name',
                in: 'header',
                schema: {
                    type: 'number',
                },
            };
            expectSpecToBeEqual(MyController, expectedParamSpec);
        });
    });
    describe('@param.header.integer', () => {
        it('defines a parameter with in:header type:integer', () => {
            class MyController {
                greet(name) { }
            }
            tslib_1.__decorate([
                (0, __1.get)('/greet'),
                tslib_1.__param(0, __1.param.header.integer('name')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [Number]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const expectedParamSpec = {
                name: 'name',
                in: 'header',
                schema: {
                    type: 'integer',
                    format: 'int32',
                },
            };
            expectSpecToBeEqual(MyController, expectedParamSpec);
        });
    });
    describe('@param.header.boolean', () => {
        it('defines a parameter with in:header type:boolean', () => {
            class MyController {
                greet(name) { }
            }
            tslib_1.__decorate([
                (0, __1.get)('/greet'),
                tslib_1.__param(0, __1.param.header.boolean('name')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [Boolean]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const expectedParamSpec = {
                name: 'name',
                in: 'header',
                schema: {
                    type: 'boolean',
                },
            };
            expectSpecToBeEqual(MyController, expectedParamSpec);
        });
    });
    describe('@param.header.long', () => {
        it('defines a parameter with in:header type:long', () => {
            class MyController {
                greet(name) { }
            }
            tslib_1.__decorate([
                (0, __1.get)('/greet'),
                tslib_1.__param(0, __1.param.header.long('name')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [Number]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const expectedParamSpec = {
                name: 'name',
                in: 'header',
                schema: {
                    type: 'integer',
                    format: 'int64',
                },
            };
            expectSpecToBeEqual(MyController, expectedParamSpec);
        });
    });
    describe('@param.header.float', () => {
        it('defines a parameter with in:header type:float', () => {
            class MyController {
                greet(name) { }
            }
            tslib_1.__decorate([
                (0, __1.get)('/greet'),
                tslib_1.__param(0, __1.param.header.float('name')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [Number]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const expectedParamSpec = {
                name: 'name',
                in: 'header',
                schema: {
                    type: 'number',
                    format: 'float',
                },
            };
            expectSpecToBeEqual(MyController, expectedParamSpec);
        });
    });
    describe('@param.header.double', () => {
        it('defines a parameter with in:header type:double', () => {
            class MyController {
                greet(name) { }
            }
            tslib_1.__decorate([
                (0, __1.get)('/greet'),
                tslib_1.__param(0, __1.param.header.double('name')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [Number]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const expectedParamSpec = {
                name: 'name',
                in: 'header',
                schema: {
                    type: 'number',
                    format: 'double',
                },
            };
            expectSpecToBeEqual(MyController, expectedParamSpec);
        });
    });
    describe('@param.header.byte', () => {
        it('defines a parameter with in:header type:byte', () => {
            class MyController {
                greet(name) { }
            }
            tslib_1.__decorate([
                (0, __1.get)('/greet'),
                tslib_1.__param(0, __1.param.header.byte('name')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const expectedParamSpec = {
                name: 'name',
                in: 'header',
                schema: {
                    type: 'string',
                    format: 'byte',
                },
            };
            expectSpecToBeEqual(MyController, expectedParamSpec);
        });
    });
    describe('@param.header.binary', () => {
        it('defines a parameter with in:header type:binary', () => {
            class MyController {
                greet(name) { }
            }
            tslib_1.__decorate([
                (0, __1.get)('/greet'),
                tslib_1.__param(0, __1.param.header.binary('name')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const expectedParamSpec = {
                name: 'name',
                in: 'header',
                schema: {
                    type: 'string',
                    format: 'binary',
                },
            };
            expectSpecToBeEqual(MyController, expectedParamSpec);
        });
    });
    describe('@param.header.date', () => {
        it('defines a parameter with in:header type:date', () => {
            class MyController {
                greet(name) { }
            }
            tslib_1.__decorate([
                (0, __1.get)('/greet'),
                tslib_1.__param(0, __1.param.header.date('name')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const expectedParamSpec = {
                name: 'name',
                in: 'header',
                schema: {
                    type: 'string',
                    format: 'date',
                },
            };
            expectSpecToBeEqual(MyController, expectedParamSpec);
        });
    });
    describe('@param.header.dateTime', () => {
        it('defines a parameter with in:header type:dateTime', () => {
            class MyController {
                greet(name) { }
            }
            tslib_1.__decorate([
                (0, __1.get)('/greet'),
                tslib_1.__param(0, __1.param.header.dateTime('name')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const expectedParamSpec = {
                name: 'name',
                in: 'header',
                schema: {
                    type: 'string',
                    format: 'date-time',
                },
            };
            expectSpecToBeEqual(MyController, expectedParamSpec);
        });
    });
    describe('@param.header.password', () => {
        it('defines a parameter with in:header type:password', () => {
            class MyController {
                greet(name) { }
            }
            tslib_1.__decorate([
                (0, __1.get)('/greet'),
                tslib_1.__param(0, __1.param.header.password('name')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const expectedParamSpec = {
                name: 'name',
                in: 'header',
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
    (0, testlab_1.expect)(actualSpec.paths['/greet']['get'].parameters).to.eql([paramSpec]);
}
//# sourceMappingURL=param-header.decorator.unit.js.map
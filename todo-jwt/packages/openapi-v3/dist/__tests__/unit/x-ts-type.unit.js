"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/openapi-v3
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
const decorators_1 = require("../../decorators");
describe('x-ts-type is converted in the right places', () => {
    // setup the models for use
    let TestRequest = class TestRequest extends repository_1.Model {
    };
    tslib_1.__decorate([
        (0, repository_1.property)({ default: 1 }),
        tslib_1.__metadata("design:type", Number)
    ], TestRequest.prototype, "value", void 0);
    TestRequest = tslib_1.__decorate([
        (0, repository_1.model)()
    ], TestRequest);
    let SuccessModel = class SuccessModel extends repository_1.Model {
        constructor(err) {
            super(err);
        }
    };
    tslib_1.__decorate([
        (0, repository_1.property)({ default: 'ok' }),
        tslib_1.__metadata("design:type", String)
    ], SuccessModel.prototype, "message", void 0);
    SuccessModel = tslib_1.__decorate([
        (0, repository_1.model)(),
        tslib_1.__metadata("design:paramtypes", [Object])
    ], SuccessModel);
    let FooError = class FooError extends repository_1.Model {
        constructor(err) {
            super(err);
        }
    };
    tslib_1.__decorate([
        (0, repository_1.property)({ default: 'foo' }),
        tslib_1.__metadata("design:type", String)
    ], FooError.prototype, "foo", void 0);
    FooError = tslib_1.__decorate([
        (0, repository_1.model)(),
        tslib_1.__metadata("design:paramtypes", [Object])
    ], FooError);
    let NotError = class NotError extends repository_1.Model {
        constructor(err) {
            super(err);
        }
    };
    tslib_1.__decorate([
        (0, repository_1.property)({ default: true }),
        tslib_1.__metadata("design:type", Boolean)
    ], NotError.prototype, "fail", void 0);
    NotError = tslib_1.__decorate([
        (0, repository_1.model)(),
        tslib_1.__metadata("design:paramtypes", [Object])
    ], NotError);
    let BarError = class BarError extends repository_1.Model {
        constructor(err) {
            super(err);
        }
    };
    tslib_1.__decorate([
        (0, repository_1.property)({ default: 'bar' }),
        tslib_1.__metadata("design:type", String)
    ], BarError.prototype, "bar", void 0);
    BarError = tslib_1.__decorate([
        (0, repository_1.model)(),
        tslib_1.__metadata("design:paramtypes", [Object])
    ], BarError);
    const testRequestSchema = {
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/TestRequest',
                },
            },
        },
    };
    const successSchema = {
        description: 'Success',
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/SuccessModel',
                },
            },
        },
    };
    const notSchema = {
        description: 'Failure',
        content: {
            'application/json': {
                schema: {
                    not: { $ref: '#/components/schemas/BarError' },
                },
            },
        },
    };
    const fooBarSchema = (k) => ({
        description: 'Failure',
        content: {
            'application/json': {
                schema: {
                    [k]: [
                        { $ref: '#/components/schemas/FooError' },
                        { $ref: '#/components/schemas/BarError' },
                    ],
                    not: { $ref: '#/components/schemas/NotError' },
                },
            },
        },
    });
    it('Allows a simple request schema', () => {
        class MyController {
            greet(body) {
                return 'Hello world!';
            }
        }
        tslib_1.__decorate([
            (0, decorators_1.post)('/greet'),
            tslib_1.__param(0, (0, decorators_1.requestBody)()),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [TestRequest]),
            tslib_1.__metadata("design:returntype", void 0)
        ], MyController.prototype, "greet", null);
        const actualSpec = (0, __1.getControllerSpec)(MyController);
        (0, testlab_1.expect)(actualSpec.paths['/greet'].post.requestBody).to.eql(testRequestSchema);
    });
    it('Does not process existing $ref responses', () => {
        const successContent = { $ref: '#/components/schema/SomeReference' };
        class MyController {
            greet(body) {
                return 'Hello world!';
            }
        }
        tslib_1.__decorate([
            (0, decorators_1.post)('/greet', {
                responses: {
                    201: successContent,
                },
            }),
            tslib_1.__param(0, (0, decorators_1.requestBody)()),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [TestRequest]),
            tslib_1.__metadata("design:returntype", void 0)
        ], MyController.prototype, "greet", null);
        const actualSpec = (0, __1.getControllerSpec)(MyController);
        (0, testlab_1.expect)(actualSpec.paths['/greet'].post.responses[201]).to.eql(successContent);
    });
    it('Allows for a response schema using the spec', () => {
        var _a, _b;
        class MyController {
            greet() {
                return new SuccessModel({ message: 'hello, world' });
            }
        }
        tslib_1.__decorate([
            (0, decorators_1.get)('/greet', {
                responses: {
                    200: {
                        description: 'Success',
                        content: {
                            'application/json': {
                                schema: {
                                    'x-ts-type': SuccessModel,
                                },
                            },
                        },
                    },
                },
            }),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", void 0)
        ], MyController.prototype, "greet", null);
        const actualSpec = (0, __1.getControllerSpec)(MyController);
        (0, testlab_1.expect)(actualSpec.paths['/greet'].get.responses[200]).to.eql(successSchema);
        (0, testlab_1.expect)((_b = (_a = actualSpec.components) === null || _a === void 0 ? void 0 : _a.schemas) === null || _b === void 0 ? void 0 : _b.SuccessModel).to.not.be.undefined();
    });
    it('Allows `anyOf` responses', () => {
        class MyController {
            greet() {
                throw new FooError({ foo: 'foo' });
            }
        }
        tslib_1.__decorate([
            (0, decorators_1.get)('/greet', {
                responses: {
                    404: {
                        description: 'Failure',
                        content: {
                            'application/json': {
                                schema: {
                                    anyOf: [{ 'x-ts-type': FooError }, { 'x-ts-type': BarError }],
                                    not: { 'x-ts-type': NotError },
                                },
                            },
                        },
                    },
                },
            }),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", void 0)
        ], MyController.prototype, "greet", null);
        const actualSpec = (0, __1.getControllerSpec)(MyController);
        (0, testlab_1.expect)(actualSpec.paths['/greet'].get.responses[404]).to.eql(fooBarSchema('anyOf'));
    });
    it('Allows `allOf` responses', () => {
        class MyController {
            greet() {
                throw new FooError({ foo: 'foo' });
            }
        }
        tslib_1.__decorate([
            (0, decorators_1.get)('/greet', {
                responses: {
                    404: {
                        description: 'Failure',
                        content: {
                            'application/json': {
                                schema: {
                                    allOf: [{ 'x-ts-type': FooError }, { 'x-ts-type': BarError }],
                                    not: { 'x-ts-type': NotError },
                                },
                            },
                        },
                    },
                },
            }),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", void 0)
        ], MyController.prototype, "greet", null);
        const actualSpec = (0, __1.getControllerSpec)(MyController);
        (0, testlab_1.expect)(actualSpec.paths['/greet'].get.responses[404]).to.eql(fooBarSchema('allOf'));
    });
    it('Allows `oneOf` responses', () => {
        class MyController {
            greet() {
                throw new FooError({ foo: 'foo' });
            }
        }
        tslib_1.__decorate([
            (0, decorators_1.get)('/greet', {
                responses: {
                    404: {
                        description: 'Failure',
                        content: {
                            'application/json': {
                                schema: {
                                    oneOf: [{ 'x-ts-type': FooError }, { 'x-ts-type': BarError }],
                                    not: { 'x-ts-type': NotError },
                                },
                            },
                        },
                    },
                },
            }),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", void 0)
        ], MyController.prototype, "greet", null);
        const actualSpec = (0, __1.getControllerSpec)(MyController);
        (0, testlab_1.expect)(actualSpec.paths['/greet'].get.responses[404]).to.eql(fooBarSchema('oneOf'));
    });
    it('Allows `not` responses', () => {
        class MyController {
            greet() {
                throw new FooError({ foo: 'foo' });
            }
        }
        tslib_1.__decorate([
            (0, decorators_1.get)('/greet', {
                responses: {
                    404: {
                        description: 'Failure',
                        content: {
                            'application/json': {
                                schema: {
                                    not: { 'x-ts-type': BarError },
                                },
                            },
                        },
                    },
                },
            }),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", void 0)
        ], MyController.prototype, "greet", null);
        const actualSpec = (0, __1.getControllerSpec)(MyController);
        (0, testlab_1.expect)(actualSpec.paths['/greet'].get.responses[404]).to.eql(notSchema);
    });
});
//# sourceMappingURL=x-ts-type.unit.js.map
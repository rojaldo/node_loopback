"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/openapi-v3
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const testlab_1 = require("@loopback/testlab");
const httpStatus = tslib_1.__importStar(require("http-status"));
const __1 = require("../../..");
describe('@oas.response decorator', () => {
    it('allows a class to not be decorated with @oas.response at all', () => {
        class MyController {
            greet() {
                return 'Hello world!';
            }
        }
        tslib_1.__decorate([
            (0, __1.get)('/greet'),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", void 0)
        ], MyController.prototype, "greet", null);
        const actualSpec = (0, __1.getControllerSpec)(MyController);
        (0, testlab_1.expect)(actualSpec.paths['/greet'].get.responses['200'].description).to.eql('Return value of MyController.greet');
    });
    context('with response models', () => {
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
        let Base = class Base {
        };
        tslib_1.__decorate([
            (0, repository_1.property)(),
            tslib_1.__metadata("design:type", String)
        ], Base.prototype, "name", void 0);
        Base = tslib_1.__decorate([
            (0, repository_1.model)()
        ], Base);
        const successSchema = {
            description: httpStatus['200'],
            content: {
                'application/json': {
                    schema: {
                        $ref: '#/components/schemas/SuccessModel',
                    },
                },
            },
        };
        const baseSchema = {
            description: httpStatus['200'],
            content: {
                'application/json': {
                    schema: {
                        $ref: '#/components/schemas/Base',
                    },
                },
            },
        };
        const fooBarSchema = {
            description: httpStatus['404'],
            content: {
                'application/json': {
                    schema: {
                        anyOf: [
                            { $ref: '#/components/schemas/BarError' },
                            { $ref: '#/components/schemas/FooError' },
                        ],
                    },
                },
            },
        };
        it('supports a single @oas.response decorator', () => {
            var _a, _b;
            class MyController {
                greet() {
                    return new SuccessModel({ message: 'Hello, world' });
                }
            }
            tslib_1.__decorate([
                (0, __1.get)('/greet'),
                __1.oas.response(200, SuccessModel),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", []),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const actualSpec = (0, __1.getControllerSpec)(MyController);
            (0, testlab_1.expect)(actualSpec.paths['/greet'].get.responses[200]).to.eql(successSchema);
            (0, testlab_1.expect)((_b = (_a = actualSpec.components) === null || _a === void 0 ? void 0 : _a.schemas) === null || _b === void 0 ? void 0 : _b.SuccessModel).to.not.be.undefined();
        });
        it('supports @oas.response for a model class not extending Model', () => {
            var _a, _b;
            class MyController {
                greet() {
                    return new Base();
                }
            }
            tslib_1.__decorate([
                (0, __1.get)('/greet'),
                __1.oas.response(200, Base),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", []),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const actualSpec = (0, __1.getControllerSpec)(MyController);
            (0, testlab_1.expect)(actualSpec.paths['/greet'].get.responses[200]).to.eql(baseSchema);
            (0, testlab_1.expect)((_b = (_a = actualSpec.components) === null || _a === void 0 ? void 0 : _a.schemas) === null || _b === void 0 ? void 0 : _b.Base).to.not.be.undefined();
        });
        it('supports multiple @oas.response decorators on a method', () => {
            var _a, _b, _c, _d, _e, _f;
            class MyController {
                greet() {
                    throw new FooError({ foo: 'bar' });
                }
            }
            tslib_1.__decorate([
                (0, __1.get)('/greet'),
                __1.oas.response(200, SuccessModel),
                __1.oas.response(404, FooError),
                __1.oas.response(404, BarError),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", []),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const actualSpec = (0, __1.getControllerSpec)(MyController);
            (0, testlab_1.expect)(actualSpec.paths['/greet'].get.responses[404]).to.eql(fooBarSchema);
            (0, testlab_1.expect)((_b = (_a = actualSpec.components) === null || _a === void 0 ? void 0 : _a.schemas) === null || _b === void 0 ? void 0 : _b.FooError).to.not.be.undefined();
            (0, testlab_1.expect)((_d = (_c = actualSpec.components) === null || _c === void 0 ? void 0 : _c.schemas) === null || _d === void 0 ? void 0 : _d.BarError).to.not.be.undefined();
            (0, testlab_1.expect)((_f = (_e = actualSpec.components) === null || _e === void 0 ? void 0 : _e.schemas) === null || _f === void 0 ? void 0 : _f.SuccessModel).to.not.be.undefined();
        });
        it('supports multiple @oas.response decorators with an array of models', () => {
            var _a, _b, _c, _d, _e, _f;
            class MyController {
                greet() {
                    throw new BarError({ bar: 'baz' });
                }
            }
            tslib_1.__decorate([
                (0, __1.get)('/greet'),
                __1.oas.response(200, SuccessModel),
                __1.oas.response(404, BarError, FooError),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", []),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const actualSpec = (0, __1.getControllerSpec)(MyController);
            (0, testlab_1.expect)(actualSpec.paths['/greet'].get.responses[404]).to.eql(fooBarSchema);
            (0, testlab_1.expect)((_b = (_a = actualSpec.components) === null || _a === void 0 ? void 0 : _a.schemas) === null || _b === void 0 ? void 0 : _b.FooError).to.not.be.undefined();
            (0, testlab_1.expect)((_d = (_c = actualSpec.components) === null || _c === void 0 ? void 0 : _c.schemas) === null || _d === void 0 ? void 0 : _d.BarError).to.not.be.undefined();
            (0, testlab_1.expect)((_f = (_e = actualSpec.components) === null || _e === void 0 ? void 0 : _e.schemas) === null || _f === void 0 ? void 0 : _f.SuccessModel).to.not.be.undefined();
        });
        context('with complex responses', () => {
            const FIRST_SCHEMA = {
                type: 'object',
                properties: {
                    x: {
                        type: 'int',
                        default: 1,
                    },
                    y: {
                        type: 'string',
                        default: '2',
                    },
                },
            };
            class MyController {
                greet() {
                    return new SuccessModel({ message: 'Hello, world!' });
                }
            }
            tslib_1.__decorate([
                (0, __1.get)('/greet', {
                    responses: {
                        200: {
                            description: 'Unknown',
                            content: {
                                'application/jsonc': { schema: FIRST_SCHEMA },
                            },
                        },
                    },
                }),
                __1.oas.response(200, SuccessModel, {
                    content: {
                        'application/pdf': { schema: { type: 'string', format: 'base64' } },
                    },
                }),
                __1.oas.response(404, FooError, BarError),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", []),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const actualSpec = (0, __1.getControllerSpec)(MyController);
            (0, testlab_1.expect)(actualSpec.paths['/greet'].get.responses[200].content['application/jsonc']).to.not.be.undefined();
            (0, testlab_1.expect)(actualSpec.paths['/greet'].get.responses[200].content['application/json']).to.not.be.undefined();
            (0, testlab_1.expect)(actualSpec.paths['/greet'].get.responses[200].content['application/pdf']).to.not.be.undefined();
            (0, testlab_1.expect)(actualSpec.paths['/greet'].get.responses[200].content['application/json'].schema).to.eql({ $ref: '#/components/schemas/SuccessModel' });
        });
    });
    context('@oas.response.file', () => {
        it('allows @oas.response.file with media types', () => {
            class MyController {
                download(fileName) {
                    // use response.download(...);
                }
            }
            tslib_1.__decorate([
                (0, __1.get)('/files/{filename}'),
                __1.oas.response.file('image/jpeg', 'image/png'),
                tslib_1.__param(0, __1.param.path.string('filename')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "download", null);
            const actualSpec = (0, __1.getControllerSpec)(MyController);
            (0, testlab_1.expect)(actualSpec.paths['/files/{filename}'].get.responses['200']).to.eql({
                description: 'The file content',
                content: {
                    'image/jpeg': {
                        schema: { type: 'string', format: 'binary' },
                    },
                    'image/png': {
                        schema: { type: 'string', format: 'binary' },
                    },
                },
            });
        });
        it('allows @oas.response.file without media types', () => {
            class MyController {
                download(filename) {
                    // use response.download(...);
                }
            }
            tslib_1.__decorate([
                (0, __1.get)('/files/{filename}'),
                __1.oas.response.file(),
                tslib_1.__param(0, __1.param.path.string('filename')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "download", null);
            const actualSpec = (0, __1.getControllerSpec)(MyController);
            (0, testlab_1.expect)(actualSpec.paths['/files/{filename}'].get.responses['200']).to.eql({
                description: 'The file content',
                content: {
                    'application/octet-stream': {
                        schema: { type: 'string', format: 'binary' },
                    },
                },
            });
        });
    });
});
//# sourceMappingURL=response.decorator.unit.js.map
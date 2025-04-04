"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/openapi-v3
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const openapi_spec_builder_1 = require("@loopback/openapi-spec-builder");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../..");
describe('@oas.tags decorator', () => {
    context('Without a top-level @api definition', () => {
        it('Allows a class to not be decorated with @oas.tags at all', () => {
            class MyController {
                greet() {
                    return 'Hello world!';
                }
                echo() {
                    return 'Hello world!';
                }
            }
            tslib_1.__decorate([
                (0, __1.get)('/greet'),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", []),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            tslib_1.__decorate([
                (0, __1.get)('/echo'),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", []),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "echo", null);
            const actualSpec = (0, __1.getControllerSpec)(MyController);
            (0, testlab_1.expect)(actualSpec.paths['/greet'].get.tags).to.be.undefined();
        });
        it('Allows a class to decorate methods with @oas.tags', () => {
            let MyController = class MyController {
                greet() {
                    return 'Hello world!';
                }
                echo() {
                    return 'Hello world!';
                }
            };
            tslib_1.__decorate([
                (0, __1.get)('/greet'),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", []),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            tslib_1.__decorate([
                (0, __1.get)('/echo'),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", []),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "echo", null);
            MyController = tslib_1.__decorate([
                __1.oas.tags('Foo', 'Bar')
            ], MyController);
            const actualSpec = (0, __1.getControllerSpec)(MyController);
            (0, testlab_1.expect)(actualSpec.paths['/greet'].get.tags).to.eql(['Foo', 'Bar']);
            (0, testlab_1.expect)(actualSpec.paths['/echo'].get.tags).to.eql(['Foo', 'Bar']);
        });
        it('Allows @oas.tags with options to append', () => {
            let MyController = class MyController {
                greet() {
                    return 'Hello world!';
                }
                echo() {
                    return 'Hello world!';
                }
            };
            tslib_1.__decorate([
                (0, __1.get)('/greet'),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", []),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            tslib_1.__decorate([
                (0, __1.get)('/echo'),
                __1.oas.tags('Bar'),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", []),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "echo", null);
            MyController = tslib_1.__decorate([
                __1.oas.tags('Foo')
            ], MyController);
            const actualSpec = (0, __1.getControllerSpec)(MyController);
            (0, testlab_1.expect)(actualSpec.paths['/greet'].get.tags).to.eql(['Foo']);
            (0, testlab_1.expect)(actualSpec.paths['/echo'].get.tags).to.eql(['Foo', 'Bar']);
        });
        it('Does not allow a member variable to be decorated', () => {
            const shouldThrow = () => {
                class MyController {
                    greet() { }
                }
                tslib_1.__decorate([
                    __1.oas.tags('foo', 'bar'),
                    tslib_1.__metadata("design:type", String)
                ], MyController.prototype, "foo", void 0);
                tslib_1.__decorate([
                    (0, __1.get)('/greet'),
                    tslib_1.__metadata("design:type", Function),
                    tslib_1.__metadata("design:paramtypes", []),
                    tslib_1.__metadata("design:returntype", void 0)
                ], MyController.prototype, "greet", null);
                return (0, __1.getControllerSpec)(MyController);
            };
            (0, testlab_1.expect)(shouldThrow).to.throw(/^\@oas.tags cannot be used on a property:/);
        });
    });
    context('With a top-level @api definition', () => {
        const expectedSpec = (0, openapi_spec_builder_1.anOpenApiSpec)()
            .withOperationReturningString('get', '/greet', 'greet')
            .build();
        expectedSpec.paths['/greet'].get.tags = ['Bin', 'Fill'];
        it('Allows a class to not be decorated with @oas.tags at all', () => {
            let MyController = class MyController {
                greet() {
                    return 'Hello world!';
                }
                echo() {
                    return 'Hello world!';
                }
            };
            MyController = tslib_1.__decorate([
                (0, __1.api)(expectedSpec)
            ], MyController);
            const actualSpec = (0, __1.getControllerSpec)(MyController);
            (0, testlab_1.expect)(actualSpec.paths['/greet'].get.tags).to.eql(['Bin', 'Fill']);
        });
        it('Allows a class to decorate methods with @oas.tags', () => {
            let MyController = class MyController {
                greet() {
                    return 'Hello world!';
                }
            };
            MyController = tslib_1.__decorate([
                (0, __1.api)(expectedSpec),
                __1.oas.tags('Foo', 'Bar')
            ], MyController);
            const actualSpec = (0, __1.getControllerSpec)(MyController);
            (0, testlab_1.expect)(actualSpec.paths['/greet'].get.tags).to.containDeep([
                'Foo',
                'Bar',
                'Bin',
                'Fill',
            ]);
        });
    });
    it('Does not allow a member variable to be decorated', () => {
        const shouldThrow = () => {
            class MyController {
                greet() { }
            }
            tslib_1.__decorate([
                __1.oas.tags('foo', 'bar'),
                tslib_1.__metadata("design:type", String)
            ], MyController.prototype, "foo", void 0);
            tslib_1.__decorate([
                (0, __1.get)('/greet'),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", []),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            return (0, __1.getControllerSpec)(MyController);
        };
        (0, testlab_1.expect)(shouldThrow).to.throw(/^\@oas.tags cannot be used on a property:/);
    });
});
//# sourceMappingURL=tags.decorator.unit.js.map
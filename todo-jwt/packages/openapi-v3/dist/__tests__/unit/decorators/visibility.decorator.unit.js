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
/**
 * Verification of the Controller Spec uses string literals (e.g.
 * 'documented', 'undocumented') instead of the `OperationVisibility` enum so
 * as to verify that the enum itself did not change.
 */
describe('visibility decorator', () => {
    it('Returns a spec with all the items decorated from the class level', () => {
        const expectedSpec = (0, openapi_spec_builder_1.anOpenApiSpec)()
            .withOperationReturningString('get', '/greet', 'greet')
            .withOperationReturningString('get', '/echo', 'echo')
            .build();
        let MyController = class MyController {
            greet() {
                return 'Hello world!';
            }
            echo() {
                return 'Hello world!';
            }
        };
        MyController = tslib_1.__decorate([
            (0, __1.api)(expectedSpec),
            __1.oas.visibility(__1.OperationVisibility.UNDOCUMENTED)
        ], MyController);
        const actualSpec = (0, __1.getControllerSpec)(MyController);
        (0, testlab_1.expect)(actualSpec.paths['/greet'].get['x-visibility']).to.eql('undocumented');
        (0, testlab_1.expect)(actualSpec.paths['/echo'].get['x-visibility']).to.eql('undocumented');
    });
    it('Returns a spec where only one method is undocumented', () => {
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
            __1.oas.visibility(__1.OperationVisibility.UNDOCUMENTED),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", void 0)
        ], MyController.prototype, "echo", null);
        const actualSpec = (0, __1.getControllerSpec)(MyController);
        (0, testlab_1.expect)(actualSpec.paths['/greet'].get['x-visibility']).to.be.undefined();
        (0, testlab_1.expect)(actualSpec.paths['/echo'].get['x-visibility']).to.eql('undocumented');
    });
    it('Allows a method to override the visibility of a class', () => {
        let MyController = class MyController {
            greet() {
                return 'Hello world!';
            }
            echo() {
                return 'Hello world!';
            }
            yell() {
                return 'HELLO WORLD!';
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
        tslib_1.__decorate([
            (0, __1.get)('/yell'),
            __1.oas.visibility(__1.OperationVisibility.DOCUMENTED),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", void 0)
        ], MyController.prototype, "yell", null);
        MyController = tslib_1.__decorate([
            __1.oas.visibility(__1.OperationVisibility.UNDOCUMENTED)
        ], MyController);
        const actualSpec = (0, __1.getControllerSpec)(MyController);
        (0, testlab_1.expect)(actualSpec.paths['/greet'].get['x-visibility']).to.eql('undocumented');
        (0, testlab_1.expect)(actualSpec.paths['/echo'].get['x-visibility']).to.eql('undocumented');
        (0, testlab_1.expect)(actualSpec.paths['/yell'].get['x-visibility']).to.be.eql('documented');
    });
    it('Allows a class to not be decorated with @oas.visibility at all', () => {
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
        (0, testlab_1.expect)(actualSpec.paths['/greet'].get['x-visibility']).to.be.undefined();
        (0, testlab_1.expect)(actualSpec.paths['/echo'].get['x-visibility']).to.be.undefined();
    });
    it('Does not allow a member variable to be decorated', () => {
        const shouldThrow = () => {
            class MyController {
                greet() { }
            }
            tslib_1.__decorate([
                __1.oas.visibility(__1.OperationVisibility.UNDOCUMENTED),
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
        (0, testlab_1.expect)(shouldThrow).to.throw(/^\@oas.visibility cannot be used on a property:/);
    });
});
//# sourceMappingURL=visibility.decorator.unit.js.map
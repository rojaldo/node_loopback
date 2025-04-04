"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/openapi-v3
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../../../");
describe('requestBody decorator', () => {
    context('for a primitive type', () => {
        let actualSpec;
        let expectedContent;
        it('infers number', () => {
            class MyController {
                greet(name) { }
            }
            tslib_1.__decorate([
                (0, __1.post)('/greeting'),
                tslib_1.__param(0, (0, __1.requestBody)()),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [Number]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            assertRequestBodySpec({ type: 'number' }, MyController);
        });
        it('infers string', () => {
            class MyController {
                greet(name) { }
            }
            tslib_1.__decorate([
                (0, __1.post)('/greeting'),
                tslib_1.__param(0, (0, __1.requestBody)()),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            assertRequestBodySpec({ type: 'string' }, MyController);
        });
        it('infers boolean', () => {
            class MyController {
                greet(name) { }
            }
            tslib_1.__decorate([
                (0, __1.post)('/greeting'),
                tslib_1.__param(0, (0, __1.requestBody)()),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [Boolean]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            assertRequestBodySpec({ type: 'boolean' }, MyController);
        });
        it('infers object', () => {
            class MyController {
                greet(name) { }
            }
            tslib_1.__decorate([
                (0, __1.post)('/greeting'),
                tslib_1.__param(0, (0, __1.requestBody)()),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [Object]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            assertRequestBodySpec({ type: 'object' }, MyController);
        });
        it('infers array', () => {
            class MyController {
                greet(name) { }
            }
            tslib_1.__decorate([
                (0, __1.post)('/greeting'),
                tslib_1.__param(0, (0, __1.requestBody)()),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [Array]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            assertRequestBodySpec({ type: 'array' }, MyController);
        });
        function assertRequestBodySpec(expectedSchemaSpec, controller) {
            actualSpec = (0, __1.getControllerSpec)(controller);
            expectedContent = {
                'application/json': {
                    schema: expectedSchemaSpec,
                },
            };
            (0, testlab_1.expect)(actualSpec.paths['/greeting']['post'].requestBody.content).to.eql(expectedContent);
        }
    });
});
//# sourceMappingURL=request-body-primitives.decorator.unit.js.map
"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/openapi-v3
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../../..");
describe('requestBody decorator', () => {
    context('can build a correct "RequestBody" spec and', () => {
        it('persists "description" and "required" into the generated schema', () => {
            const requestSpec = {
                description: 'A sample request body',
                required: true,
            };
            class MyController {
                greet(name) { }
            }
            tslib_1.__decorate([
                (0, __1.post)('/greeting'),
                tslib_1.__param(0, (0, __1.requestBody)(requestSpec)),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const requestBodySpec = (0, __1.getControllerSpec)(MyController).paths['/greeting']['post'].requestBody;
            (0, testlab_1.expect)(requestBodySpec).to.have.properties({
                description: 'A sample request body',
                required: true,
            });
        });
        it('defaults content-type to "application/json"', () => {
            const requestSpec = {
                description: 'A sample request body',
                required: true,
            };
            class MyController {
                greet(name) { }
            }
            tslib_1.__decorate([
                (0, __1.post)('/greeting'),
                tslib_1.__param(0, (0, __1.requestBody)(requestSpec)),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const requestBodySpec = (0, __1.getControllerSpec)(MyController).paths['/greeting']['post'].requestBody;
            (0, testlab_1.expect)(requestBodySpec.content).to.have.key('application/json');
        });
        it('infers request body with complex type', () => {
            const expectedContent = {
                'application/text': {
                    schema: { $ref: '#/components/schemas/MyModel' },
                },
            };
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
                createMyModel(inst) { }
            }
            tslib_1.__decorate([
                (0, __1.post)('/MyModel'),
                tslib_1.__param(0, (0, __1.requestBody)({ content: { 'application/text': {} } })),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [MyModel]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "createMyModel", null);
            const requestBodySpec = (0, __1.getControllerSpec)(MyController).paths['/MyModel']['post'].requestBody;
            (0, testlab_1.expect)(requestBodySpec.content).to.deepEqual(expectedContent);
        });
        it('preserves user-provided schema in requestBody', () => {
            const expectedContent = {
                'application/json': {
                    schema: { type: 'object' },
                },
            };
            class MyModel {
            }
            class MyController {
                createMyModel(inst) { }
            }
            tslib_1.__decorate([
                (0, __1.post)('/MyModel'),
                tslib_1.__param(0, (0, __1.requestBody)({ content: expectedContent })),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [MyModel]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "createMyModel", null);
            const requestBodySpec = (0, __1.getControllerSpec)(MyController).paths['/MyModel']['post'].requestBody;
            (0, testlab_1.expect)(requestBodySpec.content).to.deepEqual(expectedContent);
        });
        it('preserves user-provided reference in requestBody', () => {
            const expectedContent = {
                'application/json': {
                    schema: { $ref: '#/components/schemas/MyModel' },
                },
            };
            class MyModel {
            }
            class MyController {
                createMyModel(inst) { }
            }
            tslib_1.__decorate([
                (0, __1.post)('/MyModel'),
                tslib_1.__param(0, (0, __1.requestBody)({ content: expectedContent })),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [Object]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "createMyModel", null);
            const requestBodySpec = (0, __1.getControllerSpec)(MyController).paths['/MyModel']['post'].requestBody;
            (0, testlab_1.expect)(requestBodySpec.content).to.deepEqual(expectedContent);
        });
        it('reports error if more than one requestBody are found for the same method', () => {
            class MyController {
                greet(name, foo) { }
            }
            tslib_1.__decorate([
                (0, __1.post)('/greeting'),
                tslib_1.__param(0, (0, __1.requestBody)()),
                tslib_1.__param(1, (0, __1.requestBody)()),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String, Number]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            (0, testlab_1.expect)(() => (0, __1.getControllerSpec)(MyController)).to.throwError(/An operation should only have one parameter decorated by @requestBody/);
        });
    });
});
//# sourceMappingURL=request-body.decorator.unit.js.map
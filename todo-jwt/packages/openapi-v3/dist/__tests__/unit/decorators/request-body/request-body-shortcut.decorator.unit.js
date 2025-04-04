"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/openapi-v3
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../../../");
describe('requestBody decorator - shortcuts', () => {
    context('array', () => {
        it('generates the correct schema spec for an array argument', () => {
            const description = 'an array of names';
            class MyController {
                greet(name) { }
            }
            tslib_1.__decorate([
                (0, __1.post)('/greeting'),
                tslib_1.__param(0, __1.requestBody.array({ type: 'string' }, { description, required: false })),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [Array]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greet", null);
            const actualSpec = (0, __1.getControllerSpec)(MyController);
            const expectedContent = {
                'application/json': {
                    schema: {
                        type: 'array',
                        items: { type: 'string' },
                    },
                },
            };
            const requestBodySpec = actualSpec.paths['/greeting']['post'].requestBody;
            (0, testlab_1.expect)(requestBodySpec).to.have.properties({
                description,
                required: false,
                content: expectedContent,
            });
        });
    });
    context('file', () => {
        it('generates the correct schema spec for a file argument', () => {
            const description = 'a picture';
            class MyController {
                upload(request) { }
            }
            tslib_1.__decorate([
                (0, __1.post)('/pictures'),
                tslib_1.__param(0, __1.requestBody.file({ description, required: true })),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [Object]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "upload", null);
            const actualSpec = (0, __1.getControllerSpec)(MyController);
            const expectedContent = {
                'multipart/form-data': {
                    'x-parser': 'stream',
                    schema: {
                        type: 'object',
                        properties: { file: { type: 'string', format: 'binary' } },
                    },
                },
            };
            const requestBodySpec = actualSpec.paths['/pictures']['post'].requestBody;
            (0, testlab_1.expect)(requestBodySpec).to.have.properties({
                description,
                required: true,
                content: expectedContent,
            });
        });
    });
});
//# sourceMappingURL=request-body-shortcut.decorator.unit.js.map
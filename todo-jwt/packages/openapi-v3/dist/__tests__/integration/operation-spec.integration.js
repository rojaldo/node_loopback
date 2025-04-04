"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/openapi-v3
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../");
describe('operation arguments', () => {
    it('generate parameters and requestBody for operation', () => {
        let User = class User {
        };
        tslib_1.__decorate([
            (0, repository_1.property)(),
            tslib_1.__metadata("design:type", String)
        ], User.prototype, "name", void 0);
        tslib_1.__decorate([
            (0, repository_1.property)(),
            tslib_1.__metadata("design:type", Number)
        ], User.prototype, "password", void 0);
        User = tslib_1.__decorate([
            (0, repository_1.model)()
        ], User);
        class MyController {
            async createUser(type, token, location, user) {
                return;
            }
        }
        tslib_1.__decorate([
            (0, __1.post)('/users/{location}'),
            tslib_1.__param(0, __1.param.query.string('type')),
            tslib_1.__param(1, __1.param.header.string('token')),
            tslib_1.__param(2, __1.param.path.string('location')),
            tslib_1.__param(3, (0, __1.requestBody)()),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [String, String, String, User]),
            tslib_1.__metadata("design:returntype", Promise)
        ], MyController.prototype, "createUser", null);
        const expectedSpec = {
            paths: {
                '/users/{location}': {
                    post: {
                        responses: {
                            '200': { description: 'Return value of MyController.createUser' },
                        },
                        parameters: [
                            { name: 'type', in: 'query', schema: { type: 'string' } },
                            { name: 'token', in: 'header', schema: { type: 'string' } },
                            {
                                name: 'location',
                                in: 'path',
                                required: true,
                                schema: { type: 'string' },
                            },
                        ],
                        requestBody: {
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/User' },
                                },
                            },
                            'x-parameter-index': 3,
                        },
                        'x-controller-name': 'MyController',
                        'x-operation-name': 'createUser',
                        operationId: 'MyController.createUser',
                    },
                },
            },
            components: {
                schemas: {
                    User: {
                        title: 'User',
                        type: 'object',
                        properties: { name: { type: 'string' }, password: { type: 'number' } },
                        additionalProperties: false,
                    },
                },
            },
        };
        const spec = (0, __1.getControllerSpec)(MyController);
        (0, testlab_1.expect)(spec).to.eql(expectedSpec);
    });
    it('allows operation metadata in @get', () => {
        class MyController {
            async findUsers() {
                return [];
            }
        }
        tslib_1.__decorate([
            (0, __1.get)('/users', {
                operationId: 'find_users',
                responses: {
                    '200': { description: 'Users found' },
                },
            }),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", Promise)
        ], MyController.prototype, "findUsers", null);
        const expectedSpec = {
            paths: {
                '/users': {
                    get: {
                        responses: {
                            '200': { description: 'Users found' },
                        },
                        'x-controller-name': 'MyController',
                        'x-operation-name': 'findUsers',
                        operationId: 'find_users',
                    },
                },
            },
        };
        const spec = (0, __1.getControllerSpec)(MyController);
        (0, testlab_1.expect)(spec).to.eql(expectedSpec);
    });
});
//# sourceMappingURL=operation-spec.integration.js.map
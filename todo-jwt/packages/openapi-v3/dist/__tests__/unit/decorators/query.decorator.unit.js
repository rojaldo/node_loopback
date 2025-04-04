"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/openapi-v3
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../..");
describe('sugar decorators for filter and where', () => {
    let controllerSpec;
    before(() => {
        controllerSpec = (0, __1.getControllerSpec)(MyController);
    });
    it('allows @param.filter', () => {
        (0, testlab_1.expect)(controllerSpec.paths['/'].get.parameters).to.eql([
            {
                name: 'filter',
                in: 'query',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            title: 'MyModel.Filter',
                            'x-typescript-type': '@loopback/repository#Filter<MyModel>',
                            properties: {
                                fields: {
                                    oneOf: [
                                        {
                                            type: 'object',
                                            additionalProperties: false,
                                            properties: {
                                                name: {
                                                    type: 'boolean',
                                                },
                                            },
                                        },
                                        {
                                            type: 'array',
                                            uniqueItems: true,
                                            items: {
                                                enum: ['name'],
                                                type: 'string',
                                                example: 'name',
                                            },
                                        },
                                    ],
                                    title: 'MyModel.Fields',
                                },
                                offset: { type: 'integer', minimum: 0 },
                                limit: { type: 'integer', minimum: 1, example: 100 },
                                skip: { type: 'integer', minimum: 0 },
                                order: {
                                    oneOf: [
                                        { type: 'string' },
                                        { type: 'array', items: { type: 'string' } },
                                    ],
                                },
                                where: {
                                    title: 'MyModel.WhereFilter',
                                    type: 'object',
                                    additionalProperties: true,
                                },
                            },
                            additionalProperties: false,
                        },
                    },
                },
            },
        ]);
    });
    it('allows @param.filter with a custom name', () => {
        (0, testlab_1.expect)(controllerSpec.paths['/find'].get.parameters).to.eql([
            {
                name: 'query',
                in: 'query',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            title: 'MyModel.Filter',
                            'x-typescript-type': '@loopback/repository#Filter<MyModel>',
                            properties: {
                                fields: {
                                    oneOf: [
                                        {
                                            type: 'object',
                                            additionalProperties: false,
                                            properties: {
                                                name: {
                                                    type: 'boolean',
                                                },
                                            },
                                        },
                                        {
                                            type: 'array',
                                            uniqueItems: true,
                                            items: {
                                                enum: ['name'],
                                                type: 'string',
                                                example: 'name',
                                            },
                                        },
                                    ],
                                    title: 'MyModel.Fields',
                                },
                                offset: { type: 'integer', minimum: 0 },
                                limit: { type: 'integer', minimum: 1, example: 100 },
                                skip: { type: 'integer', minimum: 0 },
                                order: {
                                    oneOf: [
                                        { type: 'string' },
                                        { type: 'array', items: { type: 'string' } },
                                    ],
                                },
                                where: {
                                    title: 'MyModel.WhereFilter',
                                    type: 'object',
                                    additionalProperties: true,
                                },
                            },
                            additionalProperties: false,
                        },
                    },
                },
            },
        ]);
    });
    it('allows @param.filter with a custom name via options', () => {
        (0, testlab_1.expect)(controllerSpec.paths['/find'].get.parameters[0].name).to.eql('query');
    });
    it('allows @param.filter() excluding where', () => {
        (0, testlab_1.expect)(controllerSpec.paths['/{id}'].get.parameters).to.eql([
            { name: 'id', in: 'path', schema: { type: 'string' }, required: true },
            {
                name: 'filter',
                in: 'query',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            title: 'MyModel.Filter',
                            'x-typescript-type': '@loopback/repository#Filter<MyModel>',
                            properties: {
                                fields: {
                                    oneOf: [
                                        {
                                            type: 'object',
                                            additionalProperties: false,
                                            properties: {
                                                name: {
                                                    type: 'boolean',
                                                },
                                            },
                                        },
                                        {
                                            type: 'array',
                                            uniqueItems: true,
                                            items: {
                                                enum: ['name'],
                                                type: 'string',
                                                example: 'name',
                                            },
                                        },
                                    ],
                                    title: 'MyModel.Fields',
                                },
                                offset: { type: 'integer', minimum: 0 },
                                limit: { type: 'integer', minimum: 1, example: 100 },
                                skip: { type: 'integer', minimum: 0 },
                                order: {
                                    oneOf: [
                                        { type: 'string' },
                                        { type: 'array', items: { type: 'string' } },
                                    ],
                                },
                            },
                            additionalProperties: false,
                        },
                    },
                },
            },
        ]);
    });
    it('allows @param.where', () => {
        (0, testlab_1.expect)(controllerSpec.paths['/count'].get.parameters).to.eql([
            {
                name: 'where',
                in: 'query',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            title: 'MyModel.WhereFilter',
                            'x-typescript-type': '@loopback/repository#Where<MyModel>',
                            additionalProperties: true,
                        },
                    },
                },
            },
        ]);
    });
    let MyModel = class MyModel extends repository_1.Model {
        constructor(data) {
            super(data);
        }
    };
    tslib_1.__decorate([
        (0, repository_1.property)(),
        tslib_1.__metadata("design:type", String)
    ], MyModel.prototype, "name", void 0);
    MyModel = tslib_1.__decorate([
        (0, repository_1.model)(),
        tslib_1.__metadata("design:paramtypes", [Object])
    ], MyModel);
    class MyController {
        async find(filter) {
            throw new Error('Not implemented');
        }
        async findByQuery(query) {
            throw new Error('Not implemented');
        }
        async search(query) {
            throw new Error('Not implemented');
        }
        async findById(id, filter) {
            throw new Error('Not implemented');
        }
        async count(where) {
            throw new Error('Not implemented');
        }
    }
    tslib_1.__decorate([
        (0, __1.get)('/'),
        tslib_1.__param(0, __1.param.filter(MyModel)),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Object]),
        tslib_1.__metadata("design:returntype", Promise)
    ], MyController.prototype, "find", null);
    tslib_1.__decorate([
        (0, __1.get)('/find'),
        tslib_1.__param(0, __1.param.filter(MyModel, 'query')),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Object]),
        tslib_1.__metadata("design:returntype", Promise)
    ], MyController.prototype, "findByQuery", null);
    tslib_1.__decorate([
        (0, __1.get)('/search'),
        tslib_1.__param(0, __1.param.filter(MyModel, { name: 'query' })),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Object]),
        tslib_1.__metadata("design:returntype", Promise)
    ], MyController.prototype, "search", null);
    tslib_1.__decorate([
        (0, __1.get)('/{id}'),
        tslib_1.__param(0, __1.param.path.string('id')),
        tslib_1.__param(1, __1.param.filter(MyModel, { exclude: 'where' })),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [String, Object]),
        tslib_1.__metadata("design:returntype", Promise)
    ], MyController.prototype, "findById", null);
    tslib_1.__decorate([
        (0, __1.get)('/count'),
        tslib_1.__param(0, __1.param.where(MyModel)),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Object]),
        tslib_1.__metadata("design:returntype", Promise)
    ], MyController.prototype, "count", null);
});
//# sourceMappingURL=query.decorator.unit.js.map
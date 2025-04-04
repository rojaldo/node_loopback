"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/openapi-v3
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
describe('filterSchema', () => {
    let MyUserModel = class MyUserModel extends repository_1.Entity {
    };
    tslib_1.__decorate([
        (0, repository_1.property)(),
        tslib_1.__metadata("design:type", String)
    ], MyUserModel.prototype, "id", void 0);
    tslib_1.__decorate([
        (0, repository_1.property)(),
        tslib_1.__metadata("design:type", Number)
    ], MyUserModel.prototype, "age", void 0);
    MyUserModel = tslib_1.__decorate([
        (0, repository_1.model)({
            name: 'my-user-model',
        })
    ], MyUserModel);
    it('generate filter schema', () => {
        const schema = (0, __1.getFilterSchemaFor)(MyUserModel);
        (0, testlab_1.expect)(MyUserModel.definition.name).to.eql('my-user-model');
        (0, testlab_1.expect)(schema).to.eql({
            title: 'my-user-model.Filter',
            type: 'object',
            'x-typescript-type': '@loopback/repository#Filter<MyUserModel>',
            properties: {
                where: {
                    type: 'object',
                    title: 'my-user-model.WhereFilter',
                    additionalProperties: true,
                },
                fields: {
                    oneOf: [
                        {
                            type: 'object',
                            additionalProperties: false,
                            properties: {
                                id: {
                                    type: 'boolean',
                                },
                                age: {
                                    type: 'boolean',
                                },
                            },
                        },
                        {
                            type: 'array',
                            uniqueItems: true,
                            items: {
                                enum: ['id', 'age'],
                                type: 'string',
                                example: 'id',
                            },
                        },
                    ],
                    title: 'my-user-model.Fields',
                },
                offset: { type: 'integer', minimum: 0 },
                limit: { type: 'integer', minimum: 1, example: 100 },
                skip: { type: 'integer', minimum: 0 },
                order: {
                    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
                },
            },
            additionalProperties: false,
        });
    });
    it('generate filter schema excluding where', () => {
        const schema = (0, __1.getFilterSchemaFor)(MyUserModel, { exclude: ['where'] });
        (0, testlab_1.expect)(MyUserModel.definition.name).to.eql('my-user-model');
        (0, testlab_1.expect)(schema).to.eql({
            title: 'my-user-model.Filter',
            type: 'object',
            'x-typescript-type': '@loopback/repository#Filter<MyUserModel>',
            properties: {
                fields: {
                    oneOf: [
                        {
                            type: 'object',
                            additionalProperties: false,
                            properties: {
                                id: {
                                    type: 'boolean',
                                },
                                age: {
                                    type: 'boolean',
                                },
                            },
                        },
                        {
                            type: 'array',
                            uniqueItems: true,
                            items: {
                                enum: ['id', 'age'],
                                type: 'string',
                                example: 'id',
                            },
                        },
                    ],
                    title: 'my-user-model.Fields',
                },
                offset: { type: 'integer', minimum: 0 },
                limit: { type: 'integer', minimum: 1, example: 100 },
                skip: { type: 'integer', minimum: 0 },
                order: {
                    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
                },
            },
            additionalProperties: false,
        });
    });
    let CustomUserModel = class CustomUserModel extends repository_1.Entity {
    };
    tslib_1.__decorate([
        (0, repository_1.property)(),
        tslib_1.__metadata("design:type", String)
    ], CustomUserModel.prototype, "id", void 0);
    tslib_1.__decorate([
        (0, repository_1.property)(),
        tslib_1.__metadata("design:type", Number)
    ], CustomUserModel.prototype, "age", void 0);
    CustomUserModel = tslib_1.__decorate([
        (0, repository_1.model)({
            name: 'CustomUserModel',
        })
    ], CustomUserModel);
    it('generates filter schema with custom name', () => {
        const schema = (0, __1.getFilterSchemaFor)(CustomUserModel);
        (0, testlab_1.expect)(CustomUserModel.definition.name).to.eql('CustomUserModel');
        (0, testlab_1.expect)(schema).to.eql({
            title: 'CustomUserModel.Filter',
            type: 'object',
            'x-typescript-type': '@loopback/repository#Filter<CustomUserModel>',
            properties: {
                where: {
                    type: 'object',
                    title: 'CustomUserModel.WhereFilter',
                    additionalProperties: true,
                },
                fields: {
                    oneOf: [
                        {
                            type: 'object',
                            additionalProperties: false,
                            properties: {
                                id: {
                                    type: 'boolean',
                                },
                                age: {
                                    type: 'boolean',
                                },
                            },
                        },
                        {
                            type: 'array',
                            uniqueItems: true,
                            items: {
                                enum: ['id', 'age'],
                                type: 'string',
                                example: 'id',
                            },
                        },
                    ],
                    title: 'CustomUserModel.Fields',
                },
                offset: { type: 'integer', minimum: 0 },
                limit: { type: 'integer', minimum: 1, example: 100 },
                skip: { type: 'integer', minimum: 0 },
                order: {
                    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
                },
            },
            additionalProperties: false,
        });
    });
});
//# sourceMappingURL=filter-schema.unit.js.map
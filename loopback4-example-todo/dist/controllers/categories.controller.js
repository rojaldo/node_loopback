"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesController = void 0;
const tslib_1 = require("tslib");
const rest_1 = require("@loopback/rest");
const repository_1 = require("@loopback/repository");
const repositories_1 = require("../repositories");
/**
 * The controller class is generated from OpenAPI spec with operations tagged
 * by Categories.
 *
 */
let CategoriesController = class CategoriesController {
    constructor(repository) {
        this.repository = repository;
    }
    /**
     *
     *
     * @returns A list of categories
     */
    async getCategories() {
        return this.repository.find();
    }
};
exports.CategoriesController = CategoriesController;
tslib_1.__decorate([
    (0, rest_1.operation)('get', '/api/v1/categories', {
        summary: 'Get all categories',
        operationId: 'getCategories',
        tags: [
            'Categories',
        ],
        responses: {
            '200': {
                description: 'A list of categories',
                content: {
                    'application/json': {
                        schema: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/Category',
                            },
                        },
                    },
                },
            },
            '500': {
                description: 'Internal server error',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                error: {
                                    type: 'string',
                                    example: 'Internal server error',
                                },
                            },
                        },
                    },
                },
            },
        },
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], CategoriesController.prototype, "getCategories", null);
exports.CategoriesController = CategoriesController = tslib_1.__decorate([
    (0, rest_1.api)({
        components: {
            schemas: {
                Category: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            example: 1,
                        },
                        name: {
                            type: 'string',
                            example: 'Electronics',
                        },
                    },
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'string',
                            example: 'Internal server error',
                        },
                    },
                },
            },
        },
        paths: {},
    }),
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.CategoryRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.CategoryRepository])
], CategoriesController);
//# sourceMappingURL=categories.controller.js.map
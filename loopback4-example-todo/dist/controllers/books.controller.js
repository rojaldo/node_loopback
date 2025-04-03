"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooksController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const core_1 = require("@loopback/core");
const books_service_1 = require("../services/books.service");
let BooksController = class BooksController {
    constructor(bookService) {
        this.bookService = bookService;
    }
    async create(book) {
        return this.bookService.create(book);
    }
    async count(where) {
        return this.bookService.count(where);
    }
    async find(filter) {
        return this.bookService.find(filter);
    }
    async updateAll(book, where) {
        return this.bookService.updateAll(book, where);
    }
    async findById(id, filter) {
        return this.bookService.findById(id, filter);
    }
    async updateById(id, book) {
        await this.bookService.updateById(id, book);
    }
    async replaceById(id, book) {
        await this.bookService.replaceById(id, book);
    }
    async deleteById(id) {
        await this.bookService.deleteById(id);
    }
};
exports.BooksController = BooksController;
tslib_1.__decorate([
    (0, rest_1.post)('/api/v1/books'),
    (0, rest_1.response)(200, {
        description: 'Book model instance',
        content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.Book) } },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Book, {
                    title: 'NewBook',
                    exclude: ['id'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], BooksController.prototype, "create", null);
tslib_1.__decorate([
    (0, rest_1.get)('/api/v1/books/count'),
    (0, rest_1.response)(200, {
        description: 'Book model count',
        content: { 'application/json': { schema: repository_1.CountSchema } },
    }),
    tslib_1.__param(0, rest_1.param.where(models_1.Book)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], BooksController.prototype, "count", null);
tslib_1.__decorate([
    (0, rest_1.get)('/api/v1/books'),
    (0, rest_1.response)(200, {
        description: 'Array of Book model instances',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: (0, rest_1.getModelSchemaRef)(models_1.Book, { includeRelations: true }),
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.filter(models_1.Book)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], BooksController.prototype, "find", null);
tslib_1.__decorate([
    (0, rest_1.patch)('/api/v1/books'),
    (0, rest_1.response)(200, {
        description: 'Book PATCH success count',
        content: { 'application/json': { schema: repository_1.CountSchema } },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Book, { partial: true }),
            },
        },
    })),
    tslib_1.__param(1, rest_1.param.where(models_1.Book)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.Book, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], BooksController.prototype, "updateAll", null);
tslib_1.__decorate([
    (0, rest_1.get)('/api/v1/books/{id}'),
    (0, rest_1.response)(200, {
        description: 'Book model instance',
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Book, { includeRelations: true }),
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__param(1, rest_1.param.filter(models_1.Book, { exclude: 'where' })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], BooksController.prototype, "findById", null);
tslib_1.__decorate([
    (0, rest_1.patch)('/api/v1/books/{id}'),
    (0, rest_1.response)(204, {
        description: 'Book PATCH success',
    }),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Book, { partial: true }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, models_1.Book]),
    tslib_1.__metadata("design:returntype", Promise)
], BooksController.prototype, "updateById", null);
tslib_1.__decorate([
    (0, rest_1.put)('/api/v1/books/{id}'),
    (0, rest_1.response)(204, {
        description: 'Book PUT success',
    }),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, models_1.Book]),
    tslib_1.__metadata("design:returntype", Promise)
], BooksController.prototype, "replaceById", null);
tslib_1.__decorate([
    (0, rest_1.del)('/api/v1/books/{id}'),
    (0, rest_1.response)(204, {
        description: 'Book DELETE success',
    }),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", Promise)
], BooksController.prototype, "deleteById", null);
exports.BooksController = BooksController = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.service)(books_service_1.BooksService)),
    tslib_1.__metadata("design:paramtypes", [books_service_1.BooksService])
], BooksController);
//# sourceMappingURL=books.controller.js.map
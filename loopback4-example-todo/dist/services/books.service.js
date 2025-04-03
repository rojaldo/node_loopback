"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooksService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const book_repository_1 = require("../repositories/book.repository");
let BooksService = class BooksService {
    constructor(bookRepository) {
        this.bookRepository = bookRepository;
    }
    /*
     * Add service methods here
     */
    create(book) {
        return this.bookRepository.create(book);
    }
    deleteById(id) {
        return this.bookRepository.deleteById(id);
    }
    replaceById(id, book) {
        return this.bookRepository.replaceById(id, book);
    }
    updateById(id, book) {
        return this.bookRepository.updateById(id, book);
    }
    findById(id, filter) {
        return this.bookRepository.findById(id, filter);
    }
    updateAll(book, where) {
        return this.bookRepository.updateAll(book, where);
    }
    find(filter) {
        return this.bookRepository.find(filter);
    }
    count(where) {
        return this.bookRepository.count(where);
    }
};
exports.BooksService = BooksService;
exports.BooksService = BooksService = tslib_1.__decorate([
    (0, core_1.injectable)({ scope: core_1.BindingScope.TRANSIENT }),
    tslib_1.__param(0, (0, repository_1.repository)(book_repository_1.BookRepository)),
    tslib_1.__metadata("design:paramtypes", [book_repository_1.BookRepository])
], BooksService);
//# sourceMappingURL=books.service.js.map
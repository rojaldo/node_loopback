"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
/**
 * The model class is generated from OpenAPI schema - Category
 * Category
 */
let Category = class Category extends repository_1.Entity {
    constructor(data) {
        super(data);
        if (data != null && typeof data === 'object') {
            Object.assign(this, data);
        }
    }
};
exports.Category = Category;
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        id: true,
        generated: true,
    }),
    tslib_1.__metadata("design:type", Number)
], Category.prototype, "id", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({ jsonSchema: {
            type: 'string',
        } }),
    tslib_1.__metadata("design:type", String)
], Category.prototype, "name", void 0);
exports.Category = Category = tslib_1.__decorate([
    (0, repository_1.model)({ name: 'Category' }),
    tslib_1.__metadata("design:paramtypes", [Object])
], Category);
//# sourceMappingURL=category.model.js.map
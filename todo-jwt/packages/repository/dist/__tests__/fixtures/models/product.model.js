"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const tslib_1 = require("tslib");
const __1 = require("../../..");
let Product = class Product extends __1.Entity {
    constructor(data) {
        super(data);
    }
};
exports.Product = Product;
tslib_1.__decorate([
    (0, __1.property)({
        type: 'number',
        id: true,
        description: 'The unique identifier for a product',
    }),
    tslib_1.__metadata("design:type", Number)
], Product.prototype, "id", void 0);
tslib_1.__decorate([
    (0, __1.property)({ type: 'string' }),
    tslib_1.__metadata("design:type", String)
], Product.prototype, "name", void 0);
tslib_1.__decorate([
    (0, __1.property)({ type: 'string' }),
    tslib_1.__metadata("design:type", String)
], Product.prototype, "slug", void 0);
tslib_1.__decorate([
    (0, __1.property)({
        type: 'date',
    }),
    tslib_1.__metadata("design:type", Date)
], Product.prototype, "createdAt", void 0);
exports.Product = Product = tslib_1.__decorate([
    (0, __1.model)(),
    tslib_1.__metadata("design:paramtypes", [Object])
], Product);
//# sourceMappingURL=product.model.js.map
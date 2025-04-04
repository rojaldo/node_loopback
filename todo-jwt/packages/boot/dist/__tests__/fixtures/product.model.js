"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/boot
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
let Product = class Product extends repository_1.Entity {
};
exports.Product = Product;
tslib_1.__decorate([
    (0, repository_1.property)({ id: true }),
    tslib_1.__metadata("design:type", Number)
], Product.prototype, "id", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({ required: true }),
    tslib_1.__metadata("design:type", String)
], Product.prototype, "name", void 0);
exports.Product = Product = tslib_1.__decorate([
    (0, repository_1.model)()
], Product);
//# sourceMappingURL=product.model.js.map
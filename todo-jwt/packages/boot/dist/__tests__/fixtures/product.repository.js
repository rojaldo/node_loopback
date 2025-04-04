"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/boot
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepository = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const product_model_1 = require("./product.model");
let ProductRepository = class ProductRepository extends repository_1.DefaultCrudRepository {
    constructor(dataSource) {
        super(product_model_1.Product, dataSource);
    }
};
exports.ProductRepository = ProductRepository;
exports.ProductRepository = ProductRepository = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)('datasources.db')),
    tslib_1.__metadata("design:paramtypes", [repository_1.juggler.DataSource])
], ProductRepository);
//# sourceMappingURL=product.repository.js.map
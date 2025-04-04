"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepository = exports.Product = void 0;
const __1 = require("../../..");
const product_model_1 = require("../models/product.model");
Object.defineProperty(exports, "Product", { enumerable: true, get: function () { return product_model_1.Product; } });
class ProductRepository extends __1.DefaultCrudRepository {
    constructor(dataSource) {
        super(product_model_1.Product, dataSource);
    }
}
exports.ProductRepository = ProductRepository;
//# sourceMappingURL=product.repository.js.map
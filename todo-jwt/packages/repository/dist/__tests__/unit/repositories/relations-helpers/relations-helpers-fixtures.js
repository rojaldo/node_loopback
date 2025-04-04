"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.createManufacturer = exports.createProduct = exports.createCategory = exports.testdb = exports.CategoryRepository = exports.Category = exports.ProductRepository = exports.Product = exports.ManufacturerRepository = exports.Manufacturer = void 0;
const tslib_1 = require("tslib");
const __1 = require("../../../..");
let Manufacturer = class Manufacturer extends __1.Entity {
    constructor(data) {
        super(data);
    }
};
exports.Manufacturer = Manufacturer;
tslib_1.__decorate([
    (0, __1.property)({ id: true }),
    tslib_1.__metadata("design:type", Number)
], Manufacturer.prototype, "id", void 0);
tslib_1.__decorate([
    (0, __1.property)(),
    tslib_1.__metadata("design:type", String)
], Manufacturer.prototype, "name", void 0);
tslib_1.__decorate([
    (0, __1.belongsTo)(() => Product),
    tslib_1.__metadata("design:type", Number)
], Manufacturer.prototype, "productId", void 0);
exports.Manufacturer = Manufacturer = tslib_1.__decorate([
    (0, __1.model)(),
    tslib_1.__metadata("design:paramtypes", [Object])
], Manufacturer);
class ManufacturerRepository extends __1.DefaultCrudRepository {
    constructor(dataSource, productRepository) {
        super(Manufacturer, dataSource);
        if (productRepository)
            this.product = this.createBelongsToAccessorFor('product', productRepository);
    }
}
exports.ManufacturerRepository = ManufacturerRepository;
let Product = class Product extends __1.Entity {
    constructor(data) {
        super(data);
    }
};
exports.Product = Product;
tslib_1.__decorate([
    (0, __1.property)({ id: true }),
    tslib_1.__metadata("design:type", Number)
], Product.prototype, "id", void 0);
tslib_1.__decorate([
    (0, __1.property)(),
    tslib_1.__metadata("design:type", String)
], Product.prototype, "name", void 0);
tslib_1.__decorate([
    (0, __1.hasOne)(() => Manufacturer),
    tslib_1.__metadata("design:type", Manufacturer)
], Product.prototype, "manufacturer", void 0);
tslib_1.__decorate([
    (0, __1.belongsTo)(() => Category),
    tslib_1.__metadata("design:type", Number)
], Product.prototype, "categoryId", void 0);
exports.Product = Product = tslib_1.__decorate([
    (0, __1.model)(),
    tslib_1.__metadata("design:paramtypes", [Object])
], Product);
class ProductRepository extends __1.DefaultCrudRepository {
    constructor(dataSource, categoryRepository, manufacturerRepository) {
        super(Product, dataSource);
        if (categoryRepository)
            this.category = this.createBelongsToAccessorFor('category', categoryRepository);
        if (manufacturerRepository)
            this.manufacturer = this.createHasOneRepositoryFactoryFor('manufacturer', manufacturerRepository);
    }
}
exports.ProductRepository = ProductRepository;
let Category = class Category extends __1.Entity {
    constructor(data) {
        super(data);
    }
};
exports.Category = Category;
tslib_1.__decorate([
    (0, __1.property)({ id: true }),
    tslib_1.__metadata("design:type", Number)
], Category.prototype, "id", void 0);
tslib_1.__decorate([
    (0, __1.property)(),
    tslib_1.__metadata("design:type", String)
], Category.prototype, "name", void 0);
tslib_1.__decorate([
    (0, __1.hasMany)(() => Product, { keyTo: 'categoryId' }),
    tslib_1.__metadata("design:type", Array)
], Category.prototype, "products", void 0);
exports.Category = Category = tslib_1.__decorate([
    (0, __1.model)(),
    tslib_1.__metadata("design:paramtypes", [Object])
], Category);
class CategoryRepository extends __1.DefaultCrudRepository {
    constructor(dataSource, productRepository) {
        super(Category, dataSource);
        this.products = this.createHasManyRepositoryFactoryFor('products', productRepository);
    }
}
exports.CategoryRepository = CategoryRepository;
exports.testdb = new __1.juggler.DataSource({
    name: 'db',
    connector: 'memory',
});
function createCategory(properties) {
    return new Category(properties);
}
exports.createCategory = createCategory;
function createProduct(properties) {
    return new Product(properties);
}
exports.createProduct = createProduct;
function createManufacturer(properties) {
    return new Manufacturer(properties);
}
exports.createManufacturer = createManufacturer;
//# sourceMappingURL=relations-helpers-fixtures.js.map
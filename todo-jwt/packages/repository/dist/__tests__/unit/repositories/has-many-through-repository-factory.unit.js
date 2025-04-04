"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../..");
const has_many_through_repository_factory_1 = require("../../../relations/has-many/has-many-through.repository-factory");
describe('createHasManyThroughRepositoryFactory', () => {
    let categoryProductLinkRepo;
    let productRepo;
    beforeEach(() => {
        givenStubbedProductRepo();
        givenStubbedCategoryProductLinkRepo();
    });
    it('should return a function that could create hasManyThrough repository', () => {
        const relationMeta = resolvedMetadata;
        const result = (0, has_many_through_repository_factory_1.createHasManyThroughRepositoryFactory)(relationMeta, __1.Getter.fromValue(productRepo), __1.Getter.fromValue(categoryProductLinkRepo));
        (0, testlab_1.expect)(result).to.be.Function();
    });
    /*------------- HELPERS ---------------*/
    let Category = class Category extends __1.Entity {
        constructor(data) {
            super(data);
        }
    };
    tslib_1.__decorate([
        (0, __1.property)({ id: true }),
        tslib_1.__metadata("design:type", Number)
    ], Category.prototype, "id", void 0);
    Category = tslib_1.__decorate([
        (0, __1.model)(),
        tslib_1.__metadata("design:paramtypes", [Object])
    ], Category);
    let Product = class Product extends __1.Entity {
        constructor(data) {
            super(data);
        }
    };
    tslib_1.__decorate([
        (0, __1.property)({ id: true }),
        tslib_1.__metadata("design:type", Number)
    ], Product.prototype, "id", void 0);
    Product = tslib_1.__decorate([
        (0, __1.model)(),
        tslib_1.__metadata("design:paramtypes", [Object])
    ], Product);
    let CategoryProductLink = class CategoryProductLink extends __1.Entity {
        constructor(data) {
            super(data);
        }
    };
    tslib_1.__decorate([
        (0, __1.property)({ id: true }),
        tslib_1.__metadata("design:type", Number)
    ], CategoryProductLink.prototype, "id", void 0);
    tslib_1.__decorate([
        (0, __1.property)(),
        tslib_1.__metadata("design:type", Number)
    ], CategoryProductLink.prototype, "categoryId", void 0);
    tslib_1.__decorate([
        (0, __1.property)(),
        tslib_1.__metadata("design:type", Number)
    ], CategoryProductLink.prototype, "productId", void 0);
    CategoryProductLink = tslib_1.__decorate([
        (0, __1.model)(),
        tslib_1.__metadata("design:paramtypes", [Object])
    ], CategoryProductLink);
    class ProductRepository extends __1.DefaultCrudRepository {
        constructor(dataSource) {
            super(Product, dataSource);
        }
    }
    class CategoryProductLinkRepository extends __1.DefaultCrudRepository {
        constructor(dataSource) {
            super(CategoryProductLink, dataSource);
        }
    }
    const resolvedMetadata = {
        name: 'products',
        type: 'hasMany',
        targetsMany: true,
        source: Category,
        keyFrom: 'id',
        target: () => Product,
        keyTo: 'id',
        through: {
            model: () => CategoryProductLink,
            keyFrom: 'categoryId',
            keyTo: 'productId',
            polymorphic: false,
        },
    };
    function givenStubbedProductRepo() {
        productRepo = (0, testlab_1.createStubInstance)(ProductRepository);
    }
    function givenStubbedCategoryProductLinkRepo() {
        categoryProductLinkRepo = (0, testlab_1.createStubInstance)(CategoryProductLinkRepository);
    }
});
//# sourceMappingURL=has-many-through-repository-factory.unit.js.map
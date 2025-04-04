"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../../..");
const has_many_through_helpers_1 = require("../../../../relations/has-many/has-many-through.helpers");
describe('HasManyThroughHelpers', () => {
    const objectId = { id: '' };
    objectId.toString = function () {
        return this.id;
    };
    context('createThroughConstraintFromSource', () => {
        it('creates constraint for searching through models', () => {
            const result = (0, has_many_through_helpers_1.createThroughConstraintFromSource)(relationMetaData, 1);
            (0, testlab_1.expect)(result).to.containEql({ categoryId: 1 });
        });
    });
    context('getTargetKeysFromThroughModels', () => {
        it('returns the target fk value of a given through instance', () => {
            const through1 = createCategoryProductLink({
                id: 1,
                categoryId: 2,
                productId: 9,
            });
            const result = (0, has_many_through_helpers_1.getTargetKeysFromThroughModels)(relationMetaData, [
                through1,
            ]);
            (0, testlab_1.expect)(result).to.deepEqual([9]);
        });
        it('returns the target fk values of given through instances', () => {
            const through1 = createCategoryProductLink({
                id: 1,
                categoryId: 2,
                productId: 9,
            });
            const through2 = createCategoryProductLink({
                id: 2,
                categoryId: 2,
                productId: 8,
            });
            const result = (0, has_many_through_helpers_1.getTargetKeysFromThroughModels)(relationMetaData, [
                through1,
                through2,
            ]);
            (0, testlab_1.expect)(result).to.containDeep([9, 8]);
        });
        it('returns the string representation of the target fk value when provided with object id', () => {
            const inventoryItemId = Object.create(objectId, { id: { value: 'item-1' } });
            const departmentId = Object.create(objectId, {
                id: { value: 'department-1' },
            });
            const through1 = createDepartmentInventory({
                departmentId,
                inventoryItemId,
            });
            const result = (0, has_many_through_helpers_1.getTargetKeysFromThroughModels)(relationMetaDataWithObjectId, [through1]);
            (0, testlab_1.expect)(result[0].toString()).to.deepEqual('item-1');
        });
        it('returns the string representation of the target fk values when provided with object id', () => {
            const inventoryItemId1 = Object.create(objectId, { id: { value: 'item-1' } });
            const inventoryItemId2 = Object.create(objectId, { id: { value: 'item-2' } });
            const departmentId = Object.create(objectId, {
                id: { value: 'department-1' },
            });
            const through1 = createDepartmentInventory({
                departmentId,
                inventoryItemId: inventoryItemId1,
            });
            const through2 = createDepartmentInventory({
                departmentId,
                inventoryItemId: inventoryItemId2,
            });
            const result = (0, has_many_through_helpers_1.getTargetKeysFromThroughModels)(relationMetaDataWithObjectId, [through1, through2]);
            (0, testlab_1.expect)(result[0].toString()).to.containDeep('item-1');
            (0, testlab_1.expect)(result[1].toString()).to.containDeep('item-2');
        });
    });
    context('createTargetConstraintFromThrough', () => {
        it('creates constraint for searching target models', () => {
            const through1 = createCategoryProductLink({
                id: 1,
                categoryId: 2,
                productId: 9,
            });
            const through2 = createCategoryProductLink({
                id: 2,
                categoryId: 2,
                productId: 8,
            });
            // single through model
            let result = (0, has_many_through_helpers_1.createTargetConstraintFromThrough)(relationMetaData, [
                through1,
            ]);
            (0, testlab_1.expect)(result).to.containEql({ id: 9 });
            // multiple through models
            result = (0, has_many_through_helpers_1.createTargetConstraintFromThrough)(relationMetaData, [
                through1,
                through2,
            ]);
            (0, testlab_1.expect)(result).to.containEql({ id: { inq: [9, 8] } });
        });
        it('creates constraint for searching target models with duplicate keys', () => {
            const through1 = createCategoryProductLink({
                id: 1,
                categoryId: 2,
                productId: 9,
            });
            const through2 = createCategoryProductLink({
                id: 2,
                categoryId: 3,
                productId: 9,
            });
            const result = (0, has_many_through_helpers_1.createTargetConstraintFromThrough)(relationMetaData, [
                through1,
                through2,
            ]);
            (0, testlab_1.expect)(result).to.containEql({ id: 9 });
        });
    });
    context('getTargetIdsFromTargetModels', () => {
        it('returns an empty array if the given target array is empty', () => {
            const result = (0, has_many_through_helpers_1.getTargetIdsFromTargetModels)(relationMetaData, []);
            (0, testlab_1.expect)(result).to.containDeep([]);
        });
        it('creates constraint with a given fk', () => {
            const result = (0, has_many_through_helpers_1.getTargetIdsFromTargetModels)(relationMetaData, [
                createProduct({ id: 1 }),
            ]);
            (0, testlab_1.expect)(result).to.containDeep([1]);
        });
        it('creates constraint with given fks', () => {
            const result = (0, has_many_through_helpers_1.getTargetIdsFromTargetModels)(relationMetaData, [
                createProduct({ id: 1 }),
                createProduct({ id: 2 }),
            ]);
            (0, testlab_1.expect)(result).to.containDeep([1, 2]);
        });
        it('creates constraint with a given object id fk', () => {
            const departmentId = Object.create(objectId, {
                id: { value: 'department-1' },
            });
            const result = (0, has_many_through_helpers_1.getTargetIdsFromTargetModels)(relationMetaDataWithObjectId, [createDepartment({ id: departmentId })]);
            (0, testlab_1.expect)(result[0].toString()).to.containDeep('department-1');
        });
        it('creates constraint with given object id fks', () => {
            const departmentId1 = Object.create(objectId, {
                id: { value: 'department-1' },
            });
            const departmentId2 = Object.create(objectId, {
                id: { value: 'department-2' },
            });
            const result = (0, has_many_through_helpers_1.getTargetIdsFromTargetModels)(relationMetaDataWithObjectId, [
                createDepartment({ id: departmentId1 }),
                createDepartment({ id: departmentId2 }),
            ]);
            (0, testlab_1.expect)(result[0].toString()).to.containDeep('department-1');
            (0, testlab_1.expect)(result[1].toString()).to.containDeep('department-2');
        });
    });
    context('createThroughConstraintFromTarget', () => {
        it('creates constraint with a given fk', () => {
            const result = (0, has_many_through_helpers_1.createThroughConstraintFromTarget)(relationMetaData, [1]);
            (0, testlab_1.expect)(result).to.containEql({ productId: 1 });
        });
        it('creates constraint with given fks', () => {
            const result = (0, has_many_through_helpers_1.createThroughConstraintFromTarget)(relationMetaData, [1, 2]);
            (0, testlab_1.expect)(result).to.containEql({ productId: { inq: [1, 2] } });
        });
        it('throws if fkValue is undefined', () => {
            (0, testlab_1.expect)(() => (0, has_many_through_helpers_1.createThroughConstraintFromTarget)(relationMetaData, [])).to.throw(/"fkValue" must be provided/);
        });
    });
    context('resolveHasManyThroughMetadata', () => {
        it('throws if the wrong metadata type is used', async () => {
            const metadata = {
                name: 'category',
                type: __1.RelationType.hasOne,
                targetsMany: false,
                source: Category,
                target: () => Product,
            };
            (0, testlab_1.expect)(() => {
                (0, has_many_through_helpers_1.resolveHasManyThroughMetadata)(metadata);
            }).to.throw(/Invalid hasOne definition for Category#category: relation type must be HasMany/);
        });
        it('throws if the through is not provided', async () => {
            const metadata = {
                name: 'category',
                type: __1.RelationType.hasMany,
                targetsMany: true,
                source: Category,
                target: () => Product,
            };
            (0, testlab_1.expect)(() => {
                (0, has_many_through_helpers_1.resolveHasManyThroughMetadata)(metadata);
            }).to.throw(/Invalid hasMany definition for Category#category: through must be specified/);
        });
        it('throws if the through is not resolvable', async () => {
            const metadata = {
                name: 'category',
                type: __1.RelationType.hasMany,
                targetsMany: true,
                source: Category,
                through: { model: 'random' },
                target: () => Product,
            };
            (0, testlab_1.expect)(() => {
                (0, has_many_through_helpers_1.resolveHasManyThroughMetadata)(metadata);
            }).to.throw(/Invalid hasMany definition for Category#category: through.model must be a type resolver/);
        });
        describe('resolves through.keyTo/keyFrom/polymorphic', () => {
            it('resolves metadata with complete hasManyThrough definition', () => {
                const metadata = {
                    name: 'products',
                    type: __1.RelationType.hasMany,
                    targetsMany: true,
                    source: Category,
                    keyFrom: 'id',
                    target: () => Product,
                    keyTo: 'id',
                    through: {
                        model: () => CategoryProductLink,
                        keyFrom: 'categoryId',
                        keyTo: 'productId',
                        polymorphic: { discriminator: 'productType' },
                    },
                };
                const meta = (0, has_many_through_helpers_1.resolveHasManyThroughMetadata)(metadata);
                (0, testlab_1.expect)(meta).to.eql(relationMetaDataWithPolymorphicDiscriminator);
            });
            it('infers through.keyFrom if it is not provided', () => {
                const metadata = {
                    name: 'products',
                    type: __1.RelationType.hasMany,
                    targetsMany: true,
                    source: Category,
                    keyFrom: 'id',
                    target: () => Product,
                    keyTo: 'id',
                    through: {
                        model: () => CategoryProductLink,
                        // no through.keyFrom
                        keyTo: 'productId',
                    },
                };
                const meta = (0, has_many_through_helpers_1.resolveHasManyThroughMetadata)(metadata);
                (0, testlab_1.expect)(meta).to.eql(relationMetaData);
            });
            it('infers through.keyTo if it is not provided', () => {
                const metadata = {
                    name: 'products',
                    type: __1.RelationType.hasMany,
                    targetsMany: true,
                    source: Category,
                    keyFrom: 'id',
                    target: () => Product,
                    keyTo: 'id',
                    through: {
                        model: () => CategoryProductLink,
                        keyFrom: 'categoryId',
                        // no through.keyTo
                    },
                };
                const meta = (0, has_many_through_helpers_1.resolveHasManyThroughMetadata)(metadata);
                (0, testlab_1.expect)(meta).to.eql(relationMetaData);
            });
            it('infers through.polymorphic.discriminator if polymorphic equals to true', () => {
                const metadata = {
                    name: 'products',
                    type: __1.RelationType.hasMany,
                    targetsMany: true,
                    source: Category,
                    keyFrom: 'id',
                    target: () => Product,
                    keyTo: 'id',
                    through: {
                        model: () => CategoryProductLink,
                        keyFrom: 'categoryId',
                        keyTo: 'productId',
                        polymorphic: true,
                    },
                };
                const meta = (0, has_many_through_helpers_1.resolveHasManyThroughMetadata)(metadata);
                (0, testlab_1.expect)(meta).to.eql(relationMetaDataWithPolymorphicDiscriminator);
            });
            it('throws if through.keyFrom is not provided in through', async () => {
                const metadata = {
                    name: 'categories',
                    type: __1.RelationType.hasMany,
                    targetsMany: true,
                    source: Category,
                    keyFrom: 'id',
                    target: () => Product,
                    keyTo: 'id',
                    through: {
                        model: () => InvalidThrough,
                        keyTo: 'productId',
                    },
                };
                (0, testlab_1.expect)(() => {
                    (0, has_many_through_helpers_1.resolveHasManyThroughMetadata)(metadata);
                }).to.throw(/Invalid hasMany definition for Category#categories: through model InvalidThrough is missing definition of source foreign key/);
            });
            it('throws if through.keyTo is not provided in through', async () => {
                const metadata = {
                    name: 'categories',
                    type: __1.RelationType.hasMany,
                    targetsMany: true,
                    source: Category,
                    keyFrom: 'id',
                    target: () => Product,
                    keyTo: 'id',
                    through: {
                        model: () => InvalidThrough2,
                        keyFrom: 'categoryId',
                    },
                };
                (0, testlab_1.expect)(() => {
                    (0, has_many_through_helpers_1.resolveHasManyThroughMetadata)(metadata);
                }).to.throw(/Invalid hasMany definition for Category#categories: through model InvalidThrough2 is missing definition of target foreign key/);
            });
            it('throws if the target model does not have the id property', async () => {
                const metadata = {
                    name: 'categories',
                    type: __1.RelationType.hasMany,
                    targetsMany: true,
                    source: Category,
                    keyFrom: 'id',
                    target: () => InvalidProduct,
                    keyTo: 'id',
                    through: {
                        model: () => CategoryProductLink,
                        keyFrom: 'categoryId',
                        keyTo: 'productId',
                    },
                };
                (0, testlab_1.expect)(() => {
                    (0, has_many_through_helpers_1.resolveHasManyThroughMetadata)(metadata);
                }).to.throw('Invalid hasMany definition for Category#categories: target model InvalidProduct does not have any primary key (id property)');
            });
        });
    });
    /******  HELPERS *******/
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
    let InvalidProduct = class InvalidProduct extends __1.Entity {
        constructor(data) {
            super(data);
        }
    };
    tslib_1.__decorate([
        (0, __1.property)({ id: false }),
        tslib_1.__metadata("design:type", Number)
    ], InvalidProduct.prototype, "random", void 0);
    InvalidProduct = tslib_1.__decorate([
        (0, __1.model)(),
        tslib_1.__metadata("design:paramtypes", [Object])
    ], InvalidProduct);
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
    let Department = class Department extends __1.Entity {
        constructor(data) {
            super(data);
        }
    };
    tslib_1.__decorate([
        (0, __1.property)({
            type: 'string',
            id: true,
            generated: true,
            mongodb: { dataType: 'ObjectId' },
        }),
        tslib_1.__metadata("design:type", String)
    ], Department.prototype, "id", void 0);
    Department = tslib_1.__decorate([
        (0, __1.model)(),
        tslib_1.__metadata("design:paramtypes", [Object])
    ], Department);
    let InventoryItem = class InventoryItem extends __1.Entity {
        constructor(data) {
            super(data);
        }
    };
    tslib_1.__decorate([
        (0, __1.property)({
            type: 'string',
            id: true,
            generated: true,
            mongodb: { dataType: 'ObjectId' },
        }),
        tslib_1.__metadata("design:type", String)
    ], InventoryItem.prototype, "id", void 0);
    InventoryItem = tslib_1.__decorate([
        (0, __1.model)(),
        tslib_1.__metadata("design:paramtypes", [Object])
    ], InventoryItem);
    let DepartmentInventory = class DepartmentInventory extends __1.Entity {
        constructor(data) {
            super(data);
        }
    };
    tslib_1.__decorate([
        (0, __1.property)({
            type: 'string',
            id: true,
            generated: true,
            mongodb: { dataType: 'ObjectId' },
        }),
        tslib_1.__metadata("design:type", String)
    ], DepartmentInventory.prototype, "id", void 0);
    tslib_1.__decorate([
        (0, __1.property)(),
        tslib_1.__metadata("design:type", String)
    ], DepartmentInventory.prototype, "departmentId", void 0);
    tslib_1.__decorate([
        (0, __1.property)(),
        tslib_1.__metadata("design:type", String)
    ], DepartmentInventory.prototype, "inventoryItemId", void 0);
    DepartmentInventory = tslib_1.__decorate([
        (0, __1.model)(),
        tslib_1.__metadata("design:paramtypes", [Object])
    ], DepartmentInventory);
    const relationMetaData = {
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
    const relationMetaDataWithObjectId = {
        name: 'departments',
        type: 'hasMany',
        targetsMany: true,
        source: Department,
        keyFrom: 'id',
        target: () => InventoryItem,
        keyTo: 'id',
        through: {
            model: () => DepartmentInventory,
            keyFrom: 'departmentId',
            keyTo: 'inventoryItemId',
            polymorphic: false,
        },
    };
    const relationMetaDataWithPolymorphicDiscriminator = {
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
            polymorphic: { discriminator: 'productType' },
        },
    };
    class InvalidThrough extends __1.Entity {
    }
    InvalidThrough.definition = new __1.ModelDefinition('InvalidThrough')
        .addProperty('id', {
        type: 'number',
        id: true,
        required: true,
    })
        // lack through.keyFrom
        .addProperty('productId', { type: 'number' });
    class InvalidThrough2 extends __1.Entity {
    }
    InvalidThrough2.definition = new __1.ModelDefinition('InvalidThrough2')
        .addProperty('id', {
        type: 'number',
        id: true,
        required: true,
    })
        // lack through.keyTo
        .addProperty('categoryId', { type: 'number' });
    function createCategoryProductLink(properties) {
        return new CategoryProductLink(properties);
    }
    function createProduct(properties) {
        return new Product(properties);
    }
    function createDepartmentInventory(properties) {
        return new DepartmentInventory(properties);
    }
    function createDepartment(properties) {
        return new Department(properties);
    }
});
//# sourceMappingURL=resolve-has-many-through-metadata.unit.js.map
"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testlab_1 = require("@loopback/testlab");
const bson_1 = require("bson");
const __1 = require("../../../..");
const relations_1 = require("../../../../relations");
const relation_helpers_1 = require("../../../../relations/relation.helpers");
describe('unit tests, simulates mongodb env for helpers of inclusion resolver ', () => {
    describe('helpers for formating instances', () => {
        it('checks isBsonType', () => {
            const objId = new bson_1.ObjectId();
            const numId = 1;
            (0, testlab_1.expect)((0, relations_1.isBsonType)(objId)).to.be.true();
            (0, testlab_1.expect)((0, relations_1.isBsonType)(numId)).to.be.false();
        });
        context('deduplicate + isBsonType', () => {
            it('passes in a  simple unique array', () => {
                const id1 = new bson_1.ObjectId();
                const id2 = new bson_1.ObjectId();
                const result = (0, relations_1.deduplicate)([id1, id2]);
                (0, testlab_1.expect)(result).to.deepEqual([id1, id2]);
            });
            it('passes in a multiple items array', () => {
                const id1 = new bson_1.ObjectId();
                const id2 = new bson_1.ObjectId();
                const id3 = new bson_1.ObjectId();
                const result = (0, relations_1.deduplicate)([id3, id1, id1, id3, id2]);
                (0, testlab_1.expect)(result).to.deepEqual([id3, id1, id2]);
            });
        });
    });
    describe('helpers for generating inclusion resolvers', () => {
        // the tests below simulate mongodb environment.
        context('normalizeKey + buildLookupMap', () => {
            it('checks if id has been normalized', async () => {
                const id = new bson_1.ObjectId();
                (0, testlab_1.expect)((0, relations_1.normalizeKey)(id)).to.eql(id.toString());
            });
            it('creates a lookup map with a single key', () => {
                const categoryId = new bson_1.ObjectId();
                const pen = createProduct({ name: 'pen', categoryId: categoryId });
                const pencil = createProduct({ name: 'pencil', categoryId: categoryId });
                const result = (0, relations_1.buildLookupMap)([pen, pencil], 'categoryId', relations_1.reduceAsArray);
                // expects this map to have String/Product pair
                const expected = new Map();
                const strId = categoryId.toString();
                expected.set(strId, [pen, pencil]);
                (0, testlab_1.expect)(result).to.eql(expected);
            });
            it('creates a lookup map with more than one keys', () => {
                const categoryId = new bson_1.ObjectId();
                const anotherCategoryId = new bson_1.ObjectId();
                const pen = createProduct({ name: 'pen', categoryId: categoryId });
                const pencil = createProduct({ name: 'pencil', categoryId: categoryId });
                const eraser = createProduct({
                    name: 'eraser',
                    categoryId: anotherCategoryId,
                });
                const result = (0, relations_1.buildLookupMap)([pen, eraser, pencil], 'categoryId', relations_1.reduceAsArray);
                // expects this map to have String/Product pair
                const expected = new Map();
                const strId1 = categoryId.toString();
                const strId2 = anotherCategoryId.toString();
                expected.set(strId1, [pen, pencil]);
                expected.set(strId2, [eraser]);
                (0, testlab_1.expect)(result).to.eql(expected);
            });
        });
        context('normalizeKey + flattenMapByKeys', () => {
            it('checks if id has been normalized', async () => {
                const categoryId = new bson_1.ObjectId();
                const anotherCategoryId = new bson_1.ObjectId();
                const pen = createProduct({ name: 'pen', categoryId: categoryId });
                const pencil = createProduct({ name: 'pencil', categoryId: categoryId });
                const eraser = createProduct({
                    name: 'eraser',
                    categoryId: anotherCategoryId,
                });
                // stub map
                const map = new Map();
                const strId1 = categoryId.toString();
                const strId2 = anotherCategoryId.toString();
                map.set(strId1, [pen, pencil]);
                map.set(strId2, [eraser]);
                const result = (0, relation_helpers_1.flattenMapByKeys)([anotherCategoryId, categoryId], map);
                (0, testlab_1.expect)(result).to.eql([[eraser], [pen, pencil]]);
            });
        });
    });
    //** helpers
    let Product = class Product extends __1.Entity {
    };
    tslib_1.__decorate([
        (0, __1.property)({ id: true }),
        tslib_1.__metadata("design:type", Object)
    ], Product.prototype, "id", void 0);
    tslib_1.__decorate([
        (0, __1.property)(),
        tslib_1.__metadata("design:type", String)
    ], Product.prototype, "name", void 0);
    tslib_1.__decorate([
        (0, __1.belongsTo)(() => Category),
        tslib_1.__metadata("design:type", Object)
    ], Product.prototype, "categoryId", void 0);
    Product = tslib_1.__decorate([
        (0, __1.model)()
    ], Product);
    let Category = class Category extends __1.Entity {
    };
    tslib_1.__decorate([
        (0, __1.property)({ id: true }),
        tslib_1.__metadata("design:type", Object)
    ], Category.prototype, "id", void 0);
    tslib_1.__decorate([
        (0, __1.property)(),
        tslib_1.__metadata("design:type", String)
    ], Category.prototype, "name", void 0);
    tslib_1.__decorate([
        (0, __1.hasMany)(() => Product, { keyTo: 'categoryId' }),
        tslib_1.__metadata("design:type", Array)
    ], Category.prototype, "products", void 0);
    Category = tslib_1.__decorate([
        (0, __1.model)()
    ], Category);
    function createProduct(properties) {
        return new Product(properties);
    }
});
//# sourceMappingURL=mongo-related-helpers.unit.js.map
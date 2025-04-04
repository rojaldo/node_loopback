"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../../..");
const relations_helpers_fixtures_1 = require("./relations-helpers-fixtures");
describe('flattenTargetsOfOneToOneRelation', () => {
    describe('uses reduceAsSingleItem strategy for belongsTo relation', () => {
        it('gets the result of passing in a single sourceId', () => {
            const stationery = (0, relations_helpers_fixtures_1.createCategory)({ id: 1, name: 'stationery' });
            const pen = (0, relations_helpers_fixtures_1.createProduct)({ name: 'pen', categoryId: stationery.id });
            (0, relations_helpers_fixtures_1.createProduct)({ name: 'eraser', categoryId: 2 });
            const result = (0, __1.flattenTargetsOfOneToOneRelation)([pen.categoryId], [stationery], 'id');
            (0, testlab_1.expect)(result).to.eql([stationery]);
        });
        it('gets the result of passing in multiple sourceIds', () => {
            const stationery = (0, relations_helpers_fixtures_1.createCategory)({ id: 1, name: 'stationery' });
            const book = (0, relations_helpers_fixtures_1.createCategory)({ id: 2, name: 'book' });
            const pen = (0, relations_helpers_fixtures_1.createProduct)({ name: 'pen', categoryId: stationery.id });
            const pencil = (0, relations_helpers_fixtures_1.createProduct)({
                name: 'pencil',
                categoryId: stationery.id,
            });
            const erasers = (0, relations_helpers_fixtures_1.createProduct)({ name: 'eraser', categoryId: book.id });
            // the order of sourceIds matters
            const result = (0, __1.flattenTargetsOfOneToOneRelation)([erasers.categoryId, pencil.categoryId, pen.categoryId], [book, stationery, stationery], 'id');
            (0, testlab_1.expect)(result).to.deepEqual([book, stationery, stationery]);
        });
    });
    describe('uses reduceAsSingleItem strategy for hasOne relation', () => {
        it('gets the result of passing in a single sourceId', () => {
            const pen = (0, relations_helpers_fixtures_1.createProduct)({ id: 1, name: 'pen' });
            const penMaker = (0, relations_helpers_fixtures_1.createManufacturer)({
                name: 'Mr. Plastic',
                productId: pen.id,
            });
            const result = (0, __1.flattenTargetsOfOneToOneRelation)([pen.id], [penMaker], 'productId');
            (0, testlab_1.expect)(result).to.eql([penMaker]);
        });
        it('gets the result of passing in multiple sourceIds', () => {
            const pen = (0, relations_helpers_fixtures_1.createProduct)({ id: 1, name: 'pen' });
            const pencil = (0, relations_helpers_fixtures_1.createProduct)({ id: 2, name: 'pencil' });
            const eraser = (0, relations_helpers_fixtures_1.createProduct)({ id: 3, name: 'eraser' });
            const penMaker = (0, relations_helpers_fixtures_1.createManufacturer)({
                name: 'Mr. Plastic',
                productId: pen.id,
            });
            const pencilMaker = (0, relations_helpers_fixtures_1.createManufacturer)({
                name: 'Mr. Tree',
                productId: pencil.id,
            });
            const eraserMaker = (0, relations_helpers_fixtures_1.createManufacturer)({
                name: 'Mr. Rubber',
                productId: eraser.id,
            });
            // the order of sourceIds matters
            const result = (0, __1.flattenTargetsOfOneToOneRelation)([eraser.id, pencil.id, pen.id], [penMaker, pencilMaker, eraserMaker], 'productId');
            (0, testlab_1.expect)(result).to.deepEqual([eraserMaker, pencilMaker, penMaker]);
        });
    });
});
//# sourceMappingURL=flatten-targets-of-one-to-one-relation.helpers.unit.js.map
"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../../..");
const relations_helpers_fixtures_1 = require("./relations-helpers-fixtures");
describe('flattenTargetsOfOneToManyRelation', () => {
    describe('gets the result of using reduceAsArray strategy for hasMany relation', () => {
        it('gets the result of passing in a single sourceId', () => {
            const pen = (0, relations_helpers_fixtures_1.createProduct)({ name: 'pen', categoryId: 1 });
            const pencil = (0, relations_helpers_fixtures_1.createProduct)({ name: 'pencil', categoryId: 1 });
            (0, relations_helpers_fixtures_1.createProduct)({ name: 'eraser', categoryId: 2 });
            const result = (0, __1.flattenTargetsOfOneToManyRelation)([1], [pen, pencil], 'categoryId');
            (0, testlab_1.expect)(result).to.eql([[pen, pencil]]);
        });
        it('gets the result of passing in multiple sourceIds', () => {
            const pen = (0, relations_helpers_fixtures_1.createProduct)({ name: 'pen', categoryId: 1 });
            const pencil = (0, relations_helpers_fixtures_1.createProduct)({ name: 'pencil', categoryId: 1 });
            const eraser = (0, relations_helpers_fixtures_1.createProduct)({ name: 'eraser', categoryId: 2 });
            // use [2, 1] here to show the order of sourceIds matters
            const result = (0, __1.flattenTargetsOfOneToManyRelation)([2, 1], [pen, pencil, eraser], 'categoryId');
            (0, testlab_1.expect)(result).to.deepEqual([[eraser], [pen, pencil]]);
        });
        it('returns undefined if a source id yields no results', () => {
            const pen = (0, relations_helpers_fixtures_1.createProduct)({ name: 'pen', categoryId: 1 });
            const result = (0, __1.flattenTargetsOfOneToManyRelation)([1, 2], [pen], 'categoryId');
            (0, testlab_1.expect)(result).to.deepEqual([[pen], undefined]);
        });
    });
});
//# sourceMappingURL=flatten-targets-of-one-to-many-relation-helpers.unit.js.map
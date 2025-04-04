"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../../..");
const has_many_helpers_1 = require("../../../../relations/has-many/has-many.helpers");
describe('resolveHasManyMetadata', () => {
    it('throws if the wrong metadata type is used', async () => {
        const metadata = {
            name: 'category',
            type: __1.RelationType.hasOne,
            targetsMany: false,
            source: Category,
            target: () => Category,
        };
        (0, testlab_1.expect)(() => {
            (0, has_many_helpers_1.resolveHasManyMetadata)(metadata);
        }).to.throw(/Invalid hasOne definition for Category#category: relation type must be HasMany/);
    });
    describe('keyTo and keyFrom with resolveHasManyMetadata', () => {
        it('resolves metadata using keyTo and keyFrom', () => {
            const metadata = {
                name: 'products',
                type: __1.RelationType.hasMany,
                targetsMany: true,
                source: Category,
                keyFrom: 'id',
                target: () => Product,
                keyTo: 'categoryId',
            };
            const meta = (0, has_many_helpers_1.resolveHasManyMetadata)(metadata);
            (0, testlab_1.expect)(meta).to.eql({
                name: 'products',
                type: 'hasMany',
                targetsMany: true,
                source: Category,
                keyFrom: 'id',
                target: () => Product,
                keyTo: 'categoryId',
            });
        });
        it('infers keyFrom if it is not provided', () => {
            const metadata = {
                name: 'products',
                type: __1.RelationType.hasMany,
                targetsMany: true,
                source: Category,
                // no keyFrom
                target: () => Product,
                keyTo: 'categoryId',
            };
            const meta = (0, has_many_helpers_1.resolveHasManyMetadata)(metadata);
            (0, testlab_1.expect)(meta).to.eql({
                name: 'products',
                type: 'hasMany',
                targetsMany: true,
                source: Category,
                keyFrom: 'id',
                target: () => Product,
                keyTo: 'categoryId',
            });
        });
        it('infers keyTo if it is not provided', () => {
            const metadata = {
                name: 'products',
                type: __1.RelationType.hasMany,
                targetsMany: true,
                source: Category,
                keyFrom: 'id',
                target: () => Product,
                // no keyTo
            };
            const meta = (0, has_many_helpers_1.resolveHasManyMetadata)(metadata);
            (0, testlab_1.expect)(meta).to.eql({
                name: 'products',
                type: 'hasMany',
                targetsMany: true,
                source: Category,
                keyFrom: 'id',
                target: () => Product,
                keyTo: 'categoryId',
            });
        });
        it('throws if keyFrom, keyTo, and default foreign key name are not provided', async () => {
            const metadata = {
                name: 'categories',
                type: __1.RelationType.hasMany,
                targetsMany: true,
                source: Category,
                // no keyFrom
                target: () => Category,
                // no keyTo
            };
            (0, testlab_1.expect)(() => {
                (0, has_many_helpers_1.resolveHasManyMetadata)(metadata);
            }).to.throw(/Invalid hasMany definition for Category#categories: target model Category is missing definition of foreign key categoryId/);
        });
        it('resolves metadata if keyTo and keyFrom are not provided, but default foreign key is', async () => {
            Category.definition.addProperty('categoryId', { type: 'number' });
            const metadata = {
                name: 'category',
                type: __1.RelationType.hasMany,
                targetsMany: true,
                source: Category,
                // no keyFrom
                target: () => Category,
                // no keyTo
            };
            const meta = (0, has_many_helpers_1.resolveHasManyMetadata)(metadata);
            (0, testlab_1.expect)(meta).to.eql({
                name: 'category',
                type: 'hasMany',
                targetsMany: true,
                source: Category,
                keyFrom: 'id',
                target: () => Category,
                keyTo: 'categoryId',
            });
        });
    });
    /******  HELPERS *******/
    class Category extends __1.Entity {
    }
    Category.definition = new __1.ModelDefinition('Category').addProperty('id', {
        type: 'number',
        id: true,
        required: true,
    });
    class Product extends __1.Entity {
    }
    Product.definition = new __1.ModelDefinition('Product')
        .addProperty('id', {
        type: 'number',
        id: true,
        required: true,
    })
        .addProperty('categoryId', { type: 'number' });
});
//# sourceMappingURL=resolve-has-many-metadata.unit.js.map
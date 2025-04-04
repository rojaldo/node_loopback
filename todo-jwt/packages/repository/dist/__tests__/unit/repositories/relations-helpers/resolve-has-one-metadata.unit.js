"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../../..");
const has_one_helpers_1 = require("../../../../relations/has-one/has-one.helpers");
describe('resolveHasOneMetadata', () => {
    it('throws if the wrong metadata type is used', async () => {
        const metadata = {
            name: 'category',
            type: __1.RelationType.hasMany,
            targetsMany: true,
            source: Product,
            target: () => Category,
        };
        (0, testlab_1.expect)(() => {
            (0, has_one_helpers_1.resolveHasOneMetadata)(metadata);
        }).to.throw(/Invalid hasMany definition for Product#category: relation type must be HasOne/);
    });
    describe('keyTo and keyFrom with resolveHasOneMetadata', () => {
        it('resolves metadata using keyTo and keyFrom', () => {
            const metadata = {
                name: 'category',
                type: __1.RelationType.hasOne,
                targetsMany: false,
                source: Product,
                keyFrom: 'id',
                target: () => Category,
                keyTo: 'productId',
            };
            const meta = (0, has_one_helpers_1.resolveHasOneMetadata)(metadata);
            (0, testlab_1.expect)(meta).to.eql({
                name: 'category',
                type: 'hasOne',
                targetsMany: false,
                source: Product,
                keyFrom: 'id',
                target: () => Category,
                keyTo: 'productId',
                polymorphic: false,
            });
        });
        it('resolves metadata using polymorphic', () => {
            const metadata = {
                name: 'category',
                type: __1.RelationType.hasOne,
                targetsMany: false,
                source: Product,
                keyFrom: 'id',
                target: () => Category,
                keyTo: 'productId',
                polymorphic: { discriminator: 'productType' },
            };
            const meta = (0, has_one_helpers_1.resolveHasOneMetadata)(metadata);
            (0, testlab_1.expect)(meta).to.eql({
                name: 'category',
                type: 'hasOne',
                targetsMany: false,
                source: Product,
                keyFrom: 'id',
                target: () => Category,
                keyTo: 'productId',
                polymorphic: { discriminator: 'productType' },
            });
        });
        it('infers keyFrom if it is not provided', () => {
            const metadata = {
                name: 'category',
                type: 'hasOne',
                targetsMany: false,
                source: Product,
                // no keyFrom
                target: () => Category,
                keyTo: 'productId',
            };
            const meta = (0, has_one_helpers_1.resolveHasOneMetadata)(metadata);
            (0, testlab_1.expect)(meta).to.eql({
                name: 'category',
                type: 'hasOne',
                targetsMany: false,
                source: Product,
                keyFrom: 'id',
                target: () => Category,
                keyTo: 'productId',
                polymorphic: false,
            });
        });
        it('infers keyTo if it is not provided', () => {
            const metadata = {
                name: 'category',
                type: __1.RelationType.hasOne,
                targetsMany: false,
                source: Product,
                keyFrom: 'id',
                target: () => Category,
                // no keyTo
            };
            const meta = (0, has_one_helpers_1.resolveHasOneMetadata)(metadata);
            (0, testlab_1.expect)(meta).to.eql({
                name: 'category',
                type: 'hasOne',
                targetsMany: false,
                source: Product,
                keyFrom: 'id',
                target: () => Category,
                keyTo: 'productId',
                polymorphic: false,
            });
        });
        it('throws if keyFrom, keyTo, and default foreign key name are not provided', async () => {
            const metadata = {
                name: 'category',
                type: __1.RelationType.hasOne,
                targetsMany: false,
                source: Category,
                // no keyFrom
                target: () => Category,
                // no keyTo
            };
            (0, testlab_1.expect)(() => {
                (0, has_one_helpers_1.resolveHasOneMetadata)(metadata);
            }).to.throw(/Invalid hasOne definition for Category#category: target model Category is missing definition of foreign key categoryId/);
        });
        it('resolves metadata if keyTo and keyFrom are not provided, but default foreign key is', async () => {
            Category.definition.addProperty('categoryId', { type: 'number' });
            const metadata = {
                name: 'category',
                type: __1.RelationType.hasOne,
                targetsMany: false,
                source: Category,
                // no keyFrom
                target: () => Category,
                // no keyTo
            };
            const meta = (0, has_one_helpers_1.resolveHasOneMetadata)(metadata);
            (0, testlab_1.expect)(meta).to.eql({
                name: 'category',
                type: 'hasOne',
                targetsMany: false,
                source: Category,
                keyFrom: 'id',
                target: () => Category,
                keyTo: 'categoryId',
                polymorphic: false,
            });
        });
        it('infers polymorphic discriminator not provided', async () => {
            Category.definition.addProperty('categoryId', { type: 'number' });
            const metadata = {
                name: 'category',
                type: __1.RelationType.hasOne,
                targetsMany: false,
                source: Category,
                // no keyFrom
                target: () => Category,
                // no keyTo
                polymorphic: true,
                // no discriminator
            };
            const meta = (0, has_one_helpers_1.resolveHasOneMetadata)(metadata);
            (0, testlab_1.expect)(meta).to.eql({
                name: 'category',
                type: 'hasOne',
                targetsMany: false,
                source: Category,
                keyFrom: 'id',
                target: () => Category,
                keyTo: 'categoryId',
                polymorphic: { discriminator: 'categoryType' },
            });
        });
    });
    /******  HELPERS *******/
    class Category extends __1.Entity {
    }
    Category.definition = new __1.ModelDefinition('Category')
        .addProperty('id', { type: 'number', id: true, required: true })
        .addProperty('productId', { type: 'number', required: true });
    class Product extends __1.Entity {
    }
    Product.definition = new __1.ModelDefinition('Product').addProperty('id', {
        type: 'number',
        id: true,
        required: true,
    });
});
//# sourceMappingURL=resolve-has-one-metadata.unit.js.map
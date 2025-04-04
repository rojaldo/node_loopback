"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../../..");
const belongs_to_helpers_1 = require("../../../../relations/belongs-to/belongs-to.helpers");
describe('resolveBelongsToMetadata', () => {
    it('throws if the wrong metadata type is used', async () => {
        const metadata = {
            name: 'category',
            type: __1.RelationType.hasOne,
            targetsMany: false,
            source: Category,
            target: () => Category,
        };
        (0, testlab_1.expect)(() => {
            (0, belongs_to_helpers_1.resolveBelongsToMetadata)(metadata);
        }).to.throw(/Invalid hasOne definition for Category#category: relation type must be BelongsTo/);
    });
    describe('keyTo and keyFrom with resolveHasManyMetadata', () => {
        it('throws if the target model does not have the id property', async () => {
            const metadata = {
                name: 'category',
                type: __1.RelationType.belongsTo,
                targetsMany: false,
                source: Product,
                keyFrom: 'categoryId',
                target: () => Category,
                keyTo: 'id',
            };
            (0, testlab_1.expect)(() => {
                (0, belongs_to_helpers_1.resolveBelongsToMetadata)(metadata);
            }).to.throw(/Invalid belongsTo definition for Product#category: Category does not have any primary key \(id property\)/);
        });
        it('resolves metadata using keyTo and keyFrom', () => {
            Category.definition.addProperty('id', {
                type: 'number',
                id: true,
                required: true,
            });
            const metadata = {
                name: 'category',
                type: __1.RelationType.belongsTo,
                targetsMany: false,
                source: Product,
                keyFrom: 'categoryId',
                target: () => Category,
                keyTo: 'id',
            };
            const meta = (0, belongs_to_helpers_1.resolveBelongsToMetadata)(metadata);
            (0, testlab_1.expect)(meta).to.eql({
                name: 'category',
                type: __1.RelationType.belongsTo,
                targetsMany: false,
                source: Product,
                keyFrom: 'categoryId',
                target: () => Category,
                keyTo: 'id',
                polymorphic: false,
            });
        });
        it('resolves metadata using polymorphic', () => {
            Category.definition.addProperty('productType', {
                type: 'string',
                required: true,
            });
            const metadata = {
                name: 'category',
                type: __1.RelationType.belongsTo,
                targetsMany: false,
                source: Product,
                keyFrom: 'categoryId',
                target: () => Category,
                keyTo: 'id',
                polymorphic: { discriminator: 'productType' },
            };
            const meta = (0, belongs_to_helpers_1.resolveBelongsToMetadata)(metadata);
            (0, testlab_1.expect)(meta).to.eql({
                name: 'category',
                type: __1.RelationType.belongsTo,
                targetsMany: false,
                source: Product,
                keyFrom: 'categoryId',
                target: () => Category,
                keyTo: 'id',
                polymorphic: { discriminator: 'productType' },
            });
        });
        it('infers keyFrom if it is not provided', () => {
            const metadata = {
                name: 'category',
                type: __1.RelationType.belongsTo,
                targetsMany: false,
                source: Product,
                // no keyFrom
                target: () => Category,
                keyTo: 'id',
            };
            const meta = (0, belongs_to_helpers_1.resolveBelongsToMetadata)(metadata);
            (0, testlab_1.expect)(meta).to.eql({
                name: 'category',
                type: __1.RelationType.belongsTo,
                targetsMany: false,
                source: Product,
                keyFrom: 'categoryId',
                target: () => Category,
                keyTo: 'id',
                polymorphic: false,
            });
        });
        it('infers keyTo if it is not provided', () => {
            const metadata = {
                name: 'category',
                type: __1.RelationType.belongsTo,
                targetsMany: false,
                source: Product,
                keyFrom: 'categoryId',
                target: () => Category,
                // no keyTo
            };
            const meta = (0, belongs_to_helpers_1.resolveBelongsToMetadata)(metadata);
            (0, testlab_1.expect)(meta).to.eql({
                name: 'category',
                type: __1.RelationType.belongsTo,
                targetsMany: false,
                source: Product,
                keyFrom: 'categoryId',
                target: () => Category,
                keyTo: 'id',
                polymorphic: false,
            });
        });
        it('infers keyFrom and keyTo if they are not provided', async () => {
            const metadata = {
                name: 'category',
                type: __1.RelationType.belongsTo,
                targetsMany: false,
                source: Product,
                // no keyFrom
                target: () => Category,
                // no keyTo
            };
            const meta = (0, belongs_to_helpers_1.resolveBelongsToMetadata)(metadata);
            (0, testlab_1.expect)(meta).to.eql({
                name: 'category',
                type: __1.RelationType.belongsTo,
                targetsMany: false,
                source: Product,
                keyFrom: 'categoryId',
                target: () => Category,
                keyTo: 'id',
                polymorphic: false,
            });
        });
        it('infers polymorphic discriminator not provided', async () => {
            const metadata = {
                name: 'category',
                type: __1.RelationType.belongsTo,
                targetsMany: false,
                source: Product,
                // no keyFrom
                target: () => Category,
                // no keyTo
                polymorphic: true,
                // no discriminator
            };
            const meta = (0, belongs_to_helpers_1.resolveBelongsToMetadata)(metadata);
            (0, testlab_1.expect)(meta).to.eql({
                name: 'category',
                type: __1.RelationType.belongsTo,
                targetsMany: false,
                source: Product,
                keyFrom: 'categoryId',
                target: () => Category,
                keyTo: 'id',
                polymorphic: { discriminator: 'categoryType' },
            });
        });
    });
    /******  HELPERS *******/
    class Category extends __1.Entity {
    }
    Category.definition = new __1.ModelDefinition('Category');
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
//# sourceMappingURL=resolve-belongs-to-metadata.unit.js.map
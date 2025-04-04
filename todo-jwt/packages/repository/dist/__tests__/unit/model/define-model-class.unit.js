"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../..");
const decorators_1 = require("../../../decorators");
describe('defineModelClass', () => {
    it('creates a Model class', () => {
        const definition = new __1.ModelDefinition('DataTransferObject').addProperty('title', { type: 'string' });
        const DataTransferObject = (0, __1.defineModelClass)(__1.Model, definition);
        (0, testlab_1.expect)(DataTransferObject.prototype).instanceof(__1.Model);
        // Verify that typedefs allows us to access static Model properties
        (0, testlab_1.expect)(DataTransferObject.modelName).to.equal('DataTransferObject');
        (0, testlab_1.expect)(DataTransferObject.definition).to.deepEqual(definition);
        // Verify that typedefs allows us to create new model instances
        const instance = new DataTransferObject({ title: 'a title' });
        // Verify that typedefs allows us to call Model methods
        (0, testlab_1.expect)(instance.toJSON()).to.deepEqual({ title: 'a title' });
        // Verify that typedefs allows us to access known properties
        (0, testlab_1.expect)(instance.title).to.equal('a title');
    });
    it('creates a correctly typed constructor', () => {
        const definition = new __1.ModelDefinition('Product').addProperty('name', {
            type: 'string',
        });
        const Product = (0, __1.defineModelClass)(__1.Model, definition);
        // When the `data` argument is not provided, then TypeScript may pick
        // Model's constructor signature instead of Product constructor signature.
        // When that happens, `p` has type `Model` without Product properties.
        // This test verifies that such situation does not happen.
        const p = new Product();
        p.name = 'Pen';
        // The test passed when the line above is accepted by the compiler.
    });
    it('creates an Entity class', () => {
        const definition = new __1.ModelDefinition('Product')
            .addProperty('id', { type: 'number', id: true })
            .addProperty('name', {
            type: 'string',
        });
        const Product = (0, __1.defineModelClass)(__1.Entity, definition);
        (0, testlab_1.expect)(Product.prototype).instanceof(__1.Entity);
        // Verify that typedefs allows us to access static Model properties
        (0, testlab_1.expect)(Product.modelName).to.equal('Product');
        (0, testlab_1.expect)(Product.definition).to.deepEqual(definition);
        // Verify that typedefs allows us to access static Entity properties
        (0, testlab_1.expect)(Product.getIdProperties()).to.deepEqual(['id']);
        // Verify that typedefs allows us to create new model instances
        const instance = new Product({ id: 1, name: 'a name' });
        // Verify that typedefs allows us to call Entity methods
        (0, testlab_1.expect)(instance.getId()).to.equal(1);
        // Verify that typedefs allows us to call Model methods
        (0, testlab_1.expect)(instance.toJSON()).to.deepEqual({ id: 1, name: 'a name' });
        // Verify that typedefs allows us to access known properties
        (0, testlab_1.expect)(instance.name).to.equal('a name');
    });
    it('creates a free-form Entity', () => {
        const definition = new __1.ModelDefinition('FreeForm')
            .addProperty('id', { type: 'number', id: true })
            .addSetting('strict', false);
        const FreeForm = (0, __1.defineModelClass)(__1.Entity, definition);
        (0, testlab_1.expect)(FreeForm.prototype).instanceof(__1.Entity);
        // Verify that typedefs allows us to access static Model properties
        (0, testlab_1.expect)(FreeForm.modelName).to.equal('FreeForm');
        (0, testlab_1.expect)(FreeForm.definition).to.deepEqual(definition);
        // Verify that typedefs allows us to access static Entity properties
        (0, testlab_1.expect)(FreeForm.getIdProperties()).to.deepEqual(['id']);
        // Verify that typedefs allows us to create new model instances
        const instance = new FreeForm({ id: 1, name: 'a name' });
        // Verify that typedefs allows us to call Entity methods
        (0, testlab_1.expect)(instance.getId()).to.equal(1);
        // Verify that typedefs allows us to call Model methods
        (0, testlab_1.expect)(instance.toJSON()).to.deepEqual({ id: 1, name: 'a name' });
        // Verify that typedefs allows us to access free-form properties
        (0, testlab_1.expect)(instance.name).to.equal('a name');
    });
    it('should add model definition in decorator metadata', () => {
        const definition = new __1.ModelDefinition('Book').addProperty('title', {
            type: 'string',
        });
        const Book = (0, __1.defineModelClass)(__1.Model, definition);
        const meta = decorators_1.ModelMetadataHelper.getModelMetadata(Book);
        (0, testlab_1.expect)(meta).to.deepEqual(definition);
    });
});
//# sourceMappingURL=define-model-class.unit.js.map
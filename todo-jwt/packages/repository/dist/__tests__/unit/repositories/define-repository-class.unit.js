"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../..");
describe('RepositoryClass builder', () => {
    describe('defineRepositoryClass', () => {
        it('should generate custom repository class', async () => {
            const AddressRepository = (0, __1.defineRepositoryClass)(Address, DummyCrudRepository);
            // `CrudRepository.prototype.find` is inherited
            (0, testlab_1.expect)(AddressRepository.prototype.find).to.be.a.Function();
            // `DummyCrudRepository.prototype.findByTitle` is inherited
            (0, testlab_1.expect)(AddressRepository.prototype.findByTitle).to.be.a.Function();
            (0, testlab_1.expect)(AddressRepository.name).to.equal('AddressRepository');
            (0, testlab_1.expect)(Object.getPrototypeOf(AddressRepository)).to.equal(DummyCrudRepository);
        });
    });
    describe('defineCrudRepositoryClass', () => {
        it('should generate entity CRUD repository class', async () => {
            const ProductRepository = (0, __1.defineCrudRepositoryClass)(Product);
            (0, testlab_1.expect)(ProductRepository.name).to.equal('ProductRepository');
            (0, testlab_1.expect)(ProductRepository.prototype.find).to.be.a.Function();
            (0, testlab_1.expect)(ProductRepository.prototype.findById).to.be.a.Function();
            (0, testlab_1.expect)(Object.getPrototypeOf(ProductRepository)).to.equal(__1.DefaultCrudRepository);
        });
    });
    describe('defineKeyValueRepositoryClass', () => {
        it('should generate key value repository class', async () => {
            const ProductRepository = (0, __1.defineKeyValueRepositoryClass)(Product);
            (0, testlab_1.expect)(ProductRepository.name).to.equal('ProductRepository');
            (0, testlab_1.expect)(ProductRepository.prototype.get).to.be.a.Function();
            (0, testlab_1.expect)(Object.getPrototypeOf(ProductRepository)).to.equal(__1.DefaultKeyValueRepository);
        });
    });
    let Product = class Product extends __1.Entity {
    };
    tslib_1.__decorate([
        (0, __1.property)({ id: true }),
        tslib_1.__metadata("design:type", Number)
    ], Product.prototype, "id", void 0);
    tslib_1.__decorate([
        (0, __1.property)(),
        tslib_1.__metadata("design:type", String)
    ], Product.prototype, "name", void 0);
    Product = tslib_1.__decorate([
        (0, __1.model)()
    ], Product);
    let Address = class Address extends __1.Model {
    };
    tslib_1.__decorate([
        (0, __1.property)(),
        tslib_1.__metadata("design:type", String)
    ], Address.prototype, "street", void 0);
    tslib_1.__decorate([
        (0, __1.property)(),
        tslib_1.__metadata("design:type", String)
    ], Address.prototype, "city", void 0);
    tslib_1.__decorate([
        (0, __1.property)(),
        tslib_1.__metadata("design:type", String)
    ], Address.prototype, "state", void 0);
    Address = tslib_1.__decorate([
        (0, __1.model)()
    ], Address);
    class DummyCrudRepository {
        constructor(modelCtor, dataSource) {
            this.modelCtor = modelCtor;
            this.dataSource = dataSource;
        }
        create(dataObject, options) {
            throw new Error('Method not implemented.');
        }
        createAll(dataObjects, options) {
            throw new Error('Method not implemented.');
        }
        find(filter, options) {
            throw new Error('Method not implemented.');
        }
        updateAll(dataObject, where, options) {
            throw new Error('Method not implemented.');
        }
        deleteAll(where, options) {
            throw new Error('Method not implemented.');
        }
        count(where, options) {
            throw new Error('Method not implemented.');
        }
        // An extra method to verify it's available for the defined repo class
        findByTitle(title) {
            throw new Error('Method not implemented.');
        }
    }
});
//# sourceMappingURL=define-repository-class.unit.js.map
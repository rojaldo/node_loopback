"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../../");
describe('EntityNotFoundError', () => {
    it('inherits from Error correctly', () => {
        const err = givenAnErrorInstance();
        (0, testlab_1.expect)(err).to.be.instanceof(__1.EntityNotFoundError);
        (0, testlab_1.expect)(err).to.be.instanceof(Error);
        (0, testlab_1.expect)(err.stack)
            .to.be.String()
            // NOTE(bajtos) We cannot assert using __filename because stack traces
            // are typically converted from JS paths to TS paths using source maps.
            .and.match(/entity-not-found-error.test.(ts|js)/);
    });
    it('sets code to "ENTITY_NOT_FOUND"', () => {
        const err = givenAnErrorInstance();
        (0, testlab_1.expect)(err.code).to.equal('ENTITY_NOT_FOUND');
    });
    it('sets entity name and id properties', () => {
        const err = new __1.EntityNotFoundError('Product', 'an-id');
        (0, testlab_1.expect)(err).to.have.properties({
            entityName: 'Product',
            entityId: 'an-id',
        });
    });
    it('has a descriptive error message', () => {
        const err = new __1.EntityNotFoundError('Product', 'an-id');
        (0, testlab_1.expect)(err.message).to.match(/not found.*Product.*"an-id"/);
    });
    it('infers entity name from entity class via name', () => {
        class Product extends __1.Entity {
        }
        const err = new __1.EntityNotFoundError(Product, 1);
        (0, testlab_1.expect)(err.entityName).to.equal('Product');
    });
    it('infers entity name from entity class via modelName', () => {
        let Product = class Product extends __1.Entity {
        };
        Product = tslib_1.__decorate([
            (0, __1.model)({ name: 'CustomProduct' })
        ], Product);
        const err = new __1.EntityNotFoundError(Product, 1);
        (0, testlab_1.expect)(err.entityName).to.equal('CustomProduct');
    });
    function givenAnErrorInstance() {
        return new __1.EntityNotFoundError('Product', 1);
    }
});
describe('isEntityNotFoundError', () => {
    it('returns true for an instance of EntityNotFoundError', () => {
        const error = new __1.EntityNotFoundError('Product', 123);
        (0, testlab_1.expect)((0, __1.isEntityNotFoundError)(error)).to.be.true();
    });
    it('returns false for an instance of Error', () => {
        const error = new Error('A generic error');
        (0, testlab_1.expect)((0, __1.isEntityNotFoundError)(error)).to.be.false();
    });
});
//# sourceMappingURL=entity-not-found-error.test.js.map
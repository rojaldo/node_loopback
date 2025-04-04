"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/rest-crud
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
describe('defineCrudRepositoryClass', () => {
    it('should generate repository based on Model name', async () => {
        let Product = class Product extends repository_1.Entity {
        };
        tslib_1.__decorate([
            (0, repository_1.property)({ id: true }),
            tslib_1.__metadata("design:type", Number)
        ], Product.prototype, "id", void 0);
        Product = tslib_1.__decorate([
            (0, repository_1.model)()
        ], Product);
        const ProductRepository = (0, __1.defineCrudRepositoryClass)(Product);
        (0, testlab_1.expect)(ProductRepository.name).to.equal('ProductRepository');
    });
});
//# sourceMappingURL=define-crud-repository-class.unit.js.map
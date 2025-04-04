"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/rest-crud
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
describe('defineCrudRestController', () => {
    it('should generate controller based on Model name', async () => {
        let Product = class Product extends repository_1.Entity {
        };
        tslib_1.__decorate([
            (0, repository_1.property)({ id: true }),
            tslib_1.__metadata("design:type", Number)
        ], Product.prototype, "id", void 0);
        Product = tslib_1.__decorate([
            (0, repository_1.model)()
        ], Product);
        const CrudRestController = (0, __1.defineCrudRestController)(Product, { basePath: '/products' });
        (0, testlab_1.expect)(CrudRestController.name).to.equal('ProductController');
    });
    it('should generate controller based on Model name with readonly APIs', async () => {
        let Product = class Product extends repository_1.Entity {
        };
        tslib_1.__decorate([
            (0, repository_1.property)({ id: true }),
            tslib_1.__metadata("design:type", Number)
        ], Product.prototype, "id", void 0);
        Product = tslib_1.__decorate([
            (0, repository_1.model)()
        ], Product);
        const CrudRestController = (0, __1.defineCrudRestController)(Product, { basePath: '/products', readonly: true });
        (0, testlab_1.expect)(CrudRestController.name).to.equal('ProductController');
        // It should not generate create method
        (0, testlab_1.expect)(CrudRestController.prototype.create).to.equal(undefined);
        // It must generate read methods
        (0, testlab_1.expect)(CrudRestController.prototype.find).not.equal(undefined);
    });
});
//# sourceMappingURL=crud-rest-controller.unit.js.map
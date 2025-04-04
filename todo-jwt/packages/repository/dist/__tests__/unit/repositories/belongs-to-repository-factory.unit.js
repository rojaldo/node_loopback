"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../..");
describe('createBelongsToAccessor', () => {
    let customerRepo;
    let companyRepo;
    beforeEach(givenStubbedCustomerRepo);
    beforeEach(givenStubbedCompanyRepo);
    it('rejects relations with missing source', () => {
        const relationMeta = givenBelongsToDefinition({
            source: undefined,
        });
        (0, testlab_1.expect)(() => (0, __1.createBelongsToAccessor)(relationMeta, __1.Getter.fromValue(companyRepo), customerRepo)).to.throw(/source model must be defined/);
    });
    it('rejects relations with missing target', () => {
        const relationMeta = givenBelongsToDefinition({
            target: undefined,
        });
        (0, testlab_1.expect)(() => (0, __1.createBelongsToAccessor)(relationMeta, __1.Getter.fromValue(companyRepo), customerRepo)).to.throw(/target must be a type resolver/);
    });
    it('rejects relations with a target that is not a type resolver', () => {
        const relationMeta = givenBelongsToDefinition({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            target: Customer,
            // the cast to any above is necessary to disable compile check
            // we want to verify runtime assertion
        });
        (0, testlab_1.expect)(() => (0, __1.createBelongsToAccessor)(relationMeta, __1.Getter.fromValue(companyRepo), customerRepo)).to.throw(/target must be a type resolver/);
    });
    it('throws an error when the target does not have any primary key', () => {
        class Product extends __1.Entity {
        }
        Product.definition = new __1.ModelDefinition('Product').addProperty('categoryId', { type: Number });
        class Category extends __1.Entity {
        }
        Category.definition = new __1.ModelDefinition('Category');
        const productRepo = (0, testlab_1.createStubInstance)(__1.DefaultCrudRepository);
        const categoryRepo = (0, testlab_1.createStubInstance)(__1.DefaultCrudRepository);
        const relationMeta = {
            type: __1.RelationType.belongsTo,
            targetsMany: false,
            name: 'category',
            source: Product,
            target: () => Category,
            keyFrom: 'categoryId',
            // Let the relation to look up keyTo as the primary key of Category
            // (which is not defined!)
            keyTo: undefined,
        };
        (0, testlab_1.expect)(() => (0, __1.createBelongsToAccessor)(relationMeta, __1.Getter.fromValue(categoryRepo), productRepo)).to.throw(/Category does not have any primary key/);
    });
    /*------------- HELPERS ---------------*/
    class Customer extends __1.Entity {
    }
    Customer.definition = new __1.ModelDefinition('Customer').addProperty('id', {
        type: Number,
        id: true,
    });
    class Company extends __1.Entity {
    }
    Company.definition = new __1.ModelDefinition('Company').addProperty('id', {
        type: Number,
        id: true,
    });
    class CustomerRepository extends __1.DefaultCrudRepository {
        constructor(dataSource) {
            super(Customer, dataSource);
        }
    }
    class CompanyRepository extends __1.DefaultCrudRepository {
        constructor(dataSource) {
            super(Company, dataSource);
        }
    }
    function givenStubbedCustomerRepo() {
        customerRepo = (0, testlab_1.createStubInstance)(CustomerRepository);
    }
    function givenStubbedCompanyRepo() {
        customerRepo = (0, testlab_1.createStubInstance)(CompanyRepository);
    }
    function givenBelongsToDefinition(props) {
        const defaults = {
            type: __1.RelationType.belongsTo,
            targetsMany: false,
            name: 'company',
            source: Company,
            target: () => Customer,
            keyFrom: 'customerId',
        };
        return Object.assign(defaults, props);
    }
});
//# sourceMappingURL=belongs-to-repository-factory.unit.js.map
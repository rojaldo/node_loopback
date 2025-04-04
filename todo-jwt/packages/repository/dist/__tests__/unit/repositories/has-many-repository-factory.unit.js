"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@loopback/core");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../..");
describe('createHasManyRepositoryFactory', () => {
    let customerRepo;
    beforeEach(givenStubbedCustomerRepo);
    it('rejects relations with missing source', () => {
        const relationMeta = givenHasManyDefinition({
            source: undefined,
        });
        (0, testlab_1.expect)(() => (0, __1.createHasManyRepositoryFactory)(relationMeta, core_1.Getter.fromValue(customerRepo))).to.throw(/source model must be defined/);
    });
    it('rejects relations with missing target', () => {
        const relationMeta = givenHasManyDefinition({
            target: undefined,
        });
        (0, testlab_1.expect)(() => (0, __1.createHasManyRepositoryFactory)(relationMeta, core_1.Getter.fromValue(customerRepo))).to.throw(/target must be a type resolver/);
    });
    it('rejects relations with a target that is not a type resolver', () => {
        const relationMeta = givenHasManyDefinition({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            target: Customer,
            // the cast to any above is necessary to disable compile check
            // we want to verify runtime assertion
        });
        (0, testlab_1.expect)(() => (0, __1.createHasManyRepositoryFactory)(relationMeta, core_1.Getter.fromValue(customerRepo))).to.throw(/target must be a type resolver/);
    });
    it('rejects relations with keyTo pointing to an unknown property', () => {
        const relationMeta = givenHasManyDefinition({
            target: () => Customer,
            // Let the relation to use the default keyTo value "companyId"
            // which does not exist on the Customer model!
            keyTo: undefined,
        });
        (0, testlab_1.expect)(() => (0, __1.createHasManyRepositoryFactory)(relationMeta, core_1.Getter.fromValue(customerRepo))).to.throw(/target model Customer is missing.*foreign key companyId/);
    });
    /*------------- HELPERS ---------------*/
    class Customer extends __1.Entity {
    }
    Customer.definition = new __1.ModelDefinition('Customer').addProperty('id', {
        type: Number,
        id: true,
    });
    class CustomerRepository extends __1.DefaultCrudRepository {
        constructor(dataSource) {
            super(Customer, dataSource);
        }
    }
    function givenStubbedCustomerRepo() {
        customerRepo = (0, testlab_1.createStubInstance)(CustomerRepository);
    }
    function givenHasManyDefinition(props) {
        class Company extends __1.Entity {
        }
        Company.definition = new __1.ModelDefinition('Company').addProperty('id', {
            type: Number,
            id: true,
        });
        const defaults = {
            type: __1.RelationType.hasMany,
            targetsMany: true,
            name: 'customers',
            target: () => Customer,
            source: Company,
        };
        return Object.assign(defaults, props);
    }
});
//# sourceMappingURL=has-many-repository-factory.unit.js.map
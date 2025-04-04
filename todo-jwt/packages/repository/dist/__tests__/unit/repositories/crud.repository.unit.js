"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../..");
const crud_connector_stub_1 = require("../crud-connector.stub");
/**
 * A mock up model class
 */
class Customer extends __1.Entity {
    constructor(data) {
        super();
        if (data && typeof data.id === 'number') {
            this.id = data.id;
        }
        if (data && typeof data.email === 'string') {
            this.email = data.email;
        }
    }
}
describe('CrudRepositoryImpl', () => {
    let ds;
    let repo;
    before(() => {
        const connector = new crud_connector_stub_1.CrudConnectorStub();
        ds = {
            name: 'myDataSource',
            settings: {},
            connector: connector,
        };
        repo = new __1.CrudRepositoryImpl(ds, Customer);
    });
    beforeEach(async () => {
        await repo.deleteAll();
    });
    it('creates an entity', async () => {
        const customer = await repo.create({ id: 1, email: 'john@example.com' });
        (0, testlab_1.expect)(customer.id).to.be.eql(1);
    });
    it('updates all entities', async () => {
        await repo.create({ id: 1, email: 'john@example.com' });
        await repo.create({ id: 2, email: 'mary@example.com' });
        const result = await repo.updateAll({ email: 'xyz@example.com' });
        (0, testlab_1.expect)(result.count).to.be.eql(2);
    });
    it('find all entities', async () => {
        const c1 = await repo.create({ id: 1, email: 'john@example.com' });
        const c2 = await repo.create({ id: 2, email: 'mary@example.com' });
        const customers = await repo.find();
        (0, testlab_1.expect)(customers).to.eql([c1, c2]);
    });
    it('delete all entities', async () => {
        await repo.create({ id: 1, email: 'john@example.com' });
        await repo.create({ id: 2, email: 'mary@example.com' });
        const result = await repo.deleteAll();
        (0, testlab_1.expect)(result.count).to.be.eql(2);
    });
    it('count all entities', async () => {
        await repo.create({ id: 1, email: 'john@example.com' });
        const result = await repo.count();
        (0, testlab_1.expect)(result.count).to.be.eql(1);
    });
});
//# sourceMappingURL=crud.repository.unit.js.map
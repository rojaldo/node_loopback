"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const loopback_datasource_juggler_1 = require("loopback-datasource-juggler");
const __1 = require("../..");
const product_model_1 = require("../fixtures/models/product.model");
// This test shows the recommended way how to use @loopback/repository
// together with existing connectors when building LoopBack applications
describe('Operation hooks', () => {
    let repo;
    beforeEach(givenProductRepository);
    const beforeSave = 'before save';
    const afterSave = 'after save';
    const expectedArray = [beforeSave, afterSave];
    it('supports operation hooks', async () => {
        await repo.create({ slug: 'pencil' });
        (0, testlab_1.expect)(repo.hooksCalled).to.eql(expectedArray);
    });
    function givenProductRepository() {
        const db = new loopback_datasource_juggler_1.DataSource({
            connector: 'memory',
        });
        repo = new ProductRepository(db);
    }
    class ProductRepository extends __1.DefaultCrudRepository {
        constructor(dataSource) {
            super(product_model_1.Product, dataSource);
            this.hooksCalled = [];
        }
        definePersistedModel(entityClass) {
            const modelClass = super.definePersistedModel(entityClass);
            modelClass.observe(beforeSave, async (ctx) => {
                this.hooksCalled.push(beforeSave);
            });
            modelClass.observe(afterSave, async (ctx) => {
                this.hooksCalled.push(afterSave);
            });
            return modelClass;
        }
    }
});
//# sourceMappingURL=operation-hooks.acceptance.js.map
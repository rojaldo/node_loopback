"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testlab_1 = require("@loopback/testlab");
const loopback_datasource_juggler_1 = require("loopback-datasource-juggler");
const __1 = require("../..");
const product_model_1 = require("../fixtures/models/product.model");
const product_repository_1 = require("../fixtures/repositories/product.repository");
// This test shows the recommended way how to use @loopback/repository
// together with existing connectors when building LoopBack applications
describe('Repository in Thinking in LoopBack', () => {
    let repo;
    beforeEach(givenProductRepository);
    it('counts models in empty database', async () => {
        (0, testlab_1.expect)(await repo.count()).to.deepEqual({ count: 0 });
    });
    it('creates a new model', async () => {
        const p = await repo.create({ name: 'Ink Pen', slug: 'pen' });
        (0, testlab_1.expect)(p).instanceof(product_model_1.Product);
        testlab_1.expect.exists(p.id);
    });
    it('can save a model', async () => {
        const p = await repo.create({ slug: 'pencil' });
        p.name = 'Red Pencil';
        await repo.save(p);
        await repo.findById(p.id);
        (0, testlab_1.expect)(p).to.have.properties({
            slug: 'pencil',
            name: 'Red Pencil',
        });
    });
    it('rejects extra model properties (defaults to strict mode)', async () => {
        await (0, testlab_1.expect)(repo.create({ name: 'custom', extra: 'additional-data' })).to.be.rejectedWith(/extra.*not defined/);
    });
    it('allows models to allow additional properties', async () => {
        // TODO(bajtos) Add syntactic sugar to allow the following usage:
        //    @model({strict: false})
        let Flexible = class Flexible extends __1.Entity {
        };
        tslib_1.__decorate([
            (0, __1.property)({ id: true }),
            tslib_1.__metadata("design:type", Number)
        ], Flexible.prototype, "id", void 0);
        Flexible = tslib_1.__decorate([
            (0, __1.model)({ settings: { strict: false } })
        ], Flexible);
        const flexibleRepo = new __1.DefaultCrudRepository(Flexible, new loopback_datasource_juggler_1.DataSource({ connector: 'memory' }));
        const created = await flexibleRepo.create({
            extra: 'additional data',
        });
        const stored = await flexibleRepo.findById(created.id);
        (0, testlab_1.expect)(stored).to.containDeep({ extra: 'additional data' });
    });
    it('allows models to allow nested model properties', async () => {
        let Role = class Role extends __1.Entity {
        };
        tslib_1.__decorate([
            (0, __1.property)(),
            tslib_1.__metadata("design:type", String)
        ], Role.prototype, "name", void 0);
        Role = tslib_1.__decorate([
            (0, __1.model)()
        ], Role);
        let Address = class Address extends __1.Entity {
        };
        tslib_1.__decorate([
            (0, __1.property)(),
            tslib_1.__metadata("design:type", String)
        ], Address.prototype, "street", void 0);
        Address = tslib_1.__decorate([
            (0, __1.model)()
        ], Address);
        let User = class User extends __1.Entity {
        };
        tslib_1.__decorate([
            (0, __1.property)({
                type: 'number',
                id: true,
            }),
            tslib_1.__metadata("design:type", Number)
        ], User.prototype, "id", void 0);
        tslib_1.__decorate([
            (0, __1.property)({ type: 'string' }),
            tslib_1.__metadata("design:type", String)
        ], User.prototype, "name", void 0);
        tslib_1.__decorate([
            __1.property.array(Role),
            tslib_1.__metadata("design:type", Array)
        ], User.prototype, "roles", void 0);
        tslib_1.__decorate([
            (0, __1.property)(),
            tslib_1.__metadata("design:type", Address)
        ], User.prototype, "address", void 0);
        User = tslib_1.__decorate([
            (0, __1.model)()
        ], User);
        const userRepo = new __1.DefaultCrudRepository(User, new loopback_datasource_juggler_1.DataSource({ connector: 'memory' }));
        const user = {
            id: 1,
            name: 'foo',
            roles: [{ name: 'admin' }, { name: 'user' }],
            address: { street: 'backstreet' },
        };
        const created = await userRepo.create(user);
        const stored = await userRepo.findById(created.id);
        (0, testlab_1.expect)(stored).to.containDeep(user);
    });
    it('toObject preserves the prototype of properties', async () => {
        const DATE = new Date('2020-05-01');
        const created = await repo.create({
            createdAt: DATE,
        });
        (0, testlab_1.expect)(created.toObject()).to.deepEqual({
            id: 1,
            createdAt: DATE,
        });
    });
    function givenProductRepository() {
        const db = new loopback_datasource_juggler_1.DataSource({
            connector: 'memory',
        });
        repo = new product_repository_1.ProductRepository(db);
    }
});
//# sourceMappingURL=repository.acceptance.js.map
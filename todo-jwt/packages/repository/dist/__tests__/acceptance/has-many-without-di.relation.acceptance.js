"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
describe('HasMany relation', () => {
    // Given a Customer and Order models - see definitions at the bottom
    let existingCustomerId;
    let ds;
    let customerRepo;
    let orderRepo;
    before(givenDataSource);
    before(givenOrderRepository);
    before(givenCustomerRepository);
    beforeEach(async () => {
        await orderRepo.deleteAll();
        existingCustomerId = (await givenPersistedCustomerInstance()).id;
    });
    it('can create an instance of the related model', async () => {
        async function createCustomerOrders(customerId, orderData) {
            return customerRepo.orders(customerId).create(orderData);
        }
        const order = await createCustomerOrders(existingCustomerId, {
            description: 'order 1',
        });
        (0, testlab_1.expect)(order.toObject()).to.containDeep({
            customerId: existingCustomerId,
            description: 'order 1',
        });
        const persisted = await orderRepo.findById(order.id);
        (0, testlab_1.expect)(persisted.toObject()).to.deepEqual(order.toObject());
    });
    it('can find instances of the related model', async () => {
        async function createCustomerOrders(customerId, orderData) {
            return customerRepo.orders(customerId).create(orderData);
        }
        async function findCustomerOrders(customerId) {
            return customerRepo.orders(customerId).find();
        }
        const order = await createCustomerOrders(existingCustomerId, {
            description: 'order 1',
        });
        const notMyOrder = await createCustomerOrders(existingCustomerId + 1, {
            description: 'order 2',
        });
        const orders = await findCustomerOrders(existingCustomerId);
        (0, testlab_1.expect)(orders).to.containEql(order);
        (0, testlab_1.expect)(orders).to.not.containEql(notMyOrder);
        const persisted = await orderRepo.find({
            where: { customerId: existingCustomerId },
        });
        (0, testlab_1.expect)(persisted).to.deepEqual(orders);
    });
    //--- HELPERS ---//
    let Order = class Order extends __1.Entity {
    };
    tslib_1.__decorate([
        (0, __1.property)({
            type: 'number',
            id: true,
        }),
        tslib_1.__metadata("design:type", Number)
    ], Order.prototype, "id", void 0);
    tslib_1.__decorate([
        (0, __1.property)({
            type: 'string',
            required: true,
        }),
        tslib_1.__metadata("design:type", String)
    ], Order.prototype, "description", void 0);
    tslib_1.__decorate([
        (0, __1.property)({
            type: 'number',
            required: true,
        }),
        tslib_1.__metadata("design:type", Number)
    ], Order.prototype, "customerId", void 0);
    Order = tslib_1.__decorate([
        (0, __1.model)()
    ], Order);
    let Customer = class Customer extends __1.Entity {
    };
    tslib_1.__decorate([
        (0, __1.property)({
            type: 'number',
            id: true,
        }),
        tslib_1.__metadata("design:type", Number)
    ], Customer.prototype, "id", void 0);
    tslib_1.__decorate([
        (0, __1.property)({
            type: 'string',
        }),
        tslib_1.__metadata("design:type", String)
    ], Customer.prototype, "name", void 0);
    tslib_1.__decorate([
        (0, __1.hasMany)(() => Order),
        tslib_1.__metadata("design:type", Array)
    ], Customer.prototype, "orders", void 0);
    Customer = tslib_1.__decorate([
        (0, __1.model)()
    ], Customer);
    class OrderRepository extends __1.DefaultCrudRepository {
        constructor(db) {
            super(Order, db);
        }
    }
    class CustomerRepository extends __1.DefaultCrudRepository {
        constructor(db, orderRepositoryGetter) {
            super(Customer, db);
            this.db = db;
            this.orders = this._createHasManyRepositoryFactoryFor('orders', orderRepositoryGetter);
        }
    }
    function givenDataSource() {
        ds = new __1.juggler.DataSource({ connector: 'memory' });
    }
    function givenOrderRepository() {
        orderRepo = new OrderRepository(ds);
    }
    function givenCustomerRepository() {
        customerRepo = new CustomerRepository(ds, __1.Getter.fromValue(orderRepo));
    }
    async function givenPersistedCustomerInstance() {
        return customerRepo.create({ name: 'a customer' });
    }
});
//# sourceMappingURL=has-many-without-di.relation.acceptance.js.map
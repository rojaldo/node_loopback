"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../..");
// Given a Customer and Order models - see definitions at the bottom
let db;
let customerRepo;
let orderRepo;
let cartItemRepo;
let customerCartItemLinkRepo;
let reviewRepo;
describe('HasMany relation', () => {
    let existingCustomerId;
    let customerOrderRepo;
    let customerAuthoredReviewFactoryFn;
    let customerApprovedReviewFactoryFn;
    before(givenCrudRepositories);
    before(givenPersistedCustomerInstance);
    before(givenConstrainedRepositories);
    before(givenRepositoryFactoryFunctions);
    beforeEach(async function resetDatabase() {
        await orderRepo.deleteAll();
        await reviewRepo.deleteAll();
    });
    it('can create an instance of the related model', async () => {
        const order = await customerOrderRepo.create({
            description: 'an order desc',
        });
        const persisted = await orderRepo.findById(order.id);
        (0, testlab_1.expect)(order).to.deepEqual(persisted);
    });
    it('can find an instance of the related model', async () => {
        const order = await customerOrderRepo.create({
            description: 'an order desc',
        });
        const notMyOrder = await orderRepo.create({
            description: "someone else's order desc",
            customerId: existingCustomerId + 1, // a different customerId,
        });
        const persistedOrders = await orderRepo.find({
            where: {
                customerId: existingCustomerId,
            },
        });
        const orders = await customerOrderRepo.find();
        (0, testlab_1.expect)(orders).to.containEql(order);
        (0, testlab_1.expect)(orders).to.not.containEql(notMyOrder);
        (0, testlab_1.expect)(orders).to.deepEqual(persistedOrders);
    });
    it('finds appropriate related model instances for multiple relations', async () => {
        // note(shimks): roundabout way of creating reviews with 'approves'
        // ideally, the review repository should have a approve function
        // which should 'approve' a review
        // On another note, this test should be separated for 'create' and 'find'
        await customerAuthoredReviewFactoryFn(existingCustomerId).create({
            description: 'my wonderful review',
            approvedId: existingCustomerId + 1,
        });
        await customerAuthoredReviewFactoryFn(existingCustomerId + 1).create({
            description: 'smash that progenitor loving approve button',
            approvedId: existingCustomerId,
        });
        const reviewsApprovedByCustomerOne = await customerApprovedReviewFactoryFn(existingCustomerId).find();
        const reviewsApprovedByCustomerTwo = await customerApprovedReviewFactoryFn(existingCustomerId + 1).find();
        const persistedReviewsApprovedByCustomerOne = await reviewRepo.find({
            where: {
                approvedId: existingCustomerId,
            },
        });
        const persistedReviewsApprovedByCustomerTwo = await reviewRepo.find({
            where: {
                approvedId: existingCustomerId + 1,
            },
        });
        (0, testlab_1.expect)(reviewsApprovedByCustomerOne).to.eql(persistedReviewsApprovedByCustomerOne);
        (0, testlab_1.expect)(reviewsApprovedByCustomerTwo).to.eql(persistedReviewsApprovedByCustomerTwo);
    });
    //--- HELPERS ---//
    async function givenPersistedCustomerInstance() {
        const customer = await customerRepo.create({ name: 'a customer' });
        existingCustomerId = customer.id;
    }
    function givenConstrainedRepositories() {
        const orderFactoryFn = (0, __1.createHasManyRepositoryFactory)(Customer.definition.relations.orders, __1.Getter.fromValue(orderRepo));
        customerOrderRepo = orderFactoryFn(existingCustomerId);
    }
    function givenRepositoryFactoryFunctions() {
        customerAuthoredReviewFactoryFn = (0, __1.createHasManyRepositoryFactory)(Customer.definition.relations.reviewsAuthored, __1.Getter.fromValue(reviewRepo));
        customerApprovedReviewFactoryFn = (0, __1.createHasManyRepositoryFactory)(Customer.definition.relations.reviewsApproved, __1.Getter.fromValue(reviewRepo));
    }
});
describe('BelongsTo relation', () => {
    let findCustomerOfOrder;
    before(givenCrudRepositories);
    before(givenAccessor);
    beforeEach(async function resetDatabase() {
        await Promise.all([
            customerRepo.deleteAll(),
            orderRepo.deleteAll(),
            reviewRepo.deleteAll(),
        ]);
    });
    it('finds an instance of the related model', async () => {
        const customer = await customerRepo.create({ name: 'Order McForder' });
        const order = await orderRepo.create({
            customerId: customer.id,
            description: 'Order from Order McForder, the hoarder of Mordor',
        });
        const result = await findCustomerOfOrder(order.id);
        (0, testlab_1.expect)(result).to.deepEqual(customer);
    });
    it('throws EntityNotFound error when the related model does not exist', async () => {
        const order = await orderRepo.create({
            customerId: 999,
            description: 'Order of a fictional customer',
        });
        await (0, testlab_1.expect)(findCustomerOfOrder(order.id)).to.be.rejectedWith(__1.EntityNotFoundError);
    });
    //--- HELPERS ---//
    function givenAccessor() {
        findCustomerOfOrder = (0, __1.createBelongsToAccessor)(Order.definition.relations.customer, __1.Getter.fromValue(customerRepo), orderRepo);
    }
});
describe('HasManyThrough relation', () => {
    let existingCustomerId;
    // Customer has many CartItems through CustomerCartItemLink
    let customerCartItemRepo;
    let customerCartItemFactory;
    before(givenCrudRepositories);
    before(givenPersistedCustomerInstance);
    before(givenConstrainedRepositories);
    beforeEach(async function resetDatabase() {
        await customerRepo.deleteAll();
        await customerCartItemLinkRepo.deleteAll();
        await cartItemRepo.deleteAll();
    });
    it('creates a target instance along with the corresponding through model', async () => {
        const cartItem = await customerCartItemRepo.create({
            description: 'an item hasManyThrough',
        });
        const persistedItem = await cartItemRepo.findById(cartItem.id);
        const persistedLink = await customerCartItemLinkRepo.find();
        (0, testlab_1.expect)(cartItem).to.deepEqual(persistedItem);
        (0, testlab_1.expect)(persistedLink).have.length(1);
        const expected = {
            customerId: existingCustomerId,
            itemId: cartItem.id,
        };
        (0, testlab_1.expect)((0, testlab_1.toJSON)(persistedLink[0])).to.containEql((0, testlab_1.toJSON)(expected));
    });
    it('finds an instance via through model', async () => {
        const item = await customerCartItemRepo.create({
            description: 'an item hasManyThrough',
        });
        const notMyItem = await cartItemRepo.create({
            description: "someone else's item desc",
        });
        const items = await customerCartItemRepo.find();
        (0, testlab_1.expect)(items).to.not.containEql(notMyItem);
        (0, testlab_1.expect)(items).to.deepEqual([item]);
    });
    it('finds instances via through models', async () => {
        const item1 = await customerCartItemRepo.create({ description: 'group 1' });
        const item2 = await customerCartItemRepo.create({
            description: 'group 2',
        });
        const items = await customerCartItemRepo.find();
        (0, testlab_1.expect)(items).have.length(2);
        (0, testlab_1.expect)(items).to.deepEqual([item1, item2]);
        const group1 = await customerCartItemRepo.find({
            where: { description: 'group 1' },
        });
        (0, testlab_1.expect)(group1).to.deepEqual([item1]);
    });
    it('deletes an instance, then deletes the through model', async () => {
        await customerCartItemRepo.create({
            description: 'customer 1',
        });
        const anotherHasManyThroughRepo = customerCartItemFactory(existingCustomerId + 1);
        const item2 = await anotherHasManyThroughRepo.create({
            description: 'customer 2',
        });
        let items = await cartItemRepo.find();
        let links = await customerCartItemLinkRepo.find();
        (0, testlab_1.expect)(items).have.length(2);
        (0, testlab_1.expect)(links).have.length(2);
        await customerCartItemRepo.delete();
        items = await cartItemRepo.find();
        links = await customerCartItemLinkRepo.find();
        (0, testlab_1.expect)(items).have.length(1);
        (0, testlab_1.expect)(links).have.length(1);
        (0, testlab_1.expect)(items).to.deepEqual([item2]);
        (0, testlab_1.expect)(links[0]).has.property('itemId', item2.id);
        (0, testlab_1.expect)(links[0]).has.property('customerId', existingCustomerId + 1);
    });
    it('deletes through model when corresponding target gets deleted', async () => {
        const item1 = await customerCartItemRepo.create({
            description: 'customer 1',
        });
        const anotherHasManyThroughRepo = customerCartItemFactory(existingCustomerId + 1);
        const item2 = await anotherHasManyThroughRepo.create({
            description: 'customer 2',
        });
        // when order1 gets deleted, this through instance should be deleted too.
        const through = await customerCartItemLinkRepo.create({
            id: 1,
            customerId: existingCustomerId + 1,
            itemId: item1.id,
        });
        let items = await cartItemRepo.find();
        let links = await customerCartItemLinkRepo.find();
        (0, testlab_1.expect)(items).have.length(2);
        (0, testlab_1.expect)(links).have.length(3);
        await customerCartItemRepo.delete();
        items = await cartItemRepo.find();
        links = await customerCartItemLinkRepo.find();
        (0, testlab_1.expect)(items).have.length(1);
        (0, testlab_1.expect)(links).have.length(1);
        (0, testlab_1.expect)(items).to.deepEqual([item2]);
        (0, testlab_1.expect)(links).to.not.containEql(through);
        (0, testlab_1.expect)(links[0]).has.property('itemId', item2.id);
        (0, testlab_1.expect)(links[0]).has.property('customerId', existingCustomerId + 1);
    });
    it('deletes instances based on the filter', async () => {
        await customerCartItemRepo.create({
            description: 'customer 1',
        });
        const item2 = await customerCartItemRepo.create({
            description: 'customer 2',
        });
        let items = await cartItemRepo.find();
        let links = await customerCartItemLinkRepo.find();
        (0, testlab_1.expect)(items).have.length(2);
        (0, testlab_1.expect)(links).have.length(2);
        await customerCartItemRepo.delete({ description: 'does not exist' });
        items = await cartItemRepo.find();
        links = await customerCartItemLinkRepo.find();
        (0, testlab_1.expect)(items).have.length(2);
        (0, testlab_1.expect)(links).have.length(2);
        await customerCartItemRepo.delete({ description: 'customer 1' });
        items = await cartItemRepo.find();
        links = await customerCartItemLinkRepo.find();
        (0, testlab_1.expect)(items).have.length(1);
        (0, testlab_1.expect)(links).have.length(1);
        (0, testlab_1.expect)(items).to.deepEqual([item2]);
        (0, testlab_1.expect)(links[0]).has.property('itemId', item2.id);
        (0, testlab_1.expect)(links[0]).has.property('customerId', existingCustomerId);
    });
    it('patches instances that belong to the same source model (same source fk)', async () => {
        const item1 = await customerCartItemRepo.create({
            description: 'group 1',
        });
        const item2 = await customerCartItemRepo.create({
            description: 'group 1',
        });
        const count = await customerCartItemRepo.patch({ description: 'group 2' });
        (0, testlab_1.expect)(count).to.match({ count: 2 });
        const updateResult = await cartItemRepo.find();
        (0, testlab_1.expect)((0, testlab_1.toJSON)(updateResult)).to.containDeep((0, testlab_1.toJSON)([
            { id: item1.id, description: 'group 2' },
            { id: item2.id, description: 'group 2' },
        ]));
    });
    it('links a target instance to the source instance', async () => {
        const item = await cartItemRepo.create({ description: 'an item' });
        let targets = await customerCartItemRepo.find();
        (0, testlab_1.expect)(targets).to.deepEqual([]);
        await customerCartItemRepo.link(item.id);
        targets = await customerCartItemRepo.find();
        (0, testlab_1.expect)((0, testlab_1.toJSON)(targets)).to.containDeep((0, testlab_1.toJSON)([item]));
        const link = await customerCartItemLinkRepo.find();
        (0, testlab_1.expect)((0, testlab_1.toJSON)(link[0])).to.containEql((0, testlab_1.toJSON)({ customerId: existingCustomerId, itemId: item.id }));
    });
    it('links a target instance to the source instance with specified ThroughData', async () => {
        const item = await cartItemRepo.create({ description: 'an item' });
        await customerCartItemRepo.link(item.id, {
            throughData: { description: 'a through' },
        });
        const targets = await customerCartItemRepo.find();
        (0, testlab_1.expect)((0, testlab_1.toJSON)(targets)).to.containDeep((0, testlab_1.toJSON)([item]));
        const link = await customerCartItemLinkRepo.find();
        (0, testlab_1.expect)((0, testlab_1.toJSON)(link[0])).to.containEql((0, testlab_1.toJSON)({
            customerId: existingCustomerId,
            itemId: item.id,
            description: 'a through',
        }));
    });
    it('unlinks a target instance from the source instance', async () => {
        const item = await customerCartItemRepo.create({ description: 'an item' });
        let targets = await customerCartItemRepo.find();
        (0, testlab_1.expect)((0, testlab_1.toJSON)(targets)).to.containDeep((0, testlab_1.toJSON)([item]));
        await customerCartItemRepo.unlink(item.id);
        targets = await customerCartItemRepo.find();
        (0, testlab_1.expect)(targets).to.deepEqual([]);
        // the through model should be deleted
        const thoughs = await customerCartItemRepo.find();
        (0, testlab_1.expect)(thoughs).to.deepEqual([]);
    });
    it('unlinks all targets instance from the source instance', async () => {
        const item = await customerCartItemRepo.create({ description: 'an item' });
        const item1 = await customerCartItemRepo.create({
            description: 'another item',
        });
        let targets = await customerCartItemRepo.find();
        (0, testlab_1.expect)((0, testlab_1.toJSON)(targets)).to.containDeep((0, testlab_1.toJSON)([item, item1]));
        await customerCartItemRepo.unlinkAll();
        targets = await customerCartItemRepo.find();
        (0, testlab_1.expect)(targets).to.deepEqual([]);
        // the through model should be deleted
        const thoughs = await customerCartItemRepo.find();
        (0, testlab_1.expect)(thoughs).to.deepEqual([]);
    });
    //--- HELPERS ---//
    async function givenPersistedCustomerInstance() {
        const customer = await customerRepo.create({ name: 'a customer' });
        existingCustomerId = customer.id;
    }
    function givenConstrainedRepositories() {
        customerCartItemFactory = (0, __1.createHasManyThroughRepositoryFactory)({
            name: 'cartItems',
            type: 'hasMany',
            targetsMany: true,
            source: Customer,
            keyFrom: 'id',
            target: () => CartItem,
            keyTo: 'id',
            through: {
                model: () => CustomerCartItemLink,
                keyFrom: 'customerId',
                keyTo: 'itemId',
            },
        }, __1.Getter.fromValue(cartItemRepo), __1.Getter.fromValue(customerCartItemLinkRepo));
        customerCartItemRepo = customerCartItemFactory(existingCustomerId);
    }
});
//--- HELPERS ---//
class Order extends __1.Entity {
}
Order.definition = new __1.ModelDefinition('Order')
    .addProperty('id', { type: 'number', id: true })
    .addProperty('description', { type: 'string', required: true })
    .addProperty('customerId', { type: 'number', required: true })
    .belongsTo('customer', {
    source: Order,
    target: () => Customer,
});
class CartItem extends __1.Entity {
}
CartItem.definition = new __1.ModelDefinition('CartItem')
    .addProperty('id', { type: 'number', id: true })
    .addProperty('description', { type: 'string', required: true });
class Review extends __1.Entity {
}
Review.definition = new __1.ModelDefinition('Review')
    .addProperty('id', { type: 'number', id: true })
    .addProperty('description', { type: 'string', required: true })
    .addProperty('authorId', { type: 'number', required: false })
    .addProperty('approvedId', { type: 'number', required: false });
class Customer extends __1.Entity {
}
Customer.definition = new __1.ModelDefinition('Customer')
    .addProperty('id', { type: 'number', id: true })
    .addProperty('name', { type: 'string', required: true })
    .addProperty('orders', { type: Order, array: true })
    .addProperty('reviewsAuthored', { type: Review, array: true })
    .addProperty('reviewsApproved', { type: Review, array: true })
    .hasMany('orders', {
    source: Customer,
    target: () => Order,
    keyTo: 'customerId',
})
    .hasMany('reviewsAuthored', {
    source: Customer,
    target: () => Review,
    keyTo: 'authorId',
})
    .hasMany('reviewsApproved', {
    source: Customer,
    target: () => Review,
    keyTo: 'approvedId',
});
class CustomerCartItemLink extends __1.Entity {
}
CustomerCartItemLink.definition = new __1.ModelDefinition('CustomerCartItemLink')
    .addProperty('id', { type: 'number', id: true })
    .addProperty('itemId', { type: 'number' })
    .addProperty('customerId', { type: 'number' })
    .addProperty('description', { type: 'string' });
function givenCrudRepositories() {
    db = new __1.juggler.DataSource({ connector: 'memory' });
    customerRepo = new __1.DefaultCrudRepository(Customer, db);
    orderRepo = new __1.DefaultCrudRepository(Order, db);
    cartItemRepo = new __1.DefaultCrudRepository(CartItem, db);
    customerCartItemLinkRepo = new __1.DefaultCrudRepository(CustomerCartItemLink, db);
    reviewRepo = new __1.DefaultCrudRepository(Review, db);
}
//# sourceMappingURL=relation.factory.integration.js.map
"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../../");
describe('model', () => {
    const customerDef = new __1.ModelDefinition('Customer');
    customerDef
        .addProperty('id', 'string')
        .addProperty('email', 'string')
        .addProperty('firstName', String)
        .addProperty('lastName', __1.STRING)
        .addProperty('address', 'object')
        .addProperty('phones', 'array')
        .addProperty('createdAt', Date)
        .addSetting('id', 'id');
    const realmCustomerDef = new __1.ModelDefinition('RealmCustomer');
    realmCustomerDef
        .addProperty('realm', 'string')
        .addProperty('email', 'string')
        .addProperty('firstName', String)
        .addProperty('lastName', __1.STRING)
        .addSetting('id', ['realm', 'email']);
    const userDef = new __1.ModelDefinition('User');
    userDef
        .addProperty('id', { type: 'string', id: true })
        .addProperty('email', 'string')
        .addProperty('password', 'string')
        .addProperty('firstName', String)
        .addProperty('lastName', __1.STRING)
        .addSetting('hiddenProperties', ['password']);
    const flexibleDef = new __1.ModelDefinition('Flexible');
    flexibleDef
        .addProperty('id', { type: 'string', id: true })
        .addProperty('createdAt', Date)
        .addSetting('hiddenProperties', ['createdAt'])
        .addSetting('strict', false);
    const addressDef = new __1.ModelDefinition('Address');
    addressDef
        .addProperty('street', 'string')
        .addProperty('city', 'string')
        .addProperty('state', String)
        .addProperty('zipCode', __1.STRING);
    class Address extends __1.Entity {
        constructor(data) {
            super(data);
        }
    }
    Address.definition = addressDef;
    const phoneDef = new __1.ModelDefinition('Phone');
    phoneDef.addProperty('number', 'string').addProperty('label', 'string');
    class Phone extends __1.Entity {
        constructor(data) {
            super(data);
        }
    }
    Phone.definition = phoneDef;
    class Customer extends __1.Entity {
        constructor(data) {
            super(data);
        }
    }
    Customer.definition = customerDef;
    class RealmCustomer extends __1.Entity {
        constructor(data) {
            super(data);
        }
    }
    RealmCustomer.definition = realmCustomerDef;
    class User extends __1.Entity {
        constructor(data) {
            super(data);
        }
    }
    User.definition = userDef;
    class Flexible extends __1.Entity {
        constructor(data) {
            super(data);
        }
    }
    Flexible.definition = flexibleDef;
    function createCustomer() {
        const customer = new Customer();
        customer.id = '123';
        customer.email = 'xyz@example.com';
        return customer;
    }
    function createCustomerWithContact() {
        const customer = new Customer();
        customer.id = '123';
        customer.email = 'xyz@example.com';
        customer.address = new Address({
            street: '123 A St',
            city: 'San Jose',
            state: 'CA',
            zipCode: '95131',
        });
        customer.phones = [
            new Phone({ label: 'home', number: '111-222-3333' }),
            new Phone({ label: 'work', number: '111-222-5555' }),
        ];
        return customer;
    }
    function createCustomerWithContactAndDate(date) {
        const customer = new Customer();
        customer.id = '123';
        customer.email = 'xyz@example.com';
        customer.createdAt = date;
        customer.address = new Address({
            street: '123 A St',
            city: 'San Jose',
            state: 'CA',
            zipCode: '95131',
        });
        customer.phones = [
            new Phone({ label: 'home', number: '111-222-3333' }),
            new Phone({ label: 'work', number: '111-222-5555' }),
        ];
        return customer;
    }
    function createRealmCustomer() {
        const customer = new RealmCustomer();
        customer.realm = 'org1';
        customer.email = 'xyz@example.com';
        return customer;
    }
    function createUser() {
        const user = new User();
        user.id = '123';
        user.email = 'xyz@example.com';
        user.password = '1234test';
        user.firstName = 'Test User';
        return user;
    }
    it('adds properties', () => {
        (0, testlab_1.expect)(customerDef.name).to.eql('Customer');
        (0, testlab_1.expect)(customerDef.properties).have.properties('id', 'email', 'lastName', 'firstName');
        (0, testlab_1.expect)(customerDef.properties.lastName).to.eql({ type: __1.STRING });
    });
    it('adds settings', () => {
        (0, testlab_1.expect)(customerDef.settings).have.property('id', 'id');
    });
    it('lists id properties', () => {
        (0, testlab_1.expect)(customerDef.idProperties()).to.eql(['id']);
        (0, testlab_1.expect)(userDef.idProperties()).to.eql(['id']);
        (0, testlab_1.expect)(realmCustomerDef.idProperties()).to.eql(['realm', 'email']);
    });
    it('converts to json', () => {
        const customer = createCustomer();
        Object.assign(customer, { extra: 'additional data' });
        (0, testlab_1.expect)(customer.toJSON()).to.eql({ id: '123', email: 'xyz@example.com' });
        // notice that "extra" property was discarded from the output
    });
    it('skips properties with undefined values', () => {
        const customer = createCustomer();
        delete customer.email;
        (0, testlab_1.expect)(customer.toJSON()).to.eql({ id: '123' });
    });
    it('converts to json recursively', () => {
        const customer = createCustomerWithContact();
        (0, testlab_1.expect)(customer.toJSON()).to.eql({
            id: '123',
            email: 'xyz@example.com',
            address: {
                street: '123 A St',
                city: 'San Jose',
                state: 'CA',
                zipCode: '95131',
            },
            phones: [
                { label: 'home', number: '111-222-3333' },
                { label: 'work', number: '111-222-5555' },
            ],
        });
    });
    it('includes navigational properties in JSON (strict-mode)', () => {
        class Category extends __1.Entity {
            constructor(data) {
                super(data);
            }
        }
        class Product extends __1.Entity {
            constructor(data) {
                super(data);
            }
        }
        Category.definition = new __1.ModelDefinition('Category')
            .addSetting('strict', true)
            .addProperty('id', { type: 'number', id: true, required: true })
            .addRelation({
            name: 'products',
            type: __1.RelationType.hasMany,
            targetsMany: true,
            source: Category,
            keyFrom: 'id',
            target: () => Product,
            keyTo: 'categoryId',
        });
        const category = new Category({
            id: 1,
            products: [new Product({ id: 2, categoryId: 1 })],
        });
        const data = category.toJSON();
        (0, testlab_1.expect)(data).to.deepEqual({
            id: 1,
            products: [{ id: 2, categoryId: 1 }],
        });
    });
    it('includes navigational properties in JSON (non-strict-mode)', () => {
        class Category extends __1.Entity {
            constructor(data) {
                super(data);
            }
        }
        class Product extends __1.Entity {
            constructor(data) {
                super(data);
            }
        }
        Category.definition = new __1.ModelDefinition('Category')
            .addSetting('strict', false)
            .addProperty('id', { type: 'number', id: true, required: true })
            .addRelation({
            name: 'products',
            type: __1.RelationType.hasMany,
            targetsMany: true,
            source: Category,
            keyFrom: 'id',
            target: () => Product,
            keyTo: 'categoryId',
        });
        const category = new Category({
            id: 1,
            products: [new Product({ id: 2, categoryId: 1 })],
        });
        const data = category.toJSON();
        (0, testlab_1.expect)(data).to.deepEqual({
            id: 1,
            products: [{ id: 2, categoryId: 1 }],
        });
    });
    it('supports non-strict model in toJSON()', () => {
        const DATA = { id: 'uid', extra: 'additional data' };
        const instance = new Flexible(DATA);
        const actual = instance.toJSON();
        (0, testlab_1.expect)(actual).to.deepEqual(DATA);
    });
    it('converts to plain object', () => {
        const customer = createCustomer();
        Object.assign(customer, { unknown: 'abc' });
        (0, testlab_1.expect)(customer.toObject()).to.eql({ id: '123', email: 'xyz@example.com' });
        (0, testlab_1.expect)(customer.toObject({ ignoreUnknownProperties: false })).to.eql({
            id: '123',
            email: 'xyz@example.com',
            unknown: 'abc',
        });
    });
    it('converts to plain object recursively', () => {
        const aDate = new Date();
        const customer = createCustomerWithContactAndDate(aDate);
        Object.assign(customer, { unknown: 'abc' });
        Object.assign(customer.address, { unknown: 'xyz' });
        (0, testlab_1.expect)(customer.toObject()).to.eql({
            id: '123',
            email: 'xyz@example.com',
            createdAt: aDate,
            address: {
                street: '123 A St',
                city: 'San Jose',
                state: 'CA',
                zipCode: '95131',
            },
            phones: [
                { label: 'home', number: '111-222-3333' },
                { label: 'work', number: '111-222-5555' },
            ],
        });
        (0, testlab_1.expect)(customer.toObject({ ignoreUnknownProperties: false })).to.eql({
            id: '123',
            email: 'xyz@example.com',
            createdAt: aDate,
            unknown: 'abc',
            address: {
                street: '123 A St',
                city: 'San Jose',
                state: 'CA',
                zipCode: '95131',
                unknown: 'xyz',
            },
            phones: [
                { label: 'home', number: '111-222-3333' },
                { label: 'work', number: '111-222-5555' },
            ],
        });
    });
    it('converts to plain object including relation properties', () => {
        class Category extends __1.Entity {
            constructor(data) {
                super(data);
            }
        }
        class Product extends __1.Entity {
            constructor(data) {
                super(data);
            }
        }
        Category.definition = new __1.ModelDefinition('Category')
            .addSetting('strict', false)
            .addProperty('id', { type: 'number', id: true, required: true })
            .addRelation({
            name: 'products',
            type: __1.RelationType.hasMany,
            targetsMany: true,
            source: Category,
            keyFrom: 'id',
            target: () => Product,
            keyTo: 'categoryId',
        });
        const category = new Category({
            id: 1,
            products: [new Product({ id: 2, categoryId: 1 })],
        });
        const data = category.toObject();
        (0, testlab_1.expect)(data).to.deepEqual({
            id: 1,
            products: [{ id: 2, categoryId: 1 }],
        });
    });
    it('gets id', () => {
        const customer = createCustomer();
        (0, testlab_1.expect)(customer.getId()).to.eql('123');
    });
    it('gets id object', () => {
        const customer = createCustomer();
        (0, testlab_1.expect)(customer.getIdObject()).to.eql({ id: '123' });
    });
    it('builds where for id', () => {
        const where = Customer.buildWhereForId('123');
        (0, testlab_1.expect)(where).to.eql({ id: '123' });
    });
    it('gets composite id', () => {
        const customer = createRealmCustomer();
        (0, testlab_1.expect)(customer.getId()).to.eql({ realm: 'org1', email: 'xyz@example.com' });
    });
    it('gets composite id object', () => {
        const customer = createRealmCustomer();
        (0, testlab_1.expect)(customer.getIdObject()).to.eql({
            realm: 'org1',
            email: 'xyz@example.com',
        });
    });
    it('builds where for composite id', () => {
        const where = RealmCustomer.buildWhereForId({
            realm: 'org1',
            email: 'xyz@example.com',
        });
        (0, testlab_1.expect)(where).to.eql({ realm: 'org1', email: 'xyz@example.com' });
    });
    it('reports helpful error when getting ids of a model with no ids', () => {
        class NoId extends __1.Entity {
        }
        NoId.definition = new __1.ModelDefinition('NoId');
        const instance = new NoId();
        (0, testlab_1.expect)(() => instance.getId()).to.throw(/missing.*id/);
    });
    it('gets id names via a static method', () => {
        const names = Customer.getIdProperties();
        (0, testlab_1.expect)(names).to.deepEqual(['id']);
    });
    it('reads model name from the definition', () => {
        (0, testlab_1.expect)(Customer.modelName).to.equal('Customer');
    });
    it('reads model name from the class name', () => {
        class MyModel extends __1.Entity {
        }
        (0, testlab_1.expect)(MyModel.modelName).to.equal('MyModel');
    });
    it('excludes hidden properties from toJSON() output', () => {
        const user = createUser();
        (0, testlab_1.expect)(user.toJSON()).to.eql({
            id: '123',
            email: 'xyz@example.com',
            firstName: 'Test User',
        });
    });
    it('excludes hidden properties from toJSON() output with strict false', () => {
        const flexible = new Flexible({
            id: '123a',
            createdAt: new Date(),
        });
        (0, testlab_1.expect)(flexible.toJSON()).to.eql({
            id: '123a',
        });
    });
    it('gets id of an object through a static method', () => {
        const userId = User.getIdOf({
            id: '53',
            email: 'loopback@localhost',
            password: 'l00pback',
            firstName: 'Loopback User',
        });
        (0, testlab_1.expect)(userId).to.eql('53');
    });
    describe('rejectNavigationalPropertiesInData', () => {
        class Order extends __1.Entity {
        }
        Order.definition = new __1.ModelDefinition('Order')
            .addProperty('id', { type: 'string', id: true })
            .addRelation({
            name: 'customer',
            type: __1.RelationType.belongsTo,
            targetsMany: false,
            source: Order,
            target: () => User,
            keyFrom: 'customerId',
        });
        it('accepts data with no navigational properties', () => {
            (0, __1.rejectNavigationalPropertiesInData)(Order, { id: '1' });
        });
        it('rejects data with a navigational property', () => {
            (0, testlab_1.expect)(() => (0, __1.rejectNavigationalPropertiesInData)(Order, {
                id: '1',
                customer: {
                    id: '2',
                    email: 'test@example.com',
                    firstName: 'a customer',
                },
            })).to.throw(/Navigational properties are not allowed in model data/);
        });
    });
    describe('relation helpers', () => {
        it('adds belongsTo relation', () => {
            const definition = new __1.ModelDefinition('Phone').belongsTo('customer', {
                source: Phone,
                keyFrom: 'customerId',
                target: () => Customer,
                keyTo: 'id',
            });
            (0, testlab_1.expect)(definition.relations.customer).to.eql({
                name: 'customer',
                source: Phone,
                keyFrom: 'customerId',
                target: () => Customer,
                keyTo: 'id',
                type: __1.RelationType.belongsTo,
                targetsMany: false,
            });
        });
        it('adds hasOne relation', () => {
            const definition = new __1.ModelDefinition('Customer').hasOne('address', {
                source: Customer,
                keyFrom: 'id',
                target: () => Address,
                keyTo: 'customerId',
            });
            (0, testlab_1.expect)(definition.relations.address).to.eql({
                name: 'address',
                source: Customer,
                keyFrom: 'id',
                target: () => Address,
                keyTo: 'customerId',
                type: __1.RelationType.hasOne,
                targetsMany: false,
            });
        });
        it('adds hasMany relation', () => {
            const definition = new __1.ModelDefinition('Customer').hasMany('phones', {
                source: Customer,
                keyFrom: 'id',
                target: () => Phone,
                keyTo: 'customerId',
            });
            (0, testlab_1.expect)(definition.relations.phones).to.eql({
                name: 'phones',
                source: Customer,
                keyFrom: 'id',
                target: () => Phone,
                keyTo: 'customerId',
                type: __1.RelationType.hasMany,
                targetsMany: true,
            });
        });
    });
});
//# sourceMappingURL=model.unit.js.map
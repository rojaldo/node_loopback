"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../../");
describe('model decorator', () => {
    let Address = class Address extends __1.ValueObject {
    };
    Address = tslib_1.__decorate([
        (0, __1.model)()
    ], Address);
    let Phone = class Phone extends __1.ValueObject {
    };
    Phone = tslib_1.__decorate([
        (0, __1.model)()
    ], Phone);
    let Receipt = class Receipt extends __1.Entity {
    };
    Receipt = tslib_1.__decorate([
        (0, __1.model)({
            properties: {
                id: {
                    type: 'number',
                    required: true,
                },
            },
        })
    ], Receipt);
    let Account = class Account extends __1.Entity {
    };
    tslib_1.__decorate([
        (0, __1.property)(),
        tslib_1.__metadata("design:type", String)
    ], Account.prototype, "id", void 0);
    tslib_1.__decorate([
        (0, __1.property)(),
        tslib_1.__metadata("design:type", String)
    ], Account.prototype, "type", void 0);
    tslib_1.__decorate([
        (0, __1.property)(),
        tslib_1.__metadata("design:type", Number)
    ], Account.prototype, "balance", void 0);
    Account = tslib_1.__decorate([
        (0, __1.model)()
    ], Account);
    let Profile = class Profile extends __1.Entity {
    };
    Profile = tslib_1.__decorate([
        (0, __1.model)()
    ], Profile);
    let Product = class Product extends __1.Entity {
    };
    tslib_1.__decorate([
        (0, __1.property)(),
        tslib_1.__metadata("design:type", String)
    ], Product.prototype, "id", void 0);
    tslib_1.__decorate([
        (0, __1.property)(),
        tslib_1.__metadata("design:type", String)
    ], Product.prototype, "name", void 0);
    tslib_1.__decorate([
        (0, __1.property)(),
        tslib_1.__metadata("design:type", Number)
    ], Product.prototype, "price", void 0);
    Product = tslib_1.__decorate([
        (0, __1.model)()
    ], Product);
    let Order = class Order extends __1.Entity {
    };
    tslib_1.__decorate([
        (0, __1.property)({
            mysql: {
                column: 'QTY',
            },
        }),
        tslib_1.__metadata("design:type", Number)
    ], Order.prototype, "quantity", void 0);
    tslib_1.__decorate([
        (0, __1.property)({ type: 'string', id: true, generated: true }),
        tslib_1.__metadata("design:type", String)
    ], Order.prototype, "id", void 0);
    tslib_1.__decorate([
        (0, __1.belongsTo)(() => Customer),
        tslib_1.__metadata("design:type", String)
    ], Order.prototype, "customerId", void 0);
    tslib_1.__decorate([
        (0, __1.property)(),
        tslib_1.__metadata("design:type", Boolean)
    ], Order.prototype, "isShipped", void 0);
    Order = tslib_1.__decorate([
        (0, __1.model)({ name: 'order' })
    ], Order);
    let Customer = class Customer extends __1.Entity {
    };
    tslib_1.__decorate([
        (0, __1.property)({ type: 'string', id: true, generated: true }),
        tslib_1.__metadata("design:type", String)
    ], Customer.prototype, "id", void 0);
    tslib_1.__decorate([
        (0, __1.embedsOne)(),
        tslib_1.__metadata("design:type", Address)
    ], Customer.prototype, "address", void 0);
    tslib_1.__decorate([
        (0, __1.embedsMany)(),
        tslib_1.__metadata("design:type", Array)
    ], Customer.prototype, "phones", void 0);
    tslib_1.__decorate([
        (0, __1.referencesMany)(() => Account),
        tslib_1.__metadata("design:type", Array)
    ], Customer.prototype, "accountIds", void 0);
    tslib_1.__decorate([
        (0, __1.referencesOne)(),
        tslib_1.__metadata("design:type", Profile)
    ], Customer.prototype, "profile", void 0);
    tslib_1.__decorate([
        (0, __1.hasMany)(() => Order),
        tslib_1.__metadata("design:type", Array)
    ], Customer.prototype, "orders", void 0);
    tslib_1.__decorate([
        (0, __1.hasOne)(() => Order),
        tslib_1.__metadata("design:type", Order)
    ], Customer.prototype, "lastOrder", void 0);
    tslib_1.__decorate([
        (0, __1.relation)({ type: __1.RelationType.hasMany }),
        tslib_1.__metadata("design:type", Array)
    ], Customer.prototype, "recentOrders", void 0);
    Customer = tslib_1.__decorate([
        (0, __1.model)()
    ], Customer);
    it('hides a property defined as hidden', () => {
        let Client = class Client extends __1.Entity {
            constructor(data) {
                super(data);
            }
        };
        tslib_1.__decorate([
            (0, __1.property)(),
            tslib_1.__metadata("design:type", String)
        ], Client.prototype, "name", void 0);
        tslib_1.__decorate([
            (0, __1.property)({ hidden: true }),
            tslib_1.__metadata("design:type", String)
        ], Client.prototype, "password", void 0);
        Client = tslib_1.__decorate([
            (0, __1.model)(),
            tslib_1.__metadata("design:paramtypes", [Object])
        ], Client);
        const client = new Client({
            name: 'name',
            password: 'password',
        });
        (0, testlab_1.expect)(Client.definition.settings.hiddenProperties).to.containEql('password');
        (0, testlab_1.expect)(client.toJSON()).to.eql({
            name: 'name',
        });
    });
    it('throws error if design type is not provided', () => {
        const createModel = () => {
            let Client = 
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class Client extends __1.Entity {
            };
            tslib_1.__decorate([
                (0, __1.property)(),
                tslib_1.__metadata("design:type", void 0)
            ], Client.prototype, "id", void 0);
            Client = tslib_1.__decorate([
                (0, __1.model)()
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            ], Client);
        };
        (0, testlab_1.expect)(createModel).to.throw(Error, { code: 'CANNOT_INFER_PROPERTY_TYPE' });
    });
    // Skip the tests before we resolve the issue around global `Reflector`
    // The tests are passing it run alone but fails with `npm test`
    it('adds model metadata', () => {
        const meta = core_1.MetadataInspector.getClassMetadata(__1.MODEL_KEY, Order);
        (0, testlab_1.expect)(meta).to.eql({ name: 'order' });
    });
    it('adds model metadata without name', () => {
        const meta = core_1.MetadataInspector.getClassMetadata(__1.MODEL_KEY, Receipt);
        (0, testlab_1.expect)(meta).to.eql({
            name: 'Receipt',
            properties: {
                id: {
                    type: 'number',
                    required: true,
                },
            },
        });
    });
    it('adds model metadata with custom name', () => {
        let Doohickey = class Doohickey {
        };
        Doohickey = tslib_1.__decorate([
            (0, __1.model)({ name: 'foo' })
        ], Doohickey);
        const meta = core_1.MetadataInspector.getClassMetadata(__1.MODEL_KEY, Doohickey);
        (0, testlab_1.expect)(meta).to.eql({ name: 'foo' });
    });
    it('updates static property "modelName"', () => {
        let Category = class Category extends __1.Entity {
        };
        Category = tslib_1.__decorate([
            (0, __1.model)()
        ], Category);
        (0, testlab_1.expect)(Category.modelName).to.equal('Category');
    });
    it('adds model metadata with arbitrary properties', () => {
        var _a;
        let Arbitrary = class Arbitrary {
        };
        Arbitrary = tslib_1.__decorate([
            (0, __1.model)({ arbitrary: 'property' })
        ], Arbitrary);
        const meta = (_a = core_1.MetadataInspector.getClassMetadata(__1.MODEL_KEY, Arbitrary)) !== null && _a !== void 0 ? _a : 
        /* istanbul ignore next */ {};
        (0, testlab_1.expect)(meta.arbitrary).to.eql('property');
    });
    it('adds property metadata', () => {
        var _a;
        const meta = (_a = core_1.MetadataInspector.getAllPropertyMetadata(__1.MODEL_PROPERTIES_KEY, Order.prototype)) !== null && _a !== void 0 ? _a : {};
        (0, testlab_1.expect)(meta.quantity).to.eql({
            type: Number,
            mysql: {
                column: 'QTY',
            },
        });
        (0, testlab_1.expect)(meta.id).to.eql({
            type: 'string',
            id: true,
            generated: true,
            useDefaultIdType: false,
        });
        (0, testlab_1.expect)(meta.isShipped).to.eql({ type: Boolean });
    });
    it('adds explicitly declared array property metadata', () => {
        var _a;
        let ArrayModel = class ArrayModel {
        };
        tslib_1.__decorate([
            (0, __1.property)({ type: Array }),
            tslib_1.__metadata("design:type", Array)
        ], ArrayModel.prototype, "strArr", void 0);
        ArrayModel = tslib_1.__decorate([
            (0, __1.model)()
        ], ArrayModel);
        const meta = (_a = core_1.MetadataInspector.getAllPropertyMetadata(__1.MODEL_PROPERTIES_KEY, ArrayModel.prototype)) !== null && _a !== void 0 ? _a : {};
        (0, testlab_1.expect)(meta.strArr).to.eql({ type: Array });
    });
    it('adds embedsOne metadata', () => {
        var _a;
        const meta = (_a = core_1.MetadataInspector.getAllPropertyMetadata(__1.RELATIONS_KEY, Customer.prototype)) !== null && _a !== void 0 ? _a : {};
        (0, testlab_1.expect)(meta.address).to.eql({
            type: __1.RelationType.embedsOne,
        });
    });
    it('adds embedsMany metadata', () => {
        var _a;
        const meta = (_a = core_1.MetadataInspector.getAllPropertyMetadata(__1.RELATIONS_KEY, Customer.prototype)) !== null && _a !== void 0 ? _a : {};
        (0, testlab_1.expect)(meta.phones).to.eql({
            type: __1.RelationType.embedsMany,
        });
    });
    it('adds referencesMany metadata', () => {
        var _a;
        const meta = (_a = core_1.MetadataInspector.getAllPropertyMetadata(__1.RELATIONS_KEY, Customer.prototype)) !== null && _a !== void 0 ? _a : {};
        const relationDef = meta.accountIds;
        (0, testlab_1.expect)(relationDef).to.containEql({
            type: __1.RelationType.referencesMany,
            name: 'accounts',
            target: () => Account,
            keyFrom: 'accountIds',
        });
        (0, testlab_1.expect)(relationDef.source).to.be.exactly(Customer);
        (0, testlab_1.expect)(relationDef.target()).to.be.exactly(Account);
    });
    it('adds referencesOne metadata', () => {
        var _a;
        const meta = (_a = core_1.MetadataInspector.getAllPropertyMetadata(__1.RELATIONS_KEY, Customer.prototype)) !== null && _a !== void 0 ? _a : {};
        (0, testlab_1.expect)(meta.profile).to.eql({
            type: __1.RelationType.referencesOne,
        });
    });
    it('adds hasMany metadata', () => {
        var _a;
        const meta = (_a = core_1.MetadataInspector.getAllPropertyMetadata(__1.RELATIONS_KEY, Customer.prototype)) !== null && _a !== void 0 ? _a : {};
        (0, testlab_1.expect)(meta.orders).to.containEql({
            type: __1.RelationType.hasMany,
            name: 'orders',
        });
        (0, testlab_1.expect)(meta.orders.source).to.be.exactly(Customer);
        (0, testlab_1.expect)(meta.orders.target()).to.be.exactly(Order);
    });
    it('adds belongsTo metadata', () => {
        var _a;
        const meta = (_a = core_1.MetadataInspector.getAllPropertyMetadata(__1.RELATIONS_KEY, Order.prototype)) !== null && _a !== void 0 ? _a : {};
        const relationDef = meta.customerId;
        (0, testlab_1.expect)(relationDef).to.containEql({
            type: __1.RelationType.belongsTo,
            name: 'customer',
            target: () => Customer,
            keyFrom: 'customerId',
        });
        (0, testlab_1.expect)(relationDef.source).to.be.exactly(Order);
        (0, testlab_1.expect)(relationDef.target()).to.be.exactly(Customer);
    });
    it('adds hasOne metadata', () => {
        var _a;
        const meta = (_a = core_1.MetadataInspector.getAllPropertyMetadata(__1.RELATIONS_KEY, Customer.prototype)) !== null && _a !== void 0 ? _a : {};
        (0, testlab_1.expect)(meta.lastOrder).to.containEql({
            type: __1.RelationType.hasOne,
            name: 'lastOrder',
            target: () => Order,
            source: Customer,
        });
    });
    it('adds relation metadata', () => {
        var _a;
        const meta = (_a = core_1.MetadataInspector.getAllPropertyMetadata(__1.RELATIONS_KEY, Customer.prototype)) !== null && _a !== void 0 ? _a : {};
        (0, testlab_1.expect)(meta.recentOrders).to.eql({
            type: __1.RelationType.hasMany,
        });
    });
    it('adds hasMany metadata to the constructor', () => {
        class Person extends __1.Entity {
        }
        let House = class House extends __1.Entity {
        };
        tslib_1.__decorate([
            (0, __1.property)(),
            tslib_1.__metadata("design:type", String)
        ], House.prototype, "name", void 0);
        tslib_1.__decorate([
            (0, __1.hasMany)(() => Person, { keyTo: 'fk' }),
            tslib_1.__metadata("design:type", Array)
        ], House.prototype, "person", void 0);
        House = tslib_1.__decorate([
            (0, __1.model)()
        ], House);
        const relationMeta = core_1.MetadataInspector.getPropertyMetadata(__1.RELATIONS_KEY, House.prototype, 'person');
        (0, testlab_1.expect)(House.definition).to.have.property('relations');
        (0, testlab_1.expect)(House.definition.relations).to.containEql({ person: relationMeta });
    });
    describe('property namespace', () => {
        describe('array', () => {
            it('"@property.array" adds array metadata', () => {
                var _a;
                let TestModel = class TestModel {
                };
                tslib_1.__decorate([
                    __1.property.array(Product),
                    tslib_1.__metadata("design:type", Array)
                ], TestModel.prototype, "items", void 0);
                TestModel = tslib_1.__decorate([
                    (0, __1.model)()
                ], TestModel);
                const meta = (_a = core_1.MetadataInspector.getAllPropertyMetadata(__1.MODEL_PROPERTIES_KEY, TestModel.prototype)) !== null && _a !== void 0 ? _a : {};
                (0, testlab_1.expect)(meta.items).to.eql({ type: Array, itemType: Product });
            });
            it('throws when @property.array is used on a non-array property', () => {
                testlab_1.expect.throws(() => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    class Oops {
                    }
                    tslib_1.__decorate([
                        __1.property.array(Product),
                        tslib_1.__metadata("design:type", Product)
                    ], Oops.prototype, "product", void 0);
                }, Error, __1.property.ERR_PROP_NOT_ARRAY);
            });
        });
    });
});
//# sourceMappingURL=model-and-relation.decorator.unit.js.map
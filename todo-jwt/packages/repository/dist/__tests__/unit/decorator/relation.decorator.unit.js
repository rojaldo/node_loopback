"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../..");
describe('relation decorator', () => {
    describe('hasMany', () => {
        it('takes in complex property type and infers foreign key via source model name', () => {
            let Address = class Address extends __1.Entity {
            };
            tslib_1.__decorate([
                (0, __1.belongsTo)(() => AddressBook),
                tslib_1.__metadata("design:type", Number)
            ], Address.prototype, "addressBookId", void 0);
            Address = tslib_1.__decorate([
                (0, __1.model)()
            ], Address);
            let AddressBook = class AddressBook extends __1.Entity {
            };
            tslib_1.__decorate([
                (0, __1.hasMany)(() => Address),
                tslib_1.__metadata("design:type", Array)
            ], AddressBook.prototype, "addresses", void 0);
            AddressBook = tslib_1.__decorate([
                (0, __1.model)()
            ], AddressBook);
            const meta = core_1.MetadataInspector.getPropertyMetadata(__1.RELATIONS_KEY, AddressBook.prototype, 'addresses');
            const jugglerMeta = core_1.MetadataInspector.getPropertyMetadata(__1.MODEL_PROPERTIES_KEY, AddressBook.prototype, 'addresses');
            (0, testlab_1.expect)(meta).to.eql({
                type: __1.RelationType.hasMany,
                targetsMany: true,
                name: 'addresses',
                source: AddressBook,
                target: () => Address,
            });
            (0, testlab_1.expect)(jugglerMeta).to.not.containEql({
                type: Array,
                itemType: () => Address,
            });
            (0, testlab_1.expect)(AddressBook.definition.relations).to.eql({
                addresses: {
                    type: __1.RelationType.hasMany,
                    targetsMany: true,
                    name: 'addresses',
                    source: AddressBook,
                    target: () => Address,
                },
            });
        });
        it('takes in both complex property type and hasMany metadata', () => {
            class Address extends __1.Entity {
            }
            class AddressBook extends __1.Entity {
            }
            tslib_1.__decorate([
                (0, __1.hasMany)(() => Address, { keyTo: 'someForeignKey' }),
                tslib_1.__metadata("design:type", Array)
            ], AddressBook.prototype, "addresses", void 0);
            const meta = core_1.MetadataInspector.getPropertyMetadata(__1.RELATIONS_KEY, AddressBook.prototype, 'addresses');
            const jugglerMeta = core_1.MetadataInspector.getPropertyMetadata(__1.MODEL_PROPERTIES_KEY, AddressBook.prototype, 'addresses');
            (0, testlab_1.expect)(meta).to.eql({
                type: __1.RelationType.hasMany,
                targetsMany: true,
                name: 'addresses',
                source: AddressBook,
                target: () => Address,
                keyTo: 'someForeignKey',
            });
            (0, testlab_1.expect)(jugglerMeta).to.not.containEql({
                type: Array,
                itemType: () => Address,
            });
        });
    });
    describe('belongsTo', () => {
        it('creates juggler property metadata', () => {
            let AddressBook = class AddressBook extends __1.Entity {
            };
            tslib_1.__decorate([
                (0, __1.property)({ id: true }),
                tslib_1.__metadata("design:type", Number)
            ], AddressBook.prototype, "id", void 0);
            AddressBook = tslib_1.__decorate([
                (0, __1.model)()
            ], AddressBook);
            let Address = class Address extends __1.Entity {
            };
            tslib_1.__decorate([
                (0, __1.belongsTo)(() => AddressBook),
                tslib_1.__metadata("design:type", Number)
            ], Address.prototype, "addressBookId", void 0);
            Address = tslib_1.__decorate([
                (0, __1.model)()
            ], Address);
            const jugglerMeta = core_1.MetadataInspector.getAllPropertyMetadata(__1.MODEL_PROPERTIES_KEY, Address.prototype);
            (0, testlab_1.expect)(jugglerMeta).to.eql({
                addressBookId: {
                    type: Number,
                },
            });
            (0, testlab_1.expect)(Address.definition.relations).to.containDeep({
                addressBook: {
                    keyFrom: 'addressBookId',
                    name: 'addressBook',
                    type: 'belongsTo',
                },
            });
        });
        it('assigns it to target key', () => {
            class Address extends __1.Entity {
            }
            tslib_1.__decorate([
                (0, __1.belongsTo)(() => AddressBook),
                tslib_1.__metadata("design:type", Number)
            ], Address.prototype, "addressBookId", void 0);
            class AddressBook extends __1.Entity {
            }
            const meta = core_1.MetadataInspector.getPropertyMetadata(__1.RELATIONS_KEY, Address.prototype, 'addressBookId');
            (0, testlab_1.expect)(meta).to.eql({
                type: __1.RelationType.belongsTo,
                targetsMany: false,
                name: 'addressBook',
                source: Address,
                target: () => AddressBook,
                keyFrom: 'addressBookId',
            });
        });
        it('accepts explicit keyFrom and keyTo', () => {
            let Address = class Address extends __1.Entity {
            };
            tslib_1.__decorate([
                (0, __1.belongsTo)(() => AddressBook, {
                    keyFrom: 'aForeignKey',
                    keyTo: 'aPrimaryKey',
                    name: 'address-book',
                }),
                tslib_1.__metadata("design:type", Number)
            ], Address.prototype, "addressBookId", void 0);
            Address = tslib_1.__decorate([
                (0, __1.model)()
            ], Address);
            class AddressBook extends __1.Entity {
            }
            const meta = core_1.MetadataInspector.getPropertyMetadata(__1.RELATIONS_KEY, Address.prototype, 'addressBookId');
            (0, testlab_1.expect)(meta).to.containEql({
                keyFrom: 'aForeignKey',
                keyTo: 'aPrimaryKey',
            });
            (0, testlab_1.expect)(Address.definition.relations).to.containDeep({
                'address-book': {
                    type: 'belongsTo',
                    keyFrom: 'aForeignKey',
                    keyTo: 'aPrimaryKey',
                },
            });
        });
        it('accepts additional property metadata', () => {
            let AddressBook = class AddressBook extends __1.Entity {
            };
            tslib_1.__decorate([
                (0, __1.property)({ id: true }),
                tslib_1.__metadata("design:type", String)
            ], AddressBook.prototype, "id", void 0);
            AddressBook = tslib_1.__decorate([
                (0, __1.model)()
            ], AddressBook);
            let Address = class Address extends __1.Entity {
            };
            tslib_1.__decorate([
                (0, __1.belongsTo)(() => AddressBook, {}, {
                    length: 36,
                    postgresql: {
                        dataType: 'uuid',
                    },
                }),
                tslib_1.__metadata("design:type", String)
            ], Address.prototype, "addressBookId", void 0);
            Address = tslib_1.__decorate([
                (0, __1.model)()
            ], Address);
            const jugglerMeta = core_1.MetadataInspector.getAllPropertyMetadata(__1.MODEL_PROPERTIES_KEY, Address.prototype);
            (0, testlab_1.expect)(jugglerMeta).to.eql({
                addressBookId: {
                    type: String,
                    length: 36,
                    postgresql: {
                        dataType: 'uuid',
                    },
                },
            });
            (0, testlab_1.expect)(Address.definition.relations).to.containDeep({
                addressBook: {
                    keyFrom: 'addressBookId',
                    name: 'addressBook',
                    type: 'belongsTo',
                },
            });
        });
    });
});
describe('getModelRelations', () => {
    it('returns relation metadata for own and inherited properties', () => {
        let AccessToken = class AccessToken extends __1.Entity {
        };
        tslib_1.__decorate([
            (0, __1.property)({ id: true }),
            tslib_1.__metadata("design:type", Number)
        ], AccessToken.prototype, "userId", void 0);
        AccessToken = tslib_1.__decorate([
            (0, __1.model)()
        ], AccessToken);
        let User = class User extends __1.Entity {
        };
        tslib_1.__decorate([
            (0, __1.hasMany)(() => AccessToken),
            tslib_1.__metadata("design:type", Array)
        ], User.prototype, "accessTokens", void 0);
        User = tslib_1.__decorate([
            (0, __1.model)()
        ], User);
        let Order = class Order extends __1.Entity {
        };
        tslib_1.__decorate([
            (0, __1.property)({ id: true }),
            tslib_1.__metadata("design:type", Number)
        ], Order.prototype, "customerId", void 0);
        Order = tslib_1.__decorate([
            (0, __1.model)()
        ], Order);
        let Customer = class Customer extends User {
        };
        tslib_1.__decorate([
            (0, __1.hasMany)(() => Order),
            tslib_1.__metadata("design:type", Array)
        ], Customer.prototype, "orders", void 0);
        Customer = tslib_1.__decorate([
            (0, __1.model)()
        ], Customer);
        const relations = (0, __1.getModelRelations)(Customer);
        (0, testlab_1.expect)(relations).to.containDeep({
            accessTokens: {
                name: 'accessTokens',
                type: 'hasMany',
                target: () => AccessToken,
            },
            orders: {
                name: 'orders',
                type: 'hasMany',
                target: () => Order,
            },
        });
    });
});
//# sourceMappingURL=relation.decorator.unit.js.map
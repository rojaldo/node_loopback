"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/authentication
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../..");
describe('Authentication', () => {
    describe('@authenticate decorator', () => {
        it('can add authenticate metadata to target method', () => {
            class TestClass {
                whoAmI() { }
            }
            tslib_1.__decorate([
                (0, __1.authenticate)('my-strategy'),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", []),
                tslib_1.__metadata("design:returntype", void 0)
            ], TestClass.prototype, "whoAmI", null);
            const metaData = (0, __1.getAuthenticateMetadata)(TestClass, 'whoAmI');
            (0, testlab_1.expect)(metaData === null || metaData === void 0 ? void 0 : metaData[0]).to.eql({
                strategy: 'my-strategy',
            });
        });
        it('can add authenticate metadata to target method with an object', () => {
            class TestClass {
                whoAmI() { }
            }
            tslib_1.__decorate([
                (0, __1.authenticate)({
                    strategy: 'my-strategy',
                    options: { option1: 'value1', option2: 'value2' },
                }),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", []),
                tslib_1.__metadata("design:returntype", void 0)
            ], TestClass.prototype, "whoAmI", null);
            const metaData = (0, __1.getAuthenticateMetadata)(TestClass, 'whoAmI');
            (0, testlab_1.expect)(metaData === null || metaData === void 0 ? void 0 : metaData[0]).to.eql({
                strategy: 'my-strategy',
                options: { option1: 'value1', option2: 'value2' },
            });
        });
        it('can add authenticate metadata to target method without options', () => {
            class TestClass {
                whoAmI() { }
            }
            tslib_1.__decorate([
                (0, __1.authenticate)('my-strategy'),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", []),
                tslib_1.__metadata("design:returntype", void 0)
            ], TestClass.prototype, "whoAmI", null);
            const metaData = (0, __1.getAuthenticateMetadata)(TestClass, 'whoAmI');
            (0, testlab_1.expect)(metaData === null || metaData === void 0 ? void 0 : metaData[0]).to.eql({
                strategy: 'my-strategy',
            });
        });
        it('can add authenticate metadata to target method with multiple strategies', () => {
            class TestClass {
                whoAmI() { }
            }
            tslib_1.__decorate([
                (0, __1.authenticate)('my-strategy', 'my-strategy2'),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", []),
                tslib_1.__metadata("design:returntype", void 0)
            ], TestClass.prototype, "whoAmI", null);
            const metaData = (0, __1.getAuthenticateMetadata)(TestClass, 'whoAmI');
            (0, testlab_1.expect)(metaData === null || metaData === void 0 ? void 0 : metaData[0]).to.eql({
                strategy: 'my-strategy',
            });
            (0, testlab_1.expect)(metaData === null || metaData === void 0 ? void 0 : metaData[1]).to.eql({
                strategy: 'my-strategy2',
            });
        });
        it('can add authenticate metadata to target method with multiple objects', () => {
            class TestClass {
                whoAmI() { }
            }
            tslib_1.__decorate([
                (0, __1.authenticate)({
                    strategy: 'my-strategy',
                    options: { option1: 'value1', option2: 'value2' },
                }, {
                    strategy: 'my-strategy2',
                    options: { option1: 'value1', option2: 'value2' },
                }),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", []),
                tslib_1.__metadata("design:returntype", void 0)
            ], TestClass.prototype, "whoAmI", null);
            const metaData = (0, __1.getAuthenticateMetadata)(TestClass, 'whoAmI');
            (0, testlab_1.expect)(metaData === null || metaData === void 0 ? void 0 : metaData[0]).to.eql({
                strategy: 'my-strategy',
                options: { option1: 'value1', option2: 'value2' },
            });
            (0, testlab_1.expect)(metaData === null || metaData === void 0 ? void 0 : metaData[1]).to.eql({
                strategy: 'my-strategy2',
                options: { option1: 'value1', option2: 'value2' },
            });
        });
        it('adds authenticate metadata to target class', () => {
            let TestClass = class TestClass {
                whoAmI() { }
            };
            TestClass = tslib_1.__decorate([
                (0, __1.authenticate)('my-strategy')
            ], TestClass);
            const metaData = (0, __1.getAuthenticateMetadata)(TestClass, 'whoAmI');
            (0, testlab_1.expect)(metaData === null || metaData === void 0 ? void 0 : metaData[0]).to.eql({
                strategy: 'my-strategy',
            });
        });
        it('overrides class level metadata by method level', () => {
            let TestClass = class TestClass {
                whoAmI() { }
            };
            tslib_1.__decorate([
                (0, __1.authenticate)({
                    strategy: 'another-strategy',
                    options: {
                        option1: 'valueA',
                        option2: 'value2',
                    },
                }),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", []),
                tslib_1.__metadata("design:returntype", void 0)
            ], TestClass.prototype, "whoAmI", null);
            TestClass = tslib_1.__decorate([
                (0, __1.authenticate)({
                    strategy: 'my-strategy',
                    options: { option1: 'value1', option2: 'value2' },
                })
            ], TestClass);
            const metaData = (0, __1.getAuthenticateMetadata)(TestClass, 'whoAmI');
            (0, testlab_1.expect)(metaData === null || metaData === void 0 ? void 0 : metaData[0]).to.eql({
                strategy: 'another-strategy',
                options: { option1: 'valueA', option2: 'value2' },
            });
        });
    });
    it('can skip authentication', () => {
        let TestClass = class TestClass {
            whoAmI() { }
        };
        tslib_1.__decorate([
            __1.authenticate.skip(),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", void 0)
        ], TestClass.prototype, "whoAmI", null);
        TestClass = tslib_1.__decorate([
            (0, __1.authenticate)('my-strategy')
        ], TestClass);
        const metaData = (0, __1.getAuthenticateMetadata)(TestClass, 'whoAmI');
        (0, testlab_1.expect)(metaData === null || metaData === void 0 ? void 0 : metaData[0]).to.containEql({ skip: true });
    });
    it('can skip authentication at class level', () => {
        let TestClass = class TestClass {
            whoAmI() { }
        };
        TestClass = tslib_1.__decorate([
            __1.authenticate.skip()
        ], TestClass);
        const metaData = (0, __1.getAuthenticateMetadata)(TestClass, 'whoAmI');
        (0, testlab_1.expect)(metaData === null || metaData === void 0 ? void 0 : metaData[0]).to.containEql({ skip: true });
    });
});
//# sourceMappingURL=authenticate.decorator.unit.js.map
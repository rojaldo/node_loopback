"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
describe('common types', () => {
    describe('DeepPartial<T>', () => {
        it('works for strict models', () => {
            class Product {
            }
            check({ name: 'a name' });
            // the test passes when the compiler is happy
        });
        it('works for free-form models', () => {
            class FreeForm {
            }
            check({ id: 1, name: 'a name' });
            // the test passes when the compiler is happy
        });
        it('works for AnyObject', () => {
            check({ id: 'some id', name: 'a name' });
            // the test passes when the compiler is happy
        });
    });
});
function check(data) {
    // dummy function to run compile-time checks
    return data;
}
//# sourceMappingURL=common-types.unit.js.map
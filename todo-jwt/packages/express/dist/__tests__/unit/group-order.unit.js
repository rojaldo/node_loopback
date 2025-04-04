"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/express
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../");
describe('sortGroups', () => {
    it('sorts groups across lists', () => {
        const result = (0, __1.sortListOfGroups)(['first', 'end'], ['start', 'end', 'last']);
        (0, testlab_1.expect)(result).to.eql(['first', 'start', 'end', 'last']);
    });
    it('add new groups after existing groups', () => {
        const result = (0, __1.sortListOfGroups)(['initial', 'session', 'auth'], ['initial', 'added', 'auth']);
        (0, testlab_1.expect)(result).to.eql(['initial', 'session', 'added', 'auth']);
    });
    it('merges arrays preserving the order', () => {
        const target = ['initial', 'session', 'auth', 'routes', 'files', 'final'];
        const result = (0, __1.sortListOfGroups)(target, [
            'initial',
            'postinit',
            'preauth',
            'auth',
            'routes',
            'subapps',
            'final',
            'last', // add
        ]);
        (0, testlab_1.expect)(result).to.eql([
            'initial',
            'session',
            'postinit',
            'preauth',
            'auth',
            'routes',
            'files',
            'subapps',
            'final',
            'last',
        ]);
    });
    it('throws on conflicting order', () => {
        (0, testlab_1.expect)(() => {
            (0, __1.sortListOfGroups)(['one', 'two'], ['two', 'one']);
        }).to.throw(/Cyclic dependency/);
    });
});
//# sourceMappingURL=group-order.unit.js.map
"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
describe('BindingComparator', () => {
    const FINAL = Symbol('final');
    const orderOfPhases = ['log', 'auth', FINAL];
    const phaseTagName = 'phase';
    let bindings;
    let sortedBindingKeys;
    beforeEach(givenBindings);
    beforeEach(sortBindings);
    it('sorts by phase', () => {
        /**
         * Phases
         * - 'log': logger1, logger2
         * - 'auth': auth1, auth2
         */
        assertOrder('logger1', 'logger2', 'auth1', 'auth2');
    });
    it('sorts by phase - unknown phase comes before known ones', () => {
        /**
         * Phases
         * - 'metrics': metrics // not part of ['log', 'auth']
         * - 'log': logger1
         */
        assertOrder('metrics', 'logger1');
    });
    it('sorts by phase alphabetically without orderOf phase', () => {
        /**
         * Phases
         * - 'metrics': metrics // not part of ['log', 'auth']
         * - 'rateLimit': rateLimit // not part of ['log', 'auth']
         */
        assertOrder('metrics', 'rateLimit');
    });
    it('sorts by binding order without phase tags', () => {
        /**
         * Phases
         * - '': validator1, validator2 // not part of ['log', 'auth']
         * - 'metrics': metrics // not part of ['log', 'auth']
         * - 'log': logger1
         */
        assertOrder('validator1', 'validator2', 'metrics', 'logger1');
    });
    it('sorts by binding order without phase tags (for symbol tags)', () => {
        /**
         * Phases
         * - '': validator1 // not part of ['log', 'auth']
         * - 'metrics': metrics // not part of ['log', 'auth']
         * - 'log': logger1
         * - 'final': Symbol('final')
         */
        assertOrder('validator1', 'metrics', 'logger1', 'final');
    });
    /**
     * The sorted bindings by phase:
     * - '': validator1, validator2 // not part of ['log', 'auth']
     * - 'metrics': metrics // not part of ['log', 'auth']
     * - 'rateLimit': rateLimit // not part of ['log', 'auth']
     * - 'log': logger1, logger2
     * - 'auth': auth1, auth2
     */
    function givenBindings() {
        bindings = [
            __1.Binding.bind('logger1').tag({ [phaseTagName]: 'log' }),
            __1.Binding.bind('auth1').tag({ [phaseTagName]: 'auth' }),
            __1.Binding.bind('auth2').tag({ [phaseTagName]: 'auth' }),
            __1.Binding.bind('logger2').tag({ [phaseTagName]: 'log' }),
            __1.Binding.bind('metrics').tag({ [phaseTagName]: 'metrics' }),
            __1.Binding.bind('rateLimit').tag({ [phaseTagName]: 'rateLimit' }),
            __1.Binding.bind('validator1'),
            __1.Binding.bind('validator2'),
            __1.Binding.bind('final').tag({ [phaseTagName]: FINAL }),
        ];
    }
    function sortBindings() {
        (0, __1.sortBindingsByPhase)(bindings, phaseTagName, orderOfPhases);
        sortedBindingKeys = bindings.map(b => b.key);
    }
    function assertOrder(...keys) {
        let prev = -1;
        let prevKey = '';
        for (const key of keys) {
            const current = sortedBindingKeys.indexOf(key);
            (0, testlab_1.expect)(current).to.greaterThan(prev, `Binding ${key} should come after ${prevKey}`);
            prev = current;
            prevKey = key;
        }
    }
});
describe('compareByOrder', () => {
    it('honors order', () => {
        (0, testlab_1.expect)((0, __1.compareByOrder)('a', 'b', ['b', 'a'])).to.greaterThan(0);
    });
    it('value not included in order comes first', () => {
        (0, testlab_1.expect)((0, __1.compareByOrder)('a', 'c', ['a', 'b'])).to.greaterThan(0);
    });
    it('values not included are compared alphabetically', () => {
        (0, testlab_1.expect)((0, __1.compareByOrder)('a', 'c', [])).to.lessThan(0);
    });
    it('null/undefined/"" values are treated as ""', () => {
        (0, testlab_1.expect)((0, __1.compareByOrder)('', 'c')).to.lessThan(0);
        (0, testlab_1.expect)((0, __1.compareByOrder)(null, 'c')).to.lessThan(0);
        (0, testlab_1.expect)((0, __1.compareByOrder)(undefined, 'c')).to.lessThan(0);
    });
    it('returns 0 for equal values', () => {
        (0, testlab_1.expect)((0, __1.compareByOrder)('c', 'c')).to.equal(0);
        (0, testlab_1.expect)((0, __1.compareByOrder)(null, '')).to.equal(0);
        (0, testlab_1.expect)((0, __1.compareByOrder)('', undefined)).to.equal(0);
    });
    it('allows symbols', () => {
        const a = Symbol('a');
        const b = Symbol('b');
        (0, testlab_1.expect)((0, __1.compareByOrder)(a, b)).to.lessThan(0);
        (0, testlab_1.expect)((0, __1.compareByOrder)(a, b, [b, a])).to.greaterThan(0);
        (0, testlab_1.expect)((0, __1.compareByOrder)(a, 'b', [b, a])).to.greaterThan(0);
    });
    it('list symbols before strings', () => {
        const a = 'a';
        const b = Symbol('a');
        (0, testlab_1.expect)((0, __1.compareByOrder)(a, b)).to.greaterThan(0);
        (0, testlab_1.expect)((0, __1.compareByOrder)(b, a)).to.lessThan(0);
    });
    it('compare symbols by description', () => {
        const a = Symbol('a');
        const b = Symbol('b');
        (0, testlab_1.expect)((0, __1.compareByOrder)(a, b)).to.lessThan(0);
        (0, testlab_1.expect)((0, __1.compareByOrder)(b, a)).to.greaterThan(0);
    });
});
//# sourceMappingURL=binding-sorter.unit.js.map
"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortBindingsByPhase = exports.compareByOrder = exports.compareBindingsByTag = void 0;
/**
 * Creates a binding compare function to sort bindings by tagged phase name.
 *
 * @remarks
 * Two bindings are compared as follows:
 *
 * 1. Get values for the given tag as `phase` for bindings, if the tag is not
 * present, default `phase` to `''`.
 * 2. If both bindings have `phase` value in `orderOfPhases`, honor the order
 * specified by `orderOfPhases`.
 * 3. If a binding's `phase` does not exist in `orderOfPhases`, it comes before
 * the one with `phase` exists in `orderOfPhases`.
 * 4. If both bindings have `phase` value outside of `orderOfPhases`, they are
 * ordered by phase names alphabetically and symbol values come before string
 * values.
 *
 * @param phaseTagName - Name of the binding tag for phase
 * @param orderOfPhases - An array of phase names as the predefined order
 */
function compareBindingsByTag(phaseTagName = 'phase', orderOfPhases = []) {
    return (a, b) => {
        return compareByOrder(a.tagMap[phaseTagName], b.tagMap[phaseTagName], orderOfPhases);
    };
}
exports.compareBindingsByTag = compareBindingsByTag;
/**
 * Compare two values by the predefined order
 *
 * @remarks
 *
 * The comparison is performed as follows:
 *
 * 1. If both values are included in `order`, they are sorted by their indexes in
 * `order`.
 * 2. The value included in `order` comes after the value not included in `order`.
 * 3. If neither values are included in `order`, they are sorted:
 *   - symbol values come before string values
 *   - alphabetical order for two symbols or two strings
 *
 * @param a - First value
 * @param b - Second value
 * @param order - An array of values as the predefined order
 */
function compareByOrder(a, b, order = []) {
    a = a !== null && a !== void 0 ? a : '';
    b = b !== null && b !== void 0 ? b : '';
    const i1 = order.indexOf(a);
    const i2 = order.indexOf(b);
    if (i1 !== -1 || i2 !== -1) {
        // Honor the order
        return i1 - i2;
    }
    else {
        // Neither value is in the pre-defined order
        // symbol comes before string
        if (typeof a === 'symbol' && typeof b === 'string')
            return -1;
        if (typeof a === 'string' && typeof b === 'symbol')
            return 1;
        // both a and b are symbols or both a and b are strings
        if (typeof a === 'symbol')
            a = a.toString();
        if (typeof b === 'symbol')
            b = b.toString();
        return a < b ? -1 : a > b ? 1 : 0;
    }
}
exports.compareByOrder = compareByOrder;
/**
 * Sort bindings by phase names denoted by a tag and the predefined order
 *
 * @param bindings - An array of bindings
 * @param phaseTagName - Tag name for phase, for example, we can use the value
 * `'a'` of tag `order` as the phase name for `binding.tag({order: 'a'})`.
 *
 * @param orderOfPhases - An array of phase names as the predefined order
 */
function sortBindingsByPhase(bindings, phaseTagName, orderOfPhases) {
    return bindings.sort(compareBindingsByTag(phaseTagName, orderOfPhases));
}
exports.sortBindingsByPhase = sortBindingsByPhase;
//# sourceMappingURL=binding-sorter.js.map
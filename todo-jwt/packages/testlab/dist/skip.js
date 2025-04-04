"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/testlab
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.skipOnTravis = exports.skipIf = void 0;
/**
 * Helper function for skipping tests when a certain condition is met.
 *
 * @example
 * ```ts
 * skipIf(
 *   !features.freeFormProperties,
 *   describe,
 *  'free-form properties (strict: false)',
 *   () => {
 *     // the tests
 *   }
 * );
 * ```
 *
 * @param skip - Should the test case/suite be skipped?
 * @param verb - The function to invoke to define the test case or the test
 * suite, e.g. `it` or `describe`.
 * @param name - The test name (the first argument of `verb` function).
 * @param args - Additional arguments (framework specific), typically a function
 * implementing the test.
 */
function skipIf(skip, verb, name, ...args) {
    if (skip) {
        return verb.skip(`[SKIPPED] ${name}`, ...args);
    }
    else {
        return verb(name, ...args);
    }
}
exports.skipIf = skipIf;
/**
 * Helper function for skipping tests on Travis CI.
 *
 * @example
 *
 * ```ts
 * skipOnTravis(it, 'does something when some condition', async () => {
 *   // the test
 * });
 * ```
 *
 * @param verb - The function to invoke to define the test case or the test
 * suite, e.g. `it` or `describe`.
 * @param name - The test name (the first argument of `verb` function).
 * @param args - Additional arguments (framework specific), typically a function
 * implementing the test.
 */
function skipOnTravis(verb, name, ...args) {
    if (process.env.TRAVIS) {
        return verb.skip(`[SKIPPED ON TRAVIS] ${name}`, ...args);
    }
    else {
        return verb(name, ...args);
    }
}
exports.skipOnTravis = skipOnTravis;
//# sourceMappingURL=skip.js.map
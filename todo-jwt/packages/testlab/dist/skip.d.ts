/**
 * A function defining a new test case or a test suite, e.g. `it` or `describe`.
 */
export type TestDefinition<ARGS extends unknown[], RETVAL> = (name: string, ...args: ARGS) => RETVAL;
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
export declare function skipIf<ARGS extends unknown[], RETVAL>(skip: boolean, verb: TestDefinition<ARGS, RETVAL> & {
    skip: TestDefinition<ARGS, RETVAL>;
}, name: string, ...args: ARGS): RETVAL;
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
export declare function skipOnTravis<ARGS extends unknown[], RETVAL>(verb: TestDefinition<ARGS, RETVAL> & {
    skip: TestDefinition<ARGS, RETVAL>;
}, name: string, ...args: ARGS): RETVAL;

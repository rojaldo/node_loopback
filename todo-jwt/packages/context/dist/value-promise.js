"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.UUID_PATTERN = exports.uuid = exports.transformValueOrPromise = exports.resolveUntil = exports.tryCatchFinally = exports.tryWithFinally = exports.resolveList = exports.resolveMap = exports.getDeepProperty = exports.isPromiseLike = void 0;
/**
 * This module contains types for values and/or promises as well as a set of
 * utility methods to handle values and/or promises.
 */
const uuid_1 = require("uuid");
/**
 * Check whether a value is a Promise-like instance.
 * Recognizes both native promises and third-party promise libraries.
 *
 * @param value - The value to check.
 */
function isPromiseLike(value) {
    if (!value)
        return false;
    if (typeof value !== 'object' && typeof value !== 'function')
        return false;
    return typeof value.then === 'function';
}
exports.isPromiseLike = isPromiseLike;
/**
 * Get nested properties of an object by path
 * @param value - Value of the source object
 * @param path - Path to the property
 */
function getDeepProperty(value, path) {
    let result = value;
    const props = path.split('.').filter(Boolean);
    for (const p of props) {
        if (result == null) {
            return undefined;
        }
        result = result[p];
    }
    return result;
}
exports.getDeepProperty = getDeepProperty;
/**
 * Resolve entries of an object into a new object with the same keys. If one or
 * more entries of the source object are resolved to a promise by the `resolver`
 * function, this method returns a promise which will be resolved to the new
 * object with fully resolved entries.
 *
 * @example
 *
 * - Example 1: resolve all entries synchronously
 * ```ts
 * const result = resolveMap({a: 'x', b: 'y'}, v => v.toUpperCase());
 * ```
 * The `result` will be `{a: 'X', b: 'Y'}`.
 *
 * - Example 2: resolve one or more entries asynchronously
 * ```ts
 * const result = resolveMap({a: 'x', b: 'y'}, v =>
 *   Promise.resolve(v.toUpperCase()),
 * );
 * ```
 * The `result` will be a promise of `{a: 'X', b: 'Y'}`.
 *
 * @param map - The original object containing the source entries
 * @param resolver - A function resolves an entry to a value or promise. It will
 * be invoked with the property value, the property name, and the source object.
 */
function resolveMap(map, resolver) {
    const result = {};
    let asyncResolvers = undefined;
    const setter = (key) => (val) => {
        if (val !== undefined) {
            // Only set the value if it's not undefined so that the default value
            // for a key will be honored
            result[key] = val;
        }
    };
    for (const key in map) {
        const valueOrPromise = resolver(map[key], key, map);
        if (isPromiseLike(valueOrPromise)) {
            if (!asyncResolvers)
                asyncResolvers = [];
            asyncResolvers.push(valueOrPromise.then(setter(key)));
        }
        else {
            if (valueOrPromise !== undefined) {
                // Only set the value if it's not undefined so that the default value
                // for a key will be honored
                result[key] = valueOrPromise;
            }
        }
    }
    if (asyncResolvers) {
        return Promise.all(asyncResolvers).then(() => result);
    }
    else {
        return result;
    }
}
exports.resolveMap = resolveMap;
/**
 * Resolve entries of an array into a new array with the same indexes. If one or
 * more entries of the source array are resolved to a promise by the `resolver`
 * function, this method returns a promise which will be resolved to the new
 * array with fully resolved entries.
 *
 * @example
 *
 * - Example 1: resolve all entries synchronously
 * ```ts
 * const result = resolveList(['a', 'b'], v => v.toUpperCase());
 * ```
 * The `result` will be `['A', 'B']`.
 *
 * - Example 2: resolve one or more entries asynchronously
 * ```ts
 * const result = resolveList(['a', 'b'], v =>
 *   Promise.resolve(v.toUpperCase()),
 * );
 * ```
 * The `result` will be a promise of `['A', 'B']`.
 *
 * @param list - The original array containing the source entries
 * @param resolver - A function resolves an entry to a value or promise. It will
 * be invoked with the property value, the property index, and the source array.
 */
function resolveList(list, resolver) {
    const result = new Array(list.length);
    let asyncResolvers = undefined;
    const setter = (index) => (val) => {
        result[index] = val;
    };
    for (let ix = 0; ix < list.length; ix++) {
        const valueOrPromise = resolver(list[ix], ix, list);
        if (isPromiseLike(valueOrPromise)) {
            if (!asyncResolvers)
                asyncResolvers = [];
            asyncResolvers.push(valueOrPromise.then(setter(ix)));
        }
        else {
            result[ix] = valueOrPromise;
        }
    }
    if (asyncResolvers) {
        return Promise.all(asyncResolvers).then(() => result);
    }
    else {
        return result;
    }
}
exports.resolveList = resolveList;
/**
 * Try to run an action that returns a promise or a value
 * @param action - A function that returns a promise or a value
 * @param finalAction - A function to be called once the action
 * is fulfilled or rejected (synchronously or asynchronously)
 *
 *  @typeParam T - Type for the return value
 */
function tryWithFinally(action, finalAction) {
    return tryCatchFinally(action, undefined, finalAction);
}
exports.tryWithFinally = tryWithFinally;
/**
 * Try to run an action that returns a promise or a value with error and final
 * actions to mimic `try {} catch(err) {} finally {}` for a value or promise.
 *
 * @param action - A function that returns a promise or a value
 * @param errorAction - A function to be called once the action
 * is rejected (synchronously or asynchronously). It must either return a new
 * value or throw an error.
 * @param finalAction - A function to be called once the action
 * is fulfilled or rejected (synchronously or asynchronously)
 *
 * @typeParam T - Type for the return value
 */
function tryCatchFinally(action, errorAction = err => {
    throw err;
}, finalAction = () => { }) {
    let result;
    try {
        result = action();
    }
    catch (err) {
        result = reject(err);
    }
    if (isPromiseLike(result)) {
        return result.then(resolve, reject);
    }
    return resolve(result);
    function resolve(value) {
        try {
            return value;
        }
        finally {
            finalAction();
        }
    }
    function reject(err) {
        try {
            return errorAction(err);
        }
        finally {
            finalAction();
        }
    }
}
exports.tryCatchFinally = tryCatchFinally;
/**
 * Resolve an iterator of source values into a result until the evaluator
 * returns `true`
 * @param source - The iterator of source values
 * @param resolver - The resolve function that maps the source value to a result
 * @param evaluator - The evaluate function that decides when to stop
 */
function resolveUntil(source, resolver, evaluator) {
    // Do iteration in loop for synchronous values to avoid stack overflow
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const next = source.next();
        if (next.done)
            return undefined; // End of the iterator
        const sourceVal = next.value;
        const valueOrPromise = resolver(sourceVal);
        if (isPromiseLike(valueOrPromise)) {
            return valueOrPromise.then(v => {
                if (evaluator(sourceVal, v)) {
                    return v;
                }
                else {
                    return resolveUntil(source, resolver, evaluator);
                }
            });
        }
        else {
            if (evaluator(sourceVal, valueOrPromise)) {
                return valueOrPromise;
            }
            // Continue with the while loop
        }
    }
}
exports.resolveUntil = resolveUntil;
/**
 * Transform a value or promise with a function that produces a new value or
 * promise
 * @param valueOrPromise - The value or promise
 * @param transformer - A function that maps the source value to a value or promise
 */
function transformValueOrPromise(valueOrPromise, transformer) {
    if (isPromiseLike(valueOrPromise)) {
        return valueOrPromise.then(transformer);
    }
    else {
        return transformer(valueOrPromise);
    }
}
exports.transformValueOrPromise = transformValueOrPromise;
/**
 * A utility to generate uuid v4
 *
 * @deprecated Use `generateUniqueId`, [uuid](https://www.npmjs.com/package/uuid)
 * or [hyperid](https://www.npmjs.com/package/hyperid) instead.
 */
function uuid() {
    return (0, uuid_1.v4)();
}
exports.uuid = uuid;
/**
 * A regular expression for testing uuid v4 PATTERN
 * @deprecated This pattern is an internal helper used by unit-tests, we are no
 * longer using it.
 */
exports.UUID_PATTERN = /[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}/i;
//# sourceMappingURL=value-promise.js.map
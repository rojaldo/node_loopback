"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOAIPrimitiveType = exports.matchDateFormat = exports.isValidDateTime = exports.isFalse = exports.isTrue = exports.isEmpty = void 0;
const tslib_1 = require("tslib");
const debug_1 = tslib_1.__importDefault(require("debug"));
const debug = (0, debug_1.default)('loopback:rest:coercion');
function isEmpty(data) {
    const result = data === '';
    debug('isEmpty(%j) -> %s', data, result);
    return result;
}
exports.isEmpty = isEmpty;
/**
 * A set of truthy values. A data in this set will be coerced to `true`.
 *
 * @param data - The raw data get from http request
 * @returns The corresponding coerced boolean type
 */
function isTrue(data) {
    return ['TRUE', '1'].includes(data.toUpperCase());
}
exports.isTrue = isTrue;
/**
 * A set of falsy values. A data in this set will be coerced to `false`.
 * @param data - The raw data get from http request
 * @returns The corresponding coerced boolean type
 */
function isFalse(data) {
    return ['FALSE', '0'].includes(data.toUpperCase());
}
exports.isFalse = isFalse;
/**
 * Return false for invalid date
 */
function isValidDateTime(data) {
    return isNaN(data.getTime()) ? false : true;
}
exports.isValidDateTime = isValidDateTime;
const REGEX_RFC3339_DATE = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])$/;
/**
 * Return true when a date follows the RFC3339 standard
 *
 * @param date - The date to verify
 */
function matchDateFormat(date) {
    const pattern = new RegExp(REGEX_RFC3339_DATE);
    const result = pattern.test(date);
    debug('matchDateFormat(%j) -> %s', date, result);
    return result;
}
exports.matchDateFormat = matchDateFormat;
/**
 * Return the corresponding OpenAPI data type given an OpenAPI schema
 *
 * @param type - The type in an OpenAPI schema specification
 * @param format - The format in an OpenAPI schema specification
 */
function getOAIPrimitiveType(type, format) {
    if (type === 'object' || type === 'array')
        return type;
    if (type === 'string') {
        switch (format) {
            case 'byte':
                return 'byte';
            case 'binary':
                return 'binary';
            case 'date':
                return 'date';
            case 'date-time':
                return 'date-time';
            case 'password':
                return 'password';
            default:
                return 'string';
        }
    }
    if (type === 'boolean')
        return 'boolean';
    if (type === 'number')
        switch (format) {
            case 'float':
                return 'float';
            case 'double':
                return 'double';
            default:
                return 'number';
        }
    if (type === 'integer')
        return format === 'int64' ? 'long' : 'integer';
}
exports.getOAIPrimitiveType = getOAIPrimitiveType;
//# sourceMappingURL=utils.js.map
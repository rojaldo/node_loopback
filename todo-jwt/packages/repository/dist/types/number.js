"use strict";
// Copyright IBM Corp. and LoopBack contributors 2017,2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberType = void 0;
const tslib_1 = require("tslib");
const util_1 = tslib_1.__importDefault(require("util"));
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Number type
 */
class NumberType {
    constructor() {
        this.name = 'number';
    }
    isInstance(value) {
        return value == null || (!isNaN(value) && typeof value === 'number');
    }
    isCoercible(value) {
        return value == null || !isNaN(Number(value));
    }
    defaultValue() {
        return 0;
    }
    coerce(value) {
        if (value == null)
            return value;
        const n = Number(value);
        if (isNaN(n)) {
            const msg = util_1.default.format('Invalid %s: %j', this.name, value);
            throw new TypeError(msg);
        }
        return n;
    }
    serialize(value) {
        return value;
    }
}
exports.NumberType = NumberType;
//# sourceMappingURL=number.js.map
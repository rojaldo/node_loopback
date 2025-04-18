"use strict";
// Copyright IBM Corp. and LoopBack contributors 2017,2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayType = void 0;
const tslib_1 = require("tslib");
const util_1 = tslib_1.__importDefault(require("util"));
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Array type, such as string[]
 */
class ArrayType {
    constructor(itemType) {
        this.itemType = itemType;
        this.name = 'array';
    }
    isInstance(value) {
        if (value == null)
            return true;
        if (!Array.isArray(value)) {
            return false;
        }
        const list = value;
        return list.every(i => this.itemType.isInstance(i));
    }
    isCoercible(value) {
        if (value == null)
            return true;
        if (!Array.isArray(value)) {
            return false;
        }
        return value.every(i => this.itemType.isCoercible(i));
    }
    defaultValue() {
        return [];
    }
    coerce(value) {
        if (value == null)
            return value;
        if (!Array.isArray(value)) {
            const msg = util_1.default.format('Invalid %s: %j', this.name, value);
            throw new TypeError(msg);
        }
        return value.map(i => this.itemType.coerce(i));
    }
    serialize(value) {
        if (value == null)
            return value;
        return value.map(i => this.itemType.serialize(i));
    }
}
exports.ArrayType = ArrayType;
//# sourceMappingURL=array.js.map
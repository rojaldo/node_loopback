"use strict";
// Copyright IBM Corp. and LoopBack contributors 2017,2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.BufferType = void 0;
const tslib_1 = require("tslib");
const util_1 = tslib_1.__importDefault(require("util"));
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Buffer (binary) type
 */
class BufferType {
    constructor() {
        this.name = 'buffer';
    }
    isInstance(value) {
        return value == null || Buffer.isBuffer(value);
    }
    defaultValue() {
        return Buffer.from([]);
    }
    isCoercible(value) {
        if (value == null)
            return true;
        if (typeof value === 'string')
            return true;
        if (Buffer.isBuffer(value))
            return true;
        if (Array.isArray(value))
            return true;
        return false;
    }
    coerce(value, options) {
        if (value == null)
            return value;
        if (Buffer.isBuffer(value))
            return value;
        if (typeof value === 'string') {
            options = options !== null && options !== void 0 ? options : {};
            const encoding = options.encoding || 'utf-8';
            return Buffer.from(value, encoding);
        }
        else if (Array.isArray(value)) {
            return Buffer.from(value);
        }
        const msg = util_1.default.format('Invalid %s: %j', this.name, value);
        throw new TypeError(msg);
    }
    serialize(value, options) {
        if (value == null)
            return value;
        const encoding = (options === null || options === void 0 ? void 0 : options.encoding) || 'base64';
        return value.toString(encoding);
    }
}
exports.BufferType = BufferType;
//# sourceMappingURL=buffer.js.map
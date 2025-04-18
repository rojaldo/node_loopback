"use strict";
// Copyright IBM Corp. and LoopBack contributors 2017,2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectType = void 0;
const tslib_1 = require("tslib");
const util_1 = tslib_1.__importDefault(require("util"));
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Object type
 */
class ObjectType {
    constructor(type) {
        this.type = type;
        this.name = 'object';
    }
    isInstance(value) {
        return value == null || value instanceof this.type;
    }
    isCoercible(value) {
        return (value == null || (typeof value === 'object' && !Array.isArray(value)));
    }
    defaultValue() {
        return new this.type();
    }
    coerce(value) {
        if (value == null)
            return value;
        if (value instanceof this.type) {
            return value;
        }
        if (typeof value !== 'object' || Array.isArray(value)) {
            const msg = util_1.default.format('Invalid %s: %j', this.name, value);
            throw new TypeError(msg);
        }
        return new this.type(value);
    }
    serialize(value) {
        if (value == null)
            return value;
        if (typeof value.toJSON === 'function') {
            return value.toJSON();
        }
        return value;
    }
}
exports.ObjectType = ObjectType;
//# sourceMappingURL=object.js.map
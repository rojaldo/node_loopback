"use strict";
// Copyright IBM Corp. and LoopBack contributors 2017,2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateType = void 0;
const tslib_1 = require("tslib");
const util_1 = tslib_1.__importDefault(require("util"));
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Date type
 */
class DateType {
    constructor() {
        this.name = 'date';
    }
    isInstance(value) {
        return value == null || value instanceof Date;
    }
    isCoercible(value) {
        // Please note new Date(...) allows the following
        /*
         > new Date('1')
         2001-01-01T08:00:00.000Z
         > new Date('0')
         2000-01-01T08:00:00.000Z
         > new Date(1)
         1970-01-01T00:00:00.001Z
         > new Date(0)
         1970-01-01T00:00:00.000Z
         > new Date(true)
         1970-01-01T00:00:00.001Z
         > new Date(false)
         1970-01-01T00:00:00.000Z
         */
        return value == null || !isNaN(new Date(value).getTime());
    }
    defaultValue() {
        return new Date();
    }
    coerce(value) {
        if (value == null)
            return value;
        if (value instanceof Date) {
            return value;
        }
        const d = new Date(value);
        if (isNaN(d.getTime())) {
            const msg = util_1.default.format('Invalid %s: %j', this.name, value);
            throw new TypeError(msg);
        }
        return d;
    }
    serialize(value) {
        if (value == null)
            return value;
        return value.toJSON();
    }
}
exports.DateType = DateType;
//# sourceMappingURL=date.js.map
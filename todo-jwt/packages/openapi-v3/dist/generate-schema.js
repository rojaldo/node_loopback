"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/openapi-v3
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveSchema = void 0;
/**
 * Generate the `type` and `format` property in a Schema Object according to a
 * parameter's type.
 * `type` and `format` will be preserved if provided in `schema`
 *
 * @internal
 * @param type - The JavaScript type of a parameter
 * @param schema - The schema object provided in an parameter object
 */
function resolveSchema(fn, schema = {}) {
    let resolvedSchema = {};
    if (typeof fn === 'function') {
        if (fn === String) {
            resolvedSchema = { type: 'string' };
        }
        else if (fn === Number) {
            resolvedSchema = { type: 'number' };
        }
        else if (fn === Boolean) {
            resolvedSchema = { type: 'boolean' };
        }
        else if (fn === Date) {
            resolvedSchema = { type: 'string', format: 'date-time' };
        }
        else if (fn === Object) {
            resolvedSchema = { type: 'object' };
        }
        else if (fn === Array) {
            resolvedSchema = { type: 'array' };
        }
        else {
            resolvedSchema = { $ref: `#/components/schemas/${fn.name}` };
        }
    }
    return Object.assign(schema, resolvedSchema);
}
exports.resolveSchema = resolveSchema;
//# sourceMappingURL=generate-schema.js.map
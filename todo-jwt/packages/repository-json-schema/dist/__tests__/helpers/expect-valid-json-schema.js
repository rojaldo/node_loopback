"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/repository-json-schema
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.expectValidJsonSchema = void 0;
const tslib_1 = require("tslib");
const testlab_1 = require("@loopback/testlab");
const ajv_1 = tslib_1.__importDefault(require("ajv"));
const ajv_formats_1 = tslib_1.__importDefault(require("ajv-formats"));
function expectValidJsonSchema(schema) {
    const ajv = new ajv_1.default({ strictTypes: false });
    (0, ajv_formats_1.default)(ajv);
    const validate = ajv.compile(require('ajv/lib/refs/json-schema-draft-06.json'));
    const isValid = validate(schema);
    const result = isValid
        ? 'JSON Schema is valid'
        : ajv.errorsText(validate.errors);
    (0, testlab_1.expect)(result).to.equal('JSON Schema is valid');
}
exports.expectValidJsonSchema = expectValidJsonSchema;
//# sourceMappingURL=expect-valid-json-schema.js.map
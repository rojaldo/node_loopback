"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/openapi-v3
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const types_1 = require("../../types");
describe('createEmptyApiSpec', () => {
    it('sets version 3', () => {
        (0, testlab_1.expect)((0, types_1.createEmptyApiSpec)().openapi).to.equal('3.0.0');
    });
    it('sets the spec info object', () => {
        (0, testlab_1.expect)((0, types_1.createEmptyApiSpec)().info).to.deepEqual({
            title: 'LoopBack Application',
            version: '1.0.0',
        });
    });
    it('creates an empty paths object', () => {
        (0, testlab_1.expect)((0, types_1.createEmptyApiSpec)().paths).to.deepEqual({});
    });
    it('creates a default servers array', () => {
        (0, testlab_1.expect)((0, types_1.createEmptyApiSpec)().servers).to.deepEqual([{ url: '/' }]);
    });
});
//# sourceMappingURL=create-empty-spec.unit.js.map
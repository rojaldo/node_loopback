"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/openapi-v3
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const generate_schema_1 = require("../../generate-schema");
describe('generate-schema unit tests', () => {
    it('returns an empty object given no arguments', () => {
        (0, testlab_1.expect)((0, generate_schema_1.resolveSchema)()).to.eql({});
    });
    it('resolves type String', () => {
        (0, testlab_1.expect)((0, generate_schema_1.resolveSchema)(String)).to.eql({ type: 'string' });
    });
    it('resolves type Number', () => {
        (0, testlab_1.expect)((0, generate_schema_1.resolveSchema)(Number)).to.eql({ type: 'number' });
    });
    it('resolves type Boolean', () => {
        (0, testlab_1.expect)((0, generate_schema_1.resolveSchema)(Boolean)).to.eql({ type: 'boolean' });
    });
    it('resolves type Date', () => {
        (0, testlab_1.expect)((0, generate_schema_1.resolveSchema)(Date)).to.eql({ type: 'string', format: 'date-time' });
    });
    it('resolves type Object', () => {
        (0, testlab_1.expect)((0, generate_schema_1.resolveSchema)(Object)).to.eql({ type: 'object' });
    });
    it('resolves type Array', () => {
        (0, testlab_1.expect)((0, generate_schema_1.resolveSchema)(Array)).to.eql({ type: 'array' });
    });
    it('resolves type Class', () => {
        class MyModel {
        }
        (0, testlab_1.expect)((0, generate_schema_1.resolveSchema)(MyModel)).to.eql({
            $ref: '#/components/schemas/MyModel',
        });
    });
    it('preserves existing schema properties', () => {
        const schema = { foo: 'bar' };
        (0, testlab_1.expect)((0, generate_schema_1.resolveSchema)(String, schema)).to.eql({ type: 'string', foo: 'bar' });
    });
});
//# sourceMappingURL=generate-schema.unit.js.map
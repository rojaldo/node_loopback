"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/openapi-v3
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
describe('jsonToSchemaObject', () => {
    it('does nothing when given an empty object', () => {
        (0, testlab_1.expect)({}).to.eql({});
    });
    const typeDef = { type: ['string', 'number'] };
    const expectedType = { type: 'string' };
    it('converts type', () => {
        propertyConversionTest(typeDef, expectedType);
    });
    it('ignores non-compatible JSON schema properties', () => {
        const nonCompatibleDef = {
            additionalItems: {
                anyOf: [],
            },
            defaultProperties: [],
            typeof: 'function',
        };
        const expectedDef = {};
        propertyConversionTest(nonCompatibleDef, expectedDef);
    });
    it('converts allOf', () => {
        const allOfDef = {
            allOf: [typeDef, typeDef],
        };
        const expectedAllOf = {
            allOf: [expectedType, expectedType],
        };
        propertyConversionTest(allOfDef, expectedAllOf);
    });
    it('converts anyOf', () => {
        const anyOfDef = {
            anyOf: [typeDef, typeDef],
        };
        const expectedAnyOf = {
            anyOf: [expectedType, expectedType],
        };
        propertyConversionTest(anyOfDef, expectedAnyOf);
    });
    it('converts oneOf', () => {
        const oneOfDef = {
            oneOf: [typeDef, typeDef],
        };
        const expectedOneOf = {
            oneOf: [expectedType, expectedType],
        };
        propertyConversionTest(oneOfDef, expectedOneOf);
    });
    it('converts definitions', () => {
        const definitionsDef = {
            definitions: { foo: typeDef, bar: typeDef },
        };
        const expectedDef = {
            definitions: { foo: expectedType, bar: expectedType },
        };
        propertyConversionTest(definitionsDef, expectedDef);
    });
    it('converts properties', () => {
        const propertyDef = {
            properties: {
                foo: typeDef,
            },
        };
        const expectedProperties = {
            properties: {
                foo: expectedType,
            },
        };
        propertyConversionTest(propertyDef, expectedProperties);
    });
    context('additionalProperties', () => {
        it('is converted properly when the type is JsonSchema', () => {
            const additionalDef = {
                additionalProperties: typeDef,
            };
            const expectedAdditional = {
                additionalProperties: expectedType,
            };
            propertyConversionTest(additionalDef, expectedAdditional);
        });
        it('is converted properly when it is "false"', () => {
            const jsonSchema = {
                additionalProperties: false,
            };
            const openApiSchema = (0, __1.jsonToSchemaObject)(jsonSchema);
            (0, testlab_1.expect)(openApiSchema).to.deepEqual({
                additionalProperties: false,
            });
        });
        it('is converted properly when it is "true"', () => {
            const jsonSchema = {
                additionalProperties: true,
            };
            const openApiSchema = (0, __1.jsonToSchemaObject)(jsonSchema);
            (0, testlab_1.expect)(openApiSchema).to.deepEqual({
                additionalProperties: true,
            });
        });
    });
    it('converts items', () => {
        const itemsDef = {
            type: 'array',
            items: typeDef,
        };
        const expectedItems = {
            type: 'array',
            items: expectedType,
        };
        propertyConversionTest(itemsDef, expectedItems);
    });
    it('retains given properties in the conversion', () => {
        const inputDef = {
            title: 'foo',
            type: 'object',
            properties: {
                foo: {
                    type: 'string',
                },
            },
            additionalProperties: false,
            default: 'Default string',
        };
        const expectedDef = {
            title: 'foo',
            type: 'object',
            properties: {
                foo: {
                    type: 'string',
                },
            },
            additionalProperties: false,
            default: 'Default string',
        };
        (0, testlab_1.expect)((0, __1.jsonToSchemaObject)(inputDef)).to.eql(expectedDef);
    });
    it('handles circular references with $ref', () => {
        const schemaJson = {
            title: 'ReportState',
            properties: {
                // ReportState[]
                states: { type: 'array', items: { $ref: '#/definitions/ReportState' } },
                benchmarkId: { type: 'string' },
                color: { type: 'string' },
            },
        };
        const schema = (0, __1.jsonToSchemaObject)(schemaJson);
        (0, testlab_1.expect)(schema).to.eql({
            title: 'ReportState',
            properties: {
                states: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/ReportState' },
                },
                benchmarkId: { type: 'string' },
                color: { type: 'string' },
            },
        });
    });
    it('handles circular references with object', () => {
        const schemaJson = {
            title: 'ReportState',
            properties: {
                benchmarkId: { type: 'string' },
                color: { type: 'string' },
            },
        };
        // Add states: ReportState[]
        schemaJson.properties.states = { type: 'array', items: schemaJson };
        const schema = (0, __1.jsonToSchemaObject)(schemaJson);
        (0, testlab_1.expect)(schema).to.eql({
            title: 'ReportState',
            properties: {
                states: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/ReportState' },
                },
                benchmarkId: { type: 'string' },
                color: { type: 'string' },
            },
        });
    });
    it('handles indirect circular references with $ref', () => {
        const schemaJson = {
            title: 'ReportState',
            properties: {
                parentState: { $ref: '#/definitions/ParentState' },
                benchmarkId: { type: 'string' },
                color: { type: 'string' },
            },
            definitions: {
                ParentState: {
                    title: 'ParentState',
                    properties: {
                        timestamp: { type: 'string' },
                        state: { $ref: '#/definitions/ReportState' },
                    },
                },
            },
        };
        const schema = (0, __1.jsonToSchemaObject)(schemaJson);
        (0, testlab_1.expect)(schema).to.eql({
            title: 'ReportState',
            properties: {
                parentState: { $ref: '#/components/schemas/ParentState' },
                benchmarkId: { type: 'string' },
                color: { type: 'string' },
            },
            definitions: {
                ParentState: {
                    title: 'ParentState',
                    properties: {
                        timestamp: { type: 'string' },
                        state: { $ref: '#/components/schemas/ReportState' },
                    },
                },
            },
        });
    });
    it('handles indirect circular references with object', () => {
        const parentStateSchema = {
            title: 'ParentState',
            properties: {
                timestamp: { type: 'string' },
                // state: {$ref: '#/definitions/ReportState'},
            },
        };
        const schemaJson = {
            title: 'ReportState',
            properties: {
                parentState: { $ref: '#/definitions/ParentState' },
                benchmarkId: { type: 'string' },
                color: { type: 'string' },
            },
            definitions: {
                ParentState: parentStateSchema,
            },
        };
        parentStateSchema.properties.state = schemaJson;
        const schema = (0, __1.jsonToSchemaObject)(schemaJson);
        (0, testlab_1.expect)(schema).to.eql({
            title: 'ReportState',
            properties: {
                parentState: { $ref: '#/components/schemas/ParentState' },
                benchmarkId: { type: 'string' },
                color: { type: 'string' },
            },
            definitions: {
                ParentState: {
                    title: 'ParentState',
                    properties: {
                        timestamp: { type: 'string' },
                        state: { $ref: '#/components/schemas/ReportState' },
                    },
                },
            },
        });
    });
    it('errors if type is an array and items is missing', () => {
        testlab_1.expect.throws(() => {
            (0, __1.jsonToSchemaObject)({ type: 'array' });
        }, Error, '"items" property must be present if "type" is an array');
    });
    it('copies first example from examples', () => {
        const itemsDef = {
            type: 'integer',
            examples: [100, 500],
        };
        const expectedItems = {
            type: 'integer',
            example: 100,
        };
        propertyConversionTest(itemsDef, expectedItems);
    });
    // Helper function to check conversion of JSON Schema properties
    // to Swagger versions
    function propertyConversionTest(property, expected) {
        (0, testlab_1.expect)((0, __1.jsonToSchemaObject)(property)).to.deepEqual(expected);
    }
});
describe('jsonOrBooleanToJson', () => {
    it('converts true to {}', () => {
        (0, testlab_1.expect)((0, __1.jsonOrBooleanToJSON)(true)).to.eql({});
    });
    it('converts false to {}', () => {
        (0, testlab_1.expect)((0, __1.jsonOrBooleanToJSON)(false)).to.eql({ not: {} });
    });
    it('makes no changes to JSON Schema', () => {
        const jsonSchema = {
            properties: {
                number: { type: 'number' },
            },
        };
        (0, testlab_1.expect)((0, __1.jsonOrBooleanToJSON)(jsonSchema)).to.eql(jsonSchema);
    });
});
//# sourceMappingURL=json-to-schema.unit.js.map
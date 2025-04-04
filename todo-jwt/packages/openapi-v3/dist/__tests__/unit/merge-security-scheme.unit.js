"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/openapi-v3
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
const types_1 = require("../../types");
describe('mergeSecuritySchemeToSpec', () => {
    it('adds security scheme to spec', () => {
        const spec = (0, types_1.createEmptyApiSpec)();
        const schemeName = 'basic';
        const schemeSpec = {
            type: 'http',
            scheme: 'basic',
        };
        const newSpec = (0, __1.mergeSecuritySchemeToSpec)(spec, schemeName, schemeSpec);
        (0, testlab_1.expect)(newSpec.components).to.deepEqual({
            securitySchemes: {
                basic: {
                    type: 'http',
                    scheme: 'basic',
                },
            },
        });
    });
});
//# sourceMappingURL=merge-security-scheme.unit.js.map
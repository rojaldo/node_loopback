"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/openapi-v3
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const application_1 = require("./fixtures/application");
describe('spec-enhancer-extension-point', () => {
    let app;
    let specService;
    beforeEach(givenAppWithSpecService);
    it('setter - can set spec', async () => {
        const EXPECTED_SPEC = {
            openapi: '3.0.0',
            info: { title: 'LoopBack Application', version: '1.0.0' },
            // setter adds paths spec based on the default spec
            paths: getSamplePathSpec(),
        };
        const PATHS_SPEC = getSamplePathSpec();
        specService.spec = { ...specService.spec, paths: PATHS_SPEC };
        (0, testlab_1.expect)(specService.spec).to.eql(EXPECTED_SPEC);
    });
    it('generateSpec - loads and creates spec for ALL registered extensions', async () => {
        const EXPECTED_SPEC = {
            openapi: '3.0.0',
            // info object is updated by the info enhancer
            info: { title: 'LoopBack Test Application', version: '1.0.1' },
            paths: {},
            // the security scheme entry is added by the security enhancer
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                    },
                },
            },
        };
        const specFromService = await specService.applyAllEnhancers();
        (0, testlab_1.expect)(specFromService).to.eql(EXPECTED_SPEC);
    });
    it('getEnhancerByName - returns the enhancer with a given name', async () => {
        const enhancer = await specService.getEnhancerByName('info');
        (0, testlab_1.expect)(enhancer).to.not.be.undefined();
        (0, testlab_1.expect)(enhancer === null || enhancer === void 0 ? void 0 : enhancer.name).to.equal('info');
    });
    it('applyEnhancerByName - returns the merged spec after applying a given enhancer', async () => {
        const EXPECTED_SPEC = {
            openapi: '3.0.0',
            // info object is updated by the info enhancer
            info: { title: 'LoopBack Test Application', version: '1.0.1' },
            paths: {},
        };
        const mergedSpec = await specService.applyEnhancerByName('info');
        (0, testlab_1.expect)(mergedSpec).to.eql(EXPECTED_SPEC);
    });
    async function givenAppWithSpecService() {
        app = new application_1.SpecServiceApplication();
        specService = await app.getSpecService();
    }
    function getSamplePathSpec() {
        return {
            '/pets': {
                get: {
                    description: 'Returns all pets from the system that the user has access to',
                    responses: {
                        '200': {
                            description: 'A list of pets.',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'array',
                                        items: {
                                            $ref: '#/components/schemas/pet',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        };
    }
});
//# sourceMappingURL=spec-enhancer.extensions.unit.js.map
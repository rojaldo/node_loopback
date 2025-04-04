"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/authentication
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const types_1 = require("../../../types");
const mock_metadata_1 = require("../fixtures/mock-metadata");
describe('getAuthenticationMetadataForStrategy', () => {
    let metadata;
    beforeEach(givenAuthenticationMetadata);
    it('should return the authentication metadata for the specified strategy', () => {
        const { strategy, options } = mock_metadata_1.mockAuthenticationMetadata;
        const strategyMetadata = (0, types_1.getAuthenticationMetadataForStrategy)(metadata, strategy);
        (0, testlab_1.expect)(strategyMetadata).to.not.be.undefined();
        (0, testlab_1.expect)(strategyMetadata.strategy).to.equal(strategy);
        (0, testlab_1.expect)(strategyMetadata.options).to.equal(options);
    });
    it('should return undefined if no metadata exists for the specified strategy', () => {
        const strategyMetadata = (0, types_1.getAuthenticationMetadataForStrategy)(metadata, 'doesnotexist');
        (0, testlab_1.expect)(strategyMetadata).to.be.undefined();
    });
    function givenAuthenticationMetadata() {
        metadata = [mock_metadata_1.mockAuthenticationMetadata, mock_metadata_1.mockAuthenticationMetadata2];
    }
});
//# sourceMappingURL=authentication-metadata-for-strategy.unit.js.map
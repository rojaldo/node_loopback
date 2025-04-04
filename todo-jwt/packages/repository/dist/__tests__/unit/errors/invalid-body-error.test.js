"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../..");
describe('InvalidBodyDefinitionError', () => {
    it('inherits from Error correctly', () => {
        const err = givenAnErrorInstance();
        (0, testlab_1.expect)(err).to.be.instanceof(__1.InvalidBodyError);
        (0, testlab_1.expect)(err).to.be.instanceof(Error);
        (0, testlab_1.expect)(err.stack)
            .to.be.String()
            // NOTE(bajtos) We cannot assert using __filename because stack traces
            // are typically converted from JS paths to TS paths using source maps.
            .and.match(/invalid-body-error\.test\.(ts|js)/);
    });
    it('sets code to "INVALID_BODY_DEFINITION"', () => {
        const err = givenAnErrorInstance();
        (0, testlab_1.expect)(err.code).to.equal('INVALID_BODY_DEFINITION');
    });
});
describe('isInvalidBodyError', () => {
    it('returns true for an instance of InvalidBodyError', () => {
        const error = givenAnErrorInstance();
        (0, testlab_1.expect)((0, __1.isInvalidBodyError)(error)).to.be.true();
    });
    it('returns false for an instance of Error', () => {
        const error = new Error('A generic error');
        (0, testlab_1.expect)((0, __1.isInvalidBodyError)(error)).to.be.false();
    });
});
function givenAnErrorInstance() {
    return new __1.InvalidBodyError('a reason', {
        entityOrName: 'products',
        entityId: 1,
    });
}
//# sourceMappingURL=invalid-body-error.test.js.map
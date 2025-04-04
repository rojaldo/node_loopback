"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/authentication
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockStrategy2 = exports.MockStrategy = void 0;
const security_1 = require("@loopback/security");
class AuthenticationError extends Error {
}
/**
 * Test fixture for a mock asynchronous authentication strategy
 */
class MockStrategy {
    constructor() {
        this.name = 'MockStrategy';
    }
    setMockUser(userObj) {
        this.mockUser = userObj;
    }
    returnMockUser() {
        return this.mockUser;
    }
    async authenticate(req) {
        return this.verify(req);
    }
    /**
     * @param req
     * mock verification function
     *
     * For the purpose of mock tests we have this here
     * pass req.query.testState = 'fail' to mock failed authorization
     * pass req.query.testState = 'error' to mock unexpected error
     */
    async verify(request) {
        var _a, _b, _c;
        if (((_a = request.headers) === null || _a === void 0 ? void 0 : _a.testState) === 'fail') {
            const err = new AuthenticationError('authorization failed');
            err.statusCode = 401;
            throw err;
        }
        else if (((_b = request.headers) === null || _b === void 0 ? void 0 : _b.testState) === 'empty') {
            return;
        }
        else if (((_c = request.headers) === null || _c === void 0 ? void 0 : _c.testState) === 'error') {
            throw new Error('unexpected error');
        }
        return this.returnMockUser();
    }
}
exports.MockStrategy = MockStrategy;
class MockStrategy2 {
    constructor() {
        this.name = 'MockStrategy2';
    }
    async authenticate(request) {
        var _a;
        if (((_a = request.headers) === null || _a === void 0 ? void 0 : _a.testState2) === 'fail') {
            throw new AuthenticationError();
        }
        return { [security_1.securityId]: 'mock-id' };
    }
}
exports.MockStrategy2 = MockStrategy2;
//# sourceMappingURL=mock-strategy.js.map
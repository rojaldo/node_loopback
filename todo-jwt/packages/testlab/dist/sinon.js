"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/testlab
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStubInstance = exports.sinon = void 0;
const tslib_1 = require("tslib");
const sinon_1 = tslib_1.__importDefault(require("sinon"));
exports.sinon = sinon_1.default;
/**
 * Creates a new object with the given functions as the prototype and stubs all
 * implemented functions.
 *
 * Note: The given constructor function is not invoked. See also the stub API.
 *
 * This is a helper method replacing `sinon.createStubInstance` and working
 * around the limitations of TypeScript and Sinon, where Sinon is not able to
 * list private/protected members in the type definition of the stub instance
 * and therefore the stub instance cannot be assigned to places expecting TType.
 * See also
 *  - https://github.com/Microsoft/TypeScript/issues/13543
 *  - https://github.com/DefinitelyTyped/DefinitelyTyped/issues/14811
 *
 * @typeParam TType - Type being stubbed.
 * @param constructor - Object or class to stub.
 * @returns A stubbed version of the constructor, with an extra property `stubs`
 * providing access to stub API for individual methods.
 */
function createStubInstance(constructor) {
    const stub = sinon_1.default.createStubInstance(constructor);
    return Object.assign(stub, { stubs: stub });
}
exports.createStubInstance = createStubInstance;
//# sourceMappingURL=sinon.js.map
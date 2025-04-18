"use strict";
// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsolationLevel = void 0;
/**
 * Isolation level
 */
var IsolationLevel;
(function (IsolationLevel) {
    IsolationLevel["READ_COMMITTED"] = "READ COMMITTED";
    IsolationLevel["READ_UNCOMMITTED"] = "READ UNCOMMITTED";
    IsolationLevel["SERIALIZABLE"] = "SERIALIZABLE";
    IsolationLevel["REPEATABLE_READ"] = "REPEATABLE READ";
})(IsolationLevel || (exports.IsolationLevel = IsolationLevel = {}));
//# sourceMappingURL=transaction.js.map
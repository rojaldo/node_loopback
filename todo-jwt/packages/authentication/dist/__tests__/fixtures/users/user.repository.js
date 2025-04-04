"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/authentication
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
class UserRepository {
    constructor(list) {
        this.list = list;
    }
    find(username) {
        const found = Object.keys(this.list).find(k => this.list[k].username === username);
        return found ? this.list[found] : undefined;
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map
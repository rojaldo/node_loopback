"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/authentication
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicAuthenticationUserService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const __1 = require("../../../");
const keys_1 = require("../keys");
const user_repository_1 = require("../users/user.repository");
let BasicAuthenticationUserService = class BasicAuthenticationUserService {
    constructor(userRepository, userProfileFactory) {
        this.userRepository = userRepository;
        this.userProfileFactory = userProfileFactory;
    }
    async verifyCredentials(credentials) {
        if (!credentials) {
            throw new rest_1.HttpErrors.Unauthorized(`'credentials' is null`);
        }
        if (!credentials.username) {
            throw new rest_1.HttpErrors.Unauthorized(`'credentials.username' is null`);
        }
        if (!credentials.password) {
            throw new rest_1.HttpErrors.Unauthorized(`'credentials.password' is null`);
        }
        const foundUser = this.userRepository.find(credentials.username);
        if (!foundUser) {
            throw new rest_1.HttpErrors['Unauthorized'](`User with username ${credentials.username} not found.`);
        }
        if (credentials.password !== foundUser.password) {
            throw new rest_1.HttpErrors.Unauthorized('The password is not correct.');
        }
        return foundUser;
    }
    convertToUserProfile(user) {
        if (!user) {
            throw new rest_1.HttpErrors.Unauthorized(`'user' is null`);
        }
        if (!user.id) {
            throw new rest_1.HttpErrors.Unauthorized(`'user id' is null`);
        }
        return this.userProfileFactory(user);
    }
};
exports.BasicAuthenticationUserService = BasicAuthenticationUserService;
exports.BasicAuthenticationUserService = BasicAuthenticationUserService = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)(keys_1.USER_REPO)),
    tslib_1.__param(1, (0, core_1.inject)(__1.AuthenticationBindings.USER_PROFILE_FACTORY)),
    tslib_1.__metadata("design:paramtypes", [user_repository_1.UserRepository, Function])
], BasicAuthenticationUserService);
//# sourceMappingURL=basic-auth-user-service.js.map
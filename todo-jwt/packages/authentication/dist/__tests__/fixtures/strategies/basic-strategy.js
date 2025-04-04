"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/authentication
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicAuthenticationStrategy = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const types_1 = require("../../../types");
const keys_1 = require("../keys");
const basic_auth_user_service_1 = require("../services/basic-auth-user-service");
let BasicAuthenticationStrategy = class BasicAuthenticationStrategy {
    constructor(userService) {
        this.userService = userService;
        this.name = 'basic';
    }
    async authenticate(request) {
        const credentials = this.extractCredentials(request);
        const user = await this.userService.verifyCredentials(credentials);
        const userProfile = this.userService.convertToUserProfile(user);
        return userProfile;
    }
    extractCredentials(request) {
        if (!request.headers.authorization) {
            throw new rest_1.HttpErrors.Unauthorized(`Authorization header not found.`);
        }
        // for example : Basic Z2l6bW9AZ21haWwuY29tOnBhc3N3b3Jk
        const authHeaderValue = request.headers.authorization;
        if (!authHeaderValue.startsWith('Basic')) {
            throw new rest_1.HttpErrors.Unauthorized(`Authorization header is not of type 'Basic'.`);
        }
        //split the string into 2 parts. We are interested in the base64 portion
        const parts = authHeaderValue.split(' ');
        if (parts.length !== 2)
            throw new rest_1.HttpErrors.Unauthorized(`Authorization header value has too many parts. It must follow the pattern: 'Basic xxyyzz' where xxyyzz is a base64 string.`);
        const encryptedCredentails = parts[1];
        // decrypt the credentials. Should look like :   'username:password'
        const decryptedCredentails = Buffer.from(encryptedCredentails, 'base64').toString('utf8');
        //split the string into 2 parts
        const decryptedParts = decryptedCredentails.split(':');
        if (decryptedParts.length !== 2) {
            throw new rest_1.HttpErrors.Unauthorized(`Authorization header 'Basic' value does not contain two parts separated by ':'.`);
        }
        const creds = {
            username: decryptedParts[0],
            password: decryptedParts[1],
        };
        return creds;
    }
    modifySpec(spec) {
        return (0, rest_1.mergeSecuritySchemeToSpec)(spec, this.name, {
            type: 'http',
            scheme: 'basic',
        });
    }
};
exports.BasicAuthenticationStrategy = BasicAuthenticationStrategy;
exports.BasicAuthenticationStrategy = BasicAuthenticationStrategy = tslib_1.__decorate([
    (0, core_1.injectable)(types_1.asAuthStrategy, rest_1.asSpecEnhancer),
    tslib_1.__param(0, (0, core_1.inject)(keys_1.BasicAuthenticationStrategyBindings.USER_SERVICE)),
    tslib_1.__metadata("design:paramtypes", [basic_auth_user_service_1.BasicAuthenticationUserService])
], BasicAuthenticationStrategy);
//# sourceMappingURL=basic-strategy.js.map
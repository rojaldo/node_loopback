"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/authentication
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.myUserProfileFactory = exports.createBearerAuthorizationHeaderValue = exports.createBasicAuthorizationHeaderValue = exports.getUserRepository = exports.getApp = void 0;
const rest_1 = require("@loopback/rest");
const security_1 = require("@loopback/security");
const __1 = require("../..");
const user_repository_1 = require("./users/user.repository");
/**
 * Returns an application that has loaded the authentication and rest components
 */
function getApp() {
    const app = new rest_1.RestApplication();
    app.component(__1.AuthenticationComponent);
    return app;
}
exports.getApp = getApp;
/**
 * Returns a stub user repository
 */
function getUserRepository() {
    return new user_repository_1.UserRepository({
        joe888: {
            id: '1',
            firstName: 'joe',
            lastName: 'joeman',
            username: 'joe888',
            password: 'joepa55w0rd',
        },
        jill888: {
            id: '2',
            firstName: 'jill',
            lastName: 'jillman',
            username: 'jill888',
            password: 'jillpa55w0rd',
        },
        jack888: {
            id: '3',
            firstName: 'jack',
            lastName: 'jackman',
            username: 'jack888',
            password: 'jackpa55w0rd',
        },
        janice888: {
            id: '4',
            firstName: 'janice',
            lastName: 'janiceman',
            username: 'janice888',
            password: 'janicepa55w0rd',
        },
    });
}
exports.getUserRepository = getUserRepository;
function createBasicAuthorizationHeaderValue(user, options) {
    options = Object.assign({
        prefix: 'Basic ',
        separator: ':',
        extraSegment: '',
    }, options);
    // sometimes used to create an invalid 3rd segment (for testing)
    let extraPart = '';
    if (options.extraSegment !== '')
        extraPart = options.separator + options.extraSegment;
    return (options.prefix +
        Buffer.from(`${user.username}${options.separator}${user.password}${extraPart}`).toString('base64'));
}
exports.createBasicAuthorizationHeaderValue = createBasicAuthorizationHeaderValue;
function createBearerAuthorizationHeaderValue(token, alternativePrefix) {
    // default type is 'Bearer ', unless another is specified
    const prefix = alternativePrefix ? alternativePrefix : 'Bearer ';
    return prefix + token;
}
exports.createBearerAuthorizationHeaderValue = createBearerAuthorizationHeaderValue;
/**
 * Convert a User instance to an object in type UserProfile
 * @param user
 */
const myUserProfileFactory = function (user) {
    const userProfile = { [security_1.securityId]: '', name: '', id: '' };
    if (user.id) {
        userProfile.id = user.id;
        userProfile[security_1.securityId] = user.id;
    }
    let userName = '';
    if (user.firstName)
        userName = user.firstName;
    if (user.lastName)
        userName = user.firstName ? `${userName} ${user.lastName}` : user.lastName;
    userProfile.name = userName;
    return userProfile;
};
exports.myUserProfileFactory = myUserProfileFactory;
//# sourceMappingURL=helper.js.map
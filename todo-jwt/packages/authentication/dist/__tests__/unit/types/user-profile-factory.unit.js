"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/authentication
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const security_1 = require("@loopback/security");
const testlab_1 = require("@loopback/testlab");
const helper_1 = require("../../fixtures/helper");
/**
 * This test suite is for testing the
 *
 *   export interface UserProfileFactory<U> {
 *     (user: U): UserProfile;
 *   }
 *
 * interface.
 */
describe('UserProfileFactory', () => {
    let joeUser;
    let userProfileFactory1;
    let userProfileFactory2;
    givenUser();
    givenUserProfileFactory1();
    givenUserProfileFactory2();
    it('user profile contains a few fields', () => {
        const expectedUserProfile1 = {
            [security_1.securityId]: '1',
            name: 'joe joeman',
            username: 'joe888',
        };
        const userProfile = userProfileFactory1(joeUser);
        // user profile should contain these fields
        testlab_1.expect.exists(userProfile.name);
        testlab_1.expect.exists(userProfile.username);
        testlab_1.expect.exists(userProfile[security_1.securityId]);
        // the user profile fields should match the expected user profile fields
        (0, testlab_1.expect)(userProfile.name).to.equal(expectedUserProfile1.name);
        (0, testlab_1.expect)(userProfile.username).to.equal(expectedUserProfile1.username);
        (0, testlab_1.expect)(userProfile[security_1.securityId]).to.equal(expectedUserProfile1[security_1.securityId]);
        // user profile should not contain these fields
        testlab_1.expect.not.exists(userProfile.firstName);
        testlab_1.expect.not.exists(userProfile.lastName);
        testlab_1.expect.not.exists(userProfile.password);
        testlab_1.expect.not.exists(userProfile.id);
    });
    it(`user profile only contains '[securityId]' field`, () => {
        const expectedUserProfile2 = {
            [security_1.securityId]: '1',
        };
        const userProfile = userProfileFactory2(joeUser);
        // user profile should contain this field
        testlab_1.expect.exists(userProfile[security_1.securityId]);
        // the user profile field should match the expected user profile field
        (0, testlab_1.expect)(userProfile[security_1.securityId]).to.equal(expectedUserProfile2[security_1.securityId]);
        // user profile should not contain these fields
        testlab_1.expect.not.exists(userProfile.firstName);
        testlab_1.expect.not.exists(userProfile.lastName);
        testlab_1.expect.not.exists(userProfile.password);
        testlab_1.expect.not.exists(userProfile.id);
    });
    function givenUser() {
        const userRepo = (0, helper_1.getUserRepository)();
        joeUser = userRepo.list['joe888'];
    }
    /**
     * This function takes in a User and returns a UserProfile
     * with only these fields:
     *  - [securityId]
     *  - name
     *  - username
     */
    function givenUserProfileFactory1() {
        userProfileFactory1 = function (user) {
            const userProfile = {
                [security_1.securityId]: '',
                name: '',
                username: '',
            };
            if (user.id)
                userProfile[security_1.securityId] = user.id;
            let userName = '';
            if (user.firstName)
                userName = user.firstName;
            if (user.lastName)
                userName = user.firstName
                    ? `${userName} ${user.lastName}`
                    : user.lastName;
            userProfile.name = userName;
            if (user.username)
                userProfile.username = user.username;
            return userProfile;
        };
    }
    /**
     * This function takes in a User and returns a UserProfile
     * with only this field:
     *  - [securityId]
     */
    function givenUserProfileFactory2() {
        userProfileFactory2 = function (user) {
            const userProfile = { [security_1.securityId]: '' };
            if (user.id)
                userProfile[security_1.securityId] = user.id;
            return userProfile;
        };
    }
});
//# sourceMappingURL=user-profile-factory.unit.js.map
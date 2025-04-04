"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/security
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
const types_1 = require("../../types");
describe('DefaultSubject', () => {
    const subject = new __1.DefaultSubject();
    it('adds users', () => {
        const user = { [__1.securityId]: 'user-001', type: 'USER' };
        subject.addUser(user);
        (0, testlab_1.expect)(subject.user).to.eql(user);
    });
    it('adds application', () => {
        const app = {
            [__1.securityId]: 'app-001',
            type: 'APPLICATION',
        };
        subject.addApplication(app);
        (0, testlab_1.expect)(subject.getPrincipal('APPLICATION')).to.equal(app);
    });
    it('adds authority', () => {
        const perm1 = new types_1.Permission();
        perm1.action = 'get';
        perm1.resourceType = 'User';
        const perm2 = new types_1.Permission();
        perm2.action = 'update';
        perm2.resourceType = 'User';
        subject.addAuthority(perm1, perm2);
        (0, testlab_1.expect)(subject.authorities).to.containEql(perm1);
        (0, testlab_1.expect)(subject.authorities).to.containEql(perm2);
    });
    it('adds credential', () => {
        const cred = { usr: 'auser', pass: 'mypass' };
        subject.addCredential(cred);
        (0, testlab_1.expect)(subject.credentials).to.containEql(cred);
    });
});
//# sourceMappingURL=subject.unit.js.map
"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
describe('tryWithFinally', () => {
    it('performs final action for a fulfilled promise', async () => {
        let finalActionInvoked = false;
        const action = () => Promise.resolve(1);
        const finalAction = () => (finalActionInvoked = true);
        await (0, __1.tryWithFinally)(action, finalAction);
        (0, testlab_1.expect)(finalActionInvoked).to.be.true();
    });
    it('performs final action for a resolved value', () => {
        let finalActionInvoked = false;
        const action = () => 1;
        const finalAction = () => (finalActionInvoked = true);
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        (0, __1.tryWithFinally)(action, finalAction);
        (0, testlab_1.expect)(finalActionInvoked).to.be.true();
    });
    it('performs final action for a rejected promise', async () => {
        let finalActionInvoked = false;
        const action = () => Promise.reject(new Error('error'));
        const finalAction = () => (finalActionInvoked = true);
        await (0, testlab_1.expect)((0, __1.tryWithFinally)(action, finalAction)).be.rejectedWith('error');
        (0, testlab_1.expect)(finalActionInvoked).to.be.true();
    });
    it('performs final action for an action that throws an error', () => {
        let finalActionInvoked = false;
        const action = () => {
            throw new Error('error');
        };
        const finalAction = () => (finalActionInvoked = true);
        (0, testlab_1.expect)(() => (0, __1.tryWithFinally)(action, finalAction)).to.throw('error');
        (0, testlab_1.expect)(finalActionInvoked).to.be.true();
    });
});
describe('tryCatchFinally', () => {
    it('performs final action for a fulfilled promise', async () => {
        let finalActionInvoked = false;
        const action = () => Promise.resolve(1);
        const finalAction = () => (finalActionInvoked = true);
        await (0, __1.tryCatchFinally)(action, undefined, finalAction);
        (0, testlab_1.expect)(finalActionInvoked).to.be.true();
    });
    it('performs final action for a resolved value', () => {
        let finalActionInvoked = false;
        const action = () => 1;
        const finalAction = () => (finalActionInvoked = true);
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        (0, __1.tryCatchFinally)(action, undefined, finalAction);
        (0, testlab_1.expect)(finalActionInvoked).to.be.true();
    });
    it('skips error action for a fulfilled promise', async () => {
        let errorActionInvoked = false;
        const action = () => Promise.resolve(1);
        const errorAction = (err) => {
            errorActionInvoked = true;
            throw err;
        };
        await (0, __1.tryCatchFinally)(action, errorAction);
        (0, testlab_1.expect)(errorActionInvoked).to.be.false();
    });
    it('skips error action for a resolved value', () => {
        let errorActionInvoked = false;
        const action = () => 1;
        const errorAction = (err) => {
            errorActionInvoked = true;
            throw err;
        };
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        (0, __1.tryCatchFinally)(action, errorAction);
        (0, testlab_1.expect)(errorActionInvoked).to.be.false();
    });
    it('performs error action for a rejected promise', async () => {
        let errorActionInvoked = false;
        const errorAction = (err) => {
            errorActionInvoked = true;
            throw err;
        };
        const action = () => Promise.reject(new Error('error'));
        const finalAction = () => true;
        await (0, testlab_1.expect)((0, __1.tryCatchFinally)(action, errorAction, finalAction)).be.rejectedWith('error');
        (0, testlab_1.expect)(errorActionInvoked).to.be.true();
    });
    it('performs error action for an action that throws an error', () => {
        let errorActionInvoked = false;
        const errorAction = (err) => {
            errorActionInvoked = true;
            throw err;
        };
        const action = () => {
            throw new Error('error');
        };
        const finalAction = () => true;
        (0, testlab_1.expect)(() => (0, __1.tryCatchFinally)(action, errorAction, finalAction)).to.throw('error');
        (0, testlab_1.expect)(errorActionInvoked).to.be.true();
    });
    it('allows error action to return a value for a rejected promise', async () => {
        let errorActionInvoked = false;
        const errorAction = (err) => {
            errorActionInvoked = true;
            return 1;
        };
        const action = () => Promise.reject(new Error('error'));
        const result = await (0, __1.tryCatchFinally)(action, errorAction);
        (0, testlab_1.expect)(errorActionInvoked).to.be.true();
        (0, testlab_1.expect)(result).to.equal(1);
    });
    it('allows error action to return a value for an action that throws an error', () => {
        let errorActionInvoked = false;
        const errorAction = (err) => {
            errorActionInvoked = true;
            return 1;
        };
        const action = () => {
            throw new Error('error');
        };
        const result = (0, __1.tryCatchFinally)(action, errorAction);
        (0, testlab_1.expect)(result).to.equal(1);
        (0, testlab_1.expect)(errorActionInvoked).to.be.true();
    });
    it('skips error action for rejection from the final action', async () => {
        let errorActionInvoked = false;
        const errorAction = (err) => {
            errorActionInvoked = true;
            throw err;
        };
        const action = () => Promise.resolve(1);
        const finalAction = () => {
            throw new Error('error');
        };
        await (0, testlab_1.expect)((0, __1.tryCatchFinally)(action, errorAction, finalAction)).be.rejectedWith('error');
        (0, testlab_1.expect)(errorActionInvoked).to.be.false();
    });
    it('skips error action for error from the final action', () => {
        let errorActionInvoked = false;
        const errorAction = (err) => {
            errorActionInvoked = true;
            throw err;
        };
        const action = () => 1;
        const finalAction = () => {
            throw new Error('error');
        };
        (0, testlab_1.expect)(() => (0, __1.tryCatchFinally)(action, errorAction, finalAction)).to.throw('error');
        (0, testlab_1.expect)(errorActionInvoked).to.be.false();
    });
    it('allows default error action', () => {
        const action = () => {
            throw new Error('error');
        };
        (0, testlab_1.expect)(() => (0, __1.tryCatchFinally)(action)).to.throw('error');
    });
    it('allows default error action for rejected promise', () => {
        const action = () => {
            return Promise.reject(new Error('error'));
        };
        return (0, testlab_1.expect)((0, __1.tryCatchFinally)(action)).to.be.rejectedWith('error');
    });
});
//# sourceMappingURL=try-catch-finally.unit.js.map
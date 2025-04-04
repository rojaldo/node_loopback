"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/boot
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const path_1 = require("path");
const __1 = require("../../..");
describe('booter-utils unit tests', () => {
    const sandbox = new testlab_1.TestSandbox((0, path_1.resolve)(__dirname, '../../../.sandbox'));
    beforeEach('reset sandbox', () => sandbox.reset());
    describe('discoverFiles()', () => {
        beforeEach(setupSandbox);
        it('discovers files matching a nested glob pattern', async () => {
            const expected = [
                (0, path_1.resolve)(sandbox.path, 'empty.artifact.js'),
                (0, path_1.resolve)(sandbox.path, 'nested/multiple.artifact.js'),
            ];
            const glob = '/**/*.artifact.js';
            const files = await (0, __1.discoverFiles)(glob, sandbox.path);
            (0, testlab_1.expect)(files.sort()).to.eql(expected.sort());
        });
        it('discovers files matching a non-nested glob pattern', async () => {
            const expected = [(0, path_1.resolve)(sandbox.path, 'empty.artifact.js')];
            const glob = '/*.artifact.js';
            const files = await (0, __1.discoverFiles)(glob, sandbox.path);
            (0, testlab_1.expect)(files).to.eql(expected);
        });
        it('discovers no files for a unknown glob', async () => {
            const glob = '/xyz';
            const files = await (0, __1.discoverFiles)(glob, sandbox.path);
            (0, testlab_1.expect)(files).to.be.eql([]);
        });
        async function setupSandbox() {
            await sandbox.copyFile((0, path_1.resolve)(__dirname, '../../fixtures/empty.artifact.js'));
            await sandbox.copyFile((0, path_1.resolve)(__dirname, '../../fixtures/multiple.artifact.js'), 'nested/multiple.artifact.js');
        }
    });
    describe('isClass()', () => {
        it('returns true given a class', () => {
            (0, testlab_1.expect)((0, __1.isClass)(class Thing {
            })).to.be.True();
        });
    });
    describe('loadClassesFromFiles()', () => {
        it('returns an array of classes from a file', async () => {
            // Copying a test file to sandbox that contains a function and 2 classes
            await sandbox.copyFile((0, path_1.resolve)(__dirname, '../../fixtures/multiple.artifact.js'));
            const files = [(0, path_1.resolve)(sandbox.path, 'multiple.artifact.js')];
            const NUM_CLASSES = 2; // Number of classes in above file
            const classes = (0, __1.loadClassesFromFiles)(files, sandbox.path);
            (0, testlab_1.expect)(classes).to.have.lengthOf(NUM_CLASSES);
            (0, testlab_1.expect)(classes[0]).to.be.a.Function();
            (0, testlab_1.expect)(classes[1]).to.be.a.Function();
        });
        it('returns an empty array given an empty file', async () => {
            await sandbox.copyFile((0, path_1.resolve)(__dirname, '../../fixtures/empty.artifact.js'));
            const files = [(0, path_1.resolve)(sandbox.path, 'empty.artifact.js')];
            const classes = (0, __1.loadClassesFromFiles)(files, sandbox.path);
            (0, testlab_1.expect)(classes).to.be.an.Array();
            (0, testlab_1.expect)(classes).to.be.empty();
        });
        it('throws an error given a non-existent file', async () => {
            const files = [(0, path_1.resolve)(sandbox.path, 'fake.artifact.js')];
            (0, testlab_1.expect)(() => (0, __1.loadClassesFromFiles)(files, sandbox.path)).to.throw(/Cannot find module/);
        });
    });
});
//# sourceMappingURL=booter-utils.unit.js.map
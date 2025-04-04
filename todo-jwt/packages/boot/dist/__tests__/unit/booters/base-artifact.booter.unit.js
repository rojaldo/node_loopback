"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/boot
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const path_1 = require("path");
const __1 = require("../../..");
describe('base-artifact booter unit tests', () => {
    const TEST_OPTIONS = {
        dirs: ['test', 'test2'],
        extensions: ['.test.js', 'test2.js'],
        nested: false,
    };
    describe('configure()', () => {
        it(`sets 'dirs' / 'extensions' properties as an array if a string`, async () => {
            const booterInst = givenBaseBooter({
                dirs: 'test',
                extensions: '.test.js',
                nested: true,
            });
            await booterInst.configure();
            (0, testlab_1.expect)(booterInst.dirs).to.be.eql(['test']);
            (0, testlab_1.expect)(booterInst.extensions).to.be.eql(['.test.js']);
        });
        it(`creates and sets 'glob' pattern`, async () => {
            const booterInst = givenBaseBooter();
            const expected = '/{test,test2}/*@(.test.js|test2.js)';
            await booterInst.configure();
            (0, testlab_1.expect)(booterInst.glob).to.equal(expected);
        });
        it(`creates and sets 'glob' pattern (nested)`, async () => {
            const booterInst = givenBaseBooter(Object.assign({}, TEST_OPTIONS, { nested: true }));
            const expected = '/{test,test2}/**/*@(.test.js|test2.js)';
            await booterInst.configure();
            (0, testlab_1.expect)(booterInst.glob).to.equal(expected);
        });
        it(`sets 'glob' pattern to options.glob if present`, async () => {
            const expected = '/**/*.glob';
            const booterInst = givenBaseBooter(Object.assign({}, TEST_OPTIONS, { glob: expected }));
            await booterInst.configure();
            (0, testlab_1.expect)(booterInst.glob).to.equal(expected);
        });
    });
    describe('discover()', () => {
        it(`sets 'discovered' property`, async () => {
            const booterInst = givenBaseBooter();
            // Fake glob pattern so we get an empty array
            booterInst.glob = '/abc.xyz';
            await booterInst.discover();
            (0, testlab_1.expect)(booterInst.discovered).to.eql([]);
        });
    });
    describe('load()', () => {
        it(`sets 'classes' property to Classes from a file`, async () => {
            const booterInst = givenBaseBooter();
            booterInst.discovered = [
                (0, path_1.resolve)(__dirname, '../../fixtures/multiple.artifact.js'),
            ];
            const NUM_CLASSES = 2; // Above file has 1 class in it.
            await booterInst.load();
            (0, testlab_1.expect)(booterInst.classes).to.have.a.lengthOf(NUM_CLASSES);
        });
    });
    function givenBaseBooter(options) {
        return new __1.BaseArtifactBooter(__dirname, options !== null && options !== void 0 ? options : TEST_OPTIONS);
    }
});
//# sourceMappingURL=base-artifact.booter.unit.js.map
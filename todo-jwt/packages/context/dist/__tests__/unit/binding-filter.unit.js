"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
const key = 'foo';
describe('BindingFilter', () => {
    let binding;
    beforeEach(givenBinding);
    describe('filterByTag', () => {
        it('accepts bindings MATCHING the provided tag name', () => {
            const filter = (0, __1.filterByTag)('controller');
            binding.tag('controller');
            (0, testlab_1.expect)(filter(binding)).to.be.true();
        });
        it('rejects bindings NOT MATCHING the provided tag name', () => {
            const filter = (0, __1.filterByTag)('controller');
            binding.tag('dataSource');
            (0, testlab_1.expect)(filter(binding)).to.be.false();
        });
        it('accepts bindings MATCHING the provided tag regexp', () => {
            const filter = (0, __1.filterByTag)(/^c/);
            binding.tag('controller');
            (0, testlab_1.expect)(filter(binding)).to.be.true();
        });
        it('rejects bindings NOT MATCHING the provided tag regexp', () => {
            const filter = (0, __1.filterByTag)(/^c/);
            binding.tag('dataSource');
            (0, testlab_1.expect)(filter(binding)).to.be.false();
        });
        it('accepts bindings MATCHING the provided tag map', () => {
            const filter = (0, __1.filterByTag)({ controller: 'my-controller' });
            binding.tag({ controller: 'my-controller' });
            binding.tag({ name: 'my-controller' });
            (0, testlab_1.expect)(filter(binding)).to.be.true();
        });
        it('accepts bindings MATCHING the provided tag map with multiple tags', () => {
            const filter = (0, __1.filterByTag)({
                controller: 'my-controller',
                name: 'my-name',
            });
            binding.tag({ controller: 'my-controller' });
            binding.tag({ name: 'my-name' });
            (0, testlab_1.expect)(filter(binding)).to.be.true();
        });
        it('accepts bindings MATCHING the provided tag map with array values', () => {
            const filter = (0, __1.filterByTag)({
                extensionFor: (0, __1.includesTagValue)('greeting-service'),
                name: 'my-name',
            });
            binding.tag({
                extensionFor: ['greeting-service', 'anther-extension-point'],
            });
            binding.tag({ name: 'my-name' });
            (0, testlab_1.expect)(filter(binding)).to.be.true();
        });
        it('rejects bindings NOT MATCHING the provided tag map with array values', () => {
            const filter = (0, __1.filterByTag)({
                extensionFor: (0, __1.includesTagValue)('extension-point-3'),
                name: 'my-name',
            });
            binding.tag({
                extensionFor: ['extension-point-1', 'extension-point-2'],
            });
            binding.tag({ name: 'my-name' });
            (0, testlab_1.expect)(filter(binding)).to.be.false();
        });
        it('matches ANY_TAG_VALUE if the tag name exists', () => {
            const filter = (0, __1.filterByTag)({
                controller: __1.ANY_TAG_VALUE,
                name: 'my-name',
            });
            binding.tag({ name: 'my-name', controller: 'MyController' });
            (0, testlab_1.expect)(filter(binding)).to.be.true();
        });
        it('does not match ANY_TAG_VALUE if the tag name does not exists', () => {
            const filter = (0, __1.filterByTag)({
                controller: __1.ANY_TAG_VALUE,
                name: 'my-name',
            });
            binding.tag({ name: 'my-name' });
            (0, testlab_1.expect)(filter(binding)).to.be.false();
        });
        it('allows include tag value matcher - true for exact match', () => {
            const filter = (0, __1.filterByTag)({
                controller: (0, __1.includesTagValue)('MyController'),
                name: 'my-name',
            });
            binding.tag({ name: 'my-name', controller: 'MyController' });
            (0, testlab_1.expect)(filter(binding)).to.be.true();
        });
        it('allows include tag value matcher - true for included match', () => {
            const filter = (0, __1.filterByTag)({
                controller: (0, __1.includesTagValue)('MyController'),
                name: 'my-name',
            });
            binding.tag({
                name: 'my-name',
                controller: ['MyController', 'YourController'],
            });
            (0, testlab_1.expect)(filter(binding)).to.be.true();
        });
        it('allows include tag value matcher - false for no match', () => {
            const filter = (0, __1.filterByTag)({
                controller: (0, __1.includesTagValue)('XYZController'),
                name: 'my-name',
            });
            binding.tag({
                name: 'my-name',
                controller: ['MyController', 'YourController'],
            });
            (0, testlab_1.expect)(filter(binding)).to.be.false();
        });
        it('rejects bindings NOT MATCHING the provided tag map', () => {
            const filter = (0, __1.filterByTag)({ controller: 'your-controller' });
            binding.tag({ controller: 'my-controller' });
            binding.tag({ name: 'my-controller' });
            (0, testlab_1.expect)(filter(binding)).to.be.false();
        });
        it('rejects bindings NOT MATCHING the provided tag map with multiple tags', () => {
            const filter = (0, __1.filterByTag)({
                controller: 'my-controller',
                name: 'my-name',
            });
            binding.tag({ controller: 'my-controller' });
            binding.tag({ name: 'my-controller' });
            (0, testlab_1.expect)(filter(binding)).to.be.false();
        });
    });
    describe('isBindingAddress', () => {
        it('allows binding selector to be a string', () => {
            (0, testlab_1.expect)((0, __1.isBindingAddress)('controllers.MyController')).to.be.true();
        });
        it('allows binding selector to be a BindingKey', () => {
            (0, testlab_1.expect)((0, __1.isBindingAddress)(__1.BindingKey.create('controllers.MyController'))).to.be.true();
        });
        it('does not allow binding selector to be an object', () => {
            const filter = () => true;
            (0, testlab_1.expect)((0, __1.isBindingAddress)(filter)).to.be.false();
        });
        it('allows binding selector to be a BindingKey by duck-typing', () => {
            // Please note that TypeScript checks types by duck-typing
            // See https://www.typescriptlang.org/docs/handbook/interfaces.html#introduction
            const selector = {
                key: 'x',
                deepProperty: () => __1.BindingKey.create('y'),
            };
            (0, testlab_1.expect)((0, __1.isBindingAddress)(selector)).to.be.true();
        });
    });
    describe('BindingTagFilter', () => {
        it('allows tag name as string', () => {
            const filter = (0, __1.filterByTag)('controller');
            (0, testlab_1.expect)(filter.bindingTagPattern).to.eql('controller');
        });
        it('allows tag name wildcard as string', () => {
            const filter = (0, __1.filterByTag)('controllers.*');
            (0, testlab_1.expect)(filter.bindingTagPattern).to.eql(/^controllers\.[^.:]*$/);
        });
        it('allows tag name as regexp', () => {
            const filter = (0, __1.filterByTag)(/controller/);
            (0, testlab_1.expect)(filter.bindingTagPattern).to.eql(/controller/);
        });
        it('allows tag name as map', () => {
            const filter = (0, __1.filterByTag)({ controller: 'controller', rest: true });
            (0, testlab_1.expect)(filter.bindingTagPattern).to.eql({
                controller: 'controller',
                rest: true,
            });
        });
    });
    describe('isBindingTagFilter', () => {
        it('returns true for binding tag filter functions', () => {
            const filter = (0, __1.filterByTag)('controller');
            (0, testlab_1.expect)((0, __1.isBindingTagFilter)(filter)).to.be.true();
        });
        it('returns false for binding filter functions without tag', () => {
            const filter = () => true;
            (0, testlab_1.expect)((0, __1.isBindingTagFilter)(filter)).to.be.false();
        });
        it('returns false for undefined', () => {
            (0, testlab_1.expect)((0, __1.isBindingTagFilter)(undefined)).to.be.false();
        });
        it('returns false if the bindingTagPattern with wrong type', () => {
            const filter = () => true;
            filter.bindingTagPattern = true; // wrong type
            (0, testlab_1.expect)((0, __1.isBindingTagFilter)(filter)).to.be.false();
        });
    });
    describe('filterByKey', () => {
        it('accepts bindings MATCHING the provided key', () => {
            const filter = (0, __1.filterByKey)(key);
            (0, testlab_1.expect)(filter(binding)).to.be.true();
        });
        it('rejects bindings NOT MATCHING the provided key', () => {
            const filter = (0, __1.filterByKey)(`another-${key}`);
            (0, testlab_1.expect)(filter(binding)).to.be.false();
        });
        it('accepts bindings MATCHING the provided key regexp', () => {
            const filter = (0, __1.filterByKey)(/f.*/);
            (0, testlab_1.expect)(filter(binding)).to.be.true();
        });
        it('rejects bindings NOT MATCHING the provided key regexp', () => {
            const filter = (0, __1.filterByKey)(/^ba/);
            (0, testlab_1.expect)(filter(binding)).to.be.false();
        });
        it('accepts bindings MATCHING the provided filter', () => {
            const filter = (0, __1.filterByKey)(b => b.key === key);
            (0, testlab_1.expect)(filter(binding)).to.be.true();
        });
        it('rejects bindings NOT MATCHING the provided filter', () => {
            const filter = (0, __1.filterByKey)(b => b.key !== key);
            (0, testlab_1.expect)(filter(binding)).to.be.false();
        });
    });
    function givenBinding() {
        binding = new __1.Binding(key);
    }
});
//# sourceMappingURL=binding-filter.unit.js.map
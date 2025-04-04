"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../../..");
describe('includeFieldIfNot', () => {
    it('no-operation case 1 - empty dictionary', async () => {
        const fields = {};
        const result = (0, __1.includeFieldIfNot)(fields, 'field1');
        let after;
        if (result === false) {
            after = fields;
        }
        else {
            after = result;
        }
        (0, testlab_1.expect)(after).to.eql(fields);
    });
    it('no-operation case 2 - empty array', async () => {
        const fields = [];
        const result = (0, __1.includeFieldIfNot)(fields, 'field1');
        let after;
        if (result === false) {
            after = fields;
        }
        else {
            after = result;
        }
        (0, testlab_1.expect)(after).to.eql(fields);
    });
    it('no-operation case 3 - included in dictionary', async () => {
        const fields = {
            field1: true,
        };
        const result = (0, __1.includeFieldIfNot)(fields, 'field1');
        let after;
        if (result === false) {
            after = fields;
        }
        else {
            after = result;
        }
        (0, testlab_1.expect)(after).to.eql(fields);
    });
    it('no-operation case 4 - included in array', async () => {
        const fields = ['field1'];
        const result = (0, __1.includeFieldIfNot)(fields, 'field1');
        let after;
        if (result === false) {
            after = fields;
        }
        else {
            after = result;
        }
        (0, testlab_1.expect)(after).to.eql(fields);
    });
    it('dictionary form - other field included', async () => {
        const fields = {
            field2: true,
        };
        const result = (0, __1.includeFieldIfNot)(fields, 'field1');
        let after;
        if (result === false) {
            after = fields;
        }
        else {
            after = result;
        }
        (0, testlab_1.expect)(after).to.eql({
            field1: true,
            field2: true,
        });
    });
    it('array form - other field included', async () => {
        const fields = ['field2'];
        const result = (0, __1.includeFieldIfNot)(fields, 'field1');
        let after;
        if (result === false) {
            after = fields;
        }
        else {
            after = result;
        }
        (0, testlab_1.expect)(after).to.eql({
            field1: true,
            field2: true,
        });
    });
    it('dictionary form - field excluded', async () => {
        const fields = {
            field1: false,
        };
        const result = (0, __1.includeFieldIfNot)(fields, 'field1');
        let after;
        if (result === false) {
            after = fields;
        }
        else {
            after = result;
        }
        (0, testlab_1.expect)(after).to.eql({});
    });
    it('dictionary form - field excluded with other field included', async () => {
        const fields = {
            field1: false,
            field2: true,
        };
        const result = (0, __1.includeFieldIfNot)(fields, 'field1');
        let after;
        if (result === false) {
            after = fields;
        }
        else {
            after = result;
        }
        (0, testlab_1.expect)(after).to.eql({
            field1: true,
            field2: true,
        });
    });
});
//# sourceMappingURL=include-field-if-not.unit.js.map
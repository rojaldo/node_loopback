"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@loopback/core");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../../");
const note_model_1 = require("../../fixtures/models/note.model");
describe('add property to model via mixin', () => {
    let meta;
    before(async () => {
        var _a;
        meta =
            (_a = core_1.MetadataInspector.getAllPropertyMetadata(__1.MODEL_PROPERTIES_KEY, note_model_1.Note.prototype)) !== null && _a !== void 0 ? _a : {};
    });
    it('metadata for non-mixin properties exist', () => {
        (0, testlab_1.expect)(!!meta).to.be.True();
        (0, testlab_1.expect)(meta.id).to.eql({
            type: 'number',
            id: true,
            generated: true,
            useDefaultIdType: false,
        });
        (0, testlab_1.expect)(meta.title).to.eql({
            type: 'string',
            required: true,
        });
        (0, testlab_1.expect)(meta.content).to.eql({
            type: 'string',
        });
    });
    it(`metadata for mixin property 'category' exists`, () => {
        (0, testlab_1.expect)(meta.category).to.eql({
            type: 'string',
            required: true,
        });
    });
});
//# sourceMappingURL=model.mixin.unit.js.map
"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const note_model_1 = require("../../fixtures/models/note.model");
const note_repository_1 = require("../../fixtures/repositories/note.repository");
describe('add method to crud repository via mixin', () => {
    let repo;
    const noteData = {
        title: 'groceries',
        content: 'eggs,bacon',
        category: 'keto',
    };
    let note;
    beforeEach(async () => {
        repo = new note_repository_1.NoteRepository();
    });
    // method from CrudRepository
    it(`non-mixin method 'create' exists`, async () => {
        note = await repo.create(new note_model_1.Note(noteData));
        (0, testlab_1.expect)(note.toJSON()).to.deepEqual({ id: 1, ...noteData });
    });
    // method from EntityCrudRepository
    it(`non-mixin method 'findById' exists`, async () => {
        note = await repo.create(new note_model_1.Note(noteData));
        const foundNote = await repo.findById(note.id);
        (0, testlab_1.expect)(foundNote).to.deepEqual(note);
    });
    // method from mixin
    it(`mixin method 'findByTitle' exists`, async () => {
        note = await repo.create(new note_model_1.Note({ title: 'groceries', content: 'eggs,bacon', category: 'keto' }));
        const foundNotes = await repo.findByTitle('groceries');
        (0, testlab_1.expect)(foundNotes).to.deepEqual([note]);
    });
});
//# sourceMappingURL=add-method-to-repository.mixin.unit.js.map
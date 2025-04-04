"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteRepository = void 0;
const __1 = require("../../..");
const find_by_title_repo_mixin_1 = require("../mixins/find-by-title-repo-mixin");
const note_model_1 = require("../models/note.model");
/**
 * A repository for `Note` with `findByTitle`
 */
class NoteRepository extends (0, find_by_title_repo_mixin_1.FindByTitleRepositoryMixin)(__1.DefaultCrudRepository) {
    constructor(dataSource = new __1.juggler.DataSource({
        connector: 'memory',
    })) {
        super(note_model_1.Note, dataSource);
    }
}
exports.NoteRepository = NoteRepository;
//# sourceMappingURL=note.repository.js.map
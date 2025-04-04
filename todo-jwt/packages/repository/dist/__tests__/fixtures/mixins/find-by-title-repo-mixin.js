"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindByTitleRepositoryMixin = void 0;
/*
 * This function adds a new method 'findByTitle' to a repository class
 * where 'M' is a model which extends Model
 *
 * @param superClass - Base class
 *
 * @typeParam M - Model class which extends Model
 * @typeParam R - Repository class
 */
function FindByTitleRepositoryMixin(superClass) {
    class MixedRepository extends superClass {
        async findByTitle(title) {
            const where = { title };
            const titleFilter = { where };
            return this.find(titleFilter);
        }
    }
    return MixedRepository;
}
exports.FindByTitleRepositoryMixin = FindByTitleRepositoryMixin;
//# sourceMappingURL=find-by-title-repo-mixin.js.map
"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasMany = void 0;
const relation_decorator_1 = require("../relation.decorator");
const relation_types_1 = require("../relation.types");
/**
 * Decorator for hasMany
 * Calls property.array decorator underneath the hood and infers foreign key
 * name from target model name unless explicitly specified
 * @param targetResolver - Target model for hasMany relation
 * @param definition - Optional metadata for setting up hasMany relation
 * @returns A property decorator
 */
function hasMany(targetResolver, definition) {
    return function (decoratedTarget, key) {
        const meta = Object.assign(
        // default values, can be customized by the caller
        { name: key }, 
        // properties provided by the caller
        definition, 
        // properties enforced by the decorator
        {
            type: relation_types_1.RelationType.hasMany,
            targetsMany: true,
            source: decoratedTarget.constructor,
            target: targetResolver,
        });
        (0, relation_decorator_1.relation)(meta)(decoratedTarget, key);
    };
}
exports.hasMany = hasMany;
//# sourceMappingURL=has-many.decorator.js.map
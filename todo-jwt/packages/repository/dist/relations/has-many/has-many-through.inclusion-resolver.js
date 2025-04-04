"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHasManyThroughInclusionResolver = void 0;
const tslib_1 = require("tslib");
const filter_1 = require("@loopback/filter");
const debug_1 = tslib_1.__importDefault(require("debug"));
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const __1 = require("../..");
const relation_helpers_1 = require("../relation.helpers");
const has_many_through_helpers_1 = require("./has-many-through.helpers");
const debug = (0, debug_1.default)('loopback:repository:relations:has-many-through:inclusion-resolver');
/**
 * Creates InclusionResolver for HasManyThrough relation.
 * Notice that this function only generates the inclusionResolver.
 * It doesn't register it for the source repository.
 *
 *
 * @param meta - metadata of the hasMany relation (including through)
 * @param getThroughRepo - through repository getter i.e. where through
 * instances are
 * @param getTargetRepo - target repository getter i.e where target instances
 * are
 */
function createHasManyThroughInclusionResolver(meta, getThroughRepo, getTargetRepoDict) {
    const relationMeta = (0, has_many_through_helpers_1.resolveHasManyThroughMetadata)(meta);
    return async function fetchHasManyThroughModels(entities, inclusion, options) {
        var _a, _b;
        if (!relationMeta.through) {
            throw new Error(`relationMeta.through must be defined on ${relationMeta}`);
        }
        if (!entities.length)
            return [];
        debug('Fetching target models for entities:', entities);
        debug('Relation metadata:', relationMeta);
        const sourceKey = relationMeta.keyFrom;
        const sourceIds = entities.map(e => e[sourceKey]);
        const targetKey = relationMeta.keyTo;
        if (!relationMeta.through) {
            throw new Error(`relationMeta.through must be defined on ${relationMeta}`);
        }
        const throughKeyTo = relationMeta.through.keyTo;
        const throughKeyFrom = relationMeta.through.keyFrom;
        debug('Parameters:', {
            sourceKey,
            sourceIds,
            targetKey,
            throughKeyTo,
            throughKeyFrom,
        });
        debug('sourceId types', sourceIds.map(i => typeof i));
        const throughRepo = await getThroughRepo();
        // find through models
        const throughFound = await (0, relation_helpers_1.findByForeignKeys)(throughRepo, throughKeyFrom, sourceIds, {}, // scope will be applied at the target level
        options);
        const throughResult = (0, relation_helpers_1.flattenTargetsOfOneToManyRelation)(sourceIds, throughFound, throughKeyFrom);
        const scope = typeof inclusion === 'string'
            ? {}
            : inclusion.scope;
        // whether the polymorphism is configured
        const targetDiscriminator = relationMeta.through.polymorphic
            ? relationMeta.through.polymorphic.discriminator
            : undefined;
        if (targetDiscriminator) {
            // put through results into arrays based on the target polymorphic types
            const throughArrayByTargetType = {};
            for (const throughArray of throughResult) {
                if (throughArray) {
                    for (const throughItem of throughArray) {
                        const targetType = String(throughItem[targetDiscriminator]);
                        if (!getTargetRepoDict[targetType]) {
                            throw new __1.InvalidPolymorphismError(targetType, String(targetDiscriminator));
                        }
                        if (!throughArrayByTargetType[targetType]) {
                            throughArrayByTargetType[targetType] = [];
                        }
                        throughArrayByTargetType[targetType].push(throughItem);
                    }
                }
            }
            // get targets based on their polymorphic types
            const targetOfTypes = {};
            for (const targetType of Object.keys(throughArrayByTargetType)) {
                const targetIds = throughArrayByTargetType[targetType].map(throughItem => throughItem[throughKeyTo]);
                const targetRepo = await getTargetRepoDict[targetType]();
                const targetEntityList = await (0, relation_helpers_1.findByForeignKeys)(targetRepo, targetKey, targetIds, scope, options);
                targetOfTypes[targetType] = targetEntityList;
            }
            // put targets into arrays reflecting their throughs
            // Why the order is correct:
            // e.g. through model = T(target instance), target model 1 = a, target model 2 = b
            // all entities: [S1, S2, S2]
            // through-result: [[T(b-11), T(a-12), T(b-13), T(b-14)], [T(a-21), T(a-22), T(b-23)], [T(b-31), T(b-32), T(a-33)]]
            // through-array-by-target-type: {a:[T(a-12), T(a-21), T(a-22), T(a-33)] b: [T(b-11), T(b-13), T(b-14), T(b-23), T(b-31), T(b-32)]}
            // target-array-by-target-type: {a:[a-12, a-21, a-22, a-33] b: [b-11, b-13, b-14, b-23, b-31, b-32]}
            // merged:
            // through-result[0][0]->b => targets: [[b-11 from b.shift()]]
            // through-result[0][1]->a => targets: [[b-11, a-12 from a.shift()]]
            // through-result[0][2]->b => targets: [[b-11, a-12, b-13 from b.shift()]]
            // through-result[0][3]->b => targets: [[b-11, a-12, b-13, b-14 from b.shift()]]
            // through-result[1][0]->a => targets: [[b-11, a-12, b-13, b-14], [a-21, from a.shift()]]
            // through-result[1][1]->a => targets: [[b-11, a-12, b-13, b-14], [a-21, a-22 from a.shift()]]
            // through-result[1][2]->b => targets: [[b-11, a-12, b-13, b-14], [a-21, a-22, b-23 from b.shift()]]
            // through-result[2][0]->b => targets: [[b-11, a-12, b-13, b-14], [a-21, a-22, b-23], [b-31, from b.shift()]]
            // through-result[2][1]->b => targets: [[b-11, a-12, b-13, b-14], [a-21, a-22, b-23], [b-31, b-32 from b.shift()]]
            // through-result[2][1]->b => targets: [[b-11, a-12, b-13, b-14], [a-21, a-22, b-23], [b-31, b-32, a-33 from a.shift()]]
            const allTargetsOfThrough = [];
            for (const throughArray of throughResult) {
                if (throughArray && throughArray.length > 0) {
                    const currentTargetThroughArray = [];
                    for (const throughItem of throughArray) {
                        const itemToAdd = targetOfTypes[String(throughItem[targetDiscriminator])].shift();
                        if (itemToAdd) {
                            currentTargetThroughArray.push(itemToAdd);
                        }
                    }
                    allTargetsOfThrough.push(currentTargetThroughArray);
                }
                else {
                    allTargetsOfThrough.push(undefined);
                }
            }
            return allTargetsOfThrough;
        }
        else {
            const targetRepo = await getTargetRepoDict[relationMeta.target().name]();
            const result = [];
            // Normalize field filter to an object like {[field]: boolean}
            const filterBuilder = new filter_1.FilterBuilder();
            const fieldFilter = filterBuilder.fields((_a = scope === null || scope === void 0 ? void 0 : scope.fields) !== null && _a !== void 0 ? _a : {}).filter
                .fields;
            // We need targetKey to create a map, as such it always needs to be included.
            // Keep track of whether targetKey should be removed from the final result,
            // whether by explicit omission (targetKey: false) or by implicit omission
            // (anyOtherKey: true but no targetKey: true).
            const omitTargetKeyFromFields = (Object.values(fieldFilter).includes(true) &&
                fieldFilter[targetKey] !== true) ||
                fieldFilter[targetKey] === false;
            if (omitTargetKeyFromFields) {
                if (fieldFilter[targetKey] === false) {
                    // Undo explicit omission
                    delete fieldFilter[targetKey];
                }
                else {
                    // Undo implicit omission
                    fieldFilter[targetKey] = true;
                }
            }
            // get target ids from the through entities by foreign key
            const allIds = lodash_1.default.uniq(throughResult
                .filter(throughEntitySet => throughEntitySet !== undefined)
                .map(throughEntitySet => throughEntitySet === null || throughEntitySet === void 0 ? void 0 : throughEntitySet.map(entity => entity[throughKeyTo]))
                .flat());
            // Omit limit from scope as those need to be applied per fK
            const targetEntityList = await (0, relation_helpers_1.findByForeignKeys)(targetRepo, targetKey, allIds, { ...lodash_1.default.omit(scope !== null && scope !== void 0 ? scope : {}, ['limit', 'fields']), fields: fieldFilter }, {
                ...options,
                isThroughModelInclude: true,
            });
            const targetEntityIds = targetEntityList.map(targetEntity => { var _a, _b; return (_b = (_a = targetEntity[targetKey]) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : targetEntity[targetKey]; });
            const targetEntityMap = Object.fromEntries(targetEntityList.map(x => [
                x[targetKey],
                omitTargetKeyFromFields ? lodash_1.default.omit(x, [targetKey]) : x,
            ]));
            // convert from through entities to the target entities
            for (const entityList of throughResult) {
                if (entityList) {
                    const relatedIds = entityList.map(x => { var _a, _b; return (_b = (_a = x[throughKeyTo]) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : x[throughKeyTo]; });
                    // Use the order of the original result set & apply limit
                    const sortedIds = lodash_1.default.intersection(targetEntityIds, relatedIds).slice(0, (_b = scope === null || scope === void 0 ? void 0 : scope.limit) !== null && _b !== void 0 ? _b : entityList.length);
                    // Make each result its own instance to avoid shenanigans by reference
                    result.push(lodash_1.default.cloneDeep(sortedIds.map(x => targetEntityMap[x])));
                }
                else {
                    // no entities found, add undefined to results
                    result.push(entityList);
                }
            }
            debug('fetchHasManyThroughModels result', result);
            return result;
        }
    };
}
exports.createHasManyThroughInclusionResolver = createHasManyThroughInclusionResolver;
//# sourceMappingURL=has-many-through.inclusion-resolver.js.map
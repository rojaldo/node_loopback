"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.constrainDataObjects = exports.constrainDataObject = exports.constrainWhereOr = exports.constrainWhere = exports.constrainFilter = void 0;
const filter_1 = require("@loopback/filter");
const lodash_1 = require("lodash");
/**
 * A utility function which takes a filter and enforces constraint(s)
 * on it
 * @param originalFilter - the filter to apply the constrain(s) to
 * @param constraint - the constraint which is to be applied on the filter
 * @returns Filter the modified filter with the constraint, otherwise
 * the original filter
 */
function constrainFilter(originalFilter, constraint) {
    const filter = (0, lodash_1.cloneDeep)(originalFilter);
    const builder = new filter_1.FilterBuilder(filter);
    return builder.impose(constraint).build();
}
exports.constrainFilter = constrainFilter;
/**
 * A utility function which takes a where filter and enforces constraint(s)
 * on it
 * @param originalWhere - the where filter to apply the constrain(s) to
 * @param constraint - the constraint which is to be applied on the filter
 * @returns Filter the modified filter with the constraint, otherwise
 * the original filter
 */
function constrainWhere(originalWhere, constraint) {
    const where = (0, lodash_1.cloneDeep)(originalWhere);
    const builder = new filter_1.WhereBuilder(where);
    return builder.impose(constraint).build();
}
exports.constrainWhere = constrainWhere;
/**
 * A utility function which takes a where filter and enforces constraint(s)
 * on it with OR clause
 * @param originalWhere - the where filter to apply the constrain(s) to
 * @param constraint - the constraint which is to be applied on the filter with
 * or clause
 * @returns Filter the modified filter with the constraint, otherwise
 * the original filter
 */
function constrainWhereOr(originalWhere, constraint) {
    const where = (0, lodash_1.cloneDeep)(originalWhere);
    const builder = new filter_1.WhereBuilder(where);
    return builder.or(constraint).build();
}
exports.constrainWhereOr = constrainWhereOr;
/**
 * A utility function which takes a model instance data and enforces constraint(s)
 * on it
 * @param originalData - the model data to apply the constrain(s) to
 * @param constraint - the constraint which is to be applied on the data object
 * @returns the modified data with the constraint, otherwise
 * the original instance data
 */
function constrainDataObject(originalData, constraint) {
    const constrainedData = (0, lodash_1.cloneDeep)(originalData);
    for (const c in constraint) {
        if (Object.prototype.hasOwnProperty.call(constrainedData, c)) {
            // Known limitation: === does not work for objects such as ObjectId
            if (originalData[c] === constraint[c])
                continue;
            throw new Error(`Property "${c}" cannot be changed!`);
        }
        constrainedData[c] = constraint[c];
    }
    return constrainedData;
}
exports.constrainDataObject = constrainDataObject;
/**
 * A utility function which takes an array of model instance data and
 * enforces constraint(s) on it
 * @param originalData - the array of model data to apply the constrain(s) to
 * @param constraint - the constraint which is to be applied on the data objects
 * @returns an array of the modified data with the constraint, otherwise
 * the original instance data array
 */
function constrainDataObjects(originalData, constraint) {
    return originalData.map(obj => constrainDataObject(obj, constraint));
}
exports.constrainDataObjects = constrainDataObjects;
//# sourceMappingURL=constraint-utils.js.map
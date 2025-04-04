"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddCategoryPropertyMixin = void 0;
const tslib_1 = require("tslib");
const __1 = require("../../..");
/**
 * A mixin factory to add `category` property
 *
 * @param superClass - Base Class
 * @typeParam T - Model class
 */
function AddCategoryPropertyMixin(superClass) {
    class MixedModel extends superClass {
    }
    tslib_1.__decorate([
        (0, __1.property)({
            type: 'string',
            required: true,
        }),
        tslib_1.__metadata("design:type", String)
    ], MixedModel.prototype, "category", void 0);
    return MixedModel;
}
exports.AddCategoryPropertyMixin = AddCategoryPropertyMixin;
//# sourceMappingURL=category-property-mixin.js.map
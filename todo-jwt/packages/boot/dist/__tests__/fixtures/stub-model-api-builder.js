"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/boot
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimilarPatternModelApiBuilderComponent = exports.similarPatternBuildCalls = exports.SamePatternModelApiBuilderComponent = exports.samePatternBuildCalls = exports.StubModelApiBuilderComponent = exports.buildCalls = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const model_api_builder_1 = require("@loopback/model-api-builder");
exports.buildCalls = [];
let StubModelApiBuilder = class StubModelApiBuilder {
    constructor() {
        this.pattern = 'stub';
    }
    async build(application, modelClass, config) {
        exports.buildCalls.push({ application, modelClass, config });
    }
};
StubModelApiBuilder = tslib_1.__decorate([
    (0, core_1.injectable)(model_api_builder_1.asModelApiBuilder)
], StubModelApiBuilder);
class StubModelApiBuilderComponent {
    constructor() {
        this.bindings = [(0, core_1.createBindingFromClass)(StubModelApiBuilder)];
    }
}
exports.StubModelApiBuilderComponent = StubModelApiBuilderComponent;
exports.samePatternBuildCalls = [];
let SamePatternModelApiBuilder = class SamePatternModelApiBuilder {
    constructor() {
        this.pattern = 'same';
    }
    async build(application, modelClass, config) {
        exports.samePatternBuildCalls.push(application);
    }
};
SamePatternModelApiBuilder = tslib_1.__decorate([
    (0, core_1.injectable)(model_api_builder_1.asModelApiBuilder)
], SamePatternModelApiBuilder);
class SamePatternModelApiBuilderComponent {
    constructor() {
        this.bindings = [(0, core_1.createBindingFromClass)(SamePatternModelApiBuilder)];
    }
}
exports.SamePatternModelApiBuilderComponent = SamePatternModelApiBuilderComponent;
exports.similarPatternBuildCalls = [];
let SimilarPatternModelApiBuilder = class SimilarPatternModelApiBuilder {
    constructor() {
        this.pattern = 'same';
    }
    async build(application, modelClass, config) {
        exports.similarPatternBuildCalls.push({ modelClass });
    }
};
SimilarPatternModelApiBuilder = tslib_1.__decorate([
    (0, core_1.injectable)(model_api_builder_1.asModelApiBuilder)
], SimilarPatternModelApiBuilder);
class SimilarPatternModelApiBuilderComponent {
    constructor() {
        this.bindings = [(0, core_1.createBindingFromClass)(SimilarPatternModelApiBuilder)];
    }
}
exports.SimilarPatternModelApiBuilderComponent = SimilarPatternModelApiBuilderComponent;
//# sourceMappingURL=stub-model-api-builder.js.map
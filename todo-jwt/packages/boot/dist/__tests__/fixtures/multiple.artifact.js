"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/boot
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.hello = exports.ArtifactTwo = exports.ArtifactOne = void 0;
const tslib_1 = require("tslib");
const rest_1 = require("@loopback/rest");
class ArtifactOne {
    one() {
        return 'ControllerOne.one()';
    }
}
exports.ArtifactOne = ArtifactOne;
tslib_1.__decorate([
    (0, rest_1.get)('/one'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], ArtifactOne.prototype, "one", null);
class ArtifactTwo {
    two() {
        return 'ControllerTwo.two()';
    }
}
exports.ArtifactTwo = ArtifactTwo;
tslib_1.__decorate([
    (0, rest_1.get)('/two'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], ArtifactTwo.prototype, "two", null);
function hello() {
    return 'hello world';
}
exports.hello = hello;
//# sourceMappingURL=multiple.artifact.js.map
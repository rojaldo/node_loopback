"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInvalidRelationError = exports.InvalidRelationError = void 0;
class InvalidRelationError extends Error {
    constructor(reason, relationMeta, extraProperties) {
        const { name, type, source } = relationMeta;
        const model = (source === null || source === void 0 ? void 0 : source.modelName) || '<Unknown Model>';
        const message = `Invalid ${type} definition for ${model}#${name}: ${reason}`;
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.code = 'INVALID_RELATION_DEFINITION';
        this.relationName = name;
        this.relationType = type;
        this.sourceModelName = model;
        Object.assign(this, extraProperties);
    }
}
exports.InvalidRelationError = InvalidRelationError;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isInvalidRelationError(e) {
    return e instanceof InvalidRelationError;
}
exports.isInvalidRelationError = isInvalidRelationError;
//# sourceMappingURL=invalid-relation.error.js.map
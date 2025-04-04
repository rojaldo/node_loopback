"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorResponse = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
/**
 * The model class is generated from OpenAPI schema - ErrorResponse
 * ErrorResponse
 */
let ErrorResponse = class ErrorResponse {
    constructor(data) {
        if (data != null && typeof data === 'object') {
            Object.assign(this, data);
        }
    }
};
exports.ErrorResponse = ErrorResponse;
tslib_1.__decorate([
    (0, repository_1.property)({ jsonSchema: {
            type: 'string',
        } }),
    tslib_1.__metadata("design:type", String)
], ErrorResponse.prototype, "error", void 0);
exports.ErrorResponse = ErrorResponse = tslib_1.__decorate([
    (0, repository_1.model)({ name: 'ErrorResponse' }),
    tslib_1.__metadata("design:paramtypes", [Object])
], ErrorResponse);
//# sourceMappingURL=error-response.model.js.map
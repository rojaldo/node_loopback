"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculatorResponse = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
let CalculatorResponse = class CalculatorResponse extends repository_1.Model {
    constructor(data) {
        super(data);
    }
};
exports.CalculatorResponse = CalculatorResponse;
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], CalculatorResponse.prototype, "reponse", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'date',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], CalculatorResponse.prototype, "timestamp", void 0);
exports.CalculatorResponse = CalculatorResponse = tslib_1.__decorate([
    (0, repository_1.model)(),
    tslib_1.__metadata("design:paramtypes", [Object])
], CalculatorResponse);
//# sourceMappingURL=calculator-response.model.js.map
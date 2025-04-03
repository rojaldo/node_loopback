"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Echo = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
let Echo = class Echo extends repository_1.Model {
    constructor(data) {
        super(data);
    }
};
exports.Echo = Echo;
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], Echo.prototype, "message", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'date',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], Echo.prototype, "timestamp", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], Echo.prototype, "status", void 0);
exports.Echo = Echo = tslib_1.__decorate([
    (0, repository_1.model)(),
    tslib_1.__metadata("design:paramtypes", [Object])
], Echo);
//# sourceMappingURL=echo.model.js.map
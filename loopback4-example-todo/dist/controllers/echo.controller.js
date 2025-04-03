"use strict";
// Uncomment these imports to begin using these cool features!
Object.defineProperty(exports, "__esModule", { value: true });
exports.EchoController = void 0;
const tslib_1 = require("tslib");
const rest_1 = require("@loopback/rest");
const echo_model_1 = require("../models/echo.model");
// import {inject} from '@loopback/core';
class EchoController {
    constructor() { }
    async echo(message) {
        if (!message || message.length === 0 || message.trim().length === 0 || message.length > 100) {
            throw new rest_1.HttpErrors.BadRequest('The `message` query parameter is required.');
        }
        return new echo_model_1.Echo({
            message: message,
            timestamp: (new Date()).toISOString(),
            status: 'success'
        });
    }
}
exports.EchoController = EchoController;
tslib_1.__decorate([
    (0, rest_1.get)('/echo'),
    tslib_1.__param(0, rest_1.param.query.string('message', { required: true })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], EchoController.prototype, "echo", null);
//# sourceMappingURL=echo.controller.js.map
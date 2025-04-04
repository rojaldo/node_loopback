"use strict";
// Uncomment these imports to begin using these cool features!
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculatorController = void 0;
const tslib_1 = require("tslib");
const rest_1 = require("@loopback/rest");
const calculator_response_model_1 = require("../models/calculator-response.model");
const core_1 = require("@loopback/core");
const services_1 = require("../services");
// import {inject} from '@loopback/core';
let CalculatorController = class CalculatorController {
    constructor(calculatorService) {
        this.calculatorService = calculatorService;
    }
    async calculator(num1, num2, operation) {
        if (!operation || operation.length === 0 || operation.trim().length === 0 || operation !== 'add' && operation !== 'sub' && operation !== 'mult' && operation !== 'div') {
            throw new rest_1.HttpErrors.BadRequest('The `operation` query parameter is required and must be one of the following: add, sub, mult, div.');
        }
        let result = await this.calculatorService.calculate(num1, num2, operation);
        return new calculator_response_model_1.CalculatorResponse({
            reponse: `The result of ${operation} between ${num1} and ${num2} is ${result}`,
            timestamp: (new Date()).toISOString(),
        });
    }
};
exports.CalculatorController = CalculatorController;
tslib_1.__decorate([
    (0, rest_1.get)('/calculator'),
    tslib_1.__param(0, rest_1.param.query.number('num1', { required: true })),
    tslib_1.__param(1, rest_1.param.query.number('num2', { required: true })),
    tslib_1.__param(2, rest_1.param.query.string('op', { required: true })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Number, String]),
    tslib_1.__metadata("design:returntype", Promise)
], CalculatorController.prototype, "calculator", null);
exports.CalculatorController = CalculatorController = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.service)(services_1.CalculatorService)),
    tslib_1.__metadata("design:paramtypes", [services_1.CalculatorService])
], CalculatorController);
//# sourceMappingURL=calculator.controller.js.map
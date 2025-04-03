"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculatorService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
let CalculatorService = class CalculatorService {
    constructor( /* Add @inject to inject parameters */) { }
    /*
     * Add service methods here
     */
    calculate(num1, num2, operation) {
        switch (operation) {
            case 'add':
                return num1 + num2;
            case 'sub':
                return num1 - num2;
            case 'mult':
                return num1 * num2;
            case 'div':
                if (num2 === 0) {
                    throw new rest_1.HttpErrors.BadRequest('Division by zero is not allowed.');
                }
                return num1 / num2;
            default:
                throw new rest_1.HttpErrors.BadRequest('Invalid operation.');
        }
    }
};
exports.CalculatorService = CalculatorService;
exports.CalculatorService = CalculatorService = tslib_1.__decorate([
    (0, core_1.injectable)({ scope: core_1.BindingScope.TRANSIENT }),
    tslib_1.__metadata("design:paramtypes", [])
], CalculatorService);
//# sourceMappingURL=calculator.service.js.map
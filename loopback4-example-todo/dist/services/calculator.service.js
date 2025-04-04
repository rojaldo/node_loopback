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
    async calculate(num1, num2, operation) {
        let result = 0;
        switch (operation) {
            case 'add':
                result = num1 + num2;
                break;
            case 'sub':
                result = num1 - num2;
                break;
            case 'mult':
                result = num1 * num2;
                break;
            case 'div':
                if (num2 === 0) {
                    throw new rest_1.HttpErrors.BadRequest('Division by zero is not allowed.');
                }
                result = num1 / num2;
                break;
            default:
                throw new rest_1.HttpErrors.BadRequest('Invalid operation.');
        }
        // round result to 4 decimals
        return Math.round(result * 10000) / 10000;
        // return result;
    }
};
exports.CalculatorService = CalculatorService;
exports.CalculatorService = CalculatorService = tslib_1.__decorate([
    (0, core_1.injectable)({ scope: core_1.BindingScope.TRANSIENT }),
    tslib_1.__metadata("design:paramtypes", [])
], CalculatorService);
//# sourceMappingURL=calculator.service.js.map
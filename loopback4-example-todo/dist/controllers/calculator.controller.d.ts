import { CalculatorResponse } from "../models/calculator-response.model";
import { CalculatorService } from "../services";
export declare class CalculatorController {
    protected calculatorService: CalculatorService;
    constructor(calculatorService: CalculatorService);
    calculator(num1: number, num2: number, operation: string): Promise<CalculatorResponse>;
}

// Uncomment these imports to begin using these cool features!

import { get, HttpErrors, param } from "@loopback/rest";
import { CalculatorResponse } from "../models/calculator-response.model";
import { service } from "@loopback/core";
import { CalculatorService } from "../services";

// import {inject} from '@loopback/core';


export class CalculatorController {
  constructor(
    @service(CalculatorService)
    protected calculatorService: CalculatorService
  ) {}

  @get('/calculator')
  async calculator(
    @param.query.number('num1', {required: true}) num1: number,
    @param.query.number('num2', {required: true}) num2: number,
    @param.query.string('op', {required: true}) operation: string,
  ): Promise<CalculatorResponse> {
    if (!operation || operation.length === 0 || operation.trim().length === 0 || operation !== 'add' && operation !== 'sub' && operation !== 'mult' && operation !== 'div') {
      throw new HttpErrors.BadRequest(
        'The `operation` query parameter is required and must be one of the following: add, sub, mult, div.',
      );
    }

    let result = await this.calculatorService.calculate(num1, num2, operation);

    return new CalculatorResponse({
      reponse: `${result}`,
      timestamp: (new Date()).toISOString(),
    });
  }
}

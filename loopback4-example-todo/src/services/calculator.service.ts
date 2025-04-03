import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import { HttpErrors } from '@loopback/rest';

@injectable({scope: BindingScope.TRANSIENT})
export class CalculatorService {
  constructor(/* Add @inject to inject parameters */) {}

  /*
   * Add service methods here
   */

  calculate(
    num1: number,
    num2: number,
    operation: string,
  ): number {
    switch (operation) {
      case 'add':
        return num1 + num2;
      case 'sub':
        return num1 - num2;
      case 'mult':
        return num1 * num2;
      case 'div':
        if (num2 === 0) {
          throw new HttpErrors.BadRequest('Division by zero is not allowed.');
        }
        return num1 / num2;
      default:
        throw new HttpErrors.BadRequest('Invalid operation.');
    }
  }


}

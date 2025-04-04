import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import { HttpErrors } from '@loopback/rest';

@injectable({scope: BindingScope.TRANSIENT})
export class CalculatorService {
  constructor(/* Add @inject to inject parameters */) {}

  /*
   * Add service methods here
   */

  async calculate(
    num1: number,
    num2: number,
    operation: string,
  ): Promise<number> {
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
          throw new HttpErrors.BadRequest('Division by zero is not allowed.');
        }
        result = num1 / num2;
        break;
      default:
        throw new HttpErrors.BadRequest('Invalid operation.');
    }
    // round result to 4 decimals
    return Math.round(result * 10000) / 10000;
    // return result;
  }


}

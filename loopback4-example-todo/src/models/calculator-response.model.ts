import {Model, model, property} from '@loopback/repository';

@model()
export class CalculatorResponse extends Model {
  @property({
    type: 'number',
    required: true,
  })
  response: number;

  @property({
    type: 'date',
    required: true,
  })
  timestamp: string;


  constructor(data?: Partial<CalculatorResponse>) {
    super(data);
  }
}

export interface CalculatorResponseRelations {
  // describe navigational properties here
}

export type CalculatorResponseWithRelations = CalculatorResponse & CalculatorResponseRelations;

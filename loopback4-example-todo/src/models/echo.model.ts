import {Model, model, property} from '@loopback/repository';

@model()
export class Echo extends Model {
  @property({
    type: 'string',
    required: true,
  })
  message: string;

  @property({
    type: 'date',
    required: true,
  })
  timestamp: string;

  @property({
    type: 'string',
    required: true,
  })
  status: string;


  constructor(data?: Partial<Echo>) {
    super(data);
  }
}

export interface EchoRelations {
  // describe navigational properties here
}

export type EchoWithRelations = Echo & EchoRelations;

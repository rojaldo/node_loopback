import {model, property} from '@loopback/repository';

/**
 * The model class is generated from OpenAPI schema - ErrorResponse
 * ErrorResponse
 */
@model({name: 'ErrorResponse'})
export class ErrorResponse {
  constructor(data?: Partial<ErrorResponse>) {
    if (data != null && typeof data === 'object') {
      Object.assign(this, data);
    }
  }

  /**
   *
   */
  @property({jsonSchema: {
  type: 'string',
}})
  error?: string;

}

export interface ErrorResponseRelations {
  // describe navigational properties here
}

export type ErrorResponseWithRelations = ErrorResponse & ErrorResponseRelations;



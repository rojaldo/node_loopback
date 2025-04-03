import {Entity, model, property} from '@loopback/repository';

/**
 * The model class is generated from OpenAPI schema - TriviaQuestion
 * TriviaQuestion
 */
@model({name: 'TriviaQuestion'})
export class TriviaQuestion extends Entity{
  constructor(data?: Partial<TriviaQuestion>) {
    super(data);
    if (data != null && typeof data === 'object') {
      Object.assign(this, data);
    }
  }

  /**
   *
   */
  @property({
    type: 'number',
    id: true,
    generated: true,
    jsonSchema: {
      type: 'integer',
    }
  })
  id?: number;

  /**
   *
   */
  @property({jsonSchema: {
  type: 'string',
}})
  category?: string;

  /**
   *
   */
  @property({jsonSchema: {
  type: 'string',
}})
  type?: string;

  /**
   *
   */
  @property({jsonSchema: {
  type: 'string',
  enum: [
    'easy',
    'medium',
    'hard',
  ],
}})
  difficulty?: 'easy' | 'medium' | 'hard';

  /**
   *
   */
  @property({jsonSchema: {
  type: 'string',
}})
  question?: string;

  /**
   *
   */
  @property({jsonSchema: {
  type: 'string',
}})
  correct_answer?: string;

  /**
   *
   */
  @property.array(String, {jsonSchema: {
  type: 'array',
  items: {
    type: 'string',
  },
}})
  incorrect_answers?: string[];

}

export interface TriviaQuestionRelations {
  // describe navigational properties here
}

export type TriviaQuestionWithRelations = TriviaQuestion & TriviaQuestionRelations;



import {api, operation, param, requestBody} from '@loopback/rest';
import {TriviaQuestion} from '../models/trivia-question.model';
import { inject } from '@loopback/core';
import { repository } from '@loopback/repository';
import { UserRepository } from '../repositories/user.repository';
import { TriviaQuestionRepository } from '../repositories/trivia-question.repository';

/**
 * The controller class is generated from OpenAPI spec with operations tagged
 * by <no-tag>.
 *
 */
@api({
  components: {
    schemas: {
      TriviaQuestion: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 1,
          },
          category: {
            type: 'string',
            example: 'Science: Computers',
          },
          type: {
            type: 'string',
            example: 'multiple',
          },
          difficulty: {
            type: 'string',
            enum: [
              'easy',
              'medium',
              'hard',
            ],
            example: 'medium',
          },
          question: {
            type: 'string',
            example: 'What is the capital of France?',
          },
          correct_answer: {
            type: 'string',
            example: 'Paris',
          },
          incorrect_answers: {
            type: 'array',
            items: {
              type: 'string',
              example: [
                'London',
                'Berlin',
                'Madrid',
              ],
            },
          },
        },
      },
    },
  },
  paths: {},
})
export class OpenApiController {
    constructor(
      @repository(TriviaQuestionRepository)
          public repository : TriviaQuestionRepository,
    ) {} 
  /**
   * Retrieves trivia questions from the Open Trivia Database with these
parameters:
- amount: Number of trivia questions to retrieve.
- category: Category ID of the trivia questions. A number from 9 to 32.
- difficulty: Difficulty level of the trivia questions (easy, medium, hard).
- type: Type of trivia questions (multiple choice, true/false).
- token: Token for user-specific trivia questions.
- encode: Encoding type for the trivia questions (url3986, base64, none).

   *
   * @param amount Number of trivia questions to retrieve.
   * @param category Category ID of the trivia questions.
   * @param difficulty Difficulty level of the trivia questions.
   * @param type Type of trivia questions, either multiple choice (4) or
true/false.
   * @param token Token for user-specific trivia questions.
   * @returns OK
   */
  @operation('get', '/api/v1/cards', {
  summary: 'Get trivia questions',
  operationId: 'getTriviaQuestions',
  description: ' Retrieves trivia questions from the Open Trivia Database with these parameters:\n - amount: Number of trivia questions to retrieve.\n - category: Category ID of the trivia questions. A number from 9 to 32.\n - difficulty: Difficulty level of the trivia questions (easy, medium, hard).\n - type: Type of trivia questions (multiple choice, true/false).\n - token: Token for user-specific trivia questions.\n - encode: Encoding type for the trivia questions (url3986, base64, none).\n ',
  parameters: [
    {
      name: 'amount',
      in: 'query',
      required: true,
      description: 'Number of trivia questions to retrieve.',
      schema: {
        type: 'integer',
        example: 10,
      },
    },
    {
      name: 'category',
      in: 'query',
      required: false,
      description: 'Category ID of the trivia questions.',
      schema: {
        type: 'integer',
        example: 9,
      },
    },
    {
      name: 'difficulty',
      in: 'query',
      required: false,
      description: 'Difficulty level of the trivia questions.',
      schema: {
        type: 'string',
        enum: [
          'easy',
          'medium',
          'hard',
        ],
        example: 'medium',
      },
    },
    {
      name: 'type',
      in: 'query',
      required: false,
      description: 'Type of trivia questions, either multiple choice (4) or true/false.',
      schema: {
        type: 'string',
        enum: [
          'multiple',
          'boolean',
        ],
        example: 'multiple',
      },
    },
    {
      name: 'token',
      in: 'query',
      required: false,
      description: 'Token for user-specific trivia questions.',
      schema: {
        type: 'string',
        example: 'abc123',
      },
    },
  ],
  responses: {
    '200': {
      description: 'OK',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              response_code: {
                type: 'integer',
                example: 0,
              },
              results: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/TriviaQuestion',
                },
              },
            },
          },
        },
      },
    },
  },
})
  async getTriviaQuestions(@param({
  name: 'amount',
  in: 'query',
  required: true,
  description: 'Number of trivia questions to retrieve.',
  schema: {
    type: 'integer',
    example: 10,
  },
}) amount: number, @param({
  name: 'category',
  in: 'query',
  required: false,
  description: 'Category ID of the trivia questions.',
  schema: {
    type: 'integer',
    example: 9,
  },
}) category: number | undefined, @param({
  name: 'difficulty',
  in: 'query',
  required: false,
  description: 'Difficulty level of the trivia questions.',
  schema: {
    type: 'string',
    enum: [
      'easy',
      'medium',
      'hard',
    ],
    example: 'medium',
  },
}) difficulty: 'easy' | 'medium' | 'hard' | undefined, @param({
  name: 'type',
  in: 'query',
  required: false,
  description: 'Type of trivia questions, either multiple choice (4) or true/false.',
  schema: {
    type: 'string',
    enum: [
      'multiple',
      'boolean',
    ],
    example: 'multiple',
  },
}) type: 'multiple' | 'boolean' | undefined, @param({
  name: 'token',
  in: 'query',
  required: false,
  description: 'Token for user-specific trivia questions.',
  schema: {
    type: 'string',
    example: 'abc123',
  },
}) token: string | undefined): Promise<{
  response_code?: number;
  results?: TriviaQuestion[];
}> {
    let cards = await this.repository.find();
    return {
      response_code: 0,
      results: cards,
    }
  }
  /**
   * Creates a new trivia question in the Open Trivia Database.
   *
   * @param _requestBody
   * @returns Created
   */
  @operation('post', '/api/v1/cards', {
  summary: 'Create a new trivia question',
  operationId: 'createTriviaQuestion',
  description: 'Creates a new trivia question in the Open Trivia Database.',
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              example: 'Science: Computers',
            },
            type: {
              type: 'string',
              example: 'multiple',
            },
            difficulty: {
              type: 'string',
              enum: [
                'easy',
                'medium',
                'hard',
              ],
              example: 'medium',
            },
            question: {
              type: 'string',
              example: 'What is the capital of France?',
            },
            correct_answer: {
              type: 'string',
              example: 'Paris',
            },
            incorrect_answers: {
              type: 'array',
              items: {
                type: 'string',
                example: [
                  'London',
                  'Berlin',
                  'Madrid',
                ],
              },
            },
          },
        },
      },
    },
  },
  responses: {
    '201': {
      description: 'Created',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/TriviaQuestion',
          },
        },
      },
    },
  },
})
  async createTriviaQuestion(@requestBody({
  required: true,
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            example: 'Science: Computers',
          },
          type: {
            type: 'string',
            example: 'multiple',
          },
          difficulty: {
            type: 'string',
            enum: [
              'easy',
              'medium',
              'hard',
            ],
            example: 'medium',
          },
          question: {
            type: 'string',
            example: 'What is the capital of France?',
          },
          correct_answer: {
            type: 'string',
            example: 'Paris',
          },
          incorrect_answers: {
            type: 'array',
            items: {
              type: 'string',
              example: [
                'London',
                'Berlin',
                'Madrid',
              ],
            },
          },
        },
      },
    },
  },
}) _requestBody: {
  category?: string;
  type?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  question?: string;
  correct_answer?: string;
  incorrect_answers?: string[];
}): Promise<TriviaQuestion> {
     throw new Error('Not implemented'); 
  }
}


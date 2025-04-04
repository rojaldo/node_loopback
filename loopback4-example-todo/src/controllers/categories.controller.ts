import {api, operation, param, requestBody} from '@loopback/rest';
import {Category} from '../models/category.model';
import { repository } from '@loopback/repository';
import { CategoryRepository } from '../repositories';

/**
 * The controller class is generated from OpenAPI spec with operations tagged
 * by Categories.
 *
 */
@api({
  components: {
    schemas: {
      Category: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 1,
          },
          name: {
            type: 'string',
            example: 'Electronics',
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            example: 'Internal server error',
          },
        },
      },
    },
  },
  paths: {},
})
export class CategoriesController {
    constructor(
            @repository(CategoryRepository)
                public repository : CategoryRepository,
    ) {} 
  /**
   *
   *
   * @returns A list of categories
   */
  @operation('get', '/api/v1/categories', {
  summary: 'Get all categories',
  operationId: 'getCategories',
  tags: [
    'Categories',
  ],
  responses: {
    '200': {
      description: 'A list of categories',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Category',
            },
          },
        },
      },
    },
    '500': {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              error: {
                type: 'string',
                example: 'Internal server error',
              },
            },
          },
        },
      },
    },
  },
})
  async getCategories(): Promise<Category[]> {
     return this.repository.find();
  }
}


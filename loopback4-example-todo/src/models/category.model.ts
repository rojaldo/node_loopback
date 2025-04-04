import {Entity, model, property} from '@loopback/repository';

/**
 * The model class is generated from OpenAPI schema - Category
 * Category
 */
@model({name: 'Category'})
export class Category extends Entity{
  constructor(data?: Partial<Category>) {
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
  })
  id?: number;

  /**
   *
   */
  @property({jsonSchema: {
  type: 'string',
}})
  name?: string;

}

export interface CategoryRelations {
  // describe navigational properties here
}

export type CategoryWithRelations = Category & CategoryRelations;



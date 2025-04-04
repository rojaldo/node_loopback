import { Entity } from '@loopback/repository';
/**
 * The model class is generated from OpenAPI schema - Category
 * Category
 */
export declare class Category extends Entity {
    constructor(data?: Partial<Category>);
    /**
     *
     */
    id?: number;
    /**
     *
     */
    name?: string;
}
export interface CategoryRelations {
}
export type CategoryWithRelations = Category & CategoryRelations;

import { Category } from '../models/category.model';
import { CategoryRepository } from '../repositories';
/**
 * The controller class is generated from OpenAPI spec with operations tagged
 * by Categories.
 *
 */
export declare class CategoriesController {
    repository: CategoryRepository;
    constructor(repository: CategoryRepository);
    /**
     *
     *
     * @returns A list of categories
     */
    getCategories(): Promise<Category[]>;
}

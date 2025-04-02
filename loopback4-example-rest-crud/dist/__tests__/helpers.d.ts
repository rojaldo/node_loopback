import { EntityCrudRepository } from '@loopback/repository';
import { Todo } from '../models';
/**
 * Generate a complete Todo object for use with tests.
 * @param todo - A partial (or complete) Todo object.
 */
export declare function givenTodo(todo?: Partial<Todo>): Todo;
export type TodoRepository = EntityCrudRepository<Todo, typeof Todo.prototype.id>;

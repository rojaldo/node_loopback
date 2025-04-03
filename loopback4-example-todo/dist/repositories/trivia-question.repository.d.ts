import { DefaultCrudRepository } from '@loopback/repository';
import { DbDataSource } from '../datasources';
import { TriviaQuestion, TriviaQuestionRelations } from '../models';
export declare class TriviaQuestionRepository extends DefaultCrudRepository<TriviaQuestion, typeof TriviaQuestion.prototype.id, TriviaQuestionRelations> {
    constructor(dataSource: DbDataSource);
}

import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {TriviaQuestion, TriviaQuestionRelations} from '../models';

export class TriviaQuestionRepository extends DefaultCrudRepository<
  TriviaQuestion,
  typeof TriviaQuestion.prototype.id,
  TriviaQuestionRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(TriviaQuestion, dataSource);
  }
}

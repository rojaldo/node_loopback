// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/example-todo
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Filter} from '@loopback/repository';
import {
  createStubInstance,
  expect,
  sinon,
  StubbedInstanceWithSinonAccessor,
} from '@loopback/testlab';
import {TodoController} from '../../../controllers';
import {Todo} from '../../../models/index';
import {TodoRepository} from '../../../repositories';
import {Geocoder} from '../../../services';
import {aLocation, givenTodo} from '../../helpers';
import exp from 'constants';

xdescribe('TodoController', () => {
  let todoRepo: StubbedInstanceWithSinonAccessor<TodoRepository>;
  let geoService: Geocoder;

  let geocode: sinon.SinonStub;

  /*
  =============================================================================
  TEST VARIABLES
  Combining top-level objects with our resetRepositories method means we don't
  need to duplicate several variable assignments (and generation statements)
  in all of our test logic.

  NOTE: If you wanted to parallelize your test runs, you should avoid this
  pattern since each of these tests is sharing references.
  =============================================================================
  */
  let controller: TodoController;
  let aTodo: Todo;
  let aTodoWithId: Todo;
  let aChangedTodo: Todo;
  let aListOfTodos: Todo[];

  beforeEach(resetRepositories);

  xdescribe('createTodo', () => {
    it('creates a Todo', async () => {
      const create = todoRepo.stubs.create;
      create.resolves(aTodoWithId);
      const result = await controller.create(aTodo);
      expect(result).to.eql(aTodoWithId);
      sinon.assert.calledWith(create, aTodo);
    });

    it('resolves remindAtAddress to a geocode', async () => {
      const create = todoRepo.stubs.create;
      geocode.resolves([aLocation.geopoint]);

      const input = givenTodo({remindAtAddress: aLocation.address});

      const expected = new Todo(input);
      Object.assign(expected, {
        remindAtAddress: aLocation.address,
        remindAtGeo: aLocation.geostring,
      });
      create.resolves(expected);

      const result = await controller.create(input);

      expect(result).to.eql(expected);
      sinon.assert.calledWith(create, input);
      sinon.assert.calledWith(geocode, input.remindAtAddress);
    });
  });

  xdescribe('findTodoById', () => {
    it('returns a todo if it exists', async () => {
      const findById = todoRepo.stubs.findById;
      findById.resolves(aTodoWithId);
      expect(await controller.findById(aTodoWithId.id as number)).to.eql(
        aTodoWithId,
      );
      sinon.assert.calledWith(findById, aTodoWithId.id);
    });
  });

  xdescribe('findTodos', () => {
    it('returns multiple todos if they exist', async () => {
      const find = todoRepo.stubs.find;
      find.resolves(aListOfTodos);
      expect(await controller.find()).to.eql(aListOfTodos);
      sinon.assert.called(find);
    });

    it('returns empty list if no todos exist', async () => {
      const find = todoRepo.stubs.find;
      const expected: Todo[] = [];
      find.resolves(expected);
      expect(await controller.find()).to.eql(expected);
      sinon.assert.called(find);
    });

    it('uses the provided filter', async () => {
      const find = todoRepo.stubs.find;
      const filter: Filter<Todo> = {where: {isComplete: false}};

      find.resolves(aListOfTodos);
      await controller.find(filter);
      sinon.assert.calledWith(find, filter);
    });
  });

  xdescribe('replaceTodo', () => {
    xit('successfully replaces existing items', async () => {
      const replaceById = todoRepo.stubs.replaceById;
      replaceById.resolves();
      await controller.replaceById(aTodoWithId.id as number, aChangedTodo);
      sinon.assert.calledWith(replaceById, aTodoWithId.id, aChangedTodo);
    });
  });

  xdescribe('updateTodo', () => {
    it('successfully updates existing items', async () => {
      const updateById = todoRepo.stubs.updateById;
      updateById.resolves();
      await controller.updateById(aTodoWithId.id as number, aChangedTodo);
      sinon.assert.calledWith(updateById, aTodoWithId.id, aChangedTodo);
    });
  });

  xdescribe('deleteTodo', () => {
    it('successfully deletes existing items', async () => {
      const deleteById = todoRepo.stubs.deleteById;
      deleteById.resolves();
      await controller.deleteById(aTodoWithId.id as number);
      sinon.assert.calledWith(deleteById, aTodoWithId.id);
    });
  });

  function resetRepositories() {
    todoRepo = createStubInstance(TodoRepository);
    aTodo = givenTodo();
    aTodoWithId = givenTodo({
      id: 1,
    });
    aListOfTodos = [
      aTodoWithId,
      givenTodo({
        id: 2,
        title: 'so many things to do',
      }),
    ] as Todo[];
    aChangedTodo = givenTodo({
      id: aTodoWithId.id,
      title: 'Do some important things',
    });

    geoService = {geocode: sinon.stub()};
    geocode = geoService.geocode as sinon.SinonStub;

    controller = new TodoController(todoRepo, geoService);
  }
});

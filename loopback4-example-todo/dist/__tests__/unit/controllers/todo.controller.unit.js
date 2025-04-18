"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/example-todo
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const controllers_1 = require("../../../controllers");
const index_1 = require("../../../models/index");
const repositories_1 = require("../../../repositories");
const helpers_1 = require("../../helpers");
xdescribe('TodoController', () => {
    let todoRepo;
    let geoService;
    let geocode;
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
    let controller;
    let aTodo;
    let aTodoWithId;
    let aChangedTodo;
    let aListOfTodos;
    beforeEach(resetRepositories);
    xdescribe('createTodo', () => {
        it('creates a Todo', async () => {
            const create = todoRepo.stubs.create;
            create.resolves(aTodoWithId);
            const result = await controller.create(aTodo);
            (0, testlab_1.expect)(result).to.eql(aTodoWithId);
            testlab_1.sinon.assert.calledWith(create, aTodo);
        });
        it('resolves remindAtAddress to a geocode', async () => {
            const create = todoRepo.stubs.create;
            geocode.resolves([helpers_1.aLocation.geopoint]);
            const input = (0, helpers_1.givenTodo)({ remindAtAddress: helpers_1.aLocation.address });
            const expected = new index_1.Todo(input);
            Object.assign(expected, {
                remindAtAddress: helpers_1.aLocation.address,
                remindAtGeo: helpers_1.aLocation.geostring,
            });
            create.resolves(expected);
            const result = await controller.create(input);
            (0, testlab_1.expect)(result).to.eql(expected);
            testlab_1.sinon.assert.calledWith(create, input);
            testlab_1.sinon.assert.calledWith(geocode, input.remindAtAddress);
        });
    });
    xdescribe('findTodoById', () => {
        it('returns a todo if it exists', async () => {
            const findById = todoRepo.stubs.findById;
            findById.resolves(aTodoWithId);
            (0, testlab_1.expect)(await controller.findById(aTodoWithId.id)).to.eql(aTodoWithId);
            testlab_1.sinon.assert.calledWith(findById, aTodoWithId.id);
        });
    });
    xdescribe('findTodos', () => {
        it('returns multiple todos if they exist', async () => {
            const find = todoRepo.stubs.find;
            find.resolves(aListOfTodos);
            (0, testlab_1.expect)(await controller.find()).to.eql(aListOfTodos);
            testlab_1.sinon.assert.called(find);
        });
        it('returns empty list if no todos exist', async () => {
            const find = todoRepo.stubs.find;
            const expected = [];
            find.resolves(expected);
            (0, testlab_1.expect)(await controller.find()).to.eql(expected);
            testlab_1.sinon.assert.called(find);
        });
        it('uses the provided filter', async () => {
            const find = todoRepo.stubs.find;
            const filter = { where: { isComplete: false } };
            find.resolves(aListOfTodos);
            await controller.find(filter);
            testlab_1.sinon.assert.calledWith(find, filter);
        });
    });
    xdescribe('replaceTodo', () => {
        xit('successfully replaces existing items', async () => {
            const replaceById = todoRepo.stubs.replaceById;
            replaceById.resolves();
            await controller.replaceById(aTodoWithId.id, aChangedTodo);
            testlab_1.sinon.assert.calledWith(replaceById, aTodoWithId.id, aChangedTodo);
        });
    });
    xdescribe('updateTodo', () => {
        it('successfully updates existing items', async () => {
            const updateById = todoRepo.stubs.updateById;
            updateById.resolves();
            await controller.updateById(aTodoWithId.id, aChangedTodo);
            testlab_1.sinon.assert.calledWith(updateById, aTodoWithId.id, aChangedTodo);
        });
    });
    xdescribe('deleteTodo', () => {
        it('successfully deletes existing items', async () => {
            const deleteById = todoRepo.stubs.deleteById;
            deleteById.resolves();
            await controller.deleteById(aTodoWithId.id);
            testlab_1.sinon.assert.calledWith(deleteById, aTodoWithId.id);
        });
    });
    function resetRepositories() {
        todoRepo = (0, testlab_1.createStubInstance)(repositories_1.TodoRepository);
        aTodo = (0, helpers_1.givenTodo)();
        aTodoWithId = (0, helpers_1.givenTodo)({
            id: 1,
        });
        aListOfTodos = [
            aTodoWithId,
            (0, helpers_1.givenTodo)({
                id: 2,
                title: 'so many things to do',
            }),
        ];
        aChangedTodo = (0, helpers_1.givenTodo)({
            id: aTodoWithId.id,
            title: 'Do some important things',
        });
        geoService = { geocode: testlab_1.sinon.stub() };
        geocode = geoService.geocode;
        controller = new controllers_1.TodoController(todoRepo, geoService);
    }
});
//# sourceMappingURL=todo.controller.unit.js.map
"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/example-todo
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const testlab_1 = require("@loopback/testlab");
const application_1 = require("../../application");
const repositories_1 = require("../../repositories/");
const helpers_1 = require("../helpers");
xdescribe('TodoApplication', () => {
    let app;
    let client;
    let todoRepo;
    let cachingProxy;
    before(async () => (cachingProxy = await (0, helpers_1.givenCachingProxy)()));
    after(() => cachingProxy.stop());
    before(givenRunningApplicationWithCustomConfiguration);
    after(() => app.stop());
    let available = true;
    before(async function () {
        this.timeout(30 * 1000);
        const service = await app.get('services.Geocoder');
        available = await (0, helpers_1.isGeoCoderServiceAvailable)(service);
    });
    before(givenTodoRepository);
    before(() => {
        client = (0, testlab_1.createRestAppClient)(app);
    });
    beforeEach(async () => {
        await todoRepo.deleteAll();
    });
    it('creates a todo', async function () {
        // Set timeout to 30 seconds as `post /todos` triggers geocode look up
        // over the internet and it takes more than 2 seconds
        this.timeout(30000);
        const todo = (0, helpers_1.givenTodo)();
        const response = await client.post('/todos').send(todo).expect(200);
        (0, testlab_1.expect)(response.body).to.containDeep(todo);
        const result = await todoRepo.findById(response.body.id);
        (0, testlab_1.expect)(result).to.containDeep(todo);
    });
    it('creates a todo with arbitrary property', async function () {
        const todo = (0, helpers_1.givenTodo)({ tag: { random: 'random' } });
        const response = await client.post('/todos').send(todo).expect(200);
        (0, testlab_1.expect)(response.body).to.containDeep(todo);
        const result = await todoRepo.findById(response.body.id);
        (0, testlab_1.expect)(result).to.containDeep(todo);
    });
    it('rejects requests to create a todo with no title', async () => {
        const todo = (0, helpers_1.givenTodo)();
        delete todo.title;
        await client.post('/todos').send(todo).expect(422);
    });
    it('rejects requests with input that contains excluded properties', async () => {
        const todo = (0, helpers_1.givenTodo)();
        todo.id = 1;
        await client.post('/todos').send(todo).expect(422);
    });
    it('creates an address-based reminder', async function () {
        if (!available)
            return this.skip();
        // Increase the timeout to accommodate slow network connections
        this.timeout(30000);
        const todo = (0, helpers_1.givenTodo)({ remindAtAddress: helpers_1.aLocation.address });
        const response = await client.post('/todos').send(todo).expect(200);
        todo.remindAtGeo = helpers_1.aLocation.geostring;
        (0, testlab_1.expect)(response.body).to.containEql(todo);
        const result = await todoRepo.findById(response.body.id);
        (0, testlab_1.expect)(result).to.containEql(todo);
    });
    it('returns 400 if it cannot find an address', async function () {
        if (!available)
            return this.skip();
        // Increase the timeout to accommodate slow network connections
        this.timeout(30000);
        const todo = (0, helpers_1.givenTodo)({ remindAtAddress: 'this address does not exist' });
        const response = await client.post('/todos').send(todo).expect(400);
        (0, testlab_1.expect)(response.body.error.message).to.eql('Address not found: this address does not exist');
    });
    context('when dealing with a single persisted todo', () => {
        let persistedTodo;
        beforeEach(async () => {
            persistedTodo = await givenTodoInstance();
        });
        it('gets a todo by ID', () => {
            return client
                .get(`/todos/${persistedTodo.id}`)
                .send()
                .expect(200, (0, testlab_1.toJSON)(persistedTodo));
        });
        it('returns 404 when getting a todo that does not exist', () => {
            return client.get('/todos/99999').expect(404);
        });
        it('replaces the todo by ID', async () => {
            const updatedTodo = (0, helpers_1.givenTodo)({
                title: 'DO SOMETHING AWESOME',
                desc: 'It has to be something ridiculous',
                isComplete: true,
            });
            await client
                .put(`/todos/${persistedTodo.id}`)
                .send(updatedTodo)
                .expect(204);
            const result = await todoRepo.findById(persistedTodo.id);
            (0, testlab_1.expect)(result).to.containEql(updatedTodo);
        });
        it('returns 404 when replacing a todo that does not exist', () => {
            return client.put('/todos/99999').send((0, helpers_1.givenTodo)()).expect(404);
        });
        it('updates the todo by ID ', async () => {
            const updatedTodo = (0, helpers_1.givenTodo)({
                isComplete: true,
            });
            await client
                .patch(`/todos/${persistedTodo.id}`)
                .send(updatedTodo)
                .expect(204);
            const result = await todoRepo.findById(persistedTodo.id);
            (0, testlab_1.expect)(result).to.containEql(updatedTodo);
        });
        it('returns 404 when updating a todo that does not exist', () => {
            return client
                .patch('/todos/99999')
                .send((0, helpers_1.givenTodo)({ isComplete: true }))
                .expect(404);
        });
        it('deletes the todo', async () => {
            await client.del(`/todos/${persistedTodo.id}`).send().expect(204);
            await (0, testlab_1.expect)(todoRepo.findById(persistedTodo.id)).to.be.rejectedWith(repository_1.EntityNotFoundError);
        });
        it('returns 404 when deleting a todo that does not exist', async () => {
            await client.del(`/todos/99999`).expect(404);
        });
        it('rejects request with invalid keys - constructor.prototype', async () => {
            var _a;
            const res = await client
                .get('/todos?filter={"offset":0,"limit":100,"skip":0,' +
                '"where":{"constructor.prototype":{"toString":"def"}},' +
                '"fields":{"title":true,"id":true}}')
                .expect(400);
            (0, testlab_1.expect)((_a = res.body) === null || _a === void 0 ? void 0 : _a.error).to.containEql({
                statusCode: 400,
                name: 'BadRequestError',
                code: 'INVALID_PARAMETER_VALUE',
                details: {
                    syntaxError: 'JSON string cannot contain "constructor.prototype" key.',
                },
            });
        });
        it('rejects request with invalid keys - __proto__', async () => {
            var _a;
            const res = await client
                .get('/todos?filter={"offset":0,"limit":100,"skip":0,' +
                '"where":{"__proto__":{"toString":"def"}},' +
                '"fields":{"title":true,"id":true}}')
                .expect(400);
            (0, testlab_1.expect)((_a = res.body) === null || _a === void 0 ? void 0 : _a.error).to.containEql({
                statusCode: 400,
                name: 'BadRequestError',
                code: 'INVALID_PARAMETER_VALUE',
                details: {
                    syntaxError: 'JSON string cannot contain "__proto__" key.',
                },
            });
        });
        it('rejects request with prohibited keys - badKey', async () => {
            var _a;
            const res = await client
                .get('/todos?filter={"offset":0,"limit":100,"skip":0,' +
                '"where":{"badKey":{"toString":"def"}},' +
                '"fields":{"title":true,"id":true}}')
                .expect(400);
            (0, testlab_1.expect)((_a = res.body) === null || _a === void 0 ? void 0 : _a.error).to.containEql({
                statusCode: 400,
                name: 'BadRequestError',
                code: 'INVALID_PARAMETER_VALUE',
                details: {
                    syntaxError: 'JSON string cannot contain "badKey" key.',
                },
            });
        });
    });
    context('allows logging to be reconfigured', () => {
        it('logs http requests', async () => {
            const logs = [];
            const logToArray = (str) => {
                logs.push(str);
            };
            app.configure('middleware.morgan').to({
                stream: {
                    write: logToArray,
                },
            });
            await client.get('/todos');
            (0, testlab_1.expect)(logs.length).to.eql(1);
            (0, testlab_1.expect)(logs[0]).to.match(/"GET \/todos HTTP\/1\.1" 200 - "-"/);
        });
    });
    it('queries todos with a filter', async () => {
        await givenTodoInstance({ title: 'wake up', isComplete: true });
        const todoInProgress = await givenTodoInstance({
            title: 'go to sleep',
            isComplete: false,
        });
        await client
            .get('/todos')
            .query({ filter: { where: { isComplete: false } } })
            .expect(200, [(0, testlab_1.toJSON)(todoInProgress)]);
    });
    it('exploded filter conditions work', async () => {
        await givenTodoInstance({ title: 'wake up', isComplete: true });
        await givenTodoInstance({
            title: 'go to sleep',
            isComplete: false,
        });
        const response = await client.get('/todos').query('filter[limit]=2');
        (0, testlab_1.expect)(response.body).to.have.length(2);
    });
    it('queries todos with string-based order filter', async () => {
        const todoInProgress = await givenTodoInstance({
            title: 'go to sleep',
            isComplete: false,
        });
        const todoCompleted = await givenTodoInstance({
            title: 'wake up',
            isComplete: true,
        });
        const todoCompleted2 = await givenTodoInstance({
            title: 'go to work',
            isComplete: true,
        });
        await client
            .get('/todos')
            .query({ filter: { order: 'title DESC' } })
            .expect(200, (0, testlab_1.toJSON)([todoCompleted, todoCompleted2, todoInProgress]));
    });
    it('queries todos with array-based order filter', async () => {
        const todoInProgress = await givenTodoInstance({
            title: 'go to sleep',
            isComplete: false,
        });
        const todoCompleted = await givenTodoInstance({
            title: 'wake up',
            isComplete: true,
        });
        const todoCompleted2 = await givenTodoInstance({
            title: 'go to work',
            isComplete: true,
        });
        await client
            .get('/todos')
            .query({ filter: { order: ['title DESC'] } })
            .expect(200, (0, testlab_1.toJSON)([todoCompleted, todoCompleted2, todoInProgress]));
    });
    it('queries todos with exploded string-based order filter', async () => {
        const todoInProgress = await givenTodoInstance({
            title: 'go to sleep',
            isComplete: false,
        });
        const todoCompleted = await givenTodoInstance({
            title: 'wake up',
            isComplete: true,
        });
        const todoCompleted2 = await givenTodoInstance({
            title: 'go to work',
            isComplete: true,
        });
        await client
            .get('/todos')
            .query('filter[order]=title%20DESC')
            .expect(200, [
            (0, testlab_1.toJSON)(todoCompleted),
            (0, testlab_1.toJSON)(todoCompleted2),
            (0, testlab_1.toJSON)(todoInProgress),
        ]);
    });
    it('queries todos with exploded array-based fields filter', async () => {
        await givenTodoInstance({
            title: 'go to sleep',
            isComplete: false,
        });
        await client
            .get('/todos')
            .query('filter[fields][0]=title')
            .expect(200, (0, testlab_1.toJSON)([{ title: 'go to sleep' }]));
    });
    it('queries todos with exploded array-based order filter', async () => {
        const todoInProgress = await givenTodoInstance({
            title: 'go to sleep',
            isComplete: false,
        });
        const todoCompleted = await givenTodoInstance({
            title: 'wake up',
            isComplete: true,
        });
        const todoCompleted2 = await givenTodoInstance({
            title: 'go to work',
            isComplete: true,
        });
        await client
            .get('/todos')
            .query('filter[order][0]=title+DESC')
            .expect(200, (0, testlab_1.toJSON)([todoCompleted, todoCompleted2, todoInProgress]));
    });
    /*
     ============================================================================
     TEST HELPERS
     These functions help simplify setup of your test fixtures so that your tests
     can:
     - operate on a "clean" environment each time (a fresh in-memory database)
     - avoid polluting the test with large quantities of setup logic to keep
     them clear and easy to read
     - keep them DRY (who wants to write the same stuff over and over?)
     ============================================================================
     */
    async function givenRunningApplicationWithCustomConfiguration() {
        app = new application_1.TodoListApplication({
            rest: (0, testlab_1.givenHttpServerConfig)(),
        });
        app.bind(rest_1.RestBindings.REQUEST_BODY_PARSER_OPTIONS).to({
            validation: {
                prohibitedKeys: ['badKey'],
            },
        });
        await app.boot();
        /**
         * Override default config for DataSource for testing so we don't write
         * test data to file when using the memory connector.
         */
        app.bind('datasources.config.db').to({
            name: 'db',
            connector: 'memory',
        });
        // Override Geocoder datasource to use a caching proxy to speed up tests.
        app
            .bind('datasources.config.geocoder')
            .to((0, helpers_1.getProxiedGeoCoderConfig)(cachingProxy));
        // Start Application
        await app.start();
    }
    async function givenTodoRepository() {
        todoRepo = await app.getRepository(repositories_1.TodoRepository);
    }
    async function givenTodoInstance(todo) {
        return todoRepo.create((0, helpers_1.givenTodo)(todo));
    }
});
//# sourceMappingURL=todo.acceptance.js.map
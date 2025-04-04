"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/example-todo
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const rest_1 = require("@loopback/rest");
const testlab_1 = require("@loopback/testlab");
const application_1 = require("../../application");
const repositories_1 = require("../../repositories");
const helpers_1 = require("../helpers");
describe('CalculatorApplication', () => {
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
    it('sum 2 numbers', async function () {
        // Set timeout to 30 seconds as `get /calculator` triggers geocode look u
        this.timeout(30000);
        //send num1 and num2 as query params
        const response = await client.get('/calculator').query({
            num1: 1,
            num2: 2,
            op: 'add',
        }).expect(200);
        (0, testlab_1.expect)(response.body.response).to.equal(3);
    });
    it('sum 0.1+0.2', async function () {
        // Set timeout to 30 seconds as `get /calculator` triggers geocode look u
        this.timeout(30000);
        //send num1 and num2 as query params
        const response = await client.get('/calculator').query({
            num1: 0.1,
            num2: 0.2,
            op: 'add',
        }).expect(200);
        (0, testlab_1.expect)(response.body.response).to.equal(0.3);
    });
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
//# sourceMappingURL=calculator.acceptance.js.map
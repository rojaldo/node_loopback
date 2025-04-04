// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/example-todo
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {EntityNotFoundError} from '@loopback/repository';
import {Request, Response, RestBindings} from '@loopback/rest';
import {
  Client,
  createRestAppClient,
  expect,
  givenHttpServerConfig,
  toJSON,
} from '@loopback/testlab';
import morgan from 'morgan';
import {TodoListApplication} from '../../application';
import {Todo} from '../../models';
import {TodoRepository} from '../../repositories';
import {Geocoder} from '../../services';
import {
  aLocation,
  getProxiedGeoCoderConfig,
  givenCachingProxy,
  givenTodo,
  HttpCachingProxy,
  isGeoCoderServiceAvailable,
} from '../helpers';
import { log } from 'console';

describe('CalculatorApplication', () => {
  let app: TodoListApplication;
  let client: Client;
  let todoRepo: TodoRepository;

  let cachingProxy: HttpCachingProxy;
  before(async () => (cachingProxy = await givenCachingProxy()));
  after(() => cachingProxy.stop());

  before(givenRunningApplicationWithCustomConfiguration);
  after(() => app.stop());

  let available = true;

  before(async function (this: Mocha.Context) {
    this.timeout(30 * 1000);
    const service = await app.get<Geocoder>('services.Geocoder');
    available = await isGeoCoderServiceAvailable(service);
  });

  before(givenTodoRepository);
  before(() => {
    client = createRestAppClient(app);
  });

  beforeEach(async () => {
    await todoRepo.deleteAll();
  });

  it('sum 2 numbers', async function (this: Mocha.Context) {
    // Set timeout to 30 seconds as `get /calculator` triggers geocode look u
    this.timeout(30000);
    //send num1 and num2 as query params
    const response = await client.get('/calculator').query({
      num1: 1,
      num2: 2,
      op: 'add',
    }).expect(200);
    expect(response.body.response).to.equal(3);
  });

  it('sum 0.1+0.2', async function (this: Mocha.Context) {
    // Set timeout to 30 seconds as `get /calculator` triggers geocode look u
    this.timeout(30000);

    //send num1 and num2 as query params
    const response = await client.get('/calculator').query({
      num1: 0.1,
      num2: 0.2,
      op: 'add',
    }).expect(200);
    expect(response.body.response).to.equal(0.3);
  });


  async function givenRunningApplicationWithCustomConfiguration() {
    app = new TodoListApplication({
      rest: givenHttpServerConfig(),
    });

    app.bind(RestBindings.REQUEST_BODY_PARSER_OPTIONS).to({
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
      .to(getProxiedGeoCoderConfig(cachingProxy));

    // Start Application
    await app.start();
  }

  async function givenTodoRepository() {
    todoRepo = await app.getRepository(TodoRepository);
  }

  async function givenTodoInstance(todo?: Partial<Todo>) {
    return todoRepo.create(givenTodo(todo));
  }
});

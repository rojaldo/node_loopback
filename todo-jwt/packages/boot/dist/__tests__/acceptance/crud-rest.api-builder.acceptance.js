"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/boot
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const rest_crud_1 = require("@loopback/rest-crud");
const testlab_1 = require("@loopback/testlab");
const path_1 = require("path");
const __1 = require("../..");
const product_repository_1 = require("../fixtures/product.repository");
describe('CRUD rest builder acceptance tests', () => {
    let app;
    const sandbox = new testlab_1.TestSandbox((0, path_1.resolve)(__dirname, '../../.sandbox'));
    beforeEach('reset sandbox', () => sandbox.reset());
    beforeEach(givenAppWithDataSource);
    afterEach(stopApp);
    it('binds the controller and repository to the application', async () => {
        await sandbox.copyFile((0, path_1.resolve)(__dirname, '../fixtures/product.model.js'), 'models/product.model.js');
        // when creating the config file in a real app, make sure to use
        // module.exports = <ModelCrudRestApiConfig>{...}
        // it's not used here because this is a .js file
        await sandbox.writeTextFile('model-endpoints/product.rest-config.js', `
const {Product} = require('../models/product.model');
module.exports = {
  model: Product,
  pattern: 'CrudRest',
  dataSource: 'db',
  basePath: '/products',
};
      `);
        // Boot & start the application
        await app.boot();
        await app.start();
        (0, testlab_1.expect)(app.getBinding('repositories.ProductRepository').key).to.eql('repositories.ProductRepository');
        (0, testlab_1.expect)(app.getBinding('controllers.ProductController').key).to.eql('controllers.ProductController');
    });
    it('uses bound repository class if it exists', async () => {
        await sandbox.copyFile((0, path_1.resolve)(__dirname, '../fixtures/product.model.js'), 'models/product.model.js');
        await sandbox.writeTextFile('model-endpoints/product.rest-config.js', `
const {Product} = require('../models/product.model');
module.exports = {
  model: Product,
  pattern: 'CrudRest',
  dataSource: 'db',
  basePath: '/products',
};
      `);
        app.repository(product_repository_1.ProductRepository);
        const bindingName = 'repositories.ProductRepository';
        const binding = app.getBinding(bindingName);
        (0, testlab_1.expect)(binding.valueConstructor).to.eql(product_repository_1.ProductRepository);
        // Boot & start the application
        await app.boot();
        await app.start();
        // Make sure it is still equal to the defined ProductRepository after
        // booting
        (0, testlab_1.expect)(app.getBinding(bindingName).valueConstructor).to.eql(product_repository_1.ProductRepository);
        (0, testlab_1.expect)(app.getBinding('controllers.ProductController').key).to.eql('controllers.ProductController');
    });
    it('throws if there is no base path in the config', async () => {
        await sandbox.copyFile((0, path_1.resolve)(__dirname, '../fixtures/product.model.js'), 'models/product.model.js');
        await sandbox.writeTextFile('model-endpoints/product.rest-config.js', `
const {Product} = require('../models/product.model');
module.exports = {
  model: Product,
  pattern: 'CrudRest',
  dataSource: 'db',
  // basePath not specified
};
      `);
        // Boot the application
        await (0, testlab_1.expect)(app.boot()).to.be.rejectedWith(/Missing required field "basePath" in configuration for model Product./);
    });
    it('throws if a Model is used instead of an Entity', async () => {
        await sandbox.copyFile((0, path_1.resolve)(__dirname, '../fixtures/no-entity.model.js'), 'models/no-entity.model.js');
        await sandbox.writeTextFile('model-endpoints/no-entity.rest-config.js', `
const {NoEntity} = require('../models/no-entity.model');
module.exports = {
  // this model extends Model, not Entity
  model: NoEntity,
  pattern: 'CrudRest',
  dataSource: 'db',
  basePath: '/no-entities',
};
      `);
        // Boot the application
        await (0, testlab_1.expect)(app.boot()).to.be.rejectedWith(/CrudRestController requires a model that extends 'Entity'./);
    });
    class BooterApp extends (0, __1.BootMixin)((0, repository_1.RepositoryMixin)(rest_1.RestApplication)) {
        constructor(options) {
            super(options);
            this.projectRoot = sandbox.path;
            this.booters(__1.ModelApiBooter);
            this.component(rest_crud_1.CrudRestComponent);
        }
    }
    async function givenAppWithDataSource() {
        app = new BooterApp({
            rest: (0, testlab_1.givenHttpServerConfig)(),
        });
        app.dataSource(new repository_1.juggler.DataSource({ connector: 'memory' }), 'db');
    }
    async function stopApp() {
        if ((app === null || app === void 0 ? void 0 : app.state) === 'started')
            await (app === null || app === void 0 ? void 0 : app.stop());
    }
});
//# sourceMappingURL=crud-rest.api-builder.acceptance.js.map
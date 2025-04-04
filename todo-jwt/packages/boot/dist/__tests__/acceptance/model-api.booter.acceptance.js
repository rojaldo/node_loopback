"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/boot
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const testlab_1 = require("@loopback/testlab");
const path_1 = require("path");
const __1 = require("../..");
const product_model_1 = require("../fixtures/product.model");
const stub_model_api_builder_1 = require("../fixtures/stub-model-api-builder");
describe('model API booter acceptance tests', () => {
    let app;
    const sandbox = new testlab_1.TestSandbox((0, path_1.resolve)(__dirname, '../../.sandbox'));
    beforeEach('reset sandbox', () => sandbox.reset());
    beforeEach(givenAppWithDataSource);
    afterEach(stopApp);
    it('uses the correct model API builder', async () => {
        await sandbox.copyFile((0, path_1.resolve)(__dirname, '../fixtures/product.model.js'), 'models/product.model.js');
        await sandbox.writeTextFile('model-endpoints/product.rest-config.js', `
const {Product} = require('../models/product.model');
module.exports = {
  model: Product,
  pattern: 'stub',
  dataSource: 'db',
  basePath: '/products',
};
      `);
        // Boot & start the application
        await app.boot();
        await app.start();
        (0, testlab_1.expect)((0, testlab_1.toJSON)(stub_model_api_builder_1.buildCalls)).to.deepEqual((0, testlab_1.toJSON)([
            {
                application: app,
                modelClass: product_model_1.Product,
                config: {
                    basePath: '/products',
                    dataSource: 'db',
                    pattern: 'stub',
                },
            },
        ]));
    });
    it('uses the API builder registered first if there is a duplicate pattern name', async () => {
        await sandbox.copyFile((0, path_1.resolve)(__dirname, '../fixtures/product.model.js'), 'models/product.model.js');
        await sandbox.writeTextFile('model-endpoints/product.rest-config.js', `
const {Product} = require('../models/product.model');
module.exports = {
  model: Product,
  pattern: 'same',
  dataSource: 'db',
  basePath: '/products',
};
      `);
        // Boot & start the application
        await app.boot();
        await app.start();
        // registered first
        (0, testlab_1.expect)((0, testlab_1.toJSON)(stub_model_api_builder_1.samePatternBuildCalls)).to.eql([(0, testlab_1.toJSON)(app)]);
        (0, testlab_1.expect)(stub_model_api_builder_1.similarPatternBuildCalls).to.be.empty();
    });
    it('throws if there are no patterns matching', async () => {
        await sandbox.copyFile((0, path_1.resolve)(__dirname, '../fixtures/product.model.js'), 'models/product.model.js');
        await sandbox.writeTextFile('model-endpoints/product.rest-config.js', `
const {Product} = require('../models/product.model');
module.exports = {
  model: Product,
  pattern: 'doesntExist',
  dataSource: 'db',
  basePath: '/products',
};
      `);
        await (0, testlab_1.expect)(app.boot()).to.be.rejectedWith(/Unsupported API pattern "doesntExist"/);
    });
    it('throws if the model class is invalid', async () => {
        await sandbox.copyFile((0, path_1.resolve)(__dirname, '../fixtures/product.model.js'), 'models/product.model.js');
        await sandbox.writeTextFile('model-endpoints/product.rest-config.js', `
const Product = 'product'
module.exports = {
  model: Product,
  pattern: 'stub',
  dataSource: 'db',
  basePath: '/products',
};
      `);
        await (0, testlab_1.expect)(app.boot()).to.be.rejectedWith(/Invalid "model" field\. Expected a Model class, found product/);
    });
    class BooterApp extends (0, __1.BootMixin)((0, repository_1.RepositoryMixin)(rest_1.RestApplication)) {
        constructor(options) {
            super(options);
            this.projectRoot = sandbox.path;
            this.booters(__1.ModelApiBooter);
            this.component(stub_model_api_builder_1.StubModelApiBuilderComponent);
            this.component(stub_model_api_builder_1.SamePatternModelApiBuilderComponent);
            this.component(stub_model_api_builder_1.SimilarPatternModelApiBuilderComponent);
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
//# sourceMappingURL=model-api.booter.acceptance.js.map
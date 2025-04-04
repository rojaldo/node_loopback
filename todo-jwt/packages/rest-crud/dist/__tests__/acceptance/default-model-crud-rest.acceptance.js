"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/rest-crud
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
// In this test scenario, we create a product with a required & an optional
// property and use the default model settings (strict mode, forceId).
//
// Please don't add any other scenarios to this test file, create a new file
// for each scenario instead.
describe('CrudRestController for a simple Product model', () => {
    let Product = class Product extends repository_1.Entity {
        constructor(data) {
            super(data);
        }
    };
    tslib_1.__decorate([
        (0, repository_1.property)({ id: true }),
        tslib_1.__metadata("design:type", Number)
    ], Product.prototype, "id", void 0);
    tslib_1.__decorate([
        (0, repository_1.property)({ required: true }),
        tslib_1.__metadata("design:type", String)
    ], Product.prototype, "name", void 0);
    tslib_1.__decorate([
        (0, repository_1.property)(),
        tslib_1.__metadata("design:type", String)
    ], Product.prototype, "description", void 0);
    Product = tslib_1.__decorate([
        (0, repository_1.model)(),
        tslib_1.__metadata("design:paramtypes", [Object])
    ], Product);
    let app;
    let repo;
    let client;
    // sample data - call `seedData` to populate these items
    let pen;
    let pencil;
    const PATCH_DATA = { description: 'patched' };
    Object.freeze(PATCH_DATA);
    before(setupTestScenario);
    after(stopTheApp);
    beforeEach(cleanDatabase);
    describe('create', () => {
        it('creates a new Product', async () => {
            const response = await client
                .post('/products')
                .send({ name: 'A pen' })
                // FIXME: POST should return 201
                // See https://github.com/loopbackio/loopback-next/issues/788
                .expect(200);
            const created = response.body;
            (0, testlab_1.expect)(created).to.containEql({ name: 'A pen' });
            (0, testlab_1.expect)(created).to.have.property('id').of.type('number');
            const found = (await repo.find())[0];
            (0, testlab_1.expect)((0, testlab_1.toJSON)(found)).to.deepEqual(created);
        });
        it('rejects request with `id` value', async () => {
            const { body } = await client
                .post('/products')
                .send({ id: 1, name: 'a name' })
                .expect(422);
            (0, testlab_1.expect)(body.error).to.containDeep({
                code: 'VALIDATION_FAILED',
                details: [
                    {
                        path: '',
                        code: 'additionalProperties',
                        message: 'must NOT have additional properties',
                        info: { additionalProperty: 'id' },
                    },
                ],
            });
        });
    });
    describe('find', () => {
        beforeEach(seedData);
        it('returns all products when no filter was provided', async () => {
            const { body } = await client.get('/products').expect(200);
            (0, testlab_1.expect)(body).to.deepEqual((0, testlab_1.toJSON)([pen, pencil]));
        });
        it('supports `where` filter', async () => {
            const { body } = await client
                .get('/products')
                .query({ 'filter[where][name]': pen.name })
                .expect(200);
            (0, testlab_1.expect)(body).to.deepEqual((0, testlab_1.toJSON)([pen /* pencil was omitted */]));
        });
    });
    describe('findById', () => {
        beforeEach(seedData);
        it('returns model with the given id', async () => {
            const { body } = await client.get(`/products/${pen.id}`).expect(200);
            (0, testlab_1.expect)(body).to.deepEqual((0, testlab_1.toJSON)(pen));
        });
        // TODO(bajtos) to fully verify this functionality, we should create
        // a new test suite that will configure a PK with a different name
        // and type, e.g. `pk: string` instead of `id: number`.
        it('uses correct schema for the id parameter', async () => {
            const spec = await app.restServer.getApiSpec();
            const findByIdOp = spec.paths['/products/{id}'].get;
            (0, testlab_1.expect)(findByIdOp).to.containDeep({
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        schema: { type: 'number' },
                    },
                ],
            });
        });
    });
    describe('count', () => {
        beforeEach(seedData);
        it('returns all products when no filter was provided', async () => {
            const { body } = await client.get('/products/count').expect(200);
            (0, testlab_1.expect)(body).to.deepEqual({ count: 2 });
        });
        it('supports `where` query param', async () => {
            const { body } = await client
                .get('/products/count')
                .query({ 'where[name]': pen.name })
                .expect(200);
            (0, testlab_1.expect)(body).to.deepEqual({ count: 1 /* pencil was omitted */ });
        });
    });
    describe('updateAll', () => {
        beforeEach(seedData);
        it('updates all products when no filter was provided', async () => {
            const { body } = await client
                .patch('/products')
                .send(PATCH_DATA)
                .expect(200);
            (0, testlab_1.expect)(body).to.deepEqual({ count: 2 });
            const stored = await repo.find();
            (0, testlab_1.expect)((0, testlab_1.toJSON)(stored)).to.deepEqual([
                { ...(0, testlab_1.toJSON)(pen), ...PATCH_DATA },
                { ...(0, testlab_1.toJSON)(pencil), ...PATCH_DATA },
            ]);
        });
        it('supports `where` query param', async () => {
            const { body } = await client
                .patch('/products')
                .query({ 'where[name]': pen.name })
                .send(PATCH_DATA)
                .expect(200);
            (0, testlab_1.expect)(body).to.deepEqual({ count: 1 });
            const stored = await repo.find();
            (0, testlab_1.expect)((0, testlab_1.toJSON)(stored)).to.deepEqual([
                { ...(0, testlab_1.toJSON)(pen), ...PATCH_DATA },
                { ...(0, testlab_1.toJSON)(pencil) /* pencil was not patched */ },
            ]);
        });
    });
    describe('updateById', () => {
        beforeEach(seedData);
        it('updates model with the given id', async () => {
            await client.patch(`/products/${pen.id}`).send(PATCH_DATA).expect(204);
            const stored = await repo.find();
            (0, testlab_1.expect)((0, testlab_1.toJSON)(stored)).to.deepEqual([
                { ...(0, testlab_1.toJSON)(pen), ...PATCH_DATA },
                { ...(0, testlab_1.toJSON)(pencil) /* pencil was not patched */ },
            ]);
        });
        // TODO(bajtos) to fully verify this functionality, we should create
        // a new test suite that will configure a PK with a different name
        // and type, e.g. `pk: string` instead of `id: number`.
        it('uses correct schema for the id parameter', async () => {
            const spec = await app.restServer.getApiSpec();
            const findByIdOp = spec.paths['/products/{id}'].patch;
            (0, testlab_1.expect)(findByIdOp).to.containDeep({
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        schema: { type: 'number' },
                    },
                ],
            });
        });
    });
    describe('replaceById', () => {
        beforeEach(seedData);
        it('replaces model with the given id', async () => {
            const newData = Object.assign({}, pen.toJSON(), PATCH_DATA);
            await client.put(`/products/${pen.id}`).send(newData).expect(204);
            const stored = await repo.find();
            (0, testlab_1.expect)((0, testlab_1.toJSON)(stored)).to.deepEqual([
                { ...newData },
                { ...(0, testlab_1.toJSON)(pencil) /* pencil was not modified */ },
            ]);
        });
        // TODO(bajtos) to fully verify this functionality, we should create
        // a new test suite that will configure a PK with a different name
        // and type, e.g. `pk: string` instead of `id: number`.
        it('uses correct schema for the id parameter', async () => {
            const spec = await app.restServer.getApiSpec();
            const findByIdOp = spec.paths['/products/{id}']['patch'];
            (0, testlab_1.expect)(findByIdOp).to.containDeep({
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        schema: { type: 'number' },
                    },
                ],
            });
        });
    });
    describe('deleteById', () => {
        beforeEach(seedData);
        it('deletes model with the given id', async () => {
            await client.del(`/products/${pen.id}`).expect(204);
            const stored = await repo.find();
            (0, testlab_1.expect)((0, testlab_1.toJSON)(stored)).to.deepEqual((0, testlab_1.toJSON)([
                /* pen was deleted */
                pencil,
            ]));
        });
        // TODO(bajtos) to fully verify this functionality, we should create
        // a new test suite that will configure a PK with a different name
        // and type, e.g. `pk: string` instead of `id: number`.
        it('uses correct schema for the id parameter', async () => {
            const spec = await app.restServer.getApiSpec();
            const findByIdOp = spec.paths['/products/{id}']['delete'];
            (0, testlab_1.expect)(findByIdOp).to.containDeep({
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        schema: { type: 'number' },
                    },
                ],
            });
        });
    });
    async function setupTestScenario() {
        const db = new repository_1.juggler.DataSource({ connector: 'memory' });
        const ProductRepository = (0, repository_1.defineCrudRepositoryClass)(Product);
        repo = new ProductRepository(db);
        const CrudRestController = (0, __1.defineCrudRestController)(Product, { basePath: '/products' });
        class ProductController extends CrudRestController {
            constructor() {
                super(repo);
            }
        }
        app = new rest_1.RestApplication({ rest: (0, testlab_1.givenHttpServerConfig)() });
        app.controller(ProductController);
        await app.start();
        client = (0, testlab_1.createRestAppClient)(app);
    }
    async function stopTheApp() {
        await app.stop();
    }
    async function cleanDatabase() {
        await repo.deleteAll();
        // Prevent accidental access to model instances created by previous tests
        pen = undefined;
        pencil = undefined;
    }
    async function seedData() {
        // It's important to make these calls in series, to ensure that "pen"
        // comes first when the results are sorted by `id` (the default order).
        pen = await repo.create({ name: 'pen' });
        pencil = await repo.create({ name: 'pencil' });
    }
});
//# sourceMappingURL=default-model-crud-rest.acceptance.js.map
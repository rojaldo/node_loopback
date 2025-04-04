"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const lodash_1 = require("lodash");
const __1 = require("../../../..");
const relations_helpers_fixtures_1 = require("./relations-helpers-fixtures");
describe('findByForeignKeys', () => {
    let productRepo;
    // use beforeEach to restore sinon stub
    beforeEach(() => {
        productRepo = (0, testlab_1.createStubInstance)(relations_helpers_fixtures_1.ProductRepository);
    });
    it('returns an empty array when no foreign keys are passed in', async () => {
        const RESULTS = [];
        productRepo.stubs.find.resolves(RESULTS);
        const fkIds = [];
        await productRepo.create({ id: 1, name: 'product', categoryId: 1 });
        const products = await (0, __1.findByForeignKeys)(productRepo, 'categoryId', fkIds);
        (0, testlab_1.expect)(products).to.be.empty();
        testlab_1.sinon.assert.notCalled(productRepo.stubs.find);
    });
    it('returns an empty array when no instances have the foreign key value', async () => {
        const find = productRepo.stubs.find;
        find.resolves([]);
        await productRepo.create({ id: 1, name: 'product', categoryId: 1 });
        const products = await (0, __1.findByForeignKeys)(productRepo, 'categoryId', 2);
        (0, testlab_1.expect)(products).to.be.empty();
        testlab_1.sinon.assert.calledWithMatch(find, {});
    });
    it('returns an empty array when no instances have the foreign key values', async () => {
        const find = productRepo.stubs.find;
        find.resolves([]);
        await productRepo.create({ id: 1, name: 'product', categoryId: 1 });
        const products = await (0, __1.findByForeignKeys)(productRepo, 'categoryId', [2, 3]);
        (0, testlab_1.expect)(products).to.be.empty();
        testlab_1.sinon.assert.calledWithMatch(find, {});
    });
    it('returns all instances that have the foreign key value', async () => {
        const find = productRepo.stubs.find;
        const pen = (0, relations_helpers_fixtures_1.createProduct)({ name: 'pen', categoryId: 1 });
        const pencil = (0, relations_helpers_fixtures_1.createProduct)({ name: 'pencil', categoryId: 1 });
        find.resolves([pen, pencil]);
        const products = await (0, __1.findByForeignKeys)(productRepo, 'categoryId', 1);
        (0, testlab_1.expect)(products).to.deepEqual([pen, pencil]);
        testlab_1.sinon.assert.calledWithMatch(find, {
            where: {
                categoryId: 1,
            },
        });
    });
    it('does not include instances with different foreign key values', async () => {
        const find = productRepo.stubs.find;
        const pen = await productRepo.create({ name: 'pen', categoryId: 1 });
        const pencil = await productRepo.create({ name: 'pencil', categoryId: 2 });
        find.resolves([pen]);
        const products = await (0, __1.findByForeignKeys)(productRepo, 'categoryId', 1);
        (0, testlab_1.expect)(products).to.deepEqual([pen]);
        (0, testlab_1.expect)(products).to.not.containDeep(pencil);
        testlab_1.sinon.assert.calledWithMatch(find, {
            where: {
                categoryId: 1,
            },
        });
    });
    it('includes instances when there is one value in the array of foreign key values', async () => {
        const find = productRepo.stubs.find;
        const pen = await productRepo.create({ name: 'pen', categoryId: 1 });
        const pencil = await productRepo.create({ name: 'pencil', categoryId: 2 });
        find.resolves([pencil]);
        const products = await (0, __1.findByForeignKeys)(productRepo, 'categoryId', [2]);
        (0, testlab_1.expect)(products).to.deepEqual([pencil]);
        (0, testlab_1.expect)(products).to.not.containDeep(pen);
        testlab_1.sinon.assert.calledWithMatch(find, {
            where: {
                categoryId: 2,
            },
        });
    });
    it('returns all instances that have any of multiple foreign key values', async () => {
        const pen = (0, relations_helpers_fixtures_1.createProduct)({ name: 'pen', categoryId: 1 });
        const pencil = (0, relations_helpers_fixtures_1.createProduct)({ name: 'pencil', categoryId: 2 });
        const paper = (0, relations_helpers_fixtures_1.createProduct)({ name: 'paper', categoryId: 3 });
        const find = productRepo.stubs.find;
        find.resolves([pen, paper]);
        const products = await (0, __1.findByForeignKeys)(productRepo, 'categoryId', [1, 3]);
        (0, testlab_1.expect)(products).to.deepEqual([pen, paper]);
        (0, testlab_1.expect)(products).to.not.containDeep(pencil);
        testlab_1.sinon.assert.calledWithMatch(find, {
            where: {
                categoryId: {
                    inq: [1, 3],
                },
            },
        });
    });
    it('does not throw an error if scope is passed in and is undefined or empty', async () => {
        const find = productRepo.stubs.find;
        find.resolves([]);
        let products = await (0, __1.findByForeignKeys)(productRepo, 'categoryId', [1], undefined, {});
        (0, testlab_1.expect)(products).to.be.empty();
        testlab_1.sinon.assert.calledWithMatch(find, {});
        products = await (0, __1.findByForeignKeys)(productRepo, 'categoryId', 1, {}, {});
        (0, testlab_1.expect)(products).to.be.empty();
        testlab_1.sinon.assert.calledWithMatch(find, {});
    });
    it('checks if the custom scope is handled properly', async () => {
        const find = productRepo.stubs.find;
        find.resolves([]);
        await productRepo.create({ id: 1, name: 'product', categoryId: 1 });
        await productRepo.create({ id: 2, name: 'product', categoryId: 1 });
        await (0, __1.findByForeignKeys)(productRepo, 'categoryId', 1, {
            where: { id: 2 },
            include: ['nested inclusion'],
        });
        testlab_1.sinon.assert.calledWithMatch(find, {
            where: {
                categoryId: 1,
                id: 2,
            },
            include: ['nested inclusion'],
        });
    });
    it('does not manipulate non-primitive params', async () => {
        const fkValues = [1];
        const scope = {
            where: { id: 2 },
        };
        const fkValuesOriginal = (0, lodash_1.cloneDeep)(fkValues);
        const scopeOriginal = (0, lodash_1.cloneDeep)(scope);
        productRepo.stubs.find.resolves([]);
        await productRepo.create({ id: 1, name: 'product', categoryId: 1 });
        await productRepo.create({ id: 2, name: 'product', categoryId: 1 });
        await (0, __1.findByForeignKeys)(productRepo, 'categoryId', fkValues, scope);
        (0, testlab_1.expect)(fkValues).to.deepEqual(fkValuesOriginal);
        (0, testlab_1.expect)(scope).to.deepEqual(scopeOriginal);
    });
    it('runs a find for each fkValue to properly respect scope filters', async () => {
        const find = productRepo.stubs.find;
        const scope = {
            limit: 4,
            order: ['name ASC'],
            where: { name: { like: 'product%' } },
        };
        const newProducts = [
            (0, relations_helpers_fixtures_1.createProduct)({ id: 1, name: 'productA', categoryId: 1 }),
            (0, relations_helpers_fixtures_1.createProduct)({ id: 2, name: 'productB', categoryId: 2 }),
        ];
        await productRepo.create(newProducts[0]);
        await productRepo.create(newProducts[1]);
        find.resolves([]);
        await (0, __1.findByForeignKeys)(productRepo, 'categoryId', [1, 2], scope);
        testlab_1.sinon.assert.calledWithMatch(find, {
            limit: 4,
            order: ['name ASC'],
            where: {
                categoryId: 1,
                name: { like: 'product%' },
            },
        });
        testlab_1.sinon.assert.calledWithMatch(find, {
            limit: 4,
            order: ['name ASC'],
            where: {
                categoryId: 2,
                name: { like: 'product%' },
            },
        });
    });
    it('runs find globally because totalLimit is set in scope', async () => {
        const find = productRepo.stubs.find;
        const scope = {
            totalLimit: 4,
            order: ['name ASC'],
            where: { name: { like: 'product%' } },
        };
        const newProducts = [
            (0, relations_helpers_fixtures_1.createProduct)({ id: 1, name: 'productA', categoryId: 1 }),
            (0, relations_helpers_fixtures_1.createProduct)({ id: 2, name: 'productB', categoryId: 2 }),
        ];
        await productRepo.create(newProducts[0]);
        await productRepo.create(newProducts[1]);
        find.resolves([]);
        await (0, __1.findByForeignKeys)(productRepo, 'categoryId', [1, 2], scope);
        testlab_1.sinon.assert.calledWithMatch(find, {
            limit: 4,
            order: ['name ASC'],
            where: {
                categoryId: { inq: [1, 2] },
                name: { like: 'product%' },
            },
        });
    });
    it('runs find globally when `limit` is not set', async () => {
        const find = productRepo.stubs.find;
        const scope = {
            fields: ['id', 'categoryId'],
            offset: 4,
            order: ['name ASC'],
            where: { name: { like: 'product%' } },
        };
        const newProducts = [
            (0, relations_helpers_fixtures_1.createProduct)({ id: 1, name: 'productA', categoryId: 1 }),
            (0, relations_helpers_fixtures_1.createProduct)({ id: 2, name: 'productB', categoryId: 2 }),
        ];
        await productRepo.create(newProducts[0]);
        await productRepo.create(newProducts[1]);
        find.resolves([]);
        await (0, __1.findByForeignKeys)(productRepo, 'categoryId', [1, 2], scope);
        testlab_1.sinon.assert.calledWithMatch(find, {
            fields: ['id', 'categoryId'],
            offset: 4,
            order: ['name ASC'],
            where: { name: { like: 'product%' } },
        });
    });
});
//# sourceMappingURL=find-by-foreign-keys.unit.js.map
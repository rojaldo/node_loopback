"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../../");
describe('repository class', () => {
    let ctx;
    before(givenCtx);
    it('supports referencing predefined repository by name via constructor', async () => {
        const myController = await ctx.get('controllers.StringBoundController');
        (0, testlab_1.expect)(myController.noteRepo instanceof __1.DefaultCrudRepository).to.be.true();
    });
    it('supports referencing predefined repository via constructor', async () => {
        const myController = await ctx.get('controllers.RepositoryBoundController');
        (0, testlab_1.expect)(myController.noteRepo instanceof __1.DefaultCrudRepository).to.be.true();
    });
    const ds = new __1.juggler.DataSource({
        name: 'db',
        connector: 'memory',
    });
    class Note extends __1.Entity {
        constructor(data) {
            super(data);
        }
    }
    Note.definition = new __1.ModelDefinition({
        name: 'note',
        properties: {
            title: 'string',
            content: 'string',
            id: { type: 'number', id: true },
        },
    });
    let MyRepository = class MyRepository extends __1.DefaultCrudRepository {
        constructor(myModel, dataSource) {
            super(myModel, dataSource);
        }
    };
    MyRepository = tslib_1.__decorate([
        tslib_1.__param(0, (0, core_1.inject)('models.Note')),
        tslib_1.__param(1, (0, core_1.inject)('dataSources.memory')),
        tslib_1.__metadata("design:paramtypes", [Object, __1.juggler.DataSource])
    ], MyRepository);
    let StringBoundController = class StringBoundController {
        constructor(noteRepo) {
            this.noteRepo = noteRepo;
        }
    };
    StringBoundController = tslib_1.__decorate([
        tslib_1.__param(0, (0, __1.repository)('MyRepository')),
        tslib_1.__metadata("design:paramtypes", [Object])
    ], StringBoundController);
    let RepositoryBoundController = class RepositoryBoundController {
        constructor(noteRepo) {
            this.noteRepo = noteRepo;
        }
    };
    RepositoryBoundController = tslib_1.__decorate([
        tslib_1.__param(0, (0, __1.repository)(MyRepository)),
        tslib_1.__metadata("design:paramtypes", [Object])
    ], RepositoryBoundController);
    function givenCtx() {
        ctx = new core_1.Context();
        ctx.bind('models.Note').to(Note);
        ctx.bind('dataSources.memory').to(ds);
        ctx.bind('repositories.MyRepository').toClass(MyRepository);
        ctx
            .bind('controllers.StringBoundController')
            .toClass(StringBoundController);
        ctx
            .bind('controllers.RepositoryBoundController')
            .toClass(RepositoryBoundController);
    }
});
//# sourceMappingURL=repository-with-di.decorator.unit.js.map
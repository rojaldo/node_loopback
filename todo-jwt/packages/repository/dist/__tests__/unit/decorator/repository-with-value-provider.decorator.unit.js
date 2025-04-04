"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../../");
let MyController = class MyController {
    constructor(noteRepo) {
        this.noteRepo = noteRepo;
    }
};
MyController = tslib_1.__decorate([
    tslib_1.__param(0, (0, __1.repository)('noteRepo')),
    tslib_1.__metadata("design:paramtypes", [Object])
], MyController);
let MyRepositoryProvider = class MyRepositoryProvider {
    constructor(myModel, dataSource) {
        this.myModel = myModel;
        this.dataSource = dataSource;
    }
    value() {
        return new __1.DefaultCrudRepository(this.myModel, this.dataSource);
    }
};
MyRepositoryProvider = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)('models.Note')),
    tslib_1.__param(1, (0, core_1.inject)('dataSources.memory')),
    tslib_1.__metadata("design:paramtypes", [Object, __1.juggler.DataSource])
], MyRepositoryProvider);
describe('repository class', () => {
    let ctx;
    before(function () {
        const ds = new __1.juggler.DataSource({
            name: 'db',
            connector: 'memory',
        });
        class Note extends __1.Entity {
        }
        Note.definition = new __1.ModelDefinition({
            name: 'note',
            properties: {
                title: 'string',
                content: 'string',
                id: { type: 'number', id: true },
            },
        });
        ctx = new core_1.Context();
        ctx.bind('models.Note').to(Note);
        ctx.bind('dataSources.memory').to(ds);
        ctx.bind('repositories.noteRepo').toProvider(MyRepositoryProvider);
        ctx.bind('controllers.MyController').toClass(MyController);
    });
    it('supports referencing predefined repository by name via constructor', async () => {
        const myController = await ctx.get('controllers.MyController');
        (0, testlab_1.expect)(myController.noteRepo instanceof __1.DefaultCrudRepository).to.be.true();
    });
});
//# sourceMappingURL=repository-with-value-provider.decorator.unit.js.map
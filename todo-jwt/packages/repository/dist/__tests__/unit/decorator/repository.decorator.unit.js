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
tslib_1.__decorate([
    (0, __1.repository)('noteRepo'),
    tslib_1.__metadata("design:type", Object)
], MyController.prototype, "noteRepo2", void 0);
MyController = tslib_1.__decorate([
    tslib_1.__param(0, (0, __1.repository)('noteRepo')),
    tslib_1.__metadata("design:paramtypes", [Object])
], MyController);
describe('repository decorator', () => {
    let ctx;
    let defaultRepo;
    let noteRepo;
    let ds;
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
    class NoteRepository extends __1.DefaultCrudRepository {
        constructor(dataSource) {
            super(Note, dataSource);
        }
    }
    before(function () {
        ds = new __1.juggler.DataSource({
            name: 'db',
            connector: 'memory',
        });
        defaultRepo = new __1.DefaultCrudRepository(Note, ds);
        noteRepo = new NoteRepository(ds);
        ctx = new core_1.Context();
        ctx.bind('models.Note').to(Note);
        ctx.bind('datasources.memory').to(ds);
        ctx.bind('repositories.noteRepo').to(defaultRepo);
        ctx.bind(`repositories.${NoteRepository.name}`).to(noteRepo);
        ctx.bind('controllers.MyController').toClass(MyController);
    });
    it('supports referencing predefined repository by name via constructor', async () => {
        const myController = await ctx.get('controllers.MyController');
        (0, testlab_1.expect)(myController.noteRepo).exactly(defaultRepo);
    });
    it('supports referencing predefined repository by name via property', async () => {
        const myController = await ctx.get('controllers.MyController');
        (0, testlab_1.expect)(myController.noteRepo2).exactly(defaultRepo);
    });
    it('throws not implemented for class-level @repository', () => {
        (0, testlab_1.expect)(() => {
            let Controller1 = 
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class Controller1 {
            };
            Controller1 = tslib_1.__decorate([
                (0, __1.repository)('noteRepo')
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            ], Controller1);
        }).to.throw(/not implemented/);
    });
    it('supports @repository(model, dataSource) by names', async () => {
        let Controller2 = class Controller2 {
            constructor(repo) {
                this.repo = repo;
            }
        };
        Controller2 = tslib_1.__decorate([
            tslib_1.__param(0, (0, __1.repository)('Note', 'memory')),
            tslib_1.__metadata("design:paramtypes", [Object])
        ], Controller2);
        ctx.bind('controllers.Controller2').toClass(Controller2);
        const myController = await ctx.get('controllers.Controller2');
        (0, testlab_1.expect)(myController.repo).to.be.not.null();
    });
    it('supports @repository(model, dataSource)', async () => {
        let Controller3 = class Controller3 {
            constructor(repo) {
                this.repo = repo;
            }
        };
        Controller3 = tslib_1.__decorate([
            tslib_1.__param(0, (0, __1.repository)(Note, ds)),
            tslib_1.__metadata("design:paramtypes", [Object])
        ], Controller3);
        ctx.bind('controllers.Controller3').toClass(Controller3);
        const myController = await ctx.get('controllers.Controller3');
        const r = myController.repo;
        (0, testlab_1.expect)(r).to.be.instanceof(__1.DefaultCrudRepository);
        (0, testlab_1.expect)(r.dataSource).to.be.exactly(ds);
    });
    it('rejects @repository("")', async () => {
        let Controller4 = class Controller4 {
            constructor(repo) {
                this.repo = repo;
            }
        };
        Controller4 = tslib_1.__decorate([
            tslib_1.__param(0, (0, __1.repository)('')),
            tslib_1.__metadata("design:paramtypes", [Object])
        ], Controller4);
        ctx.bind('controllers.Controller4').toClass(Controller4);
        try {
            await ctx.get('controllers.Controller4');
            throw new Error('Repository resolver should have thrown an error.');
        }
        catch (err) {
            (0, testlab_1.expect)(err).to.match(/invalid repository/i);
        }
    });
    describe('@repository.getter() ', () => {
        it('accepts repository name', async () => {
            let TestController = class TestController {
                constructor(getRepo) {
                    this.getRepo = getRepo;
                }
            };
            TestController = tslib_1.__decorate([
                tslib_1.__param(0, __1.repository.getter('NoteRepository')),
                tslib_1.__metadata("design:paramtypes", [Function])
            ], TestController);
            ctx.bind('TestController').toClass(TestController);
            const controller = await ctx.get('TestController');
            const repoGetter = controller.getRepo;
            (0, testlab_1.expect)(repoGetter).to.be.a.Function();
            const repo = await repoGetter();
            (0, testlab_1.expect)(repo).to.be.exactly(noteRepo);
        });
        it('accepts repository class', async () => {
            let TestController = class TestController {
                constructor(getRepo) {
                    this.getRepo = getRepo;
                }
            };
            TestController = tslib_1.__decorate([
                tslib_1.__param(0, __1.repository.getter(NoteRepository)),
                tslib_1.__metadata("design:paramtypes", [Function])
            ], TestController);
            ctx.bind('TestController').toClass(TestController);
            const controller = await ctx.get('TestController');
            const repoGetter = controller.getRepo;
            (0, testlab_1.expect)(repoGetter).to.be.a.Function();
            const repo = await repoGetter();
            (0, testlab_1.expect)(repo).to.be.exactly(noteRepo);
        });
    });
});
//# sourceMappingURL=repository.decorator.unit.js.map
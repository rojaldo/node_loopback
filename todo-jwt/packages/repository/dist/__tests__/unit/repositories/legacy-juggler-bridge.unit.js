"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testlab_1 = require("@loopback/testlab");
const lodash_1 = require("lodash");
const __1 = require("../../..");
const relations_1 = require("../../../relations");
const crud_connector_stub_1 = require("../crud-connector.stub");
const TransactionClass = require('loopback-datasource-juggler').Transaction;
describe('legacy loopback-datasource-juggler', () => {
    let ds;
    before(function () {
        ds = new __1.juggler.DataSource({
            name: 'db',
            connector: 'memory',
        });
        (0, testlab_1.expect)(ds.settings.name).to.eql('db');
        (0, testlab_1.expect)(ds.settings.connector).to.eql('memory');
    });
    it('creates models', () => {
        const Note = ds.createModel('note', { title: 'string', content: 'string', id: { type: 'number', id: true } }, {});
        const Note2 = (0, __1.bindModel)(Note, ds);
        (0, testlab_1.expect)(Note2.modelName).to.eql('note');
        (0, testlab_1.expect)(Note2.definition).to.eql(Note.definition);
        (0, testlab_1.expect)(Note2.create).to.exactly(Note.create);
    });
});
describe('DefaultCrudRepository', () => {
    let ds;
    class Note extends __1.Entity {
        constructor(data) {
            super(data);
        }
    }
    Note.definition = new __1.ModelDefinition({
        name: 'Note',
        properties: {
            title: 'string',
            content: 'string',
            id: { name: 'id', type: 'number', id: true },
        },
    });
    beforeEach(() => {
        ds = new __1.juggler.DataSource({
            name: 'db',
            connector: 'memory',
        });
    });
    context('constructor', () => {
        class ShoppingList extends __1.Entity {
        }
        ShoppingList.definition = new __1.ModelDefinition({
            name: 'ShoppingList',
            properties: {
                id: {
                    type: 'number',
                    id: true,
                },
                created: {
                    type: () => Date,
                },
                toBuy: {
                    type: 'array',
                    itemType: 'string',
                },
                toVisit: {
                    type: Array,
                    itemType: () => String,
                },
            },
        });
        it('converts PropertyDefinition with array type', () => {
            const originalPropertyDefinition = Object.assign({}, ShoppingList.definition.properties);
            const listDefinition = new __1.DefaultCrudRepository(ShoppingList, ds)
                .modelClass.definition;
            const jugglerPropertyDefinition = {
                created: { type: Date },
                toBuy: {
                    type: [String],
                },
                toVisit: {
                    type: [String],
                },
            };
            (0, testlab_1.expect)(listDefinition.properties).to.containDeep(jugglerPropertyDefinition);
            (0, testlab_1.expect)(ShoppingList.definition.properties).to.containDeep(originalPropertyDefinition);
        });
        it('converts PropertyDefinition with model type', () => {
            let Role = class Role {
            };
            tslib_1.__decorate([
                (0, __1.property)(),
                tslib_1.__metadata("design:type", String)
            ], Role.prototype, "name", void 0);
            Role = tslib_1.__decorate([
                (0, __1.model)()
            ], Role);
            let Address = class Address {
            };
            tslib_1.__decorate([
                (0, __1.property)(),
                tslib_1.__metadata("design:type", String)
            ], Address.prototype, "street", void 0);
            Address = tslib_1.__decorate([
                (0, __1.model)()
            ], Address);
            let User = class User extends __1.Entity {
            };
            tslib_1.__decorate([
                (0, __1.property)({
                    type: 'number',
                    id: true,
                }),
                tslib_1.__metadata("design:type", Number)
            ], User.prototype, "id", void 0);
            tslib_1.__decorate([
                (0, __1.property)({ type: 'string' }),
                tslib_1.__metadata("design:type", String)
            ], User.prototype, "name", void 0);
            tslib_1.__decorate([
                __1.property.array(Role),
                tslib_1.__metadata("design:type", Array)
            ], User.prototype, "roles", void 0);
            tslib_1.__decorate([
                (0, __1.property)(),
                tslib_1.__metadata("design:type", Address)
            ], User.prototype, "address", void 0);
            User = tslib_1.__decorate([
                (0, __1.model)()
            ], User);
            (0, testlab_1.expect)(ds.getModel('User')).undefined();
            new __1.DefaultCrudRepository(User, ds);
            const JugglerUser = ds.getModel('User');
            (0, testlab_1.expect)(JugglerUser).to.be.a.Function();
            const addressProperty = JugglerUser.definition.properties.address;
            const addressModel = addressProperty.type;
            (0, testlab_1.expect)(addressModel).to.be.a.Function();
            (0, testlab_1.expect)(addressModel).to.equal(ds.getModel('Address'));
            (0, testlab_1.expect)(addressModel.name).to.equal('Address');
            (0, testlab_1.expect)(addressModel.definition).to.containDeep({
                name: 'Address',
                properties: { street: { type: String } },
            });
            const rolesProperty = JugglerUser.definition.properties.roles;
            (0, testlab_1.expect)(rolesProperty.type).to.be.an.Array().of.length(1);
            // FIXME(bajtos) PropertyDefinition in juggler does not allow array type!
            const rolesModel = 
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            rolesProperty.type[0];
            (0, testlab_1.expect)(rolesModel).to.be.a.Function();
            (0, testlab_1.expect)(rolesModel).to.equal(ds.getModel('Role'));
            (0, testlab_1.expect)(rolesModel.name).to.equal('Role');
            (0, testlab_1.expect)(rolesModel.definition).to.containDeep({
                name: 'Role',
                properties: { name: { type: String } },
            });
            // issue 2912: make sure the juggler leaves the original model definition alone
            (0, testlab_1.expect)(User.definition.properties.roles.itemType).to.equal(Role);
            (0, testlab_1.expect)(User.definition.properties.address.type).to.equal(Address);
        });
        it('handles recursive model references', () => {
            let ReportState = class ReportState extends __1.Entity {
                constructor(data) {
                    super(data);
                }
            };
            tslib_1.__decorate([
                (0, __1.property)({ id: true }),
                tslib_1.__metadata("design:type", String)
            ], ReportState.prototype, "id", void 0);
            tslib_1.__decorate([
                __1.property.array(ReportState, {}),
                tslib_1.__metadata("design:type", Array)
            ], ReportState.prototype, "states", void 0);
            tslib_1.__decorate([
                (0, __1.property)({
                    type: 'string',
                }),
                tslib_1.__metadata("design:type", String)
            ], ReportState.prototype, "benchmarkId", void 0);
            tslib_1.__decorate([
                (0, __1.property)({
                    type: 'string',
                }),
                tslib_1.__metadata("design:type", String)
            ], ReportState.prototype, "color", void 0);
            ReportState = tslib_1.__decorate([
                (0, __1.model)(),
                tslib_1.__metadata("design:paramtypes", [Object])
            ], ReportState);
            const repo = new __1.DefaultCrudRepository(ReportState, ds);
            const definition = repo.modelClass.definition;
            const typeOfStates = definition.properties.states.type;
            (0, testlab_1.expect)(typeOfStates).to.eql([repo.modelClass]);
        });
    });
    it('shares the backing PersistedModel across repo instances', () => {
        const model1 = new __1.DefaultCrudRepository(Note, ds).modelClass;
        const model2 = new __1.DefaultCrudRepository(Note, ds).modelClass;
        (0, testlab_1.expect)(model1 === model2).to.be.true();
    });
    it('implements Repository.create()', async () => {
        const repo = new __1.DefaultCrudRepository(Note, ds);
        const note = await repo.create({ title: 't3', content: 'c3' });
        const result = await repo.findById(note.id);
        (0, testlab_1.expect)(result.toJSON()).to.eql(note.toJSON());
    });
    it('implements Repository.createAll()', async () => {
        const repo = new __1.DefaultCrudRepository(Note, ds);
        const notes = await repo.createAll([
            { title: 't3', content: 'c3' },
            { title: 't4', content: 'c4' },
        ]);
        (0, testlab_1.expect)(notes.length).to.eql(2);
    });
    describe('find', () => {
        it('is implemented', async () => {
            const repo = new __1.DefaultCrudRepository(Note, ds);
            await repo.createAll([
                { title: 't1', content: 'c1' },
                { title: 't2', content: 'c2' },
            ]);
            const notes = await repo.find({ where: { title: 't1' } });
            (0, testlab_1.expect)(notes.length).to.eql(1);
        });
        it('does not manipulate the original filter', async () => {
            const repo = new __1.DefaultCrudRepository(Note, ds);
            const filter = { where: { title: 't1' } };
            const originalFilter = (0, lodash_1.cloneDeep)(filter);
            await repo.createAll([
                { title: 't1', content: 'c1' },
                { title: 't2', content: 'c2' },
            ]);
            await repo.find(filter);
            (0, testlab_1.expect)(filter).to.deepEqual(originalFilter);
        });
    });
    describe('findOne', () => {
        it('is implemented', async () => {
            const repo = new __1.DefaultCrudRepository(Note, ds);
            await repo.createAll([
                { title: 't1', content: 'c1' },
                { title: 't1', content: 'c2' },
            ]);
            const note = await repo.findOne({
                where: { title: 't1' },
                order: ['content DESC'],
            });
            (0, testlab_1.expect)(note).to.not.be.null();
            (0, testlab_1.expect)(note === null || note === void 0 ? void 0 : note.title).to.eql('t1');
            (0, testlab_1.expect)(note === null || note === void 0 ? void 0 : note.content).to.eql('c2');
        });
        it('returns null if instances were found', async () => {
            const repo = new __1.DefaultCrudRepository(Note, ds);
            await repo.createAll([
                { title: 't1', content: 'c1' },
                { title: 't1', content: 'c2' },
            ]);
            const note = await repo.findOne({
                where: { title: 't5' },
                order: ['content DESC'],
            });
            (0, testlab_1.expect)(note).to.be.null();
        });
        it('does not manipulate the original filter', async () => {
            const repo = new __1.DefaultCrudRepository(Note, ds);
            const filter = {
                where: { title: 't5' },
                order: ['content DESC'],
            };
            const originalFilter = (0, lodash_1.cloneDeep)(filter);
            await repo.createAll([
                { title: 't1', content: 'c1' },
                { title: 't1', content: 'c2' },
            ]);
            await repo.findOne(filter);
            (0, testlab_1.expect)(filter).to.deepEqual(originalFilter);
        });
    });
    describe('findById', () => {
        it('returns the correct instance', async () => {
            const repo = new __1.DefaultCrudRepository(Note, ds);
            const note = await repo.create({ title: 'a-title', content: 'a-content' });
            const result = await repo.findById(note.id);
            (0, testlab_1.expect)(result === null || result === void 0 ? void 0 : result.toJSON()).to.eql(note.toJSON());
        });
        it('returns the correct instance with fields', async () => {
            const repo = new __1.DefaultCrudRepository(Note, ds);
            const note = await repo.create({ title: 'a-title', content: 'a-content' });
            const result = await repo.findById(note.id, { fields: { title: true } });
            (0, testlab_1.expect)(result === null || result === void 0 ? void 0 : result.toJSON()).to.eql({ title: 'a-title' });
        });
        it('does not manipulate the original filter', async () => {
            const repo = new __1.DefaultCrudRepository(Note, ds);
            const filter = { fields: { title: true, content: true } };
            const originalFilter = (0, lodash_1.cloneDeep)(filter);
            const note = await repo.create({ title: 'a-title', content: 'a-content' });
            await repo.findById(note.id, filter);
            (0, testlab_1.expect)(filter).to.deepEqual(originalFilter);
        });
        it('throws when the instance does not exist', async () => {
            const repo = new __1.DefaultCrudRepository(Note, ds);
            await (0, testlab_1.expect)(repo.findById(999999)).to.be.rejectedWith({
                code: 'ENTITY_NOT_FOUND',
                message: 'Entity not found: Note with id 999999',
            });
        });
    });
    describe('DefaultCrudRepository with relations', () => {
        let Author = class Author extends __1.Entity {
        };
        tslib_1.__decorate([
            (0, __1.property)({ id: true }),
            tslib_1.__metadata("design:type", Number)
        ], Author.prototype, "id", void 0);
        tslib_1.__decorate([
            (0, __1.property)(),
            tslib_1.__metadata("design:type", String)
        ], Author.prototype, "name", void 0);
        tslib_1.__decorate([
            (0, relations_1.belongsTo)(() => Folder),
            tslib_1.__metadata("design:type", Number)
        ], Author.prototype, "folderId", void 0);
        Author = tslib_1.__decorate([
            (0, __1.model)()
        ], Author);
        let Folder = class Folder extends __1.Entity {
        };
        tslib_1.__decorate([
            (0, __1.property)({ id: true }),
            tslib_1.__metadata("design:type", Number)
        ], Folder.prototype, "id", void 0);
        tslib_1.__decorate([
            (0, __1.property)(),
            tslib_1.__metadata("design:type", String)
        ], Folder.prototype, "name", void 0);
        tslib_1.__decorate([
            (0, relations_1.hasMany)(() => File),
            tslib_1.__metadata("design:type", Array)
        ], Folder.prototype, "files", void 0);
        tslib_1.__decorate([
            (0, relations_1.hasOne)(() => Author),
            tslib_1.__metadata("design:type", Author)
        ], Folder.prototype, "author", void 0);
        Folder = tslib_1.__decorate([
            (0, __1.model)()
        ], Folder);
        let File = class File extends __1.Entity {
        };
        tslib_1.__decorate([
            (0, __1.property)({ id: true }),
            tslib_1.__metadata("design:type", Number)
        ], File.prototype, "id", void 0);
        tslib_1.__decorate([
            (0, __1.property)(),
            tslib_1.__metadata("design:type", String)
        ], File.prototype, "title", void 0);
        tslib_1.__decorate([
            (0, relations_1.belongsTo)(() => Folder),
            tslib_1.__metadata("design:type", Number)
        ], File.prototype, "folderId", void 0);
        File = tslib_1.__decorate([
            (0, __1.model)()
        ], File);
        let Account = class Account extends __1.Entity {
        };
        tslib_1.__decorate([
            (0, __1.property)({ id: true }),
            tslib_1.__metadata("design:type", Number)
        ], Account.prototype, "id", void 0);
        tslib_1.__decorate([
            (0, __1.property)(),
            tslib_1.__metadata("design:type", String)
        ], Account.prototype, "name", void 0);
        tslib_1.__decorate([
            (0, relations_1.belongsTo)(() => Author, { name: 'author' }),
            tslib_1.__metadata("design:type", Number)
        ], Account.prototype, "author", void 0);
        Account = tslib_1.__decorate([
            (0, __1.model)()
        ], Account);
        let folderRepo;
        let fileRepo;
        let authorRepo;
        let accountRepo;
        let folderFiles;
        let fileFolder;
        let folderAuthor;
        before(() => {
            ds = new __1.juggler.DataSource({
                name: 'db',
                connector: 'memory',
            });
            folderRepo = new __1.DefaultCrudRepository(Folder, ds);
            fileRepo = new __1.DefaultCrudRepository(File, ds);
            authorRepo = new __1.DefaultCrudRepository(Author, ds);
            accountRepo = new __1.DefaultCrudRepository(Account, ds);
        });
        before(() => {
            // using a variable instead of a repository property
            folderFiles = (0, relations_1.createHasManyRepositoryFactory)(Folder.definition.relations.files, async () => fileRepo);
            folderAuthor = (0, relations_1.createHasOneRepositoryFactory)(Folder.definition.relations.author, async () => authorRepo);
            fileFolder = (0, relations_1.createBelongsToAccessor)(File.definition.relations.folder, async () => folderRepo, fileRepo);
        });
        beforeEach(async () => {
            await folderRepo.deleteAll();
            await fileRepo.deleteAll();
            await authorRepo.deleteAll();
        });
        context('find* methods with inclusion', () => {
            it('implements Repository.find() with included models', async () => {
                const createdFolders = await folderRepo.createAll([
                    { name: 'f1', id: 1 },
                    { name: 'f2', id: 2 },
                ]);
                const files = await fileRepo.createAll([
                    { id: 1, title: 'file1', folderId: 1 },
                    { id: 2, title: 'file2', folderId: 3 },
                ]);
                folderRepo.registerInclusionResolver('files', hasManyResolver);
                const folders = await folderRepo.find({ include: ['files'] });
                (0, testlab_1.expect)((0, testlab_1.toJSON)(folders)).to.deepEqual([
                    { ...createdFolders[0].toJSON(), files: [(0, testlab_1.toJSON)(files[0])] },
                    { ...createdFolders[1].toJSON(), files: [] },
                ]);
            });
            it('implements Repository.find() with included models and scope limit', async () => {
                const createdFolders = await folderRepo.createAll([
                    { name: 'f1', id: 1 },
                    { name: 'f2', id: 2 },
                    { name: 'f3', id: 3 },
                    { name: 'f4', id: 4 },
                ]);
                const files = await fileRepo.createAll([
                    { id: 1, title: 'file1', folderId: 1 },
                    { id: 2, title: 'file3.A', folderId: 3 },
                    { id: 3, title: 'file3.D', folderId: 3 },
                    { id: 4, title: 'file3.C', folderId: 3 },
                    { id: 5, title: 'file3.B', folderId: 3 },
                    { id: 6, title: 'file2.D', folderId: 2 },
                    { id: 7, title: 'file2.A', folderId: 2 },
                    { id: 8, title: 'file2.C', folderId: 2 },
                    { id: 9, title: 'file2.B', folderId: 2 },
                ]);
                folderRepo.registerInclusionResolver('files', folderFiles.inclusionResolver);
                const folders = await folderRepo.find({
                    include: [
                        { relation: 'files', scope: { limit: 3, order: ['title ASC'] } },
                    ],
                });
                (0, testlab_1.expect)((0, testlab_1.toJSON)(folders)).to.deepEqual([
                    { ...createdFolders[0].toJSON(), files: [(0, testlab_1.toJSON)(files[0])] },
                    {
                        ...createdFolders[1].toJSON(),
                        files: [(0, testlab_1.toJSON)(files[6]), (0, testlab_1.toJSON)(files[8]), (0, testlab_1.toJSON)(files[7])],
                    },
                    {
                        ...createdFolders[2].toJSON(),
                        files: [(0, testlab_1.toJSON)(files[1]), (0, testlab_1.toJSON)(files[4]), (0, testlab_1.toJSON)(files[3])],
                    },
                    {
                        ...createdFolders[3].toJSON(),
                        // files: [], //? I would prefer to have files as an empty array but I think that would be a change to flattenTargetsOfOneToManyRelation?
                    },
                ]);
            });
            it('implements Repository.find() with included models and scope totalLimit', async () => {
                const createdFolders = await folderRepo.createAll([
                    { name: 'f1', id: 1 },
                    { name: 'f2', id: 2 },
                    { name: 'f3', id: 3 },
                    { name: 'f4', id: 4 },
                ]);
                const files = await fileRepo.createAll([
                    { id: 1, title: 'file1', folderId: 1 },
                    { id: 2, title: 'file3.A', folderId: 3 },
                    { id: 3, title: 'file3.D', folderId: 3 },
                    { id: 4, title: 'file3.C', folderId: 3 },
                    { id: 5, title: 'file3.B', folderId: 3 },
                    { id: 6, title: 'file2.D', folderId: 2 },
                    { id: 7, title: 'file2.A', folderId: 2 },
                    { id: 8, title: 'file2.C', folderId: 2 },
                    { id: 9, title: 'file2.B', folderId: 2 },
                ]);
                folderRepo.registerInclusionResolver('files', folderFiles.inclusionResolver);
                const folders = await folderRepo.find({
                    include: [
                        { relation: 'files', scope: { totalLimit: 3, order: ['title ASC'] } },
                    ],
                });
                (0, testlab_1.expect)((0, testlab_1.toJSON)(folders)).to.deepEqual([
                    { ...createdFolders[0].toJSON(), files: [(0, testlab_1.toJSON)(files[0])] },
                    {
                        ...createdFolders[1].toJSON(),
                        files: [(0, testlab_1.toJSON)(files[6]), (0, testlab_1.toJSON)(files[8])],
                    },
                    {
                        ...createdFolders[2].toJSON(),
                        // files: [],
                    },
                    {
                        ...createdFolders[3].toJSON(),
                        // files: [], //? I would prefer to have files as an empty array but I think that would be a change to flattenTargetsOfOneToManyRelation?
                    },
                ]);
            });
            it('implements Repository.findById() with included models', async () => {
                const folders = await folderRepo.createAll([
                    { name: 'f1', id: 1 },
                    { name: 'f2', id: 2 },
                ]);
                const createdFile = await fileRepo.create({
                    id: 1,
                    title: 'file1',
                    folderId: 1,
                });
                fileRepo.registerInclusionResolver('folder', belongsToResolver);
                const file = await fileRepo.findById(1, {
                    include: ['folder'],
                });
                (0, testlab_1.expect)(file.toJSON()).to.deepEqual({
                    ...createdFile.toJSON(),
                    folder: folders[0].toJSON(),
                });
            });
            it('implements Repository.findOne() with included models', async () => {
                const folders = await folderRepo.createAll([
                    { name: 'f1', id: 1 },
                    { name: 'f2', id: 2 },
                ]);
                const createdAuthor = await authorRepo.create({
                    id: 1,
                    name: 'a1',
                    folderId: 1,
                });
                folderRepo.registerInclusionResolver('author', hasOneResolver);
                const folder = await folderRepo.findOne({
                    include: ['author'],
                });
                (0, testlab_1.expect)(folder.toJSON()).to.deepEqual({
                    ...folders[0].toJSON(),
                    author: createdAuthor.toJSON(),
                });
            });
            context('throws if the target data passes to CRUD methods contains nav properties', () => {
                it('error message warns about the nav properties', async () => {
                    // a unit test for entityToData, which is invoked by create() method
                    // it would be the same of other CRUD methods.
                    await (0, testlab_1.expect)(folderRepo.create({
                        name: 'f1',
                        files: [{ title: 'nav property' }],
                    })).to.be.rejectedWith('Navigational properties are not allowed in model data (model "Folder" property "files"), please remove it.');
                });
                it('error msg also warns about property and relation names in belongsTo relation', async () => {
                    // the belongsTo relation has the same property name as the relation name.
                    await (0, testlab_1.expect)(accountRepo.create({
                        name: 'acoount 1',
                        author: 1, // same as the relation name
                    })).to.be.rejectedWith('Navigational properties are not allowed in model data (model "Account" property "author"), please remove it.' +
                        ' The error might be invoked by belongsTo relations, please make sure the relation name is not the same as' +
                        ' the property name.');
                });
            });
            // stub resolvers
            const hasManyResolver = async (entities) => {
                const files = [];
                for (const entity of entities) {
                    const file = await folderFiles(entity.id).find();
                    files.push(file);
                }
                return files;
            };
            const belongsToResolver = async (entities) => {
                const folders = [];
                for (const file of entities) {
                    const folder = await fileFolder(file.folderId);
                    folders.push(folder);
                }
                return folders;
            };
            const hasOneResolver = async (entities) => {
                const authors = [];
                for (const folder of entities) {
                    const author = await folderAuthor(folder.id).get();
                    authors.push(author);
                }
                return authors;
            };
        });
    });
    it('implements Repository.delete()', async () => {
        const repo = new __1.DefaultCrudRepository(Note, ds);
        const note = await repo.create({ title: 't3', content: 'c3' });
        await repo.delete(note);
        const found = await repo.find({ where: { id: note.id } });
        (0, testlab_1.expect)(found).to.be.empty();
    });
    it('implements Repository.deleteById()', async () => {
        const repo = new __1.DefaultCrudRepository(Note, ds);
        const note = await repo.create({ title: 't3', content: 'c3' });
        await repo.deleteById(note.id);
        const found = await repo.find({ where: { id: note.id } });
        (0, testlab_1.expect)(found).to.be.empty();
    });
    it('throws EntityNotFoundError when deleting an unknown id', async () => {
        const repo = new __1.DefaultCrudRepository(Note, ds);
        await (0, testlab_1.expect)(repo.deleteById(99999)).to.be.rejectedWith(__1.EntityNotFoundError);
    });
    it('implements Repository.deleteAll()', async () => {
        const repo = new __1.DefaultCrudRepository(Note, ds);
        await repo.create({ title: 't3', content: 'c3' });
        await repo.create({ title: 't4', content: 'c4' });
        const result = await repo.deleteAll({ title: 't3' });
        (0, testlab_1.expect)(result.count).to.eql(1);
    });
    it('implements Repository.updateById()', async () => {
        const repo = new __1.DefaultCrudRepository(Note, ds);
        const note = await repo.create({ title: 't3', content: 'c3' });
        const id = note.id;
        const delta = { content: 'c4' };
        await repo.updateById(id, delta);
        const updated = await repo.findById(id);
        (0, testlab_1.expect)(updated.toJSON()).to.eql(Object.assign(note.toJSON(), delta));
    });
    it('throws EntityNotFound error when updating an unknown id', async () => {
        const repo = new __1.DefaultCrudRepository(Note, ds);
        await (0, testlab_1.expect)(repo.updateById(9999, { title: 't4' })).to.be.rejectedWith(__1.EntityNotFoundError);
    });
    it('throws error when provided an empty id', async () => {
        const repo = new __1.DefaultCrudRepository(Note, ds);
        await (0, testlab_1.expect)(repo.updateById(undefined, { title: 't4' })).to.be.rejectedWith('Invalid Argument: id cannot be undefined');
    });
    it('implements Repository.updateAll()', async () => {
        const repo = new __1.DefaultCrudRepository(Note, ds);
        await repo.create({ title: 't3', content: 'c3' });
        await repo.create({ title: 't4', content: 'c4' });
        const result = await repo.updateAll({ content: 'c5' }, {});
        (0, testlab_1.expect)(result.count).to.eql(2);
        const notes = await repo.find({ where: { title: 't3' } });
        (0, testlab_1.expect)(notes[0].content).to.eql('c5');
    });
    it('implements Repository.updateAll() without a where object', async () => {
        const repo = new __1.DefaultCrudRepository(Note, ds);
        await repo.create({ title: 't3', content: 'c3' });
        await repo.create({ title: 't4', content: 'c4' });
        const result = await repo.updateAll({ content: 'c5' });
        (0, testlab_1.expect)(result.count).to.eql(2);
        const notes = await repo.find();
        const titles = notes.map(n => `${n.title}:${n.content}`);
        (0, testlab_1.expect)(titles).to.deepEqual(['t3:c5', 't4:c5']);
    });
    it('implements Repository.count()', async () => {
        const repo = new __1.DefaultCrudRepository(Note, ds);
        await repo.create({ title: 't3', content: 'c3' });
        await repo.create({ title: 't4', content: 'c4' });
        const result = await repo.count();
        (0, testlab_1.expect)(result.count).to.eql(2);
    });
    it('implements Repository.save() without id', async () => {
        const repo = new __1.DefaultCrudRepository(Note, ds);
        const note = await repo.save(new Note({ title: 't3', content: 'c3' }));
        const result = await repo.findById(note.id);
        (0, testlab_1.expect)(result.toJSON()).to.eql(note.toJSON());
    });
    it('implements Repository.save() with id', async () => {
        const repo = new __1.DefaultCrudRepository(Note, ds);
        const note1 = await repo.create({ title: 't3', content: 'c3' });
        note1.content = 'c4';
        const note = await repo.save(note1);
        const result = await repo.findById(note.id);
        (0, testlab_1.expect)(result.toJSON()).to.eql(note1.toJSON());
    });
    it('implements Repository.replaceById()', async () => {
        const repo = new __1.DefaultCrudRepository(Note, ds);
        const note = await repo.create({ title: 't3', content: 'c3' });
        await repo.replaceById(note.id, { title: 't4', content: undefined });
        const result = await repo.findById(note.id);
        (0, testlab_1.expect)(result.toJSON()).to.eql({
            id: note.id,
            title: 't4',
        });
    });
    it('throws EntityNotFound error when replacing an unknown id', async () => {
        const repo = new __1.DefaultCrudRepository(Note, ds);
        await (0, testlab_1.expect)(repo.replaceById(9999, { title: 't4' })).to.be.rejectedWith(__1.EntityNotFoundError);
    });
    it('implements Repository.exists()', async () => {
        const repo = new __1.DefaultCrudRepository(Note, ds);
        const note1 = await repo.create({ title: 't3', content: 'c3' });
        const ok = await repo.exists(note1.id);
        (0, testlab_1.expect)(ok).to.be.true();
    });
    describe('Repository.execute()', () => {
        beforeEach(() => {
            // Dummy implementation for execute() in datasource
            ds.execute = (...args) => {
                return Promise.resolve(args);
            };
        });
        it('implements SQL variant', async () => {
            const repo = new __1.DefaultCrudRepository(Note, ds);
            const result = await repo.execute('query', ['arg']);
            (0, testlab_1.expect)(result).to.deepEqual(['query', ['arg']]);
        });
        it('implements MongoDB variant', async () => {
            const repo = new __1.DefaultCrudRepository(Note, ds);
            const result = await repo.execute('MyCollection', 'aggregate', [
                { $unwind: '$data' },
                { $out: 'tempData' },
            ]);
            (0, testlab_1.expect)(result).to.deepEqual([
                'MyCollection',
                'aggregate',
                [{ $unwind: '$data' }, { $out: 'tempData' }],
            ]);
        });
        it('implements a generic variant', async () => {
            const repo = new __1.DefaultCrudRepository(Note, ds);
            const command = {
                query: 'MATCH (u:User {email: {email}}) RETURN u',
                params: {
                    email: 'alice@example.com',
                },
            };
            const result = await repo.execute(command);
            (0, testlab_1.expect)(result).to.deepEqual([command]);
        });
        it(`throws error when execute() not implemented by ds connector`, async () => {
            const memDs = new __1.juggler.DataSource({
                name: 'db',
                connector: 'memory',
            });
            delete memDs.connector.execute;
            const repo = new __1.DefaultCrudRepository(Note, memDs);
            await (0, testlab_1.expect)(repo.execute('query', [])).to.be.rejectedWith('execute() must be implemented by the connector');
        });
    });
    it('has the property inclusionResolvers', () => {
        const repo = new __1.DefaultCrudRepository(Note, ds);
        (0, testlab_1.expect)(repo.inclusionResolvers).to.be.instanceof(Map);
    });
    it('implements Repository.registerInclusionResolver()', () => {
        const repo = new __1.DefaultCrudRepository(Note, ds);
        const resolver = async (entities) => {
            return entities;
        };
        repo.registerInclusionResolver('notes', resolver);
        const setResolver = repo.inclusionResolvers.get('notes');
        (0, testlab_1.expect)(setResolver).to.eql(resolver);
    });
});
describe('DefaultTransactionalRepository', () => {
    let ds;
    class Note extends __1.Entity {
        constructor(data) {
            super(data);
        }
    }
    Note.definition = new __1.ModelDefinition({
        name: 'Note',
        properties: {
            title: 'string',
            content: 'string',
            id: { name: 'id', type: 'number', id: true },
        },
    });
    beforeEach(() => {
        ds = new __1.juggler.DataSource({
            name: 'db',
            connector: 'memory',
        });
    });
    it('throws an error when beginTransaction() not implemented', async () => {
        const repo = new __1.DefaultTransactionalRepository(Note, ds);
        await (0, testlab_1.expect)(repo.beginTransaction({})).to.be.rejectedWith('beginTransaction must be function implemented by the connector');
    });
    it('calls connector beginTransaction() when available', async () => {
        const crudDs = new __1.juggler.DataSource({
            name: 'db',
            connector: crud_connector_stub_1.CrudConnectorStub,
        });
        const repo = new __1.DefaultTransactionalRepository(Note, crudDs);
        const res = await repo.beginTransaction();
        (0, testlab_1.expect)(res).to.be.instanceOf(TransactionClass);
    });
});
//# sourceMappingURL=legacy-juggler-bridge.unit.js.map
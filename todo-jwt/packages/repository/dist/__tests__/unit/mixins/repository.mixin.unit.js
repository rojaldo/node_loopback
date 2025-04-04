"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../..");
const decorators_1 = require("../../../decorators");
describe('RepositoryMixin', () => {
    it('mixed class has .repository()', () => {
        const myApp = new AppWithRepoMixin();
        (0, testlab_1.expect)(typeof myApp.repository).to.be.eql('function');
    });
    it('binds repository from app.repository()', () => {
        const myApp = new AppWithRepoMixin();
        expectNoteRepoToNotBeBound(myApp);
        myApp.repository(NoteRepo);
        expectNoteRepoToBeBound(myApp);
    });
    it('binds singleton repository from app.repository()', () => {
        let SingletonNoteRepo = class SingletonNoteRepo extends NoteRepo {
        };
        SingletonNoteRepo = tslib_1.__decorate([
            (0, core_1.injectable)({ scope: core_1.BindingScope.SINGLETON })
        ], SingletonNoteRepo);
        const myApp = new AppWithRepoMixin();
        const binding = myApp.repository(SingletonNoteRepo);
        (0, testlab_1.expect)(binding.scope).to.equal(core_1.BindingScope.SINGLETON);
    });
    it('mixed class has .getRepository()', () => {
        const myApp = new AppWithRepoMixin();
        (0, testlab_1.expect)(typeof myApp.getRepository).to.eql('function');
    });
    it('gets repository instance from app.getRepository()', async () => {
        const myApp = new AppWithRepoMixin();
        myApp.bind('repositories.NoteRepo').toClass(NoteRepo).tag('repository');
        const repoInstance = await myApp.getRepository(NoteRepo);
        (0, testlab_1.expect)(repoInstance).to.be.instanceOf(NoteRepo);
    });
    it('binds user defined component without repository', () => {
        class EmptyTestComponent {
        }
        const myApp = new AppWithRepoMixin();
        myApp.component(EmptyTestComponent);
        expectComponentToBeBound(myApp, EmptyTestComponent);
    });
    it('binds user defined component with repository from .component()', () => {
        const myApp = new AppWithRepoMixin();
        const boundComponentsBefore = myApp.find('components.*').map(b => b.key);
        (0, testlab_1.expect)(boundComponentsBefore).to.be.empty();
        expectNoteRepoToNotBeBound(myApp);
        myApp.component(TestComponent);
        expectComponentToBeBound(myApp, TestComponent);
        expectNoteRepoToBeBound(myApp);
    });
    it('binds user defined component with models', () => {
        let MyModel = class MyModel extends __1.Model {
        };
        MyModel = tslib_1.__decorate([
            (0, decorators_1.model)()
        ], MyModel);
        class MyModelComponent {
            constructor() {
                this.models = [MyModel];
            }
        }
        const myApp = new AppWithRepoMixin();
        myApp.component(MyModelComponent);
        const boundModels = myApp.find('models.*').map(b => b.key);
        (0, testlab_1.expect)(boundModels).to.containEql('models.MyModel');
        const modelCtor = myApp.getSync('models.MyModel');
        (0, testlab_1.expect)(modelCtor).to.be.equal(MyModel);
    });
    context('migrateSchema', () => {
        let app;
        let migrateStub;
        let updateStub;
        let DataSourceStub;
        beforeEach(setupTestHelpers);
        it('is a method provided by the mixin', () => {
            (0, testlab_1.expect)(typeof app.migrateSchema).to.be.eql('function');
        });
        it('calls autoupdate on registered datasources', async () => {
            app.dataSource(DataSourceStub);
            await app.migrateSchema({ existingSchema: 'alter' });
            testlab_1.sinon.assert.called(updateStub);
            testlab_1.sinon.assert.notCalled(migrateStub);
        });
        it('calls automigrate on registered datasources', async () => {
            app.dataSource(DataSourceStub);
            await app.migrateSchema({ existingSchema: 'drop' });
            testlab_1.sinon.assert.called(migrateStub);
            testlab_1.sinon.assert.notCalled(updateStub);
        });
        it('skips datasources not implementing schema migrations', async () => {
            class OtherDataSource {
                constructor() {
                    this.name = 'other';
                    this.connector = undefined;
                    this.settings = {};
                }
            }
            // Bypass app.dataSource type checks and bind a custom datasource class
            app
                .bind('datasources.other')
                .toClass(OtherDataSource)
                .tag('datasource')
                .inScope(core_1.BindingScope.SINGLETON);
            await app.migrateSchema({ existingSchema: 'drop' });
            // the test passes when migrateSchema() does not throw any error
        });
        it('skips datasources that disables migration', async () => {
            let modelsMigrated = ['no models were migrated'];
            const ds = new __1.juggler.DataSource({
                name: 'db',
                connector: 'memory',
                disableMigration: true,
            });
            // FIXME(bajtos) typings for connectors are missing autoupdate/autoupgrade
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ds.connector.automigrate = function (models, cb) {
                modelsMigrated = models;
                cb();
            };
            app.dataSource(ds);
            class Product extends __1.Entity {
            }
            Product.definition = new __1.ModelDefinition('Product').addProperty('id', {
                type: 'number',
                id: true,
            });
            class ProductRepository extends __1.DefaultCrudRepository {
                constructor() {
                    super(Product, ds);
                }
            }
            app.repository(ProductRepository);
            await app.migrateSchema({ existingSchema: 'drop' });
            (0, testlab_1.expect)(modelsMigrated).to.eql(['no models were migrated']);
        });
        it('attaches all models to datasources', async () => {
            let modelsMigrated = ['no models were migrated'];
            const ds = new __1.juggler.DataSource({ name: 'db', connector: 'memory' });
            // FIXME(bajtos) typings for connectors are missing autoupdate/autoupgrade
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ds.connector.automigrate = function (models, cb) {
                modelsMigrated = models;
                cb();
            };
            app.dataSource(ds);
            class Product extends __1.Entity {
            }
            Product.definition = new __1.ModelDefinition('Product').addProperty('id', {
                type: 'number',
                id: true,
            });
            class ProductRepository extends __1.DefaultCrudRepository {
                constructor() {
                    super(Product, ds);
                }
            }
            app.repository(ProductRepository);
            await app.migrateSchema({ existingSchema: 'drop' });
            (0, testlab_1.expect)(modelsMigrated).to.eql(['Product']);
        });
        it('migrates selected models only', async () => {
            app.dataSource(DataSourceStub);
            await app.migrateSchema({ existingSchema: 'drop', models: ['Category'] });
            testlab_1.sinon.assert.calledWith(migrateStub, ['Category']);
            testlab_1.sinon.assert.notCalled(updateStub);
        });
        function setupTestHelpers() {
            app = new AppWithRepoMixin();
            migrateStub = testlab_1.sinon.stub().resolves();
            updateStub = testlab_1.sinon.stub().resolves();
            DataSourceStub = class extends __1.juggler.DataSource {
                automigrate(models) {
                    return migrateStub(models);
                }
                autoupdate(models) {
                    return updateStub(models);
                }
            };
        }
    });
    class AppWithRepoMixin extends (0, __1.RepositoryMixin)(core_1.Application) {
    }
    class NoteRepo {
        constructor() {
            const ds = new __1.juggler.DataSource({
                name: 'db',
                connector: 'memory',
            });
            this.model = ds.createModel('note', { title: 'string', content: 'string' }, {});
        }
    }
    class TestComponent {
        constructor() {
            this.repositories = [NoteRepo];
        }
    }
    function expectNoteRepoToBeBound(myApp) {
        const boundRepositories = myApp.find('repositories.*').map(b => b.key);
        (0, testlab_1.expect)(boundRepositories).to.containEql('repositories.NoteRepo');
        const binding = myApp.getBinding('repositories.NoteRepo');
        (0, testlab_1.expect)(binding.scope).to.equal(core_1.BindingScope.TRANSIENT);
        (0, testlab_1.expect)(binding.tagMap).to.have.property('repository');
        const repoInstance = myApp.getSync('repositories.NoteRepo');
        (0, testlab_1.expect)(repoInstance).to.be.instanceOf(NoteRepo);
    }
    function expectNoteRepoToNotBeBound(myApp) {
        const boundRepos = myApp.find('repositories.*').map(b => b.key);
        (0, testlab_1.expect)(boundRepos).to.be.empty();
    }
    function expectComponentToBeBound(myApp, component) {
        const boundComponents = myApp.find('components.*').map(b => b.key);
        (0, testlab_1.expect)(boundComponents).to.containEql(`components.${component.name}`);
        const componentInstance = myApp.getSync(`components.${component.name}`);
        (0, testlab_1.expect)(componentInstance).to.be.instanceOf(component);
    }
});
describe('RepositoryMixin dataSource', () => {
    it('mixes into the target class', () => {
        const myApp = new AppWithRepoMixin();
        (0, testlab_1.expect)(typeof myApp.dataSource).to.be.eql('function');
    });
    it('does not conflict with previous binding keys', () => {
        const myApp = new AppWithRepoMixin();
        const withoutDataSource = myApp.find('datasources.*');
        (0, testlab_1.expect)(withoutDataSource).to.be.empty();
    });
    it('binds dataSource class using the dataSourceName property', () => {
        const myApp = new AppWithRepoMixin();
        const binding = myApp.dataSource(FooDataSource);
        (0, testlab_1.expect)(binding.tagMap).to.have.property('datasource');
        expectDataSourceToBeBound(myApp, FooDataSource, 'foo');
    });
    it('binds dataSource class using the given name', () => {
        const myApp = new AppWithRepoMixin();
        myApp.dataSource(FooDataSource, 'bar');
        expectDataSourceToBeBound(myApp, FooDataSource, 'bar');
    });
    it('binds dataSource class using options', () => {
        const myApp = new AppWithRepoMixin();
        const binding = myApp.dataSource(FooDataSource, {
            name: 'bar',
            namespace: 'my-datasources',
        });
        (0, testlab_1.expect)(binding.key).to.eql('my-datasources.bar');
    });
    it('binds dataSource class using Class name', () => {
        const myApp = new AppWithRepoMixin();
        myApp.dataSource(BarDataSource);
        expectDataSourceToBeBound(myApp, BarDataSource, 'BarDataSource');
    });
    it('binds dataSource class instance using dataSourceName property', () => {
        const myApp = new AppWithRepoMixin();
        myApp.dataSource(new FooDataSource());
        expectDataSourceToBeBound(myApp, FooDataSource, 'foo');
    });
    it('binds dataSource class instance using custom name', () => {
        const myApp = new AppWithRepoMixin();
        myApp.dataSource(new FooDataSource(), 'bar');
        expectDataSourceToBeBound(myApp, FooDataSource, 'bar');
    });
    const expectDataSourceToBeBound = (app, ds, name) => {
        (0, testlab_1.expect)(app.find('datasources.*').map(d => d.key)).to.containEql(`datasources.${name}`);
        (0, testlab_1.expect)(app.findByTag('datasource').map(d => d.key)).to.containEql(`datasources.${name}`);
        (0, testlab_1.expect)(app.getSync(`datasources.${name}`)).to.be.instanceOf(ds);
    };
    class AppWithRepoMixin extends (0, __1.RepositoryMixin)(core_1.Application) {
    }
    class FooDataSource extends __1.juggler.DataSource {
        constructor() {
            super({
                name: 'foo',
                connector: 'memory',
            });
        }
    }
    FooDataSource.dataSourceName = 'foo';
    class BarDataSource extends __1.juggler.DataSource {
        constructor() {
            super({
                name: 'foo',
                connector: 'memory',
            });
        }
    }
});
describe('RepositoryMixin model', () => {
    it('mixes into the target class', () => {
        const myApp = new AppWithRepoMixin();
        (0, testlab_1.expect)(typeof myApp.model).to.be.eql('function');
    });
    it('binds a model class', () => {
        const myApp = new AppWithRepoMixin();
        const binding = myApp.model(MyModel);
        (0, testlab_1.expect)(binding.key).to.eql('models.MyModel');
        (0, testlab_1.expect)(binding.tagMap).to.have.property('model');
        (0, testlab_1.expect)(myApp.getSync('models.MyModel')).to.eql(MyModel);
    });
    let MyModel = class MyModel {
    };
    tslib_1.__decorate([
        (0, decorators_1.property)(),
        tslib_1.__metadata("design:type", String)
    ], MyModel.prototype, "name", void 0);
    MyModel = tslib_1.__decorate([
        (0, decorators_1.model)()
    ], MyModel);
    class AppWithRepoMixin extends (0, __1.RepositoryMixin)(core_1.Application) {
    }
});
//# sourceMappingURL=repository.mixin.unit.js.map
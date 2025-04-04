"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultTransactionalRepository = exports.DefaultCrudRepository = exports.ensurePromise = exports.bindModel = exports.juggler = void 0;
const tslib_1 = require("tslib");
const assert_1 = tslib_1.__importDefault(require("assert"));
const loopback_datasource_juggler_1 = tslib_1.__importDefault(require("loopback-datasource-juggler"));
const errors_1 = require("../errors");
const model_1 = require("../model");
const relations_1 = require("../relations");
const type_resolver_1 = require("../type-resolver");
var juggler;
(function (juggler) {
    juggler.DataSource = loopback_datasource_juggler_1.default.DataSource;
    juggler.ModelBase = loopback_datasource_juggler_1.default.ModelBase;
    juggler.PersistedModel = loopback_datasource_juggler_1.default.PersistedModel;
    juggler.KeyValueModel = loopback_datasource_juggler_1.default.KeyValueModel;
    // eslint-disable-next-line @typescript-eslint/no-shadow
    juggler.IsolationLevel = loopback_datasource_juggler_1.default.IsolationLevel;
})(juggler || (exports.juggler = juggler = {}));
function isModelClass(propertyType) {
    return (!(0, type_resolver_1.isTypeResolver)(propertyType) &&
        typeof propertyType === 'function' &&
        typeof propertyType.definition === 'object' &&
        propertyType.toString().startsWith('class '));
}
/**
 * This is a bridge to the legacy DAO class. The function mixes DAO methods
 * into a model class and attach it to a given data source
 * @param modelClass - Model class
 * @param ds - Data source
 * @returns {} The new model class with DAO (CRUD) operations
 */
function bindModel(modelClass, ds) {
    const BoundModelClass = class extends modelClass {
    };
    BoundModelClass.attachTo(ds);
    return BoundModelClass;
}
exports.bindModel = bindModel;
/**
 * Ensure the value is a promise
 * @param p - Promise or void
 */
function ensurePromise(p) {
    if (p && p instanceof Promise) {
        return p;
    }
    else {
        return Promise.reject(new Error('The value should be a Promise: ' + p));
    }
}
exports.ensurePromise = ensurePromise;
/**
 * Default implementation of CRUD repository using legacy juggler model
 * and data source
 */
class DefaultCrudRepository {
    /**
     * Constructor of DefaultCrudRepository
     * @param entityClass - LoopBack 4 entity class
     * @param dataSource - Legacy juggler data source
     */
    constructor(
    // entityClass should have type "typeof T", but that's not supported by TSC
    entityClass, dataSource) {
        this.entityClass = entityClass;
        this.dataSource = dataSource;
        this.inclusionResolvers = new Map();
        const definition = entityClass.definition;
        (0, assert_1.default)(!!definition, `Entity ${entityClass.name} must have valid model definition.`);
        (0, assert_1.default)(definition.idProperties().length > 0, `Entity ${entityClass.name} must have at least one id/pk property.`);
        this.modelClass = this.ensurePersistedModel(entityClass);
    }
    // Create an internal legacy Model attached to the datasource
    ensurePersistedModel(entityClass) {
        const definition = entityClass.definition;
        (0, assert_1.default)(!!definition, `Entity ${entityClass.name} must have valid model definition.`);
        const dataSource = this.dataSource;
        const model = dataSource.getModel(definition.name);
        if (model) {
            // The backing persisted model has been already defined.
            return model;
        }
        return this.definePersistedModel(entityClass);
    }
    /**
     * Creates a legacy persisted model class, attaches it to the datasource and
     * returns it. This method can be overridden in sub-classes to acess methods
     * and properties in the generated model class.
     * @param entityClass - LB4 Entity constructor
     */
    definePersistedModel(entityClass) {
        const dataSource = this.dataSource;
        const definition = entityClass.definition;
        // To handle circular reference back to the same model,
        // we create a placeholder model that will be replaced by real one later
        dataSource.getModel(definition.name, true /* forceCreate */);
        // We need to convert property definitions from PropertyDefinition
        // to plain data object because of a juggler limitation
        const properties = {};
        // We need to convert PropertyDefinition into the definition that
        // the juggler understands
        Object.entries(definition.properties).forEach(([key, value]) => {
            // always clone value so that we do not modify the original model definition
            // ensures that model definitions can be reused with multiple datasources
            if (value.type === 'array' || value.type === Array) {
                value = Object.assign({}, value, {
                    type: [value.itemType && this.resolvePropertyType(value.itemType)],
                });
                delete value.itemType;
            }
            else {
                value = Object.assign({}, value, {
                    type: this.resolvePropertyType(value.type),
                });
            }
            properties[key] = Object.assign({}, value);
        });
        const modelClass = dataSource.createModel(definition.name, properties, Object.assign(
        // settings that users can override
        { strict: true }, 
        // user-defined settings
        definition.settings, 
        // settings enforced by the framework
        { strictDelete: false }));
        modelClass.attachTo(dataSource);
        return modelClass;
    }
    resolvePropertyType(type) {
        const resolved = (0, type_resolver_1.resolveType)(type);
        return isModelClass(resolved)
            ? this.ensurePersistedModel(resolved)
            : resolved;
    }
    /**
     * @deprecated
     * Function to create a constrained relation repository factory
     *
     * Use `this.createHasManyRepositoryFactoryFor()` instead
     *
     * @param relationName - Name of the relation defined on the source model
     * @param targetRepo - Target repository instance
     */
    _createHasManyRepositoryFactoryFor(relationName, targetRepositoryGetter) {
        return this.createHasManyRepositoryFactoryFor(relationName, targetRepositoryGetter);
    }
    /**
     * Function to create a constrained relation repository factory
     *
     * @example
     * ```ts
     * class CustomerRepository extends DefaultCrudRepository<
     *   Customer,
     *   typeof Customer.prototype.id,
     *   CustomerRelations
     * > {
     *   public readonly orders: HasManyRepositoryFactory<Order, typeof Customer.prototype.id>;
     *
     *   constructor(
     *     protected db: juggler.DataSource,
     *     orderRepository: EntityCrudRepository<Order, typeof Order.prototype.id>,
     *   ) {
     *     super(Customer, db);
     *     this.orders = this._createHasManyRepositoryFactoryFor(
     *       'orders',
     *       orderRepository,
     *     );
     *   }
     * }
     * ```
     *
     * @param relationName - Name of the relation defined on the source model
     * @param targetRepo - Target repository instance
     */
    createHasManyRepositoryFactoryFor(relationName, targetRepositoryGetter) {
        const meta = this.entityClass.definition.relations[relationName];
        return (0, relations_1.createHasManyRepositoryFactory)(meta, targetRepositoryGetter);
    }
    /**
     * Function to create a constrained hasManyThrough relation repository factory
     *
     * @example
     * ```ts
     * class CustomerRepository extends DefaultCrudRepository<
     *   Customer,
     *   typeof Customer.prototype.id,
     *   CustomerRelations
     * > {
     *   public readonly cartItems: HasManyRepositoryFactory<CartItem, typeof Customer.prototype.id>;
     *
     *   constructor(
     *     protected db: juggler.DataSource,
     *     cartItemRepository: EntityCrudRepository<CartItem, typeof, CartItem.prototype.id>,
     *     throughRepository: EntityCrudRepository<Through, typeof Through.prototype.id>,
     *   ) {
     *     super(Customer, db);
     *     this.cartItems = this.createHasManyThroughRepositoryFactoryFor(
     *       'cartItems',
     *       cartItemRepository,
     *     );
     *   }
     * }
     * ```
     *
     * @param relationName - Name of the relation defined on the source model
     * @param targetRepo - Target repository instance
     * @param throughRepo - Through repository instance
     */
    createHasManyThroughRepositoryFactoryFor(relationName, targetRepositoryGetter, throughRepositoryGetter) {
        const meta = this.entityClass.definition.relations[relationName];
        return (0, relations_1.createHasManyThroughRepositoryFactory)(meta, targetRepositoryGetter, throughRepositoryGetter);
    }
    /**
     * @deprecated
     * Function to create a belongs to accessor
     *
     * Use `this.createBelongsToAccessorFor()` instead
     *
     * @param relationName - Name of the relation defined on the source model
     * @param targetRepo - Target repository instance
     */
    _createBelongsToAccessorFor(relationName, targetRepositoryGetter) {
        return this.createBelongsToAccessorFor(relationName, targetRepositoryGetter);
    }
    /**
     * Function to create a belongs to accessor
     *
     * @param relationName - Name of the relation defined on the source model
     * @param targetRepo - Target repository instance
     */
    createBelongsToAccessorFor(relationName, targetRepositoryGetter) {
        const meta = this.entityClass.definition.relations[relationName];
        return (0, relations_1.createBelongsToAccessor)(meta, targetRepositoryGetter, this);
    }
    /**
     * @deprecated
     * Function to create a constrained hasOne relation repository factory
     *
     * @param relationName - Name of the relation defined on the source model
     * @param targetRepo - Target repository instance
     */
    _createHasOneRepositoryFactoryFor(relationName, targetRepositoryGetter) {
        return this.createHasOneRepositoryFactoryFor(relationName, targetRepositoryGetter);
    }
    /**
     * Function to create a constrained hasOne relation repository factory
     *
     * @param relationName - Name of the relation defined on the source model
     * @param targetRepo - Target repository instance
     */
    createHasOneRepositoryFactoryFor(relationName, targetRepositoryGetter) {
        const meta = this.entityClass.definition.relations[relationName];
        return (0, relations_1.createHasOneRepositoryFactory)(meta, targetRepositoryGetter);
    }
    /**
     * @deprecated
     * Function to create a references many accessor
     *
     * Use `this.createReferencesManyAccessorFor()` instead
     *
     * @param relationName - Name of the relation defined on the source model
     * @param targetRepo - Target repository instance
     */
    _createReferencesManyAccessorFor(relationName, targetRepoGetter) {
        return this.createReferencesManyAccessorFor(relationName, targetRepoGetter);
    }
    /**
     * Function to create a references many accessor
     *
     * @param relationName - Name of the relation defined on the source model
     * @param targetRepo - Target repository instance
     */
    createReferencesManyAccessorFor(relationName, targetRepoGetter) {
        const meta = this.entityClass.definition.relations[relationName];
        return (0, relations_1.createReferencesManyAccessor)(meta, targetRepoGetter, this);
    }
    async create(entity, options) {
        // perform persist hook
        const data = await this.entityToData(entity, options);
        const model = await ensurePromise(this.modelClass.create(data, options));
        return this.toEntity(model);
    }
    async createAll(entities, options) {
        // perform persist hook
        const data = await Promise.all(entities.map(e => this.entityToData(e, options)));
        const models = await ensurePromise(this.modelClass.createAll(data, options));
        return this.toEntities(models);
    }
    async save(entity, options) {
        const id = this.entityClass.getIdOf(entity);
        if (id == null) {
            return this.create(entity, options);
        }
        else {
            await this.replaceById(id, entity, options);
            return new this.entityClass(entity.toObject());
        }
    }
    async find(filter, options) {
        const include = filter === null || filter === void 0 ? void 0 : filter.include;
        const models = await ensurePromise(this.modelClass.find(this.normalizeFilter(filter), options));
        const entities = this.toEntities(models);
        return this.includeRelatedModels(entities, include, options);
    }
    async findOne(filter, options) {
        const model = await ensurePromise(this.modelClass.findOne(this.normalizeFilter(filter), options));
        if (!model)
            return null;
        const entity = this.toEntity(model);
        const include = filter === null || filter === void 0 ? void 0 : filter.include;
        const resolved = await this.includeRelatedModels([entity], include, options);
        return resolved[0];
    }
    async findById(id, filter, options) {
        const include = filter === null || filter === void 0 ? void 0 : filter.include;
        const model = await ensurePromise(this.modelClass.findById(id, this.normalizeFilter(filter), options));
        if (!model) {
            throw new errors_1.EntityNotFoundError(this.entityClass, id);
        }
        const entity = this.toEntity(model);
        const resolved = await this.includeRelatedModels([entity], include, options);
        return resolved[0];
    }
    update(entity, options) {
        return this.updateById(entity.getId(), entity, options);
    }
    async delete(entity, options) {
        // perform persist hook
        await this.entityToData(entity, options);
        return this.deleteById(entity.getId(), options);
    }
    async updateAll(data, where, options) {
        where = where !== null && where !== void 0 ? where : {};
        const persistedData = await this.entityToData(data, options);
        const result = await ensurePromise(this.modelClass.updateAll(where, persistedData, options));
        return { count: result.count };
    }
    async updateById(id, data, options) {
        if (!Object.keys(data).length) {
            throw new errors_1.InvalidBodyError(this.entityClass, id);
        }
        if (id === undefined) {
            throw new Error('Invalid Argument: id cannot be undefined');
        }
        const idProp = this.modelClass.definition.idName();
        const where = {};
        where[idProp] = id;
        const result = await this.updateAll(data, where, options);
        if (result.count === 0) {
            throw new errors_1.EntityNotFoundError(this.entityClass, id);
        }
    }
    async replaceById(id, data, options) {
        try {
            const payload = await this.entityToData(data, options);
            await ensurePromise(this.modelClass.replaceById(id, payload, options));
        }
        catch (err) {
            if (err.statusCode === 404) {
                throw new errors_1.EntityNotFoundError(this.entityClass, id);
            }
            throw err;
        }
    }
    async deleteAll(where, options) {
        const result = await ensurePromise(this.modelClass.deleteAll(where, options));
        return { count: result.count };
    }
    async deleteById(id, options) {
        const result = await ensurePromise(this.modelClass.deleteById(id, options));
        if (result.count === 0) {
            throw new errors_1.EntityNotFoundError(this.entityClass, id);
        }
    }
    async count(where, options) {
        const result = await ensurePromise(this.modelClass.count(where, options));
        return { count: result };
    }
    exists(id, options) {
        return ensurePromise(this.modelClass.exists(id, options));
    }
    async execute(...args) {
        return ensurePromise(this.dataSource.execute(...args));
    }
    toEntity(model) {
        return new this.entityClass(model.toObject());
    }
    toEntities(models) {
        return models.map(m => this.toEntity(m));
    }
    /**
     * Register an inclusion resolver for the related model name.
     *
     * @param relationName - Name of the relation defined on the source model
     * @param resolver - Resolver function for getting related model entities
     */
    registerInclusionResolver(relationName, resolver) {
        this.inclusionResolvers.set(relationName, resolver);
    }
    /**
     * Returns model instances that include related models of this repository
     * that have a registered resolver.
     *
     * @param entities - An array of entity instances or data
     * @param include -Inclusion filter
     * @param options - Options for the operations
     */
    async includeRelatedModels(entities, include, options) {
        return (0, relations_1.includeRelatedModels)(this, entities, include, options);
    }
    /**
     * This function works as a persist hook.
     * It converts an entity from the CRUD operations' caller
     * to a persistable data that can will be stored in the
     * back-end database.
     *
     * User can extend `DefaultCrudRepository` then override this
     * function to execute custom persist hook.
     * @param entity The entity passed from CRUD operations' caller.
     * @param options
     */
    async entityToData(entity, options = {}) {
        return this.ensurePersistable(entity, options);
    }
    /** Converts an entity object to a JSON object to check if it contains navigational property.
     * Throws an error if `entity` contains navigational property.
     *
     * @param entity The entity passed from CRUD operations' caller.
     * @param options
     */
    ensurePersistable(entity, options = {}) {
        // FIXME(bajtos) Ideally, we should call toJSON() to convert R to data object
        // Unfortunately that breaks replaceById for MongoDB connector, where we
        // would call replaceId with id *argument* set to ObjectID value but
        // id *property* set to string value.
        /*
        const data: AnyObject =
          typeof entity.toJSON === 'function' ? entity.toJSON() : {...entity};
        */
        const data = new this.entityClass(entity);
        (0, model_1.rejectNavigationalPropertiesInData)(this.entityClass, data);
        return data;
    }
    /**
     * Removes juggler's "include" filter as it does not apply to LoopBack 4
     * relations.
     *
     * @param filter - Query filter
     */
    normalizeFilter(filter) {
        if (!filter)
            return undefined;
        return { ...filter, include: undefined };
    }
}
exports.DefaultCrudRepository = DefaultCrudRepository;
/**
 * Default implementation of CRUD repository using legacy juggler model
 * and data source with beginTransaction() method for connectors which
 * support Transactions
 */
class DefaultTransactionalRepository extends DefaultCrudRepository {
    async beginTransaction(options) {
        const dsOptions = options !== null && options !== void 0 ? options : {};
        // juggler.Transaction still has the Promise/Callback variants of the
        // Transaction methods
        // so we need it cast it back
        return (await this.dataSource.beginTransaction(dsOptions));
    }
}
exports.DefaultTransactionalRepository = DefaultTransactionalRepository;
//# sourceMappingURL=legacy-juggler-bridge.js.map
"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.repository = exports.RepositoryMetadata = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const assert_1 = tslib_1.__importDefault(require("assert"));
const repositories_1 = require("../repositories");
const legacy_juggler_bridge_1 = require("../repositories/legacy-juggler-bridge");
/**
 * Metadata for a repository
 */
class RepositoryMetadata {
    /**
     * Constructor for RepositoryMetadata
     *
     * @param modelOrRepo - Name or class of the model. If the value is a string and
     * `dataSource` is not present, it will treated as the name of a predefined
     * repository
     * @param dataSource - Name or instance of the data source
     *
     * For example:
     *
     * - new RepositoryMetadata(repoName);
     * - new RepositoryMetadata(modelName, dataSourceName);
     * - new RepositoryMetadata(modelClass, dataSourceInstance);
     * - new RepositoryMetadata(modelName, dataSourceInstance);
     * - new RepositoryMetadata(modelClass, dataSourceName);
     */
    constructor(modelOrRepo, dataSource) {
        this.name =
            typeof modelOrRepo === 'string' && dataSource === undefined
                ? modelOrRepo
                : undefined;
        this.modelName =
            typeof modelOrRepo === 'string' && dataSource != null
                ? modelOrRepo
                : undefined;
        this.modelClass =
            typeof modelOrRepo === 'function' ? modelOrRepo : undefined;
        this.dataSourceName =
            typeof dataSource === 'string' ? dataSource : undefined;
        this.dataSource = typeof dataSource === 'object' ? dataSource : undefined;
    }
}
exports.RepositoryMetadata = RepositoryMetadata;
function repository(modelOrRepo, dataSource) {
    // if string, repository or not a model ctor,
    // keep it a string / assign to ctor's name (string) for DI
    const stringOrModel = typeof modelOrRepo !== 'string' && !modelOrRepo.prototype.getId
        ? modelOrRepo.name
        : modelOrRepo;
    const meta = new RepositoryMetadata(stringOrModel, dataSource);
    return function (target, key, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    descriptorOrIndex) {
        if (key || typeof descriptorOrIndex === 'number') {
            if (meta.name) {
                // Make it shortcut to `@inject('repositories.MyRepo')`
                // Please note key is undefined for constructor. If strictNullChecks
                // is true, the compiler will complain as reflect-metadata won't
                // accept undefined or null for key. Use ! to fool the compiler.
                (0, core_1.inject)('repositories.' + meta.name, meta)(target, key, descriptorOrIndex);
            }
            else {
                // Use repository-factory to create a repository from model + dataSource
                (0, core_1.inject)('', meta, resolve)(target, key, descriptorOrIndex);
            }
            return;
        }
        // Mixin repository into the class
        throw new Error('Class level @repository is not implemented');
    };
}
exports.repository = repository;
(function (repository) {
    /**
     * Decorator used to inject a Getter for a repository
     * Mainly intended for usage with repository injections on relation repository
     * factory
     * @param nameOrClass - The repository class (ProductRepository) or a string name ('ProductRepository').
     */
    function getter(nameOrClass) {
        const name = typeof nameOrClass === 'string' ? nameOrClass : nameOrClass.name;
        return core_1.inject.getter(`repositories.${name}`);
    }
    repository.getter = getter;
})(repository || (exports.repository = repository = {}));
/**
 * Resolve the @repository injection
 * @param ctx - Context
 * @param injection - Injection metadata
 */
async function resolve(ctx, injection) {
    const meta = injection.metadata;
    let modelClass = meta.modelClass;
    if (meta.modelName) {
        modelClass = (await ctx.get('models.' + meta.modelName));
    }
    if (!modelClass) {
        throw new Error('Invalid repository config: ' +
            ' neither modelClass nor modelName was specified.');
    }
    let dataSource = meta.dataSource;
    if (meta.dataSourceName) {
        dataSource = await ctx.get('datasources.' + meta.dataSourceName);
    }
    (0, assert_1.default)(dataSource instanceof legacy_juggler_bridge_1.juggler.DataSource, 'DataSource must be provided');
    return new repositories_1.DefaultCrudRepository(modelClass, dataSource);
}
//# sourceMappingURL=repository.decorator.js.map
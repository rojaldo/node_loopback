"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/rest-crud
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrudRestApiBuilder = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const model_api_builder_1 = require("@loopback/model-api-builder");
const repository_1 = require("@loopback/repository");
const debug_1 = tslib_1.__importDefault(require("debug"));
const _1 = require(".");
const debug = (0, debug_1.default)('loopback:boot:crud-rest');
let CrudRestApiBuilder = class CrudRestApiBuilder {
    constructor() {
        this.pattern = 'CrudRest';
    }
    build(application, modelClass, cfg) {
        const modelName = modelClass.name;
        const config = cfg;
        if (!config.basePath) {
            throw new Error(`Missing required field "basePath" in configuration for model ${modelName}.`);
        }
        if (!(modelClass.prototype instanceof repository_1.Entity)) {
            throw new Error(`CrudRestController requires a model that extends 'Entity'. (Model name ${modelName} does not extend 'Entity')`);
        }
        const entityClass = modelClass;
        let repoBindingName = `repositories.${entityClass.name}Repository`;
        if (application.isBound(repoBindingName)) {
            debug('Using the existing Repository binding %j', repoBindingName);
        }
        else {
            // repository class does not exist
            const repositoryClass = setupCrudRepository(entityClass, config);
            application.repository(repositoryClass);
            repoBindingName = repositoryClass.name;
            debug('Registered repository class', repoBindingName);
        }
        const controllerClass = setupCrudRestController(entityClass, config);
        application.controller(controllerClass);
        debug('Registered controller class', controllerClass.name);
        return Promise.resolve();
    }
};
exports.CrudRestApiBuilder = CrudRestApiBuilder;
exports.CrudRestApiBuilder = CrudRestApiBuilder = tslib_1.__decorate([
    (0, core_1.injectable)(model_api_builder_1.asModelApiBuilder)
], CrudRestApiBuilder);
/**
 * Set up a CRUD Repository class for the given Entity class.
 *
 * @param entityClass - the Entity class the repository is built for
 * @param config - configuration of the Entity class
 */
function setupCrudRepository(entityClass, config) {
    const repositoryClass = (0, repository_1.defineCrudRepositoryClass)(entityClass);
    injectFirstConstructorArg(repositoryClass, `datasources.${config.dataSource}`);
    return repositoryClass;
}
/**
 * Set up a CRUD Controller class for the given Entity class.
 *
 * @param entityClass - the Entity class the controller is built for
 * @param config - configuration of the Entity class
 */
function setupCrudRestController(entityClass, config) {
    const controllerClass = (0, _1.defineCrudRestController)(entityClass, 
    // important - forward the entire config object to allow controller
    // factories to accept additional (custom) config options
    config);
    injectFirstConstructorArg(controllerClass, `repositories.${entityClass.name}Repository`);
    return controllerClass;
}
/**
 * Inject given key into a given class constructor
 *
 * @param ctor - constructor for a class (e.g. a controller class)
 * @param key - binding to use in order to resolve the value of the decorated
 * constructor parameter or property
 */
function injectFirstConstructorArg(ctor, key) {
    (0, core_1.inject)(key)(ctor, undefined, // constructor member
    0);
}
//# sourceMappingURL=crud-rest.api-builder.js.map
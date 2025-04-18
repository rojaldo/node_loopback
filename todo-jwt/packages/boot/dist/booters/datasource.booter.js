"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/boot
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSourceDefaults = exports.DataSourceBooter = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const keys_1 = require("../keys");
const types_1 = require("../types");
const base_artifact_booter_1 = require("./base-artifact.booter");
/**
 * A class that extends BaseArtifactBooter to boot the 'DataSource' artifact type.
 * Discovered DataSources are bound using `app.dataSource()`.
 *
 * Supported phases: configure, discover, load
 *
 * @param app - Application instance
 * @param projectRoot - Root of User Project relative to which all paths are resolved
 * @param bootConfig - DataSource Artifact Options Object
 */
let DataSourceBooter = class DataSourceBooter extends base_artifact_booter_1.BaseArtifactBooter {
    constructor(app, projectRoot, datasourceConfig = {}) {
        super(projectRoot, 
        // Set DataSource Booter Options if passed in via bootConfig
        Object.assign({}, exports.DataSourceDefaults, datasourceConfig));
        this.app = app;
        this.datasourceConfig = datasourceConfig;
    }
    /**
     * Uses super method to get a list of Artifact classes. Boot each file by
     * creating a DataSourceConstructor and binding it to the application class.
     */
    async load() {
        await super.load();
        /**
         * If DataSource Classes were discovered, we need to make sure RepositoryMixin
         * was used (so we have `app.dataSource()`) to perform the binding of a
         * DataSource Class.
         */
        if (this.classes.length > 0) {
            if (!this.app.dataSource) {
                console.warn('app.dataSource() function is needed for DataSourceBooter. You can add ' +
                    'it to your Application using RepositoryMixin from @loopback/repository.');
            }
            else {
                this.classes.forEach(cls => {
                    this.app.dataSource(cls);
                });
            }
        }
    }
};
exports.DataSourceBooter = DataSourceBooter;
exports.DataSourceBooter = DataSourceBooter = tslib_1.__decorate([
    (0, types_1.booter)('datasources'),
    tslib_1.__param(0, (0, core_1.inject)(core_1.CoreBindings.APPLICATION_INSTANCE)),
    tslib_1.__param(1, (0, core_1.inject)(keys_1.BootBindings.PROJECT_ROOT)),
    tslib_1.__param(2, (0, core_1.config)()),
    tslib_1.__metadata("design:paramtypes", [Object, String, Object])
], DataSourceBooter);
/**
 * Default ArtifactOptions for DataSourceBooter.
 */
exports.DataSourceDefaults = {
    dirs: ['datasources'],
    extensions: ['.datasource.js'],
    nested: true,
};
//# sourceMappingURL=datasource.booter.js.map
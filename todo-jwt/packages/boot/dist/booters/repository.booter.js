"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2019. All Rights Reserved.
// Node module: @loopback/boot
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryDefaults = exports.RepositoryBooter = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const keys_1 = require("../keys");
const types_1 = require("../types");
const base_artifact_booter_1 = require("./base-artifact.booter");
/**
 * A class that extends BaseArtifactBooter to boot the 'Repository' artifact type.
 * Discovered repositories are bound using `app.repository()` which must be added
 * to an Application using the `RepositoryMixin` from `@loopback/repository`.
 *
 * Supported phases: configure, discover, load
 *
 * @param app - Application instance
 * @param projectRoot - Root of User Project relative to which all paths are resolved
 * @param bootConfig - Repository Artifact Options Object
 */
let RepositoryBooter = class RepositoryBooter extends base_artifact_booter_1.BaseArtifactBooter {
    constructor(app, projectRoot, repositoryOptions = {}) {
        super(projectRoot, 
        // Set Repository Booter Options if passed in via bootConfig
        Object.assign({}, exports.RepositoryDefaults, repositoryOptions));
        this.app = app;
        this.repositoryOptions = repositoryOptions;
    }
    /**
     * Uses super method to get a list of Artifact classes. Boot each class by
     * binding it to the application using `app.repository(repository);` if present.
     */
    async load() {
        await super.load();
        /**
         * If Repository Classes were discovered, we need to make sure RepositoryMixin
         * was used (so we have `app.repository()`) to perform the binding of a
         * Repository Class.
         */
        if (this.classes.length > 0) {
            if (!this.app.repository) {
                console.warn('app.repository() function is needed for RepositoryBooter. You can add ' +
                    'it to your Application using RepositoryMixin from @loopback/repository.');
            }
            else {
                this.classes.forEach(cls => {
                    this.app.repository(cls);
                });
            }
        }
    }
};
exports.RepositoryBooter = RepositoryBooter;
exports.RepositoryBooter = RepositoryBooter = tslib_1.__decorate([
    (0, types_1.booter)('repositories'),
    tslib_1.__param(0, (0, core_1.inject)(core_1.CoreBindings.APPLICATION_INSTANCE)),
    tslib_1.__param(1, (0, core_1.inject)(keys_1.BootBindings.PROJECT_ROOT)),
    tslib_1.__param(2, (0, core_1.config)()),
    tslib_1.__metadata("design:paramtypes", [Object, String, Object])
], RepositoryBooter);
/**
 * Default ArtifactOptions for RepositoryBooter.
 */
exports.RepositoryDefaults = {
    dirs: ['repositories'],
    extensions: ['.repository.js'],
    nested: true,
};
//# sourceMappingURL=repository.booter.js.map
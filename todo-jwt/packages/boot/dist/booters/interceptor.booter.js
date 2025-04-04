"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/boot
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterceptorProviderDefaults = exports.InterceptorProviderBooter = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const debug_1 = tslib_1.__importDefault(require("debug"));
const keys_1 = require("../keys");
const types_1 = require("../types");
const base_artifact_booter_1 = require("./base-artifact.booter");
const debug = (0, debug_1.default)('loopback:boot:interceptor-booter');
/**
 * A class that extends BaseArtifactBooter to boot the 'InterceptorProvider' artifact type.
 *
 * Supported phases: configure, discover, load
 *
 * @param app - Application instance
 * @param projectRoot - Root of User Project relative to which all paths are resolved
 * @param bootConfig - InterceptorProvider Artifact Options Object
 */
let InterceptorProviderBooter = class InterceptorProviderBooter extends base_artifact_booter_1.BaseArtifactBooter {
    constructor(app, projectRoot, interceptorConfig = {}) {
        super(projectRoot, 
        // Set InterceptorProvider Booter Options if passed in via bootConfig
        Object.assign({}, exports.InterceptorProviderDefaults, interceptorConfig));
        this.app = app;
        this.interceptorConfig = interceptorConfig;
    }
    /**
     * Uses super method to get a list of Artifact classes. Boot each file by
     * creating a DataSourceConstructor and binding it to the application class.
     */
    async load() {
        await super.load();
        this.interceptors = this.classes;
        for (const interceptor of this.interceptors) {
            debug('Bind interceptor: %s', interceptor.name);
            const binding = this.app.interceptor(interceptor);
            debug('Binding created for interceptor: %j', binding);
        }
    }
};
exports.InterceptorProviderBooter = InterceptorProviderBooter;
exports.InterceptorProviderBooter = InterceptorProviderBooter = tslib_1.__decorate([
    (0, types_1.booter)('interceptors'),
    tslib_1.__param(0, (0, core_1.inject)(core_1.CoreBindings.APPLICATION_INSTANCE)),
    tslib_1.__param(1, (0, core_1.inject)(keys_1.BootBindings.PROJECT_ROOT)),
    tslib_1.__param(2, (0, core_1.config)()),
    tslib_1.__metadata("design:paramtypes", [core_1.Application, String, Object])
], InterceptorProviderBooter);
/**
 * Default ArtifactOptions for InterceptorProviderBooter.
 */
exports.InterceptorProviderDefaults = {
    dirs: ['interceptors'],
    extensions: ['.interceptor.js'],
    nested: true,
};
//# sourceMappingURL=interceptor.booter.js.map
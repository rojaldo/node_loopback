"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/boot
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceDefaults = exports.ServiceBooter = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const debug_1 = tslib_1.__importDefault(require("debug"));
const keys_1 = require("../keys");
const types_1 = require("../types");
const base_artifact_booter_1 = require("./base-artifact.booter");
const debug = (0, debug_1.default)('loopback:boot:service-booter');
/**
 * A class that extends BaseArtifactBooter to boot the 'Service' artifact type.
 * Discovered services are bound using `app.service()`.
 *
 * Supported phases: configure, discover, load
 *
 * @param app - Application instance
 * @param projectRoot - Root of User Project relative to which all paths are resolved
 * @param bootConfig - Service Artifact Options Object
 */
let ServiceBooter = class ServiceBooter extends base_artifact_booter_1.BaseArtifactBooter {
    constructor(app, projectRoot, serviceConfig = {}) {
        super(projectRoot, 
        // Set Service Booter Options if passed in via bootConfig
        Object.assign({}, exports.ServiceDefaults, serviceConfig));
        this.app = app;
        this.serviceConfig = serviceConfig;
    }
    /**
     * Uses super method to get a list of Artifact classes. Boot each file by
     * creating a DataSourceConstructor and binding it to the application class.
     */
    async load() {
        await super.load();
        for (const cls of this.classes) {
            if (!isBindableClass(cls))
                continue;
            debug('Bind class: %s', cls.name);
            const binding = this.app.service(cls);
            debug('Binding created for class: %j', binding);
        }
    }
};
exports.ServiceBooter = ServiceBooter;
exports.ServiceBooter = ServiceBooter = tslib_1.__decorate([
    (0, types_1.booter)('services'),
    tslib_1.__param(0, (0, core_1.inject)(core_1.CoreBindings.APPLICATION_INSTANCE)),
    tslib_1.__param(1, (0, core_1.inject)(keys_1.BootBindings.PROJECT_ROOT)),
    tslib_1.__param(2, (0, core_1.config)()),
    tslib_1.__metadata("design:paramtypes", [Object, String, Object])
], ServiceBooter);
/**
 * Default ArtifactOptions for DataSourceBooter.
 */
exports.ServiceDefaults = {
    dirs: ['services'],
    extensions: ['.service.js'],
    nested: true,
};
function isServiceProvider(cls) {
    const hasSupportedName = cls.name.endsWith('Provider');
    const hasValueMethod = typeof cls.prototype.value === 'function';
    return hasSupportedName && hasValueMethod;
}
function isBindableClass(cls) {
    if (core_1.MetadataInspector.getClassMetadata(core_1.BINDING_METADATA_KEY, cls)) {
        return true;
    }
    if ((0, core_1.hasInjections)(cls)) {
        return true;
    }
    if (isServiceProvider(cls)) {
        debug('Provider class found: %s', cls.name);
        return true;
    }
    if ((0, core_1.isDynamicValueProviderClass)(cls)) {
        debug('Dynamic value provider class found: %s', cls.name);
        return true;
    }
    debug('Skip class not decorated with @injectable: %s', cls.name);
    return false;
}
//# sourceMappingURL=service.booter.js.map
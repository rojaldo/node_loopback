"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/boot
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.LifeCycleObserverDefaults = exports.LifeCycleObserverBooter = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const debug_1 = tslib_1.__importDefault(require("debug"));
const keys_1 = require("../keys");
const types_1 = require("../types");
const base_artifact_booter_1 = require("./base-artifact.booter");
const debug = (0, debug_1.default)('loopback:boot:lifecycle-observer-booter');
/**
 * A class that extends BaseArtifactBooter to boot the 'LifeCycleObserver' artifact type.
 *
 * Supported phases: configure, discover, load
 *
 * @param app - Application instance
 * @param projectRoot - Root of User Project relative to which all paths are resolved
 * @param bootConfig - LifeCycleObserver Artifact Options Object
 */
let LifeCycleObserverBooter = class LifeCycleObserverBooter extends base_artifact_booter_1.BaseArtifactBooter {
    constructor(app, projectRoot, observerConfig = {}) {
        super(projectRoot, 
        // Set LifeCycleObserver Booter Options if passed in via bootConfig
        Object.assign({}, exports.LifeCycleObserverDefaults, observerConfig));
        this.app = app;
        this.observerConfig = observerConfig;
    }
    /**
     * Uses super method to get a list of Artifact classes. Boot each file by
     * creating a DataSourceConstructor and binding it to the application class.
     */
    async load() {
        await super.load();
        this.observers = this.classes.filter(core_1.isLifeCycleObserverClass);
        for (const observer of this.observers) {
            debug('Bind life cycle observer: %s', observer.name);
            const binding = this.app.lifeCycleObserver(observer);
            debug('Binding created for life cycle observer: %j', binding);
        }
    }
};
exports.LifeCycleObserverBooter = LifeCycleObserverBooter;
exports.LifeCycleObserverBooter = LifeCycleObserverBooter = tslib_1.__decorate([
    (0, types_1.booter)('observers'),
    tslib_1.__param(0, (0, core_1.inject)(core_1.CoreBindings.APPLICATION_INSTANCE)),
    tslib_1.__param(1, (0, core_1.inject)(keys_1.BootBindings.PROJECT_ROOT)),
    tslib_1.__param(2, (0, core_1.config)()),
    tslib_1.__metadata("design:paramtypes", [core_1.Application, String, Object])
], LifeCycleObserverBooter);
/**
 * Default ArtifactOptions for DataSourceBooter.
 */
exports.LifeCycleObserverDefaults = {
    dirs: ['observers'],
    extensions: ['.observer.js'],
    nested: true,
};
//# sourceMappingURL=lifecyle-observer.booter.js.map
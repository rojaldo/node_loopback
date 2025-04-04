"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/boot
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControllerDefaults = exports.ControllerBooter = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const keys_1 = require("../keys");
const types_1 = require("../types");
const base_artifact_booter_1 = require("./base-artifact.booter");
/**
 * A class that extends BaseArtifactBooter to boot the 'Controller' artifact type.
 * Discovered controllers are bound using `app.controller()`.
 *
 * Supported phases: configure, discover, load
 *
 * @param app - Application instance
 * @param projectRoot - Root of User Project relative to which all paths are resolved
 * @param bootConfig - Controller Artifact Options Object
 */
let ControllerBooter = class ControllerBooter extends base_artifact_booter_1.BaseArtifactBooter {
    constructor(app, projectRoot, controllerConfig = {}) {
        super(projectRoot, 
        // Set Controller Booter Options if passed in via bootConfig
        Object.assign({}, exports.ControllerDefaults, controllerConfig));
        this.app = app;
        this.controllerConfig = controllerConfig;
    }
    /**
     * Uses super method to get a list of Artifact classes. Boot each class by
     * binding it to the application using `app.controller(controller);`.
     */
    async load() {
        await super.load();
        this.classes.forEach(cls => {
            this.app.controller(cls);
        });
    }
};
exports.ControllerBooter = ControllerBooter;
exports.ControllerBooter = ControllerBooter = tslib_1.__decorate([
    (0, types_1.booter)('controllers'),
    tslib_1.__param(0, (0, core_1.inject)(core_1.CoreBindings.APPLICATION_INSTANCE)),
    tslib_1.__param(1, (0, core_1.inject)(keys_1.BootBindings.PROJECT_ROOT)),
    tslib_1.__param(2, (0, core_1.config)()),
    tslib_1.__metadata("design:paramtypes", [core_1.Application, String, Object])
], ControllerBooter);
/**
 * Default ArtifactOptions for ControllerBooter.
 */
exports.ControllerDefaults = {
    dirs: ['controllers'],
    extensions: ['.controller.js'],
    nested: true,
};
//# sourceMappingURL=controller.booter.js.map
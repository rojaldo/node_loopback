"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/boot
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.BootComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const booters_1 = require("./booters");
const bootstrapper_1 = require("./bootstrapper");
const keys_1 = require("./keys");
/**
 * BootComponent is used to export the default list of Booter's made
 * available by this module as well as bind the BootStrapper to the app so it
 * can be used to run the Booters.
 */
let BootComponent = class BootComponent {
    /**
     *
     * @param app - Application instance
     */
    constructor(app) {
        // Export a list of default booters in the component so they get bound
        // automatically when this component is mounted.
        this.booters = [
            booters_1.ApplicationMetadataBooter,
            booters_1.ControllerBooter,
            booters_1.RepositoryBooter,
            booters_1.ServiceBooter,
            booters_1.DataSourceBooter,
            booters_1.LifeCycleObserverBooter,
            booters_1.InterceptorProviderBooter,
            booters_1.ModelApiBooter,
            booters_1.ModelBooter,
        ];
        // Bound as a SINGLETON so it can be cached as it has no state
        app
            .bind(keys_1.BootBindings.BOOTSTRAPPER_KEY)
            .toClass(bootstrapper_1.Bootstrapper)
            .inScope(core_1.BindingScope.SINGLETON);
    }
};
exports.BootComponent = BootComponent;
exports.BootComponent = BootComponent = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)(core_1.CoreBindings.APPLICATION_INSTANCE)),
    tslib_1.__metadata("design:paramtypes", [core_1.Application])
], BootComponent);
//# sourceMappingURL=boot.component.js.map
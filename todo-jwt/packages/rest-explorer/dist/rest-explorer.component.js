"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/rest-explorer
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestExplorerComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const rest_explorer_controller_1 = require("./rest-explorer.controller");
const rest_explorer_keys_1 = require("./rest-explorer.keys");
const swaggerUI = require('swagger-ui-dist');
/**
 * A component providing a self-hosted API Explorer.
 */
let RestExplorerComponent = class RestExplorerComponent {
    constructor(application, restExplorerConfig = {}) {
        var _a;
        this.application = application;
        const explorerPath = (_a = restExplorerConfig.path) !== null && _a !== void 0 ? _a : '/explorer';
        this.registerControllerRoute('get', explorerPath, 'indexRedirect');
        this.registerControllerRoute('get', explorerPath + '/', 'index');
        if (restExplorerConfig.useSelfHostedSpec !== false) {
            this.registerControllerRoute('get', explorerPath + '/openapi.json', 'spec');
        }
        application.static(explorerPath, swaggerUI.getAbsoluteFSPath());
        // Disable redirect to externally hosted API explorer
        application.restServer.config.apiExplorer = { disabled: true };
    }
    registerControllerRoute(verb, path, methodName) {
        this.application.route(verb, path, {
            'x-visibility': 'undocumented',
            responses: {},
        }, rest_explorer_controller_1.ExplorerController, (0, rest_1.createControllerFactoryForClass)(rest_explorer_controller_1.ExplorerController), methodName);
    }
};
exports.RestExplorerComponent = RestExplorerComponent;
exports.RestExplorerComponent = RestExplorerComponent = tslib_1.__decorate([
    (0, core_1.injectable)({ tags: { [core_1.ContextTags.KEY]: rest_explorer_keys_1.RestExplorerBindings.COMPONENT.key } }),
    tslib_1.__param(0, (0, core_1.inject)(core_1.CoreBindings.APPLICATION_INSTANCE)),
    tslib_1.__param(1, (0, core_1.config)()),
    tslib_1.__metadata("design:paramtypes", [rest_1.RestApplication, Object])
], RestExplorerComponent);
//# sourceMappingURL=rest-explorer.component.js.map
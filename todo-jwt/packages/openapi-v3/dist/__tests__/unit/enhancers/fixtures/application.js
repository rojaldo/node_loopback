"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/openapi-v3
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecServiceApplication = void 0;
const core_1 = require("@loopback/core");
const __1 = require("../../../..");
const info_spec_extension_1 = require("./info.spec.extension");
const security_spec_extension_1 = require("./security.spec.extension");
class SpecServiceApplication extends core_1.Application {
    constructor() {
        super();
        this.add((0, core_1.createBindingFromClass)(__1.OASEnhancerService, {
            key: __1.OASEnhancerBindings.OAS_ENHANCER_SERVICE,
        }));
        this.add((0, core_1.createBindingFromClass)(security_spec_extension_1.SecuritySpecEnhancer));
        this.add((0, core_1.createBindingFromClass)(info_spec_extension_1.InfoSpecEnhancer));
    }
    async main() { }
    getSpecService() {
        return this.get(__1.OASEnhancerBindings.OAS_ENHANCER_SERVICE);
    }
}
exports.SpecServiceApplication = SpecServiceApplication;
//# sourceMappingURL=application.js.map
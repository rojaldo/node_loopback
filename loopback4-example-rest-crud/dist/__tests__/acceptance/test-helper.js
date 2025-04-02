"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/example-rest-crud
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupApplication = void 0;
const testlab_1 = require("@loopback/testlab");
const application_1 = require("../../application");
async function setupApplication() {
    const app = new application_1.TodoApplication({
        rest: (0, testlab_1.givenHttpServerConfig)(),
    });
    await app.boot();
    await app.start();
    const client = (0, testlab_1.createRestAppClient)(app);
    return { app, client };
}
exports.setupApplication = setupApplication;
//# sourceMappingURL=test-helper.js.map
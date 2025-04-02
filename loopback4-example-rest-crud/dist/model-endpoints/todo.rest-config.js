"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/example-rest-crud
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
module.exports = {
    model: models_1.Todo,
    pattern: 'CrudRest',
    dataSource: 'db',
    basePath: '/todos',
};
//# sourceMappingURL=todo.rest-config.js.map
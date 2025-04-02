"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/example-rest-crud
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.givenTodo = void 0;
const models_1 = require("../models");
/**
 * Generate a complete Todo object for use with tests.
 * @param todo - A partial (or complete) Todo object.
 */
function givenTodo(todo) {
    const data = Object.assign({
        title: 'do a thing',
        desc: 'There are some things that need doing',
        isComplete: false,
    }, todo);
    return new models_1.Todo(data);
}
exports.givenTodo = givenTodo;
//# sourceMappingURL=helpers.js.map
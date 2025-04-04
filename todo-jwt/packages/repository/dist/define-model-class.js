"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineModelClass = void 0;
const tslib_1 = require("tslib");
const assert = tslib_1.__importStar(require("assert"));
const decorators_1 = require("./decorators");
/**
 * Create (define) a new model class with the given name and definition.
 *
 * @remarks
 *
 * ```ts
 * const Product = defineModelClass(Entity, new ModelDefinition('Product'));
 * ```
 *
 * To enable type safety, you should describe properties of your model:
 *
 * ```ts
 * const Product = defineModelClass<
 *  typeof Entity,
 *  {id: number, name: string}
 * >(Entity, new ModelDefinition('Product'));
 * ```
 *
 * If your model allows arbitrary (free-form) properties, then add `AnyObject`
 * to the type describing model properties.
 *
 * ```ts
 * const Product = defineModelClass<
 *  typeof Entity,
 *  AnyObject & {id: number},
 * >(Entity, new ModelDefinition('Product'));
 * ```
 *
 * @param base The base model to extend, typically Model or Entity.
 *  You can also use your own base class, e.g. `User`.
 * @param definition Definition of the model to create.
 * @typeParam BaseCtor Constructor type of the base class,
 *   e.g `typeof Model` or `typeof Entity`
 * @typeParam Props Interface describing model properties,
 *   e.g. `{title: string}` or `AnyObject & {id: number}`.
 */
function defineModelClass(base /* Model or Entity */, definition) {
    const modelName = definition.name;
    const defineNamedModelClass = new Function(base.name, `return class ${modelName} extends ${base.name} {}`);
    const modelClass = defineNamedModelClass(base);
    assert.equal(modelClass.name, modelName);
    // Apply `@model(definition)` to the generated class
    (0, decorators_1.model)(definition)(modelClass);
    return modelClass;
}
exports.defineModelClass = defineModelClass;
//# sourceMappingURL=define-model-class.js.map
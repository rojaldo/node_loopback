import { DataObject, PrototypeOf } from './common-types';
import { Model, ModelDefinition } from './model';
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
export declare function defineModelClass<BaseCtor extends typeof Model, Props extends object = {}>(base: BaseCtor, definition: ModelDefinition): DynamicModelCtor<BaseCtor, Props>;
/**
 * A type describing a model class created via `defineModelClass`.
 *
 * Assuming template arguments `BaseCtor` and `Props`, this type describes
 * a class constructor with the following properties:
 * - a constructor function accepting `DataObject<Props>` as the only argument,
 *   this argument is optional
 * - all static fields (properties, methods) from `BaseCtor` are inherited and
 *   available as static fields on the dynamic class
 * - all prototype fields from `BaseCtor` prototype are inherited and available
 *   as prototype fields on the dynamic class
 */
export type DynamicModelCtor<BaseCtor extends typeof Model, Props extends object> = {
    /** Model constructor accepting partial model data. */
    new (data?: DataObject<PrototypeOf<BaseCtor> & Props>): PrototypeOf<BaseCtor> & Props;
} & BaseCtor;

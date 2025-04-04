import { MixinTarget } from '@loopback/core';
import { Model } from '../../..';
/**
 * A mixin factory to add `category` property
 *
 * @param superClass - Base Class
 * @typeParam T - Model class
 */
export declare function AddCategoryPropertyMixin<T extends MixinTarget<Model>>(superClass: T): {
    new (...args: any[]): {
        category: string;
        toJSON: () => Object;
        toObject: (options?: import("../../..").AnyObject | undefined) => Object;
    };
} & T;

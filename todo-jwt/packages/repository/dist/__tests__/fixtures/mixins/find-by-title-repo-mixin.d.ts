import { MixinTarget } from '@loopback/core';
import { CrudRepository, Model, Where } from '../../..';
/**
 * An interface to allow finding notes by title
 */
export interface FindByTitle<M extends Model> {
    findByTitle(title: string): Promise<M[]>;
}
export declare function FindByTitleRepositoryMixin<M extends Model & {
    title: string;
}, R extends MixinTarget<CrudRepository<M>>>(superClass: R): {
    new (...args: any[]): {
        findByTitle(title: string): Promise<M[]>;
        create: (dataObject: import("../../..").DataObject<M>, options?: import("../../..").AnyObject | undefined) => Promise<M>;
        createAll: (dataObjects: import("../../..").DataObject<M>[], options?: import("../../..").AnyObject | undefined) => Promise<M[]>;
        find: (filter?: import("@loopback/filter/dist/query").Filter<M> | undefined, options?: import("../../..").AnyObject | undefined) => Promise<(M & {})[]>;
        updateAll: (dataObject: import("../../..").DataObject<M>, where?: Where<M> | undefined, options?: import("../../..").AnyObject | undefined) => Promise<import("../../..").Count>;
        deleteAll: (where?: Where<M> | undefined, options?: import("../../..").AnyObject | undefined) => Promise<import("../../..").Count>;
        count: (where?: Where<M> | undefined, options?: import("../../..").AnyObject | undefined) => Promise<import("../../..").Count>;
    };
} & R;

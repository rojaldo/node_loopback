import { Constructor } from '@loopback/core';
import { DefaultCrudRepository, juggler } from '../../..';
import { Note, NoteRelations } from '../models/note.model';
declare const NoteRepository_base: {
    new (...args: any[]): {
        findByTitle(title: string): Promise<Note[]>;
        create: (dataObject: import("../../..").DataObject<Note>, options?: import("../../..").AnyObject | undefined) => Promise<Note>;
        createAll: (dataObjects: import("../../..").DataObject<Note>[], options?: import("../../..").AnyObject | undefined) => Promise<Note[]>;
        find: (filter?: import("@loopback/filter/dist/query").Filter<Note> | undefined, options?: import("../../..").AnyObject | undefined) => Promise<Note[]>;
        updateAll: (dataObject: import("../../..").DataObject<Note>, where?: import("@loopback/filter/dist/query").Where<Note> | undefined, options?: import("../../..").AnyObject | undefined) => Promise<import("../../..").Count>;
        deleteAll: (where?: import("@loopback/filter/dist/query").Where<Note> | undefined, options?: import("../../..").AnyObject | undefined) => Promise<import("../../..").Count>;
        count: (where?: import("@loopback/filter/dist/query").Where<Note> | undefined, options?: import("../../..").AnyObject | undefined) => Promise<import("../../..").Count>;
    };
} & Constructor<DefaultCrudRepository<Note, number | undefined, NoteRelations>>;
/**
 * A repository for `Note` with `findByTitle`
 */
export declare class NoteRepository extends NoteRepository_base {
    constructor(dataSource?: juggler.DataSource);
}
export {};

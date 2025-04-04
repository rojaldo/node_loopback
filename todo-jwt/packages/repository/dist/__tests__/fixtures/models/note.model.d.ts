import { BaseEntity } from '../mixins/base-entity';
declare const Note_base: {
    new (...args: any[]): {
        category: string;
        toJSON: () => Object;
        toObject: (options?: import("../../../common-types").AnyObject | undefined) => Object;
    };
} & typeof BaseEntity;
export declare class Note extends Note_base {
    id?: number;
    title: string;
    content?: string;
    constructor(data?: Partial<Note>);
}
export interface NoteRelations {
}
export type NoteWithRelations = Note & NoteRelations;
export {};

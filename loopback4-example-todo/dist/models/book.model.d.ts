import { Entity } from '@loopback/repository';
export declare class Book extends Entity {
    id?: number;
    title?: string;
    description?: string;
    pages?: number;
    isbn: string;
    constructor(data?: Partial<Book>);
}
export interface BookRelations {
}
export type BookWithRelations = Book & BookRelations;

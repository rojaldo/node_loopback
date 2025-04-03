import { Count, Filter, FilterExcludingWhere, Where } from '@loopback/repository';
import { Book } from '../models';
import { BooksService } from '../services/books.service';
export declare class BooksController {
    private bookService;
    constructor(bookService: BooksService);
    create(book: Omit<Book, 'id'>): Promise<Book>;
    count(where?: Where<Book>): Promise<Count>;
    find(filter?: Filter<Book>): Promise<Book[]>;
    updateAll(book: Book, where?: Where<Book>): Promise<Count>;
    findById(id: number, filter?: FilterExcludingWhere<Book>): Promise<Book>;
    updateById(id: number, book: Book): Promise<void>;
    replaceById(id: number, book: Book): Promise<void>;
    deleteById(id: number): Promise<void>;
}

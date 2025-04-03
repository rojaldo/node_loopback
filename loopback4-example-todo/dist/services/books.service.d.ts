import { Count, Filter, FilterExcludingWhere, Where } from '@loopback/repository';
import { BookRepository } from '../repositories/book.repository';
import { Book } from '../models';
export declare class BooksService {
    private bookRepository;
    constructor(bookRepository: BookRepository);
    create(book: Omit<Book, "id">): Promise<Book>;
    deleteById(id: number): Promise<void>;
    replaceById(id: number, book: Book): Promise<void>;
    updateById(id: number, book: Book): Promise<void>;
    findById(id: number, filter: FilterExcludingWhere<Book> | undefined): Book | PromiseLike<Book>;
    updateAll(book: Book, where: Where<Book> | undefined): Count | PromiseLike<Count>;
    find(filter: Filter<Book> | undefined): Book[] | PromiseLike<Book[]>;
    count(where: Where<Book> | undefined): Promise<Count>;
}

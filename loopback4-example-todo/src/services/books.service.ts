import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import { Count, Filter, FilterExcludingWhere, repository, Where } from '@loopback/repository';
import { BookRepository } from '../repositories/book.repository';
import { Book } from '../models';

@injectable({scope: BindingScope.TRANSIENT})
export class BooksService {


  constructor(@repository(BookRepository)
      private bookRepository : BookRepository,) {}

  /*
   * Add service methods here
   */

  create(book: Omit<Book, "id">): Promise<Book> {
    return this.bookRepository.create(book);
  }

  deleteById(id: number) {
    return this.bookRepository.deleteById(id);
  }
  replaceById(id: number, book: Book) {
    return this.bookRepository.replaceById(id, book);
  }
  updateById(id: number, book: Book) {
    return this.bookRepository.updateById(id, book);
  }
  findById(id: number, filter: FilterExcludingWhere<Book> | undefined): Book | PromiseLike<Book> {
    return this.bookRepository.findById(id, filter);
  }
  updateAll(book: Book, where: Where<Book> | undefined): Count | PromiseLike<Count> {
    return this.bookRepository.updateAll(book, where);
  }
  find(filter: Filter<Book> | undefined): Book[] | PromiseLike<Book[]> {
    return this.bookRepository.find(filter);
  }
  count(where: Where<Book> | undefined): Promise<Count> {
    return this.bookRepository.count(where);
  }
}

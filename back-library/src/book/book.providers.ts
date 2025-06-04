import { BookEntity } from './entities/book.entity';
import { BookRepository } from './repositories/book.repository';

export const bookProviders = [
  {
    provide: 'BOOK_REPOSITORY',
    useValue: BookEntity,
  },
  {
    provide: 'IBookRepository',
    useClass: BookRepository,
  },
];
import { BookModel } from '../models/book.model';
import { PaginationDTO } from '../dto/pagination.dto';
import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';

export interface IBookRepository {
  create(createBookDto: CreateBookDto): Promise<BookModel>;
  findAll(pagDTO: PaginationDTO): Promise<{ data: BookModel[], meta: { total: number, skip: number, limit: number } }>;
  findOne(id: number): Promise<BookModel | null>;
  update(id: number, updateBookDto: UpdateBookDto): Promise<BookModel>;
  remove(id: number): Promise<{ id: number }>;
}
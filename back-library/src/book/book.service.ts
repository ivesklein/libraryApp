import { Inject, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PaginationDTO } from './dto/pagination.dto';
import { IBookRepository } from './repositories/book.repository.interface';

@Injectable()
export class BookService {
  constructor(
    @Inject('IBookRepository')
    private bookRepository: IBookRepository,
  ) {}

  async create(createBookDto: CreateBookDto) {
    return this.bookRepository.create(createBookDto);
  }

  async findAll(pagDTO: PaginationDTO) {
    return this.bookRepository.findAll(pagDTO);
  }

  async findOne(id: number) {
    return this.bookRepository.findOne(id);
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    return this.bookRepository.update(id, updateBookDto);
  }

  async remove(id: number) {
    return this.bookRepository.remove(id);
  }
}
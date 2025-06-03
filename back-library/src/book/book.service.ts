import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PaginationDTO } from './dto/pagination.dto';

@Injectable()
export class BookService {
  create(createBookDto: CreateBookDto) {
    // create a book and add corresponding flags
    return 'This action adds a new book';
  }

  findAll(pagDTO:PaginationDTO) {
    //return all books from pagination that are not flag deleted
    return `This action returns all book`;
  }

  findOne(id: number) {
    // return book if not flagged as deleted
    return `This action returns a #${id} book`;
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    // update the items
    return `This action updates a #${id} book`;
  }

  remove(id: number) {
    // flag it as deleted
    return `This action removes a #${id} book`;
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PaginationDTO } from './dto/pagination.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('book')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @ApiOperation({ summary: 'Creates a book' })
  @ApiResponse({ status: 201, description: 'item added with the id' })
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @Get()
  @ApiOperation({ summary: 'Returns all books that matches pagination' })
  @ApiResponse({ status: 200, description: 'returns books' })
  findAll(@Query() pagDTO:PaginationDTO) {
    return this.bookService.findAll(pagDTO);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Returns a book by id' })
  @ApiResponse({ status: 200, description: 'returns book' })
  findOne(@Param('id') id: string) {
    return this.bookService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Updates a book by id' })
  @ApiResponse({ status: 200, description: 'returns book' })
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(+id, updateBookDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletes a book by id' })
  @ApiResponse({ status: 200, description: 'returns nothing' })
  remove(@Param('id') id: string) {
    return this.bookService.remove(+id);
  }
}
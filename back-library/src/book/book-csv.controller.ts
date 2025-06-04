import { Controller, Get, Query, Res } from "@nestjs/common";
import { BookService } from "./book.service";
import { PaginationDTO } from "./dto/pagination.dto";
import { Response } from "express";

@Controller('book-csv')
export class BookCsvController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  async exportCsv(@Query() pagDTO: PaginationDTO, @Res() res: Response) {
    const result = await this.bookService.findAll(pagDTO);
    const books = result.data;
    
    // Create CSV header
    const csvHeader = 'title,description,author,publisher,available\n';
    
    // Create CSV rows
    const csvRows = books.map(book => {
      return `"${book.title?.replace(/"/g, '""') || ''}","${book.description?.replace(/"/g, '""') || ''}","${book.author?.replace(/"/g, '""') || ''}","${book.publisher?.replace(/"/g, '""') || ''}",${book.available}`;
    }).join('\n');
    
    // Combine header and rows
    const csvContent = csvHeader + csvRows;
    
    // Set response headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=books.csv');
    
    // Send the CSV content
    return res.send(csvContent);
  }
}
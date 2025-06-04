import { Controller, Get, Query, Res, UseGuards } from "@nestjs/common";
import { BookService } from "./book.service";
import { PaginationDTO } from "./dto/pagination.dto";
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { Response } from "express";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@ApiTags('book-csv')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('book-csv')
export class BookCsvController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  @ApiOperation({ summary: 'Export books as CSV based on pagination parameters' })
  @ApiResponse({ status: 200, description: 'Returns books as CSV file' })
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
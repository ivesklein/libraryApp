import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { DatabaseModule } from '../database/database.module';
import { bookProviders } from './book.providers';
import { authorProviders } from '../author/author.providers';
import { publisherProviders } from '../publisher/publisher.providers';
import { BookCsvController } from './book-csv.controller';
import { BookSeeder } from './book.seeder';

@Module({
  imports: [DatabaseModule],
  controllers: [BookController, BookCsvController],
  providers: [
    BookSeeder,
    BookService,
    ...bookProviders,
    ...authorProviders,
    ...publisherProviders,
  ],
})
export class BookModule {}
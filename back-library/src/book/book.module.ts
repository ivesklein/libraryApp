import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { BookCsvController } from './book-csv.controller';
import { bookProviders } from './book.providers';
import { authorProviders } from '../author/author.providers';
import { publisherProviders } from '../publisher/publisher.providers';
import { DatabaseModule } from '../database/database.module';
import { BookSeeder } from './book.seeder';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [BookController, BookCsvController],
  providers: [
    BookService,
    BookSeeder,
    ...bookProviders,
    ...authorProviders,
    ...publisherProviders
  ]
})
export class BookModule {}
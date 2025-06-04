import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Book } from './entities/book.entity';
import { Author } from '../author/entities/author.entity';
import { Publisher } from '../publisher/entities/publisher.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class BookSeeder implements OnModuleInit {
  constructor(
    @Inject('BOOK_REPOSITORY')
    private bookRepository: typeof Book,
    @Inject('AUTHOR_REPOSITORY')
    private authorRepository: typeof Author,
    @Inject('PUBLISHER_REPOSITORY')
    private publisherRepository: typeof Publisher,
  ) {}

  async onModuleInit() {
    console.log('Seeding books...');
    const count = await this.bookRepository.count();
    if (count > 5) {
      console.log('Database already seeded with books');
      return;
    }

    try {
      const filePath = path.join('/app/src/book/', 'example-data', 'books.json');
      const booksData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      const sequelize = this.bookRepository.sequelize;
      
      await sequelize.transaction(async (t) => {
        for (const bookData of booksData) {
          // Find or create author
          const [author] = await this.authorRepository.findOrCreate({
            where: { name: bookData.author },
            defaults: { name: bookData.author },
            transaction: t
          });

          // Find or create publisher
          const [publisher] = await this.publisherRepository.findOrCreate({
            where: { name: bookData.publisher },
            defaults: { name: bookData.publisher },
            transaction: t
          });

          // Create book
          await this.bookRepository.create({
            title: bookData.title,
            description: bookData.description || '',
            fileCover: bookData.fileCover || '',
            authorId: author.id,
            publisherId: publisher.id,
            available: true,
            deleted: false,
          }, { transaction: t });
        }
      });

      console.log(`Seeded ${booksData.length} books successfully`);
    } catch (error) {
      console.error('Error seeding books:', error);
    }
  }
}
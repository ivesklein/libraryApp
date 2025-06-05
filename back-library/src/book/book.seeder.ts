import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { BookEntity } from './entities/book.entity';
import { AuthorEntity } from '../author/entities/author.entity';
import { PublisherEntity } from '../publisher/entities/publisher.entity';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

@Injectable()
export class BookSeeder implements OnModuleInit {
  constructor(
    @Inject('BOOK_REPOSITORY')
    private bookRepository: typeof BookEntity,
    @Inject('AUTHOR_REPOSITORY')
    private authorRepository: typeof AuthorEntity,
    @Inject('PUBLISHER_REPOSITORY')
    private publisherRepository: typeof PublisherEntity,
  ) {}

  async onModuleInit() {
    console.log('Seeding books...');
    const count = await this.bookRepository.count({ where:{ deleted: false }});
    if (count > 5) {
      console.log('Database already seeded with books');
      return;
    }

    try {
      const filePath = '/app/dist/books.json';
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

          // Get book cover from API
          let coverUrl = '';
          try {
            const encodedTitle = encodeURIComponent(bookData.title);
            const encodedAuthor = encodeURIComponent(bookData.author);
            const response = await axios.get(`https://bookcover.longitood.com/bookcover?book_title=${encodedTitle}&author_name=${encodedAuthor}`);
            coverUrl = response.data.url;
          } catch (error) {
            console.error(`Failed to fetch cover for ${bookData.title}:`, error.message);
          }

          // Create book
          await this.bookRepository.create({
            title: bookData.title,
            description: bookData.description || '',
            fileCover: coverUrl || '',
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
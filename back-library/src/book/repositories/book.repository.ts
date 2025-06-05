import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BookEntity } from '../entities/book.entity';
import { BookModel } from '../models/book.model';
import { IBookRepository } from './book.repository.interface';
import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';
import { PaginationDTO } from '../dto/pagination.dto';
import { AuthorEntity } from '../../author/entities/author.entity';
import { PublisherEntity } from '../../publisher/entities/publisher.entity';

@Injectable()
export class BookRepository implements IBookRepository {
  constructor(
    @Inject('BOOK_REPOSITORY')
    private bookEntityRepository: typeof BookEntity,
    @Inject('AUTHOR_REPOSITORY')
    private authorRepository: typeof AuthorEntity,
    @Inject('PUBLISHER_REPOSITORY')
    private publisherRepository: typeof PublisherEntity,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<BookModel> {
    const sequelize = this.bookEntityRepository.sequelize;
    
    return await sequelize.transaction(async (t) => {
      // Find or create author
      const [author] = await this.authorRepository.findOrCreate({
        where: { name: createBookDto.author },
        defaults: { name: createBookDto.author },
        transaction: t
      });

      // Find or create publisher
      const [publisher] = await this.publisherRepository.findOrCreate({
        where: { name: createBookDto.publisher },
        defaults: { name: createBookDto.publisher },
        transaction: t
      });

      // Create the book with author and publisher IDs
      const book = await this.bookEntityRepository.create({
        title: createBookDto.title,
        description: createBookDto.description,
        fileCover: createBookDto.fileCover,
        authorId: author.id,
        publisherId: publisher.id,
        available: true,
        deleted: false,
      }, { transaction: t });

      // Return domain model
      return new BookModel({
        id: book.id,
        title: book.title,
        description: book.description,
        author: author.name,
        publisher: publisher.name,
        fileCover: book.fileCover,
        available: book.available,
        deleted: book.deleted,
        createdAt: book.createdAt,
        updatedAt: book.updatedAt
      });
    });
  }

  async findAll(pagDTO: PaginationDTO): Promise<{ data: BookModel[], meta: { total: number, skip: number, limit: number } }> {
    const { skip = 0, limit = 10, sort1=null, sort2=null, query = null } = pagDTO;

    const whereClause = { deleted: false };
    const includeOptions = [
      { model: AuthorEntity },
      { model: PublisherEntity }
    ];

    if (query) {
      const { Op } = require('sequelize');
      const sequelize = this.bookEntityRepository.sequelize;
      
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${query}%` } },
        { description: { [Op.like]: `%${query}%` } },
        sequelize.literal(`"author"."name" LIKE '%${query}%'`)
      ];
    }

    const order = [];
    if (sort1) {
      const isDesc = sort1.startsWith('-');
      const field = isDesc ? sort1.substring(1) : sort1;
      const direction = isDesc ? 'DESC' : 'ASC';
      if (field === 'author') {
        order.push(['author', 'name', direction]);
      } else if (field === 'publisher') {
        order.push(['publisher', 'name', direction]);
      } else {
        order.push([field, direction]);
      }
    }
    if (sort2) {
      const isDesc = sort2.startsWith('-');
      const field = isDesc ? sort2.substring(1) : sort2;
      const direction = isDesc ? 'DESC' : 'ASC';
      if (field === 'author') {
        order.push(['author', 'name', direction]);
      } else if (field === 'publisher') {
        order.push(['publisher', 'name', direction]);
      } else {
        order.push([field, direction]);
      }
    }

    const { rows, count } = await this.bookEntityRepository.findAndCountAll({
      where: whereClause,
      limit,
      offset: skip,
      include: includeOptions,
      order,
      distinct: true
    });

    // Map to domain models
    const books = rows.map(book => new BookModel({
      id: book.id,
      title: book.title,
      description: book.description,
      author: book.author?.name,
      publisher: book.publisher?.name,
      fileCover: book.fileCover,
      available: book.available,
      deleted: book.deleted,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt
    }));

    return {
      data: books,
      meta: {
        total: count,
        skip,
        limit
      }
    };
  }

  async findOne(id: number): Promise<BookModel | null> {
    const book = await this.bookEntityRepository.findOne({
      where: { id, deleted: false },
      include: [
        { model: AuthorEntity },
        { model: PublisherEntity }
      ]
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    // Map to domain model
    return new BookModel({
      id: book.id,
      title: book.title,
      description: book.description,
      author: book.author?.name,
      publisher: book.publisher?.name,
      fileCover: book.fileCover,
      available: book.available,
      deleted: book.deleted,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt
    });
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<BookModel> {
    const book = await this.bookEntityRepository.findOne({
      where: { id, deleted: false },
      include: [
        { model: AuthorEntity },
        { model: PublisherEntity }
      ]
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    const sequelize = this.bookEntityRepository.sequelize;
    
    return await sequelize.transaction(async (t) => {
      // Handle author update if provided
      let authorName = book.author?.name;
      if (updateBookDto.author) {
        const [author] = await this.authorRepository.findOrCreate({
          where: { name: updateBookDto.author },
          defaults: { name: updateBookDto.author },
          transaction: t
        });
        book.authorId = author.id;
        authorName = author.name;
      }

      // Handle publisher update if provided
      let publisherName = book.publisher?.name;
      if (updateBookDto.publisher) {
        const [publisher] = await this.publisherRepository.findOrCreate({
          where: { name: updateBookDto.publisher },
          defaults: { name: updateBookDto.publisher },
          transaction: t
        });
        book.publisherId = publisher.id;
        publisherName = publisher.name;
      }

      // Update other fields
      if (updateBookDto.title) book.title = updateBookDto.title;
      if (updateBookDto.description) book.description = updateBookDto.description;
      if (updateBookDto.fileCover) book.fileCover = updateBookDto.fileCover;

      await book.save({ transaction: t });
      
      // Return domain model
      return new BookModel({
        id: book.id,
        title: book.title,
        description: book.description,
        author: authorName,
        publisher: publisherName,
        fileCover: book.fileCover,
        available: book.available,
        deleted: book.deleted,
        createdAt: book.createdAt,
        updatedAt: book.updatedAt
      });
    });
  }

  async remove(id: number): Promise<{ id: number }> {
    const book = await this.bookEntityRepository.findByPk(id);
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    await book.update({ deleted: true });
    return { id };
  }
}
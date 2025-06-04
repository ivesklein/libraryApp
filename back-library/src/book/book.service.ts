import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PaginationDTO } from './dto/pagination.dto';
import { Book } from './entities/book.entity';
import { Author } from '../author/entities/author.entity';
import { Publisher } from '../publisher/entities/publisher.entity';

@Injectable()
export class BookService {
  constructor(
    @Inject('BOOK_REPOSITORY')
    private bookRepository: typeof Book,
    @Inject('AUTHOR_REPOSITORY')
    private authorRepository: typeof Author,
    @Inject('PUBLISHER_REPOSITORY')
    private publisherRepository: typeof Publisher,
  ) {}

  async create(createBookDto: CreateBookDto) {
    // Get the Sequelize instance from the repository
    const sequelize = this.bookRepository.sequelize;
    
    return await sequelize.transaction(async (t) => {
      // Find or create author within transaction
      const [author] = await this.authorRepository.findOrCreate({
        where: { name: createBookDto.author },
        defaults: { name: createBookDto.author },
        transaction: t
      });

      // Find or create publisher within transaction
      const [publisher] = await this.publisherRepository.findOrCreate({
        where: { name: createBookDto.publisher },
        defaults: { name: createBookDto.publisher },
        transaction: t
      });

      // Create the book with author and publisher IDs within transaction
      const book = await this.bookRepository.create({
        title: createBookDto.title,
        description: createBookDto.description,
        fileCover: createBookDto.fileCover,
        authorId: author.id,
        publisherId: publisher.id,
        available: true,
        deleted: false,
      }, { transaction: t });

      // Return formatted book with author and publisher names
      return {
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
      };
    });
  }

  async findAll(pagDTO: PaginationDTO) {
    const { skip = 0, limit = 10, sort1=null, sort2=null, query = null } = pagDTO;

    const whereClause = { deleted: false };
    const includeOptions = [
      { model: Author },
      { model: Publisher }
    ];

    if (query) {
      const { Op } = require('sequelize');
      includeOptions[0]["where"] = {
        name: { [Op.like]: `%${query}%` }
      };
      whereClause['title'] = { [Op.like]: `%${query}%` };
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

    const { rows, count } = await this.bookRepository.findAndCountAll({
      where: whereClause,
      limit,
      offset: skip,
      include: includeOptions,
      order
    });

    // Format the data to include author and publisher as strings
    const formattedBooks = rows.map(book => ({
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
      data: formattedBooks,
      meta: {
        total: count,
        skip,
        limit
      }
    };
  }

  async findOne(id: number) {
    const book = await this.bookRepository.findOne({
      where: { id, deleted: false },
      include: [
        { model: Author },
        { model: Publisher }
      ]
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    // Format the book to include author and publisher as strings
    return {
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
    };
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    const book = await this.bookRepository.findOne({
      where: { id, deleted: false },
      include: [
        { model: Author },
        { model: Publisher }
      ]
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    const sequelize = this.bookRepository.sequelize;
    
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
      
      // Return formatted book with author and publisher names
      return {
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
      };
    });
  }

  async remove(id: number) {
    const book = await this.findOne(id);
    const bookEntity = await this.bookRepository.findByPk(id);
    if (bookEntity) {
      await bookEntity.update({ deleted: true });
    }
    return { id };
  }
}
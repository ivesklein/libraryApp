import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PaginationDTO } from './dto/pagination.dto';
import { BookModel } from './models/book.model';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('BookController', () => {
  let controller: BookController;
  let bookService: BookService;

  const mockBookModel: BookModel = {
    id: 1,
    title: 'Test Book',
    author: 'Test Author',
    description: 'Test Description',
    publisher: 'Test Publisher',
    fileCover: 'cover.jpg',
    available: true,
    deleted: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockPaginatedResult = {
    data: [mockBookModel],
    meta: {
      total: 1,
      skip: 0,
      limit: 10
    }
  };

  beforeEach(async () => {
    const mockBookService = {
      create: jest.fn().mockResolvedValue(mockBookModel),
      findAll: jest.fn().mockResolvedValue(mockPaginatedResult),
      findOne: jest.fn().mockResolvedValue(mockBookModel),
      update: jest.fn().mockResolvedValue(mockBookModel),
      remove: jest.fn().mockResolvedValue({ id: 1 })
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [
        {
          provide: BookService,
          useValue: mockBookService
        }
      ]
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<BookController>(BookController);
    bookService = module.get<BookService>(BookService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new book, check that is a tube to the controller that is a tube to the interface', async () => {
      const createBookDto: CreateBookDto = {
        title: 'Test Book',
        author: 'Test Author',
        description: 'Test Description',
        publisher: 'Test Publisher',
        fileCover: 'cover.jpg'
      };

      const result = await controller.create(createBookDto);
      
      expect(bookService.create).toHaveBeenCalledWith(createBookDto);
      expect(result).toEqual(mockBookModel);
    });
  });

  describe('findAll', () => {
    it('should return paginated books, check that is a tube to the controller that is a tube to the interface', async () => {
      const pagDTO: PaginationDTO = {
        skip: 0, limit: 10,
        query: null,
        sort1: null,
        sort2: null
      };
      
      const result = await controller.findAll(pagDTO);
      
      expect(bookService.findAll).toHaveBeenCalledWith(pagDTO);
      expect(result).toEqual(mockPaginatedResult);
    });
  });

  describe('findOne', () => {
    it('should return a book by id, check that is a tube to the controller that is a tube to the interface', async () => {
      const result = await controller.findOne('1');
      
      expect(bookService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockBookModel);
    });
  });

  describe('update', () => {
    it('should update a book, check that is a tube to the controller that is a tube to the interface', async () => {
      const updateBookDto: UpdateBookDto = {
        title: 'Updated Book Title'
      };
      
      const result = await controller.update('1', updateBookDto);
      
      expect(bookService.update).toHaveBeenCalledWith(1, updateBookDto);
      expect(result).toEqual(mockBookModel);
    });
  });

  describe('remove, check that is a tube to the controller that is a tube to the interface', () => {
    it('should remove a book', async () => {
      const result = await controller.remove('1');
      
      expect(bookService.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual({ id: 1 });
    });
  });
});
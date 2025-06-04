import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { IBookRepository } from './repositories/book.repository.interface';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PaginationDTO } from './dto/pagination.dto';
import { BookModel } from './models/book.model';

describe('BookService', () => {
  let service: BookService;
  let mockBookRepository: Partial<IBookRepository>;

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
    // Create mock repository
    mockBookRepository = {
      create: jest.fn().mockResolvedValue(mockBookModel),
      findAll: jest.fn().mockResolvedValue(mockPaginatedResult),
      findOne: jest.fn().mockResolvedValue(mockBookModel),
      update: jest.fn().mockResolvedValue(mockBookModel),
      remove: jest.fn().mockResolvedValue({ id: 1 })
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: 'IBookRepository',
          useValue: mockBookRepository
        }
      ],
    }).compile();

    service = module.get<BookService>(BookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new book(aka: be a tube to the interface)', async () => {
      const createBookDto: CreateBookDto = {
        title: 'Test Book',
        author: 'Test Author',
        description: 'Test Description',
        publisher: 'Test Publisher',
        fileCover: 'cover.jpg'
      };

      const result = await service.create(createBookDto);
      
      expect(mockBookRepository.create).toHaveBeenCalledWith(createBookDto);
      expect(result).toEqual(mockBookModel);
    });
  });

  describe('findAll', () => {
    it('should return paginated books(aka: be a tube to the interface)', async () => {
      const pagDTO: PaginationDTO = {
        skip: 0, limit: 10,
        query: null,
        sort1: null,
        sort2: null
      };
      
      const result = await service.findAll(pagDTO);
      
      expect(mockBookRepository.findAll).toHaveBeenCalledWith(pagDTO);
      expect(result).toEqual(mockPaginatedResult);
    });
  });

  describe('findOne', () => {
    it('should return a book by id(aka: be a tube to the interface)', async () => {
      const id = 1;
      
      const result = await service.findOne(id);
      
      expect(mockBookRepository.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockBookModel);
    });
  });

  describe('update', () => {
    it('should update a book(aka: be a tube to the interface)', async () => {
      const id = 1;
      const updateBookDto: UpdateBookDto = {
        title: 'Updated Book Title'
      };
      
      const result = await service.update(id, updateBookDto);
      
      expect(mockBookRepository.update).toHaveBeenCalledWith(id, updateBookDto);
      expect(result).toEqual(mockBookModel);
    });
  });

  describe('remove', () => {
    it('should remove a book(aka: be a tube to the interface)', async () => {
      const id = 1;
      
      const result = await service.remove(id);
      
      expect(mockBookRepository.remove).toHaveBeenCalledWith(id);
      expect(result).toEqual({ id: 1 });
    });
  });
});
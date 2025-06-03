import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';

describe('BookController', () => {
  let controller: BookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [BookService],
    }).compile();

    controller = module.get<BookController>(BookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('on create should be defined', () => {
    expect(controller.create).toBeDefined();
  })

  it('on create should accept dto', () => {
    const dto = {
      title: 'test',
      author: 'test',
      description: 'test',
      publisher: 'test',
      fileCover: 'test',
    }
    expect(controller.create(dto)).toBeDefined();
  })

});

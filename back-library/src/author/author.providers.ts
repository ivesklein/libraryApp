import { AuthorEntity } from './entities/author.entity';

export const authorProviders = [
  {
    provide: 'AUTHOR_REPOSITORY',
    useValue: AuthorEntity,
  },
];
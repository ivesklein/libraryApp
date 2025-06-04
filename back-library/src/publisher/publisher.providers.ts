import { Publisher } from './entities/publisher.entity';

export const publisherProviders = [
  {
    provide: 'PUBLISHER_REPOSITORY',
    useValue: Publisher,
  },
];
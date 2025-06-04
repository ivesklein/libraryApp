import { PublisherEntity } from './entities/publisher.entity';

export const publisherProviders = [
  {
    provide: 'PUBLISHER_REPOSITORY',
    useValue: PublisherEntity,
  },
];
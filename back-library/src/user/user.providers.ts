import { UserEntity } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';

export const userProviders = [
  {
    provide: 'USER_REPOSITORY',
    useValue: UserEntity,
  },
  {
    provide: 'IUserRepository',
    useClass: UserRepository,
  },
];
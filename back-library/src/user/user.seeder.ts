import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class UserSeeder implements OnModuleInit {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: typeof User,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  async seed() {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { username: 'user' },
    });

    if (!existingUser) {
      // create dummy user
      await this.userRepository.create({
        username: 'user',
        password: 'pass',
      });
      console.log('Default user created');
    }
  }
}
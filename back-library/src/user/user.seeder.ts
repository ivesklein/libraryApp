import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { IUserRepository } from './repositories/user.repository.interface';
import { UserModel } from './models/user.model';

@Injectable()
export class UserSeeder implements OnModuleInit {
  constructor(
    @Inject('IUserRepository')
    private userRepository: IUserRepository,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  async seed() {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ username: 'user' });

    if (!existingUser) {
      // create dummy user
      const newUser = new UserModel({
        username: 'user',
        password: 'pass',
      });
      
      await this.userRepository.create(newUser);
      console.log('Default user created');
    }
  }
}
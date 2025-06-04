import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { userProviders } from './user.providers';
import { UserSeeder } from './user.seeder';

@Module({
  imports: [DatabaseModule],
  providers: [
    UserSeeder,
    ...userProviders,
  ],
  exports: [...userProviders],
})
export class UserModule {}
import { Sequelize } from 'sequelize-typescript';
import { BookEntity } from '../book/entities/book.entity';
import { AuthorEntity } from '../author/entities/author.entity';
import { PublisherEntity } from '../publisher/entities/publisher.entity';
import { UserEntity } from '../user/entities/user.entity';
import * as dotenv from 'dotenv';

dotenv.config();

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_DATABASE || 'library',
      });
      sequelize.addModels([BookEntity, AuthorEntity, PublisherEntity, UserEntity]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
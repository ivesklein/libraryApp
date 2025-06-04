import { Sequelize } from 'sequelize-typescript';
import { Book } from '../book/entities/book.entity';
import { Author } from '../author/entities/author.entity';
import { Publisher } from '../publisher/entities/publisher.entity';
import { User } from '../user/entities/user.entity';
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
      sequelize.addModels([Book, Author, Publisher, User]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
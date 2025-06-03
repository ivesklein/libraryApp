import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Book } from '../../book/entities/book.entity';

@Table
export class Author extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @HasMany(() => Book)
  books: Book[];
}
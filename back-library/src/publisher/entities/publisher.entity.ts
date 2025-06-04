import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { BookEntity } from '../../book/entities/book.entity';

@Table
export class PublisherEntity extends Model {
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

  @HasMany(() => BookEntity)
  books: BookEntity[];
}
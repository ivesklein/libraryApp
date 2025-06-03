import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Author } from '../../author/entities/author.entity';
import { Publisher } from '../../publisher/entities/publisher.entity';

@Table
export class Book extends Model {
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
  title: string;

  @ForeignKey(() => Author)
  @Column
  authorId: number;

  @BelongsTo(() => Author)
  author: Author;

  @Column({
    type: DataType.TEXT,
  })
  description: string;

  @ForeignKey(() => Publisher)
  @Column
  publisherId: number;

  @BelongsTo(() => Publisher)
  publisher: Publisher;

  @Column
  fileCover: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  available: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  deleted: boolean;
}
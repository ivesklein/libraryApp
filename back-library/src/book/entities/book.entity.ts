import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { AuthorEntity } from '../../author/entities/author.entity';
import { PublisherEntity } from '../../publisher/entities/publisher.entity';

@Table
export class BookEntity extends Model {
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

  @ForeignKey(() => AuthorEntity)
  @Column
  authorId: number;

  @BelongsTo(() => AuthorEntity)
  author: AuthorEntity;

  @Column({
    type: DataType.TEXT,
  })
  description: string;

  @ForeignKey(() => PublisherEntity)
  @Column
  publisherId: number;

  @BelongsTo(() => PublisherEntity)
  publisher: PublisherEntity;

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
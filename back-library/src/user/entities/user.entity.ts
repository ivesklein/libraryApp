import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class UserEntity extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;
}
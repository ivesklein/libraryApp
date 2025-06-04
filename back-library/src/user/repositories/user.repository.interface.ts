import { UserModel } from '../models/user.model';

export interface IUserRepository {
  findOne(criteria: Partial<UserModel>): Promise<UserModel | null>;
  create(userData: Partial<UserModel>): Promise<UserModel>;
  findAll(): Promise<UserModel[]>;
}
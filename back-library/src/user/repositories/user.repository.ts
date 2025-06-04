import { Injectable, Inject } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { UserModel } from '../models/user.model';
import { IUserRepository } from './user.repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @Inject('USER_REPOSITORY')
    private userEntityRepository: typeof UserEntity,
  ) {}

  async findOne(criteria: Partial<UserModel>): Promise<UserModel | null> {
    const entity = await this.userEntityRepository.findOne({
      where: criteria,
    });
    
    return entity ? this.mapToModel(entity) : null;
  }

  async create(userData: Partial<UserModel>): Promise<UserModel> {
    const created = await this.userEntityRepository.create(userData);
    return this.mapToModel(created);
  }

  async findAll(): Promise<UserModel[]> {
    const entities = await this.userEntityRepository.findAll();
    return entities.map(entity => this.mapToModel(entity));
  }

  private mapToModel(entity: UserEntity): UserModel {
    return new UserModel({
      id: entity.id,
      username: entity.username,
      password: entity.password,
    });
  }
}
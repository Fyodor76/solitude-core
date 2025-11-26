import { InjectModel } from '@nestjs/sequelize';
import { UserRepository } from 'src/users/domain/repository/user.repository';
import { UserModel } from '../orm/user.entity';
import { UserEntity } from 'src/users/domain/entities/user.entity';
import { Injectable } from '@nestjs/common';

Injectable();
export class SequilizeUserRepository implements UserRepository {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: typeof UserModel,
  ) {}

  async create(user: UserEntity): Promise<UserEntity> {
    const created = await this.userModel.create({ ...user });

    if (!created) return;

    return this.buildUserEntity(created);
  }

  async findById(id: string): Promise<UserEntity> {
    const found = await this.userModel.findByPk(id);

    if (!found) return;
    return this.buildUserEntity(found);
  }

  async findByLogin(login: string): Promise<UserEntity> {
    const found = await this.userModel.findOne({ where: { login } });

    if (!found) return;

    return this.buildUserEntity(found);
  }

  private async buildUserEntity(user: UserModel) {
    return new UserEntity(user.login, user.password, user.id);
  }
}

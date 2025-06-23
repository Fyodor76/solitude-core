import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.entity';
import { tryCatch } from '../common/utils/try-catch.helper';
import { throwNotFound } from '../common/exceptions/http-exception.helper';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async create(createDto: any): Promise<User> {
    return tryCatch(
      () => this.userModel.create(createDto),
      'UsersService:create',
    );
  }

  async findAll(): Promise<User[]> {
    return tryCatch(() => this.userModel.findAll(), 'UsersService:findAll');
  }

  async findById(id: string): Promise<User> {
    const user = await tryCatch(
      () => this.userModel.findByPk(id),
      'UsersService:findById',
    );
    if (!user) throwNotFound(`User with id ${id} not found`);
    return user;
  }

  async update(id: string, updateDto: any): Promise<number> {
    const [affectedCount] = await tryCatch(
      () => this.userModel.update(updateDto, { where: { id } }),
      'UsersService:update',
    );
    if (affectedCount === 0) throwNotFound(`User with id ${id} not found`);
    return affectedCount;
  }

  async remove(id: string): Promise<void> {
    const deleted = await tryCatch(
      () => this.userModel.destroy({ where: { id } }),
      'UsersService:remove',
    );
    if (!deleted) throwNotFound(`User with id ${id} not found`);
  }
}

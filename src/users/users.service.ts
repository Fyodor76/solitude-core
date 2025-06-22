import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async create(createDto: any): Promise<User> {
    return this.userModel.create(createDto);
  }

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findByPk(id);
  }

  async update(id: string, updateDto: any): Promise<number> {
    const [affectedCount] = await this.userModel.update(updateDto, {
      where: { id },
    });
    return affectedCount;
  }

  async remove(id: string): Promise<void> {
    await this.userModel.destroy({ where: { id } });
  }
}

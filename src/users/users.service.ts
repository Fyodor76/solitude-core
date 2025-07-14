import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.entity';
import { tryCatch, tryCatchWs } from '../common/utils/try-catch.helper';
import { throwNotFound } from '../common/exceptions/http-exception.helper';
import { RequestUserDto } from './dto/request-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { Op } from 'sequelize';
import { Sender } from './types';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async create(createDto: RequestUserDto): Promise<ResponseUserDto> {
    const existingUser = await this.userModel.findOne({
      where: {
        [Op.or]: [{ username: createDto.username }, { email: createDto.email }],
      },
    });

    if (existingUser) {
      throw new ConflictException(
        'User with this username or email already exists',
      );
    }

    const user = await tryCatch(
      () => this.userModel.create(createDto),
      'UsersService:create',
    );

    return user.toJSON() as ResponseUserDto;
  }

  async findAll(): Promise<ResponseUserDto[]> {
    const users = await tryCatch(
      () => this.userModel.findAll(),
      'UsersService:findAll',
    );
    return users.map((u) => u.toJSON() as ResponseUserDto);
  }

  async findById(id: string): Promise<ResponseUserDto> {
    const user = await tryCatch(
      () => this.userModel.findByPk(id),
      'UsersService:findById',
    );
    if (!user) throwNotFound(`User with id ${id} not found`);
    return user.toJSON() as ResponseUserDto;
  }

  async update(
    id: string,
    updateDto: RequestUserDto,
  ): Promise<ResponseUserDto> {
    const [affectedCount] = await tryCatch(
      () => this.userModel.update(updateDto, { where: { id } }),
      'UsersService:update',
    );
    if (affectedCount === 0) throwNotFound(`User with id ${id} not found`);

    const updatedUser = await this.userModel.findByPk(id);
    return updatedUser.toJSON() as ResponseUserDto;
  }

  async remove(id: string): Promise<{ id: string }> {
    const deleted = await tryCatch(
      () => this.userModel.destroy({ where: { id } }),
      'UsersService:remove',
    );
    if (!deleted) throwNotFound(`User with id ${id} not found`);
    return { id };
  }

  async createGuestUser(): Promise<string> {
    return tryCatchWs(async () => {
      const guestUser = await this.userModel.create({
        username: `guest_${Date.now()}`,
        email: null,
        password: null,
        role: Sender.GUEST,
      });
      return guestUser.id;
    }, 'ChatService:createGuestUser');
  }
}

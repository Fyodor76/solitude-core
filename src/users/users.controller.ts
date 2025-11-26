import { Controller, Post, Body, HttpCode } from '@nestjs/common';

import { UserAplication } from './application/user.service';
import { UserMapper } from './application/mappers/user.mapper';
import { UserCreateDto } from './application/dto/user-create.dto';
@Controller('users')
export class UsersController {
  constructor(private readonly usersApplication: UserAplication) {}

  @Post()
  @HttpCode(201)
  async create(@Body() user: UserCreateDto) {
    const userEntity = await UserMapper.toEntity(user);
    const createdUser = await this.usersApplication.create(userEntity);
    return UserMapper.toResponse(createdUser);
  }
}

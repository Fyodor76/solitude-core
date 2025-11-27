import {
  Controller,
  Post,
  Body,
  HttpCode,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { UserAplication } from './application/user.service';
import { UserMapper } from './application/mappers/user.mapper';
import { UserCreateDto } from './application/dto/user-create.dto';
import { ApiTags } from '@nestjs/swagger';

import { Auth } from 'src/common/decorators/auth';
import {
  ApiCreateUser,
  ApiDeleteUser,
  ApiGetAllUsers,
  ApiGetUserById,
  ApiGetUserByLogin,
  ApiUpdateUser,
} from 'src/common/swagger/users.decorators';

@ApiTags('Users')  
@Controller('users')
export class UsersController {
  constructor(private readonly usersApplication: UserAplication) {}

  @Post()
  @HttpCode(201)
  @ApiCreateUser() // ✅ Чистый и понятный декоратор
  async create(@Body() user: UserCreateDto) {
    const userEntity = await UserMapper.toEntity(user);
    const createdUser = await this.usersApplication.create(userEntity);
    return UserMapper.toResponse(createdUser);
  }

  @Get('login/:login')
  @ApiGetUserByLogin() // ✅ Документация для поиска по логину
  async getByLogin(@Param('login') login: string) {
    const user = await this.usersApplication.getUserByLogin(login);
    return UserMapper.toResponse(user);
  }

  @Auth()
  @Get(':id')
  @ApiGetUserById() // ✅ Документация для поиска по ID
  async getById(@Param('id') id: string) {
    // TODO: Добавить метод в UserAplication
    // const user = await this.usersApplication.getById(id);
    // return UserMapper.toResponse(user);
  }

  @Auth()
  @Get()
  @ApiGetAllUsers() // ✅ Документация для получения всех пользователей
  async getAll() {
    // TODO: Добавить метод в UserAplication
    // const users = await this.usersApplication.getAll();
    // return users.map(user => UserMapper.toResponse(user));
  }

  @Auth()
  @Put(':id')
  @ApiUpdateUser() // ✅ Документация для обновления
  async update(@Param('id') id: string, @Body() userDto: UserCreateDto) {
    // TODO: Добавить метод в UserAplication
    // const userEntity = await UserMapper.toEntity(userDto, id);
    // const updatedUser = await this.usersApplication.update(userEntity);
    // return UserMapper.toResponse(updatedUser);
  }

  @Auth()
  @Delete(':id')
  @ApiDeleteUser() // ✅ Документация для удаления
  async delete(@Param('id') id: string) {
    // TODO: Добавить метод в UserAplication
    // await this.usersApplication.delete(id);
    // return { id };
  }
}

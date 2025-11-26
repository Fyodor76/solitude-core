import { UserEntity } from '../../domain/entities/user.entity';
import { UserCreateDto } from '../dto/user-create.dto';
import { UserResponseDto } from '../dto/user-response.dto';

export class UserMapper {
  static async toEntity(dto: UserCreateDto): Promise<UserEntity> {
    const user = new UserEntity(dto.login, dto.password);
    await user.setPassword(dto.password);
    return user;
  }
  static toResponse(user: UserEntity): UserResponseDto {
    return new UserResponseDto(user.id, user.login);
  }
}

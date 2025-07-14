import { ApiProperty } from '@nestjs/swagger';
import { SenderType } from '../types';

export class RequestUserDto {
  @ApiProperty({ example: 'johndoe' })
  username: string;

  @ApiProperty({ example: 'johndoe@example.com' })
  email: string;

  @ApiProperty({ example: 'operator' })
  role: SenderType;

  @ApiProperty({ example: 'StrongPassword123!' })
  password: string;
}

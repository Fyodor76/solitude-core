import { ApiProperty } from '@nestjs/swagger';
import { SenderType } from '../types';

export class ResponseUserDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'johndoe' })
  username: string;

  @ApiProperty({ example: 'operator' })
  role: SenderType;

  @ApiProperty({ example: 'johndoe@example.com' })
  email: string;
}

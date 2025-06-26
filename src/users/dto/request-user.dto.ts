import { ApiProperty } from '@nestjs/swagger';

export class RequestUserDto {
  @ApiProperty({ example: 'johndoe' })
  username: string;

  @ApiProperty({ example: 'johndoe@example.com' })
  email: string;

  @ApiProperty({ example: 'StrongPassword123!' })
  password: string;
}

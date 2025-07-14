import { ApiProperty } from '@nestjs/swagger';

export class UserJoinedResponseDto {
  @ApiProperty()
  userId: string;
}

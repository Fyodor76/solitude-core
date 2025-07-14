import { ApiProperty } from '@nestjs/swagger';

export class UserLeftResponseDto {
  @ApiProperty()
  userId: string;
}

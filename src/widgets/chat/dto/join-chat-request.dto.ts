import { ApiProperty } from '@nestjs/swagger';

export class JoinChatRequestDto {
  @ApiProperty()
  chatId: string;

  @ApiProperty()
  userId: string;
}

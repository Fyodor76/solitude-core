import { ApiProperty } from '@nestjs/swagger';

export class ChatClosedResponseDto {
  @ApiProperty()
  chatId: string;
}

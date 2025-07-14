import { ApiProperty } from '@nestjs/swagger';

export class MessageDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  chatId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  text: string;

  @ApiProperty()
  createdAt: Date;
}

export class ChatHistoryResponseDto {
  @ApiProperty({ type: [MessageDto] })
  messages: MessageDto[];
}

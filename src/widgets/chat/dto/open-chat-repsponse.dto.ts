import { ApiProperty } from '@nestjs/swagger';
import { Chat } from '../chat.entity';

export class ChatParticipantDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  role: string;
}
export class OpenedChatResponseDto {
  @ApiProperty()
  chat: Chat;

  @ApiProperty({
    type: () => OpenedChatUserDto,
  })
  user: OpenedChatUserDto;

  @ApiProperty({ type: [ChatParticipantDto] })
  chatParticipants: ChatParticipantDto[];
}

export class OpenedChatUserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  isGuest: boolean;
}

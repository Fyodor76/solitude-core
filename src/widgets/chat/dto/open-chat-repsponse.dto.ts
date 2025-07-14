import { ApiProperty } from '@nestjs/swagger';
import { Chat } from '../chat.entity';

export class OpenedChatResponseDto {
  @ApiProperty()
  chat: Chat;

  @ApiProperty({
    type: () => OpenedChatUserDto,
  })
  user: OpenedChatUserDto;
}

export class OpenedChatUserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  isGuest: boolean;
}

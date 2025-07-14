import { ApiProperty } from '@nestjs/swagger';
import { ChatStatus, ChatStatusType } from '../types';
import { ChatParticipantDto } from './chat-participants.dto';
import { MessageDto } from './chat-history-response.dto';

export class ChatDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: Object.values(ChatStatus) })
  status: ChatStatusType;

  @ApiProperty({ type: () => [ChatParticipantDto], required: false })
  participants?: ChatParticipantDto[];

  @ApiProperty({ type: () => [MessageDto], required: false })
  messages?: MessageDto[];
}

import { ApiProperty } from '@nestjs/swagger';

export class ChatParticipantDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  chatId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ required: false })
  user?: {
    id: string;
    username: string;
    role: string;
  };
}

import { ApiProperty } from '@nestjs/swagger';
export class ChatParticipantDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  role: string;
}

export class UserJoinedResponseDto {
  @ApiProperty()
  userId: string;

  @ApiProperty({ type: [ChatParticipantDto] })
  chatParticipants: ChatParticipantDto[];
}

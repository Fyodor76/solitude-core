import { ApiProperty } from '@nestjs/swagger';

export class MessageDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  chatId: string;

  @ApiProperty({ required: false, nullable: true })
  userId?: string | null;

  @ApiProperty()
  text: string;

  @ApiProperty({ required: false })
  user?: {
    id: string;
    username: string;
    role: string;
  };
}

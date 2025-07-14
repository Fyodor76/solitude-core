import { ApiProperty } from '@nestjs/swagger';

export class CloseChatRequestDto {
  @ApiProperty()
  chatId: string;
}

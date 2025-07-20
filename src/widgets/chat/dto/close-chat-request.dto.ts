import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO для запроса закрытия чата
 */
export class CloseChatRequestDto {
  /**
   * Идентификатор чата для закрытия
   */
  @ApiProperty({ example: '7be85f93-4810-4462-3ffc-25bv3f10afa6' })
  chatId: string;
}

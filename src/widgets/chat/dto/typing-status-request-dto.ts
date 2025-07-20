import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/**
 * DTO для запроса статуса набора текста в чате
 */
export class TypingStatusRequestDto {
  /**
   * Идентификатор чата, в котором пользователь печатает
   */
  @ApiProperty({ example: '7be85f93-4810-4462-3ffc-25bv3f10afa6' })
  @IsString()
  chatId: string;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class RequestMessageDto {
  /**
   * Идентификатор чата, куда отправляется сообщение
   */
  @ApiProperty({ example: '7be85f93-4810-4462-3ffc-25bv3f10afa6' })
  @IsUUID()
  chatId: string;

  /**
   * Идентификатор пользователя. Если не передан — сообщение от бота.
   */
  @ApiProperty({
    example: '7be85f93-4810-4462-3ffc-25bv3f10afa6',
    description: 'ID пользователя. Если не передан — сообщение от бота.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  userId?: string;

  /**
   * Текст сообщения (необязательно, например если это файл или событие)
   */
  @ApiPropertyOptional({ example: 'Спасибо за вопрос!' })
  @IsOptional()
  @IsString()
  text?: string;
}

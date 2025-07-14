import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RequestMessageDto {
  @ApiProperty({ example: '7be85f93-4810-4462-3ffc-25bv3f10afa6' })
  chatId: string;

  @ApiProperty({
    example: '7be85f93-4810-4462-3ffc-25bv3f10afa6',
    description: 'ID пользователя, или null для бота',
  })
  userId: string | null;

  @ApiPropertyOptional({ example: 'Спасибо за вопрос!' })
  text?: string;
}

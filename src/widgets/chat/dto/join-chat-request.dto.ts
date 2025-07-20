import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class JoinChatRequestDto {
  /**
   * Идентификатор чата, к которому присоединяется пользователь
   */
  @ApiProperty({
    example: '7be85f93-4810-4462-3ffc-25bv3f10afa6',
    description: 'ID чата, в который пользователь хочет войти',
  })
  @IsUUID()
  chatId: string;

  /**
   * Идентификатор пользователя, который присоединяется к чату
   */
  @ApiProperty({
    example: '7be85f93-4810-4462-3ffc-25bv3f10afa6',
    description: 'ID пользователя',
  })
  @IsUUID()
  userId: string;
}

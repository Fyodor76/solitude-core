import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class OpenChatRequestDto {
  /**
   * Идентификатор пользователя (если есть).
   * Если не передан, создаётся гость.
   */
  @ApiPropertyOptional({
    description: 'ID пользователя. Если не передан, создаётся гость.',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  userId?: string;
}

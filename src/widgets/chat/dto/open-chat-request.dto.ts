import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class OpenChatRequestDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  userId: string | null;
}

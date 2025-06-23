import {
  IsUUID,
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class CreateQuestionDto {
  @ApiProperty({ example: 'What is the capital of France?' })
  @IsString()
  questionText: string;

  @ApiPropertyOptional({
    type: [String],
    example: ['Paris', 'London', 'Rome', 'Berlin'],
  })
  @IsOptional()
  @IsArray()
  options?: string[];

  @ApiPropertyOptional({ example: 'Paris' })
  @IsOptional()
  @IsString()
  correctAnswer?: string;
}

export class CreateTestDto {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  @IsUUID()
  ownerId: string;

  @ApiProperty({ example: 'Geography Quiz' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'A test about world capitals' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: { timeLimit: 30, shuffleQuestions: true },
    type: 'object',
    additionalProperties: true,
  })
  @IsOptional()
  @IsObject()
  settingsJson?: Record<string, any>;

  @ApiPropertyOptional({ type: [CreateQuestionDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions?: CreateQuestionDto[];
}

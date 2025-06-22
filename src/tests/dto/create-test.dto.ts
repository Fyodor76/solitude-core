// src/tests/dto/create-test.dto.ts
import {
  IsUUID,
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateQuestionDto {
  @IsString()
  questionText: string;

  @IsOptional()
  @IsArray()
  options?: string[];

  @IsOptional()
  @IsString()
  correctAnswer?: string;
}

export class CreateTestDto {
  @IsUUID()
  ownerId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  settingsJson?: Record<string, any>;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions?: CreateQuestionDto[];
}

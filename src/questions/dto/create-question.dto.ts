import { IsString, IsOptional, IsArray, IsUUID } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  questionText: string;

  @IsOptional()
  @IsArray()
  options?: string[];

  @IsOptional()
  @IsString()
  correctAnswer?: string;

  @IsOptional()
  @IsUUID()
  testId?: string;
}

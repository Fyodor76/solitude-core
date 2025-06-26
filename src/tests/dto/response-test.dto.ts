import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ResponseQuestionDto } from 'src/questions/dto/response-question.dto';

export class ResponseTestDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174002' })
  id: string;

  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  ownerId: string;

  @ApiProperty({ example: 'Geography Quiz' })
  title: string;

  @ApiPropertyOptional({ example: 'A test about world capitals' })
  description?: string;

  @ApiPropertyOptional({
    example: { timeLimit: 30, shuffleQuestions: true },
    type: 'object',
    additionalProperties: true,
  })
  settingsJson?: Record<string, any>;
}

export class ResponseTestWithQuestionsDto extends ResponseTestDto {
  @ApiProperty({ type: [ResponseQuestionDto] })
  questions: ResponseQuestionDto[];
}

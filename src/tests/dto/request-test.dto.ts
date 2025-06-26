import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ResponseQuestionDto } from 'src/questions/dto/response-question.dto';

export class RequestTestDto {
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

export class RequestTestWithQuestionsDto extends RequestTestDto {
  @ApiProperty({ type: [ResponseQuestionDto] })
  questions: ResponseQuestionDto[];
}

export class UpdateRequestTestWithQuestionsDto extends RequestTestWithQuestionsDto {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id: string;
}

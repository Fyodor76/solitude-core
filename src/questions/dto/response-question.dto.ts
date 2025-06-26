import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ResponseQuestionDto {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id: string;

  @ApiProperty({ example: 'What is the capital of France?' })
  questionText: string;

  @ApiPropertyOptional({
    example: {
      options: ['Paris', 'London', 'Berlin'],
      maxSelections: 1,
    },
    type: 'object',
    additionalProperties: true,
  })
  payload?: Record<string, any>;

  @ApiPropertyOptional({ example: 'Paris' })
  correctAnswer?: string | string[] | null;

  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  testId: string;
}

import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { QuestionService } from './questions.service';
import { ResponseQuestionDto } from './dto/response-question.dto';

@ApiTags('questions')
@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get('test/:testId')
  @ApiOperation({ summary: 'Get all questions by test ID' })
  @ApiParam({
    name: 'testId',
    description: 'UUID of the test to fetch questions for',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @ApiResponse({
    status: 200,
    description: 'List of questions for the given test',
    type: ResponseQuestionDto,
    isArray: true,
  })
  findByTest(@Param('testId') testId: string): Promise<ResponseQuestionDto[]> {
    return this.questionService.findByTestId(testId);
  }
}

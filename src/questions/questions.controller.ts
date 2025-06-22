import { Controller, Get, Param } from '@nestjs/common';
import { QuestionService } from './questions.service';
import { Question } from './questions.entity';

@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get('test/:testId')
  findByTest(@Param('testId') testId: string): Promise<Question[]> {
    return this.questionService.findByTestId(testId);
  }
}

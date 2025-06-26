import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Question } from './questions.entity';
import { tryCatch } from '../common/utils/try-catch.helper';
import { throwNotFound } from '../common/exceptions/http-exception.helper';
import { ResponseQuestionDto } from './dto/response-question.dto';
import { RequestQuestionDto } from './dto/request-question.dto';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question)
    private questionModel: typeof Question,
  ) {}

  async findByTestId(testId: string): Promise<ResponseQuestionDto[]> {
    return tryCatch(
      () => this.questionModel.findAll({ where: { testId } }),
      'QuestionService:findByTestId',
    );
  }

  async create(createDto: RequestQuestionDto): Promise<ResponseQuestionDto> {
    return tryCatch(
      () => this.questionModel.create(createDto),
      'QuestionService:create',
    );
  }

  async removeByTestId(testId: string): Promise<string> {
    const deletedCount = await tryCatch(
      () => this.questionModel.destroy({ where: { testId } }),
      'QuestionService:removeByTestId',
    );

    if (!deletedCount) {
      throwNotFound(`No questions found for testId: ${testId}`);
    }

    return testId;
  }
}

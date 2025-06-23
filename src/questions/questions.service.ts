import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Question } from './questions.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { tryCatch } from '../common/utils/try-catch.helper';
import { throwNotFound } from '../common/exceptions/http-exception.helper';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question)
    private questionModel: typeof Question,
  ) {}

  async findByTestId(testId: string): Promise<Question[]> {
    return tryCatch(
      () => this.questionModel.findAll({ where: { testId } }),
      'QuestionService:findByTestId',
    );
  }

  async create(createDto: CreateQuestionDto): Promise<Question> {
    return tryCatch(
      () => this.questionModel.create(createDto),
      'QuestionService:create',
    );
  }

  async removeByTestId(testId: string): Promise<void> {
    const deleted = await tryCatch(
      () => this.questionModel.destroy({ where: { testId } }),
      'QuestionService:removeByTestId',
    );
    if (!deleted) throwNotFound(`No questions found for testId: ${testId}`);
  }
}

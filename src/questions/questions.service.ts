import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Question } from './questions.entity';
@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question)
    private questionModel: typeof Question,
  ) {}

  async findByTestId(testId: string): Promise<Question[]> {
    return this.questionModel.findAll({ where: { testId } });
  }

  async create(createDto: any): Promise<Question> {
    return this.questionModel.create(createDto);
  }

  async removeByTestId(testId: string): Promise<void> {
    await this.questionModel.destroy({ where: { testId } });
  }
}

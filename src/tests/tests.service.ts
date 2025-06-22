import { Injectable } from '@nestjs/common';
import { Test } from './tests.entity';
import { InjectModel } from '@nestjs/sequelize';
import { NotFoundException } from '@nestjs/common';
import { QuestionService } from '../questions/questions.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { CreateQuestionDto } from '../questions/dto/create-question.dto';
@Injectable()
export class TestService {
  constructor(
    @InjectModel(Test)
    private testModel: typeof Test,
    private readonly questionService: QuestionService,
  ) {}

  async create(createDto: CreateTestDto): Promise<Test> {
    const { questions, ...testData } = createDto;

    const test = await this.testModel.create(testData);

    if (questions && questions.length) {
      await this.createQuestionsForTest(test.id, questions);
    }

    return test;
  }

  async findAll(): Promise<Test[]> {
    return this.testModel.findAll();
  }

  async findById(id: string): Promise<Test> {
    return this.testModel.findByPk(id);
  }

  async update(id: string, updateDto: UpdateTestDto): Promise<Test> {
    const { questions, ...testData } = updateDto;

    const [affectedCount, [updatedTest]] = await this.testModel.update(
      testData,
      {
        where: { id },
        returning: true,
      },
    );

    if (affectedCount === 0) {
      throw new NotFoundException(`Test with id ${id} not found`);
    }

    if (questions && questions.length) {
      await this.questionService.removeByTestId(id);
      await this.createQuestionsForTest(id, questions);
    }

    return updatedTest;
  }

  async remove(id: string): Promise<void> {
    await this.testModel.destroy({ where: { id } });
  }

  // Приватный метод для создания вопросов для теста
  private async createQuestionsForTest(
    testId: string,
    questions: CreateQuestionDto[],
  ): Promise<void> {
    await Promise.all(
      questions.map((q) => this.questionService.create({ ...q, testId })),
    );
  }
}

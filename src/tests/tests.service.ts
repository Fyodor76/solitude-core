import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Test } from './tests.entity';
import { QuestionService } from '../questions/questions.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { CreateQuestionDto } from '../questions/dto/create-question.dto';
import { tryCatch } from '../common/utils/try-catch.helper';
import { throwNotFound } from '../common/exceptions/http-exception.helper';

@Injectable()
export class TestService {
  private readonly logger = new Logger(TestService.name);

  constructor(
    @InjectModel(Test)
    private testModel: typeof Test,
    private readonly questionService: QuestionService,
  ) {}

  async create(createDto: CreateTestDto): Promise<Test> {
    const { questions, ...testData } = createDto;

    const test = await tryCatch(
      () => this.testModel.create(testData),
      'TestService:create',
    );

    if (questions && questions.length) {
      await this.createQuestionsForTest(test.id, questions);
    }

    return test;
  }

  async findAll(): Promise<Test[]> {
    return tryCatch(() => this.testModel.findAll(), 'TestService:findAll');
  }

  async findById(id: string): Promise<Test> {
    const test = await tryCatch(
      () => this.testModel.findByPk(id),
      'TestService:findById',
    );

    if (!test) {
      throwNotFound(`Test with id ${id} not found`);
    }

    return test;
  }

  async update(id: string, updateDto: UpdateTestDto): Promise<Test> {
    const { questions, ...testData } = updateDto;

    const [affectedCount, [updatedTest]] = await tryCatch(
      () =>
        this.testModel.update(testData, {
          where: { id },
          returning: true,
        }),
      'TestService:update',
    );

    if (affectedCount === 0) {
      throwNotFound(`Test with id ${id} not found`);
    }

    if (questions && questions.length) {
      await this.questionService.removeByTestId(id);
      await this.createQuestionsForTest(id, questions);
    }

    return updatedTest;
  }

  async remove(id: string): Promise<void> {
    const deleted = await tryCatch(
      () => this.testModel.destroy({ where: { id } }),
      'TestService:remove',
    );

    if (!deleted) {
      throwNotFound(`Test with id ${id} not found`);
    }
  }

  private async createQuestionsForTest(
    testId: string,
    questions: CreateQuestionDto[],
  ): Promise<void> {
    await tryCatch(
      () =>
        Promise.all(
          questions.map((q) => this.questionService.create({ ...q, testId })),
        ),
      'TestService:createQuestionsForTest',
    );
  }
}

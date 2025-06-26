import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Test } from './tests.entity';
import { QuestionService } from '../questions/questions.service';
import { tryCatch } from '../common/utils/try-catch.helper';
import { throwNotFound } from '../common/exceptions/http-exception.helper';
import { ResponseTestWithQuestionsDto } from './dto/response-test.dto';
import { Question } from '../questions/questions.entity';
import { RequestTestWithQuestionsDto } from './dto/request-test.dto';
import { RequestQuestionDto } from 'src/questions/dto/request-question.dto';

@Injectable()
export class TestService {
  private readonly logger = new Logger(TestService.name);

  constructor(
    @InjectModel(Test)
    private testModel: typeof Test,
    private readonly questionService: QuestionService,
  ) {}

  async create(
    createDto: RequestTestWithQuestionsDto,
  ): Promise<ResponseTestWithQuestionsDto> {
    const { questions, ...testData } = createDto;

    const test = await tryCatch(
      () => this.testModel.create(testData),
      'TestService:create',
    );

    if (questions && questions.length) {
      await this.createQuestionsForTest(test.id, questions);
    }

    const testWithQuestions = await this.testModel.findByPk(test.id, {
      include: [Question],
    });

    return testWithQuestions;
  }

  async findAll(): Promise<ResponseTestWithQuestionsDto[]> {
    return tryCatch(
      () => this.testModel.findAll({ include: [Question] }),
      'TestService:findAll',
    );
  }

  async findById(id: string): Promise<ResponseTestWithQuestionsDto> {
    const test = await tryCatch(
      () => this.testModel.findByPk(id, { include: [Question] }),
      'TestService:findById',
    );

    if (!test) {
      throwNotFound(`Test with id ${id} not found`);
    }

    return test;
  }

  async update(
    id: string,
    updateDto: RequestTestWithQuestionsDto,
  ): Promise<ResponseTestWithQuestionsDto> {
    const { questions, ...testData } = updateDto;

    const [affectedCount] = await tryCatch(
      () => this.testModel.update(testData, { where: { id } }),
      'TestService:update',
    );

    if (affectedCount === 0) {
      throwNotFound(`Test with id ${id} not found`);
    }

    if (questions && questions.length) {
      await this.questionService.removeByTestId(id);
      await this.createQuestionsForTest(id, questions);
    }

    const updatedTest = await this.testModel.findByPk(id, {
      include: [Question],
    });

    return updatedTest as ResponseTestWithQuestionsDto;
  }

  async remove(id: string): Promise<string> {
    const deletedCount = await tryCatch(
      () => this.testModel.destroy({ where: { id } }),
      'TestService:remove',
    );

    if (!deletedCount) {
      throwNotFound(`Test with id ${id} not found`);
    }

    return id;
  }

  private async createQuestionsForTest(
    testId: string,
    questions: RequestQuestionDto[],
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

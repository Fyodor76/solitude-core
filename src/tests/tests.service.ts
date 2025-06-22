import { Injectable } from '@nestjs/common';
import { Test } from './tests.entity';
import { InjectModel } from '@nestjs/sequelize';
import { NotFoundException } from '@nestjs/common';
import { QuestionService } from 'src/questions/questions.service';
@Injectable()
export class TestService {
  constructor(
    @InjectModel(Test)
    private testModel: typeof Test,
    private readonly questionService: QuestionService,
  ) {}

  async create(createDto: any): Promise<Test> {
    const { questions, ...testData } = createDto;

    const test = await this.testModel.create(testData);

    if (questions && questions.length) {
      await Promise.all(
        questions.map((q: any) =>
          this.questionService.create({ ...q, testId: test.id }),
        ),
      );
    }

    return test;
  }

  async findAll(): Promise<Test[]> {
    return this.testModel.findAll();
  }

  async findById(id: string): Promise<Test> {
    return this.testModel.findByPk(id);
  }

  async update(id: string, updateDto: any): Promise<Test> {
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

      await Promise.all(
        questions.map((q: any) =>
          this.questionService.create({ ...q, testId: id }),
        ),
      );
    }

    return updatedTest;
  }

  async remove(id: string): Promise<void> {
    await this.testModel.destroy({ where: { id } });
  }
}

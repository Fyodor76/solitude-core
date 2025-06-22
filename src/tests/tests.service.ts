import { Injectable } from '@nestjs/common';
import { Test } from './tests.entity';
import { InjectModel } from '@nestjs/sequelize';
import { NotFoundException } from '@nestjs/common';
@Injectable()
export class TestService {
  constructor(
    @InjectModel(Test)
    private testModel: typeof Test,
  ) {}

  async create(createDto: any): Promise<Test> {
    return this.testModel.create(createDto);
  }

  async findAll(): Promise<Test[]> {
    return this.testModel.findAll();
  }

  async findById(id: string): Promise<Test> {
    return this.testModel.findByPk(id);
  }

  async update(id: string, updateDto: any): Promise<Test> {
    const [affectedCount, [updatedTest]] = await this.testModel.update(
      updateDto,
      {
        where: { id },
        returning: true,
      },
    );

    if (affectedCount === 0) {
      throw new NotFoundException(`Test with id ${id} not found`);
    }

    return updatedTest;
  }

  async remove(id: string): Promise<void> {
    await this.testModel.destroy({ where: { id } });
  }
}

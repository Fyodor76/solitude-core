import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FormSubmissionRepository } from '../../domain/repository/form-submission.repository';
import { FormSubmissionEntity } from '../../domain/entities/form-submission.entity';
import { FormSubmissionModel } from '../orm/form-submission.entity';
import { Op } from 'sequelize';

@Injectable()
export class SequelizeFormSubmissionRepository implements FormSubmissionRepository {
  constructor(
    @InjectModel(FormSubmissionModel)
    private readonly formSubmissionModel: typeof FormSubmissionModel,
  ) {}

  async create(submission: FormSubmissionEntity): Promise<FormSubmissionEntity> {
    const created = await this.formSubmissionModel.create({
      id: submission.id,
      formType: submission.formType,
      formData: submission.formData,
      status: submission.status,
      source: submission.source,
      ipAddress: submission.ipAddress,
      userAgent: submission.userAgent,
      createdAt: submission.createdAt,
      updatedAt: submission.updatedAt,
    });

    return this.toDomainEntity(created);
  }

  async findById(id: string): Promise<FormSubmissionEntity | null> {
    const found = await this.formSubmissionModel.findByPk(id);
    return found ? this.toDomainEntity(found) : null;
  }

  async findByFormType(formType: string): Promise<FormSubmissionEntity[]> {
    const submissions = await this.formSubmissionModel.findAll({
      where: { formType },
      order: [['createdAt', 'DESC']],
    });

    return submissions.map(submission => this.toDomainEntity(submission));
  }

  async findAll(): Promise<FormSubmissionEntity[]> {
    const submissions = await this.formSubmissionModel.findAll({
      order: [['createdAt', 'DESC']],
    });

    return submissions.map(submission => this.toDomainEntity(submission));
  }

  async update(submission: FormSubmissionEntity): Promise<FormSubmissionEntity> {
    const [affectedCount] = await this.formSubmissionModel.update(
      {
        formData: submission.formData,
        status: submission.status,
        source: submission.source,
        ipAddress: submission.ipAddress,
        userAgent: submission.userAgent,
        updatedAt: submission.updatedAt,
      },
      { where: { id: submission.id } },
    );

    if (affectedCount === 0) {
      throw new Error('Form submission not found');
    }

    return submission;
  }

  async delete(id: string): Promise<void> {
    await this.formSubmissionModel.destroy({ where: { id } });
  }

  async countByStatus(status: string): Promise<number> {
    return await this.formSubmissionModel.count({ where: { status } });
  }

  private toDomainEntity(model: FormSubmissionModel): FormSubmissionEntity {
    return new FormSubmissionEntity(
      model.id,
      model.formType,
      model.formData,
      model.status as 'new' | 'processed' | 'rejected',
      model.source,
      model.ipAddress,
      model.userAgent,
      model.createdAt,
      model.updatedAt,
    );
  }
}

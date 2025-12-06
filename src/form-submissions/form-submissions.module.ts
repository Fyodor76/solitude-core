import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FormSubmissionService } from './application/services/form-submission.service';
import { SequelizeFormSubmissionRepository } from './infrastructure/repositories/sequelize-form-submission.repository';
import { FormSubmissionModel } from './infrastructure/orm/form-submission.entity';
import { FormSubmissionController } from './form-submission.controller';

@Module({
  imports: [SequelizeModule.forFeature([FormSubmissionModel])],
  controllers: [FormSubmissionController],
  providers: [
    FormSubmissionService,
    {
      provide: 'FormSubmissionRepository',
      useClass: SequelizeFormSubmissionRepository,
    },
  ],
  exports: [FormSubmissionService],
})
export class FormSubmissionsModule {}

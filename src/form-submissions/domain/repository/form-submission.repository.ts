import { FormSubmissionEntity } from '../entities/form-submission.entity';

export interface FormSubmissionRepository {
  create(submission: FormSubmissionEntity): Promise<FormSubmissionEntity>;
  findById(id: string): Promise<FormSubmissionEntity | null>;
  findByFormType(formType: string): Promise<FormSubmissionEntity[]>;
  findAll(): Promise<FormSubmissionEntity[]>;
  update(submission: FormSubmissionEntity): Promise<FormSubmissionEntity>;
  delete(id: string): Promise<void>;
  countByStatus(status: string): Promise<number>;
}

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FormSubmissionRepository } from 'src/form-submissions/domain/repository/form-submission.repository';
import {
  CallbackFormDto,
  FormSubmissionResponseDto,
} from '../dto/form-submission.dto';
import { FormSubmissionMapper } from '../mappers/form-submission.mapper';

@Injectable()
export class FormSubmissionService {
  constructor(
    @Inject('FormSubmissionRepository')
    private readonly formSubmissionRepository: FormSubmissionRepository,
  ) {}

  async submitCallbackForm(
    dto: CallbackFormDto,
    source?: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<FormSubmissionResponseDto> {
    const submission = FormSubmissionMapper.toCallbackFormEntity(
      dto,
      source,
      ipAddress,
      userAgent,
    );

    const created = await this.formSubmissionRepository.create(submission);

    return new FormSubmissionResponseDto(
      true,
      'Форма успешно отправлена',
      created.id,
    );
  }

  async getAllSubmissions() {
    const submissions = await this.formSubmissionRepository.findAll();
    return submissions.map((submission) =>
      FormSubmissionMapper.toResponse(submission),
    );
  }

  async getSubmissionsByFormType(formType: string) {
    const submissions =
      await this.formSubmissionRepository.findByFormType(formType);
    return submissions.map((submission) =>
      FormSubmissionMapper.toResponse(submission),
    );
  }

  async getSubmissionById(id: string) {
    const submission = await this.formSubmissionRepository.findById(id);
    if (!submission) {
      throw new NotFoundException('Submission not found');
    }
    return FormSubmissionMapper.toResponse(submission);
  }

  async markAsProcessed(id: string) {
    const submission = await this.formSubmissionRepository.findById(id);
    if (!submission) {
      throw new NotFoundException('Form submission not found');
    }

    submission.markAsProcessed();
    const updated = await this.formSubmissionRepository.update(submission);
    return FormSubmissionMapper.toResponse(updated);
  }

  async markAsRejected(id: string) {
    const submission = await this.formSubmissionRepository.findById(id);
    if (!submission) {
      throw new NotFoundException('Form submission not found');
    }

    submission.markAsRejected();
    const updated = await this.formSubmissionRepository.update(submission);
    return FormSubmissionMapper.toResponse(updated);
  }

  async getStats() {
    const [newCount, processedCount, rejectedCount] = await Promise.all([
      this.formSubmissionRepository.countByStatus('new'),
      this.formSubmissionRepository.countByStatus('processed'),
      this.formSubmissionRepository.countByStatus('rejected'),
    ]);

    return {
      new: newCount,
      processed: processedCount,
      rejected: rejectedCount,
      total: newCount + processedCount + rejectedCount,
    };
  }
}

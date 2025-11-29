import { FormSubmissionEntity } from '../../domain/entities/form-submission.entity';
import { CallbackFormDto } from '../dto/form-submission.dto';

export class FormSubmissionMapper {
  static toCallbackFormEntity(
    dto: CallbackFormDto,
    source?: string,
    ipAddress?: string,
    userAgent?: string,
  ): FormSubmissionEntity {
    return FormSubmissionEntity.create(
      'callback',
      {
        name: dto.name,
        phone: dto.phone,
        email: dto.email,
        comment: dto.comment,
        agreeToPolicy: dto.agreeToPolicy,
      },
      source,
      ipAddress,
      userAgent,
    );
  }

  static toResponse(entity: FormSubmissionEntity) {
    return {
      id: entity.id,
      formType: entity.formType,
      formData: entity.formData,
      status: entity.status,
      source: entity.source,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}

import { v4 as uuidv4 } from 'uuid';

export class FormSubmissionEntity {
  constructor(
    public id: string,
    public formType: string,
    public formData: Record<string, any>,
    public status: 'new' | 'processed' | 'rejected' = 'new',
    public source?: string,
    public ipAddress?: string,
    public userAgent?: string,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}

  markAsProcessed(): void {
    this.status = 'processed';
    this.updatedAt = new Date();
  }

  markAsRejected(): void {
    this.status = 'rejected';
    this.updatedAt = new Date();
  }

  updateData(newData: Record<string, any>): void {
    this.formData = { ...this.formData, ...newData };
    this.updatedAt = new Date();
  }

  static create(
    formType: string,
    formData: Record<string, any>,
    source?: string,
    ipAddress?: string,
    userAgent?: string,
  ): FormSubmissionEntity {
    return new FormSubmissionEntity(
      uuidv4(),
      formType,
      formData,
      'new',
      source,
      ipAddress,
      userAgent,
    );
  }
}

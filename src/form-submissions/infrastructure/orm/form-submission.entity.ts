import { Table, Column, Model, DataType, Index } from 'sequelize-typescript';

@Table({ tableName: 'form_submissions' })
export class FormSubmissionModel extends Model<FormSubmissionModel> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Index
  @Column({ type: DataType.STRING, allowNull: false })
  formType: string;

  @Column({ type: DataType.JSONB, allowNull: false })
  formData: Record<string, any>;

  @Index
  @Column({
    type: DataType.ENUM('new', 'processed', 'rejected'),
    defaultValue: 'new',
  })
  status: string;

  @Column({ type: DataType.STRING, defaultValue: 'website' })
  source: string;

  @Column({ type: DataType.STRING })
  ipAddress: string;

  @Column({ type: DataType.TEXT })
  userAgent: string;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  createdAt: Date;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  updatedAt: Date;
}

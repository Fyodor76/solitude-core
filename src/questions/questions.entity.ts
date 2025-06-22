import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
} from 'sequelize-typescript';
import { Test } from '../tests/tests.entity';

@Table({ tableName: 'questions' })
export class Question extends Model<Question> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => Test)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  testId: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  questionText: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  options: object;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  correctAnswer: string;

  @BelongsTo(() => Test)
  test: Test;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}

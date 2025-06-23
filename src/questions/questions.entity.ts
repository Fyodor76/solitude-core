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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Test } from '../tests/tests.entity';

@Table({ tableName: 'questions' })
export class Question extends Model<Question> {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  @ForeignKey(() => Test)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  testId: string;

  @ApiProperty({ example: 'What is the capital of France?' })
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  questionText: string;

  @ApiPropertyOptional({
    example: ['Paris', 'London', 'Berlin', 'Rome'],
    type: 'array',
    items: { type: 'string' },
  })
  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  options: object;

  @ApiPropertyOptional({ example: 'Paris' })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  correctAnswer: string;

  @ApiPropertyOptional({ type: () => Test })
  @BelongsTo(() => Test)
  test: Test;

  @ApiProperty({ example: '2023-06-24T12:34:56.789Z' })
  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @ApiProperty({ example: '2023-06-24T12:34:56.789Z' })
  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}

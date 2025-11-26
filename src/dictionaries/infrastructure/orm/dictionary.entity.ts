import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'dictionaries' })
export class DictionaryModel extends Model<DictionaryModel> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  slug: string;

  @Column({
    type: DataType.ENUM(
      'size',
      'color',
      'material',
      'brand',
      'country',
      'other',
    ),
    allowNull: false,
  })
  type: string;

  @Column({ type: DataType.JSON, defaultValue: [] })
  values: any[];

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isActive: boolean;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  sortOrder: number;

  @Column({ type: DataType.TEXT })
  description: string;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  createdAt: Date;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  updatedAt: Date;
}

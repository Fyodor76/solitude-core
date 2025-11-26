import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { AttributeValueModel } from './attribute-value.entity';

@Table({ tableName: 'product_attributes' })
export class ProductAttributeModel extends Model<ProductAttributeModel> {
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
      'color',
      'size',
      'volume',
      'weight',
      'dimension',
      'other',
    ),
    allowNull: false,
  })
  type: string;

  @Column({ type: DataType.TEXT })
  description: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isActive: boolean;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  sortOrder: number;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  createdAt: Date;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  updatedAt: Date;

  @HasMany(() => AttributeValueModel, 'attributeId')
  values: AttributeValueModel[];
}

import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ProductAttributeModel } from './product-attribute.entity';

@Table({ tableName: 'attribute_values' })
export class AttributeValueModel extends Model<AttributeValueModel> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ForeignKey(() => ProductAttributeModel)
  attributeId: string;

  @Column({ type: DataType.STRING, allowNull: false })
  value: string;

  @Column({ type: DataType.STRING, allowNull: false })
  slug: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  sortOrder: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isActive: boolean;

  @Column({ type: DataType.STRING(7) })
  hexCode: string;

  @Column({ type: DataType.JSON, defaultValue: {} })
  metadata: any;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  createdAt: Date;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  updatedAt: Date;

  @BelongsTo(() => ProductAttributeModel, 'attributeId')
  attribute: ProductAttributeModel;
}

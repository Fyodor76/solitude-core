import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { ProductVariationModel } from './product-variation.entity';

@Table({ tableName: 'variation_attributes' })
export class VariationAttributeModel extends Model<VariationAttributeModel> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => ProductVariationModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'variationId',
  })
  variationId: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'attributeId',
  })
  attributeId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'values',
  })
  values: string[];

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  createdAt: Date;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  updatedAt: Date;
}

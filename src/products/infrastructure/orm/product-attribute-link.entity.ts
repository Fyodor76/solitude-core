import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { ProductModel } from './product.entity';

@Table({ tableName: 'product_attribute_links' })
export class ProductAttributeLinkModel extends Model<ProductAttributeLinkModel> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => ProductModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'productId',
  })
  productId: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'attributeId',
  })
  attributeId: string;

  @Column({ type: DataType.JSON, allowNull: false })
  values: string[];

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  createdAt: Date;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  updatedAt: Date;
}

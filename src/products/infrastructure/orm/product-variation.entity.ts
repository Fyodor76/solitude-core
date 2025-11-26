import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { ProductModel } from './product.entity';
import { VariationAttributeModel } from './variation-attribute.entity';

@Table({ tableName: 'product_variations' })
export class ProductVariationModel extends Model<ProductVariationModel> {
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
  @ForeignKey(() => ProductModel)
  productId: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  sku: string;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  price: number;

  @Column({ type: DataType.DECIMAL(10, 2) })
  comparePrice: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  stock: number;

  @Column({ type: DataType.JSON, defaultValue: [] })
  images: string[];

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isActive: boolean;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  createdAt: Date;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  updatedAt: Date;

  // Relations
  @BelongsTo(() => ProductModel)
  product: ProductModel;

  @HasMany(() => VariationAttributeModel)
  attributes: VariationAttributeModel[];
}

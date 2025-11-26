import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { CategoryModel } from '../../../categories/infrastructure/orm/category.entity';
import { ProductVariationModel } from './product-variation.entity';
import { ProductAttributeLinkModel } from './product-attribute-link.entity';

@Table({ tableName: 'products' })
export class ProductModel extends Model<ProductModel> {
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

  @Column({ type: DataType.TEXT })
  description: string;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  price: number;

  @Column({ type: DataType.DECIMAL(10, 2) })
  comparePrice: number;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ForeignKey(() => CategoryModel)
  categoryId: string;

  @Column({ type: DataType.STRING })
  brand: string;

  @Column({ type: DataType.STRING })
  material: string;

  @Column({ type: DataType.STRING, unique: true })
  sku: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isActive: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isFeatured: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  inStock: boolean;

  @Column({ type: DataType.JSON, defaultValue: [] })
  images: string[];

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  createdAt: Date;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  updatedAt: Date;

  // Relations
  @BelongsTo(() => CategoryModel)
  category: CategoryModel;

  @HasMany(() => ProductVariationModel)
  variations: ProductVariationModel[];

  @HasMany(() => ProductAttributeLinkModel)
  attributeLinks: ProductAttributeLinkModel[];
}

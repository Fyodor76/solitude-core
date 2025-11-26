import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';

@Table({ tableName: 'categories' })
export class CategoryModel extends Model<CategoryModel> {
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

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ForeignKey(() => CategoryModel)
  parentId: string | null;

  @Column({ type: DataType.STRING(500) })
  imageId: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isActive: boolean;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  sortOrder: number;

  @Column({
    type: DataType.ENUM('category', 'collection'),
    defaultValue: 'category',
  })
  type: string;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  createdAt: Date;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  updatedAt: Date;

  @BelongsTo(() => CategoryModel, 'parentId')
  parent: CategoryModel;

  @HasMany(() => CategoryModel, 'parentId')
  children: CategoryModel[];
}

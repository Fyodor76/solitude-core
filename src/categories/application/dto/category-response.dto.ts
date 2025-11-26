import { ApiProperty } from '@nestjs/swagger';
import { CategoryType } from 'src/categories/domain/entities/category.entity';

export class CategoryResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'Test name' })
  name: string;

  @ApiProperty({ example: 't-shirts' })
  slug: string;

  @ApiProperty({ example: 'Test description' })
  description: string;

  @ApiProperty({ example: null })
  parentId: string | null;

  @ApiProperty({ example: '123-test' })
  imageId: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: 0 })
  sortOrder: number;

  @ApiProperty({ enum: CategoryType, example: CategoryType.CATEGORY })
  type: CategoryType;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(category: {
    id: string;
    name: string;
    slug: string;
    description: string;
    parentId: string | null;
    imageId: string;
    isActive: boolean;
    sortOrder: number;
    type: CategoryType;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = category.id;
    this.name = category.name;
    this.slug = category.slug;
    this.description = category.description;
    this.parentId = category.parentId;
    this.imageId = category.imageId;
    this.isActive = category.isActive;
    this.sortOrder = category.sortOrder;
    this.type = category.type;
    this.createdAt = category.createdAt;
    this.updatedAt = category.updatedAt;
  }
}

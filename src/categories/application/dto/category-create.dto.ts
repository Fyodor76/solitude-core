import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CategoryType } from 'src/categories/domain/entities/category.entity';

export class CategoryCreateDto {
  @ApiProperty({ example: 'Test name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 't-shirts' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'Test description' })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ example: null })
  @IsString()
  @IsOptional()
  parentId: string | null;

  @ApiProperty({ example: '123-test' })
  @IsString()
  @IsOptional()
  imageId: string;

  @ApiProperty({ example: 0 })
  @IsOptional()
  sortOrder: number;

  @ApiProperty({ enum: CategoryType, example: CategoryType.CATEGORY })
  @IsEnum(CategoryType)
  @IsOptional()
  type: CategoryType;
}

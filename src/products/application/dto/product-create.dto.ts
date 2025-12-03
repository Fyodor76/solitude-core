import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsUrl,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ProductAttributeDto {
  @ApiProperty({
    description: 'ID атрибута',
    example: 'a0dbee61-366d-4128-a20e-0f7b4938523a',
  })
  @IsUUID()
  @IsNotEmpty()
  attributeId: string;

  @ApiProperty({
    description: 'Выбранные значения атрибута (сами значения, не ID)',
    example: ['red', 'blue'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  values?: string[];
}

export class VariationAttributeDto {
  @ApiProperty({ example: 'attr-color-123' })
  @IsString()
  @IsNotEmpty()
  attributeId: string;

  @ApiProperty({
    example: ['red'],
    description: 'Значения атрибута для вариации',
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  values: string[]; // <-- тоже просто значения
}

export class ProductVariationCreateDto {
  @ApiProperty({ example: 'NIKE-TS-RED-S' })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ example: 2990 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 3490 })
  @IsNumber()
  @IsOptional()
  comparePrice?: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsOptional()
  stock: number;

  @ApiProperty({ example: ['https://example.com/red-tshirt.jpg'] })
  @IsArray()
  @IsUrl({}, { each: true })
  @IsOptional()
  images: string[];

  @ApiProperty({ type: [VariationAttributeDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariationAttributeDto)
  attributes: VariationAttributeDto[];
}

export class ProductCreateDto {
  @ApiProperty({ example: 'Футболка Nike Sport' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'nike-t-shirt-sport' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'Спортивная футболка Nike' })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ example: 2990 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 3490 })
  @IsNumber()
  @IsOptional()
  comparePrice?: number;

  @ApiProperty({ example: 'cat-tshirts-123' })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ example: 'nike' })
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiProperty({ example: 'cotton-100' })
  @IsString()
  @IsNotEmpty()
  material: string;

  @ApiProperty({ example: 'NIKE-TS-BASE' })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  isFeatured: boolean;

  @ApiProperty({ example: ['https://example.com/tshirt.jpg'] })
  @IsArray()
  @IsUrl({}, { each: true })
  @IsOptional()
  images: string[];

  @ApiProperty({ type: [ProductAttributeDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductAttributeDto)
  @IsOptional()
  attributes: ProductAttributeDto[];

  @ApiProperty({ type: [ProductVariationCreateDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariationCreateDto)
  @IsOptional()
  variations: ProductVariationCreateDto[];
}

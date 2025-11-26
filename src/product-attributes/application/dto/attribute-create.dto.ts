import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AttributeType } from 'src/product-attributes/domain/entities/product-attribute.entity';

export class ProductAttributeCreateDto {
  @ApiProperty({ example: 'Цвет' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'color' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ enum: AttributeType, example: AttributeType.COLOR })
  @IsEnum(AttributeType)
  type: AttributeType;

  @ApiProperty({ example: 'Цвет товара' })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ example: 0 })
  @IsNumber()
  @IsOptional()
  sortOrder: number;
}

export class AttributeValueCreateDto {
  @ApiProperty({ example: 'Красный' })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({ example: 'red' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 0 })
  @IsNumber()
  @IsOptional()
  sortOrder: number;

  @ApiProperty({ example: '#FF0000' })
  @IsString()
  @IsOptional()
  hexCode: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}

import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class VariationAttributeCreateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  attributeId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  valueSlug: string;
}

export class ProductVariationCreateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  comparePrice?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  stock?: number;

  @ApiProperty({ required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiProperty({ type: [VariationAttributeCreateDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariationAttributeCreateDto)
  attributes: VariationAttributeCreateDto[];
}

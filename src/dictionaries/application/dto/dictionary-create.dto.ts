import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { DictionaryType } from 'src/dictionaries/domain/entities/dictionary.entity';

export class DictionaryValueCreateDto {
  @ApiProperty({ example: 'Красный' })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({ example: 'red' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 0 })
  @IsOptional()
  sortOrder: number;

  @ApiProperty({ example: '#FF0000' })
  @IsOptional()
  hexCode: string;

  @ApiProperty({ example: {} })
  @IsOptional()
  metadata: Record<string, any>;
}

export class DictionaryCreateDto {
  @ApiProperty({ example: 'Цвета' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'colors' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ enum: DictionaryType, example: DictionaryType.COLOR })
  @IsEnum(DictionaryType)
  type: DictionaryType;

  @ApiProperty({ type: [DictionaryValueCreateDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DictionaryValueCreateDto)
  @IsOptional()
  values: DictionaryValueCreateDto[];

  @ApiProperty({ example: 'Справочник цветов товаров' })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ example: 0 })
  @IsOptional()
  sortOrder: number;
}

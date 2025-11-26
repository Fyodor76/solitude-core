import { ApiProperty } from '@nestjs/swagger';
import { DictionaryType } from 'src/dictionaries/domain/entities/dictionary.entity';

export class DictionaryValueResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  value: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  sortOrder: number;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  metadata: Record<string, any>;

  @ApiProperty()
  hexCode?: string;

  @ApiProperty()
  createdAt: Date;

  constructor(value: {
    id: string;
    value: string;
    slug: string;
    sortOrder: number;
    isActive: boolean;
    metadata: Record<string, any>;
    hexCode?: string;
    createdAt: Date;
  }) {
    this.id = value.id;
    this.value = value.value;
    this.slug = value.slug;
    this.sortOrder = value.sortOrder;
    this.isActive = value.isActive;
    this.metadata = value.metadata;
    this.hexCode = value.hexCode;
    this.createdAt = value.createdAt;
  }
}

export class DictionaryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty({ enum: DictionaryType })
  type: DictionaryType;

  @ApiProperty({ type: [DictionaryValueResponseDto] })
  values: DictionaryValueResponseDto[];

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  sortOrder: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(dictionary: {
    id: string;
    name: string;
    slug: string;
    type: DictionaryType;
    values: DictionaryValueResponseDto[];
    isActive: boolean;
    sortOrder: number;
    description: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = dictionary.id;
    this.name = dictionary.name;
    this.slug = dictionary.slug;
    this.type = dictionary.type;
    this.values = dictionary.values;
    this.isActive = dictionary.isActive;
    this.sortOrder = dictionary.sortOrder;
    this.description = dictionary.description;
    this.createdAt = dictionary.createdAt;
    this.updatedAt = dictionary.updatedAt;
  }
}

import { ApiProperty } from '@nestjs/swagger';
import { AttributeType } from 'src/product-attributes/domain/entities/product-attribute.entity';

export class AttributeValueResponseDto {
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
  hexCode?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(value: {
    id: string;
    value: string;
    slug: string;
    sortOrder: number;
    isActive: boolean;
    hexCode?: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = value.id;
    this.value = value.value;
    this.slug = value.slug;
    this.sortOrder = value.sortOrder;
    this.isActive = value.isActive;
    this.hexCode = value.hexCode;
    this.createdAt = value.createdAt;
    this.updatedAt = value.updatedAt;
  }
}

export class ProductAttributeResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty({ enum: AttributeType })
  type: AttributeType;

  @ApiProperty()
  description: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  sortOrder: number;

  @ApiProperty({ type: [AttributeValueResponseDto] })
  values: AttributeValueResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(attribute: {
    id: string;
    name: string;
    slug: string;
    type: AttributeType;
    description: string;
    isActive: boolean;
    sortOrder: number;
    values: AttributeValueResponseDto[];
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = attribute.id;
    this.name = attribute.name;
    this.slug = attribute.slug;
    this.type = attribute.type;
    this.description = attribute.description;
    this.isActive = attribute.isActive;
    this.sortOrder = attribute.sortOrder;
    this.values = attribute.values;
    this.createdAt = attribute.createdAt;
    this.updatedAt = attribute.updatedAt;
  }
}

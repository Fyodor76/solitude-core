import { ApiProperty } from '@nestjs/swagger';

export class VariationAttributeResponseDto {
  @ApiProperty()
  attributeId: string;

  @ApiProperty()
  values: string[];

  constructor(attribute: { attributeId: string; values: string[] }) {
    this.attributeId = attribute.attributeId;
    this.values = attribute.values;
  }
}

export class ProductVariationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  sku: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  comparePrice?: number;

  @ApiProperty()
  stock: number;

  @ApiProperty()
  images: string[];

  @ApiProperty({ type: [VariationAttributeResponseDto] })
  attributes: VariationAttributeResponseDto[];

  @ApiProperty()
  isActive: boolean;

  constructor(variation: {
    id: string;
    sku: string;
    price: number;
    comparePrice?: number;
    stock: number;
    images: string[];
    attributes: VariationAttributeResponseDto[];
    isActive: boolean;
  }) {
    this.id = variation.id;
    this.sku = variation.sku;
    this.price = variation.price;
    this.comparePrice = variation.comparePrice;
    this.stock = variation.stock;
    this.images = variation.images;
    this.attributes = variation.attributes;
    this.isActive = variation.isActive;
  }
}

export class ProductAttributeResponseDto {
  @ApiProperty()
  attributeId: string;

  @ApiProperty({
    description: "Slug'и значений атрибута",
    example: ['red', 'blue'],
  })
  values: string[];

  constructor(attribute: { attributeId: string; values: string[] }) {
    this.attributeId = attribute.attributeId;
    this.values = attribute.values;
  }
}

export class ProductResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  comparePrice?: number;

  @ApiProperty()
  categoryId: string;

  @ApiProperty()
  brand: string;

  @ApiProperty()
  material: string;

  @ApiProperty()
  sku: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  isFeatured: boolean;

  @ApiProperty()
  inStock: boolean;

  @ApiProperty()
  images: string[];

  @ApiProperty({ type: [ProductAttributeResponseDto] })
  attributes: ProductAttributeResponseDto[];

  @ApiProperty({ type: [ProductVariationResponseDto] })
  variations: ProductVariationResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    comparePrice?: number;
    categoryId: string;
    brand: string;
    material: string;
    sku: string;
    isActive: boolean;
    isFeatured: boolean;
    inStock: boolean;
    images: string[];
    attributes: ProductAttributeResponseDto[];
    variations: ProductVariationResponseDto[];
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = product.id;
    this.name = product.name;
    this.slug = product.slug;
    this.description = product.description;
    this.price = product.price;
    this.comparePrice = product.comparePrice;
    this.categoryId = product.categoryId;
    this.brand = product.brand;
    this.material = product.material;
    this.sku = product.sku;
    this.isActive = product.isActive;
    this.isFeatured = product.isFeatured;
    this.inStock = product.inStock;
    this.images = product.images;
    this.attributes = product.attributes;
    this.variations = product.variations;
    this.createdAt = product.createdAt;
    this.updatedAt = product.updatedAt;
  }
}

import {
  ProductEntity,
  ProductAttribute,
  ProductVariation,
  VariationAttribute,
} from '../../domain/entities/product.entity';
import {
  ProductCreateDto,
  ProductVariationCreateDto,
} from '../dto/product-create.dto';
import {
  ProductResponseDto,
  ProductAttributeResponseDto,
  ProductVariationResponseDto,
  VariationAttributeResponseDto,
} from '../dto/product-response.dto';

import { v4 as uuidv4 } from 'uuid';

export class ProductMapper {
  static toEntity(dto: ProductCreateDto, id?: string): ProductEntity {
    const attributes =
      dto.attributes?.map(
        (attr) => new ProductAttribute(attr.attributeId, attr.values),
      ) || [];

    const variations =
      dto.variations?.map(
        (variation) =>
          new ProductVariation(
            uuidv4(),
            variation.sku,
            variation.price,
            variation.comparePrice,
            variation.stock || 0,
            variation.images || [],
            variation.attributes.map(
              (attr) => new VariationAttribute(attr.attributeId, attr.values),
            ),
            true,
          ),
      ) || [];

    return new ProductEntity(
      id,
      dto.name,
      dto.slug,
      dto.description || '',
      dto.price,
      dto.comparePrice,
      dto.categoryId,
      dto.brand,
      dto.material,
      dto.sku,
      dto.isActive !== undefined ? dto.isActive : true,
      dto.isFeatured || false,
      true,
      dto.images || [],
      attributes,
      variations,
    );
  }

  static toResponse(entity: ProductEntity): ProductResponseDto {
    const attributeResponses = entity.attributes.map(
      (attr) =>
        new ProductAttributeResponseDto({
          attributeId: attr.attributeId,
          values: attr.values,
        }),
    );

    const variationResponses = entity.variations.map(
      (variation) =>
        new ProductVariationResponseDto({
          id: variation.id,
          sku: variation.sku,
          price: variation.price,
          comparePrice: variation.comparePrice,
          stock: variation.stock,
          images: variation.images,
          attributes: variation.attributes.map(
            (attr) =>
              new VariationAttributeResponseDto({
                attributeId: attr.attributeId,
                values: attr.values,
              }),
          ),
          isActive: variation.isActive,
        }),
    );

    return new ProductResponseDto({
      id: entity.id,
      name: entity.name,
      slug: entity.slug,
      description: entity.description,
      price: entity.price,
      comparePrice: entity.comparePrice,
      categoryId: entity.categoryId,
      brand: entity.brand,
      material: entity.material,
      sku: entity.sku,
      isActive: entity.isActive,
      isFeatured: entity.isFeatured,
      inStock: entity.inStock,
      images: entity.images,
      attributes: attributeResponses,
      variations: variationResponses,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static toVariationEntity(
    dto: ProductVariationCreateDto,
    productId: string,
    id?: string,
  ): ProductVariation {
    const attributes = dto.attributes.map(
      (attr) => new VariationAttribute(attr.attributeId, attr.values),
    );

    return new ProductVariation(
      id,
      dto.sku,
      dto.price,
      dto.comparePrice,
      dto.stock || 0,
      dto.images || [],
      attributes,
      true,
    );
  }
}

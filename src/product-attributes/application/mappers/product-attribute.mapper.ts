import { AttributeValueEntity } from 'src/product-attributes/domain/entities/attribute-value.entity';
import { ProductAttributeEntity } from '../../domain/entities/product-attribute.entity';
import {
  ProductAttributeCreateDto,
  AttributeValueCreateDto,
} from '../dto/attribute-create.dto';
import {
  ProductAttributeResponseDto,
  AttributeValueResponseDto,
} from '../dto/attribute-response.dto';

export class ProductAttributeMapper {
  static toAttributeEntity(
    dto: ProductAttributeCreateDto,
    id?: string,
  ): ProductAttributeEntity {
    return new ProductAttributeEntity(
      id,
      dto.name,
      dto.slug,
      dto.type,
      dto.description || '',
      true,
      dto.sortOrder || 0,
      [],
    );
  }

  static toValueEntity(
    dto: AttributeValueCreateDto,
    attributeId: string,
    id?: string,
  ): AttributeValueEntity {
    return new AttributeValueEntity(
      id,
      attributeId,
      dto.value,
      dto.slug,
      dto.sortOrder || 0,
      dto.isActive !== undefined ? dto.isActive : true,
      dto.hexCode,
      {},
    );
  }

  static toAttributeResponse(
    entity: ProductAttributeEntity,
  ): ProductAttributeResponseDto {
    const valueResponses = (entity.values || []).map(
      (value) =>
        new AttributeValueResponseDto({
          id: value.id,
          value: value.value,
          slug: value.slug,
          sortOrder: value.sortOrder,
          isActive: value.isActive,
          hexCode: value.hexCode,
          createdAt: value.createdAt,
          updatedAt: value.updatedAt,
        }),
    );

    return new ProductAttributeResponseDto({
      id: entity.id,
      name: entity.name,
      slug: entity.slug,
      type: entity.type,
      description: entity.description,
      isActive: entity.isActive,
      sortOrder: entity.sortOrder,
      values: valueResponses,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}

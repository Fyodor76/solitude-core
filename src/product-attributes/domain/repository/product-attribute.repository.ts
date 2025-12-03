import {
  ProductAttributeEntity,
  AttributeType,
} from '../entities/product-attribute.entity';
import { AttributeValueEntity } from '../entities/attribute-value.entity';

export interface ProductAttributeRepository {
  createAttribute(
    attribute: ProductAttributeEntity,
  ): Promise<ProductAttributeEntity>;
  findAttributeById(id: string): Promise<ProductAttributeEntity>;
  findAttributeBySlug(slug: string): Promise<ProductAttributeEntity>;
  findAttributesByType(type: AttributeType): Promise<ProductAttributeEntity[]>;
  findAllAttributes(
    filters?: AttributeFilters,
  ): Promise<ProductAttributeEntity[]>;
  updateAttribute(
    attribute: ProductAttributeEntity,
  ): Promise<ProductAttributeEntity>;
  deleteAttribute(id: string): Promise<void>;

  createValue(value: AttributeValueEntity): Promise<AttributeValueEntity>;
  findValueById(id: string): Promise<AttributeValueEntity>;
  findValuesByAttributeId(attributeId: string): Promise<AttributeValueEntity[]>;
  findValueBySlug(
    attributeId: string,
    slug: string,
  ): Promise<AttributeValueEntity>;
  findValuesBySlugs(
    attributeId: string,
    slugs: string[],
  ): Promise<AttributeValueEntity[]>;
  updateValue(value: AttributeValueEntity): Promise<AttributeValueEntity>;
  deleteValue(id: string): Promise<void>;
  deleteValuesByAttributeId(attributeId: string): Promise<void>;
}

export interface AttributeFilters {
  isActive?: boolean;
  type?: AttributeType;
}

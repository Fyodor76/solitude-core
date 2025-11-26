import { Inject, Injectable } from '@nestjs/common';
import { ProductAttributeRepository } from '../domain/repository/product-attribute.repository';
import {
  ProductAttributeEntity,
  AttributeType,
} from '../domain/entities/product-attribute.entity';
import { AttributeValueEntity } from '../domain/entities/attribute-value.entity';
import {
  throwConflict,
  throwNotFound,
} from '../../common/exceptions/http-exception.helper';

@Injectable()
export class ProductAttributeApplication {
  constructor(
    @Inject('ProductAttributeRepository')
    private readonly attributeRepository: ProductAttributeRepository,
  ) {}

  // Attribute methods
  async createAttribute(
    attribute: ProductAttributeEntity,
  ): Promise<ProductAttributeEntity> {
    const existing = await this.attributeRepository.findAttributeBySlug(
      attribute.slug,
    );
    if (existing) {
      throwConflict('Product attribute with this slug already exists');
    }

    return await this.attributeRepository.createAttribute(attribute);
  }

  async getAttributeById(id: string): Promise<ProductAttributeEntity> {
    const attribute = await this.attributeRepository.findAttributeById(id);
    if (!attribute) {
      throwNotFound('Product attribute not found');
    }
    return attribute;
  }

  async getAttributeBySlug(slug: string): Promise<ProductAttributeEntity> {
    const attribute = await this.attributeRepository.findAttributeBySlug(slug);
    if (!attribute) {
      throwNotFound('Product attribute not found');
    }
    return attribute;
  }

  async getAttributesByType(
    type: AttributeType,
  ): Promise<ProductAttributeEntity[]> {
    return await this.attributeRepository.findAttributesByType(type);
  }

  async getAllAttributes(): Promise<ProductAttributeEntity[]> {
    return await this.attributeRepository.findAllAttributes();
  }

  async updateAttribute(
    attribute: ProductAttributeEntity,
  ): Promise<ProductAttributeEntity> {
    const existing = await this.attributeRepository.findAttributeById(
      attribute.id,
    );
    if (!existing) {
      throwNotFound('Product attribute not found');
    }

    if (existing.slug !== attribute.slug) {
      const slugExists = await this.attributeRepository.findAttributeBySlug(
        attribute.slug,
      );
      if (slugExists) {
        throwConflict('Product attribute with this slug already exists');
      }
    }

    return await this.attributeRepository.updateAttribute(attribute);
  }

  async deleteAttribute(id: string): Promise<void> {
    const attribute = await this.attributeRepository.findAttributeById(id);
    if (!attribute) {
      throwNotFound('Product attribute not found');
    }

    await this.attributeRepository.deleteAttribute(id);
  }

  // Value methods
  async createValue(
    value: AttributeValueEntity,
  ): Promise<AttributeValueEntity> {
    const attribute = await this.attributeRepository.findAttributeById(
      value.attributeId,
    );
    if (!attribute) {
      throwNotFound('Product attribute not found');
    }

    const existingValue = await this.attributeRepository.findValueBySlug(
      value.attributeId,
      value.slug,
    );
    if (existingValue) {
      throwConflict('Attribute value with this slug already exists');
    }

    return await this.attributeRepository.createValue(value);
  }

  async getValuesByAttributeId(
    attributeId: string,
  ): Promise<AttributeValueEntity[]> {
    const attribute =
      await this.attributeRepository.findAttributeById(attributeId);
    if (!attribute) {
      throwNotFound('Product attribute not found');
    }

    return await this.attributeRepository.findValuesByAttributeId(attributeId);
  }

  async updateValue(
    value: AttributeValueEntity,
  ): Promise<AttributeValueEntity> {
    const existingValue = await this.attributeRepository.findValueById(
      value.id,
    );
    if (!existingValue) {
      throwNotFound('Attribute value not found');
    }

    return await this.attributeRepository.updateValue(value);
  }

  async deleteValue(id: string): Promise<void> {
    const value = await this.attributeRepository.findValueById(id);
    if (!value) {
      throwNotFound('Attribute value not found');
    }

    await this.attributeRepository.deleteValue(id);
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { ProductRepository } from '../domain/repository/product.repository';
import {
  ProductEntity,
  ProductVariation,
} from '../domain/entities/product.entity';
import {
  throwBadRequest,
  throwConflict,
  throwNotFound,
} from '../../common/exceptions/http-exception.helper';
import { ProductFiltersDto } from './dto/product-filters.dto';
import { ProductAttributeRepository } from 'src/product-attributes/domain/repository/product-attribute.repository';

@Injectable()
export class ProductApplication {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    @Inject('ProductAttributeRepository')
    private readonly attributeRepository: ProductAttributeRepository,
  ) {}

  async create(product: ProductEntity): Promise<ProductEntity> {
    // Check if slug already exists
    const existingBySlug = await this.productRepository.findBySlug(
      product.slug,
    );
    if (existingBySlug) {
      throwConflict('Product with this slug already exists');
    }

    const existingBySku = await this.productRepository.findBySku(product.sku);
    if (existingBySku) {
      throwConflict('Product with this SKU already exists');
    }

    return await this.productRepository.create(product);
  }

  async getById(id: string): Promise<ProductEntity> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throwNotFound('Product not found');
    }
    return product;
  }

  async getBySlug(slug: string): Promise<ProductEntity> {
    const product = await this.productRepository.findBySlug(slug);
    if (!product) {
      throwNotFound('Product not found');
    }
    return product;
  }

  async getByCategory(categoryId: string): Promise<ProductEntity[]> {
    return await this.productRepository.findByCategory(categoryId);
  }

  async getByBrand(brand: string): Promise<ProductEntity[]> {
    return await this.productRepository.findByBrand(brand);
  }

  async getAll(filters?: ProductFiltersDto): Promise<ProductEntity[]> {
    return await this.productRepository.findAll(filters);
  }

  async update(product: ProductEntity): Promise<ProductEntity> {
    const existing = await this.productRepository.findById(product.id);
    if (!existing) {
      throwNotFound('Product not found');
    }

    if (existing.slug !== product.slug) {
      const slugExists = await this.productRepository.findBySlug(product.slug);
      if (slugExists) {
        throwConflict('Product with this slug already exists');
      }
    }

    return await this.productRepository.update(product);
  }

  async delete(id: string): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throwNotFound('Product not found');
    }

    await this.productRepository.delete(id);
  }

  async createVariation(
    productId: string,
    variation: ProductVariation,
  ): Promise<ProductEntity> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throwNotFound('Product not found');
    }

    await this.validateVariationAttributes(variation.attributes);

    await this.validateUniqueVariation(productId, variation.attributes);

    return await this.productRepository.createVariation(productId, variation);
  }

  async updateVariation(
    productId: string,
    variation: ProductVariation,
  ): Promise<ProductEntity> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throwNotFound('Product not found');
    }

    await this.validateVariationAttributes(variation.attributes);

    await this.validateUniqueVariation(
      productId,
      variation.attributes,
      variation.id,
    );

    return await this.productRepository.updateVariation(productId, variation);
  }

  async deleteVariation(
    productId: string,
    variationId: string,
  ): Promise<ProductEntity> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throwNotFound('Product not found');
    }

    return await this.productRepository.deleteVariation(productId, variationId);
  }

  /**
   * Валидация атрибутов вариации
   */
  private async validateVariationAttributes(attributes: any[]): Promise<void> {
    for (const attr of attributes) {
      // Проверяем существование атрибута
      const attribute = await this.attributeRepository.findAttributeById(
        attr.attributeId,
      );
      if (!attribute) {
        throwBadRequest(`Attribute with id ${attr.attributeId} not found`);
      }

      // Проверяем существование значения
      const valueExists = await this.attributeRepository.findValueBySlug(
        attr.attributeId,
        attr.valueSlug,
      );
      if (!valueExists) {
        throwBadRequest(
          `Value '${attr.valueSlug}' not found for attribute '${attribute.name}'`,
        );
      }
    }
  }

  /**
   * Валидация уникальности комбинации атрибутов
   */
  private async validateUniqueVariation(
    productId: string,
    attributes: any[],
    excludeVariationId?: string,
  ): Promise<void> {
    const product = await this.productRepository.findById(productId);

    const existingVariation = product.variations.find((variation) => {
      if (excludeVariationId && variation.id === excludeVariationId) {
        return false;
      }

      return this.areAttributesEqual(variation.attributes, attributes);
    });

    if (existingVariation) {
      throwConflict('Variation with these attributes already exists');
    }
  }

  /**
   * Сравнение массивов атрибутов
   */
  private areAttributesEqual(attrs1: any[], attrs2: any[]): boolean {
    if (attrs1.length !== attrs2.length) return false;

    return attrs1.every((attr1) =>
      attrs2.some(
        (attr2) =>
          attr1.attributeId === attr2.attributeId &&
          attr1.valueSlug === attr2.valueSlug,
      ),
    );
  }
}

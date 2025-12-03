// src/products/application/validators/variation.validator.ts
import { Inject, Injectable } from '@nestjs/common';
import {
  ProductEntity,
  ProductVariation,
} from '../../domain/entities/product.entity';
import { ProductRepository } from '../../domain/repository/product.repository';
import {
  throwBadRequest,
  throwConflict,
  throwNotFound,
} from '../../../common/exceptions/http-exception.helper';

@Injectable()
export class VariationValidator {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  /**
   * Проверяет что вариация имеет атрибуты
   */
  validateVariationHasAttributes(variation: ProductVariation): void {
    if (!variation.attributes || variation.attributes.length === 0) {
      throwBadRequest(
        `Variation '${variation.sku}' must have at least one attribute`,
      );
    }
  }

  /**
   * Проверяет уникальность комбинаций атрибутов в продукте
   */
  async validateUniqueVariationAttributes(
    product: ProductEntity,
  ): Promise<void> {
    const existingCombinations = new Set();

    for (const variation of product.variations) {
      const key = this.getVariationKey(variation);

      if (existingCombinations.has(key)) {
        throwBadRequest('Duplicate variation attributes combination found');
      }
      existingCombinations.add(key);
    }
  }

  async validateVariationExists(
    productId: string,
    variationId: string,
  ): Promise<ProductVariation> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throwNotFound('Product not found');
    }

    const variation = product.variations.find((v) => v.id === variationId);
    if (!variation) {
      throwNotFound('Variation not found');
    }

    return variation;
  }

  /**
   * Проверяет уникальность комбинации атрибутов для отдельной вариации
   */
  async validateUniqueVariation(
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
   * Создает уникальный ключ для комбинации атрибутов
   */
  private getVariationKey(variation: ProductVariation): string {
    return variation.attributes
      .map((attr) => `${attr.attributeId}:${[...attr.values].sort().join(',')}`)
      .sort()
      .join('|');
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
          JSON.stringify([...attr1.values].sort()) ===
            JSON.stringify([...attr2.values].sort()),
      ),
    );
  }
}

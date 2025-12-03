// src/products/application/validators/sku.validator.ts
import { Inject, Injectable } from '@nestjs/common';
import { ProductRepository } from '../../domain/repository/product.repository';
import {
  throwConflict,
  throwBadRequest,
} from '../../../common/exceptions/http-exception.helper';
import { ProductVariation } from '../../domain/entities/product.entity';

@Injectable()
export class SkuValidator {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  /**
   * Проверяет уникальность SKU продукта
   */
  async validateProductSku(sku: string, productId?: string): Promise<void> {
    const existing = await this.productRepository.findBySku(sku);

    if (existing && (!productId || existing.id !== productId)) {
      throwConflict(`Product with SKU '${sku}' already exists`);
    }
  }

  /**
   * Проверяет уникальность SKU вариации
   */
  async validateVariationSku(sku: string): Promise<void> {
    const existing = await this.productRepository.findVariationBySku(sku);

    if (existing) {
      throwConflict(
        `Variation with SKU '${sku}' already exists in product ${existing.productId}`,
      );
    }
  }

  async validateProductSlug(slug: string, productId?: string): Promise<void> {
    const existing = await this.productRepository.findBySlug(slug);

    if (existing && (!productId || existing.id !== productId)) {
      throwConflict(`Product with slug '${slug}' already exists`);
    }
  }

  /**
   * Проверяет что SKU вариации ≠ SKU продукта
   */
  validateVariationSkuNotEqualsProductSku(
    variationSku: string,
    productSku: string,
  ): void {
    if (variationSku === productSku) {
      throwBadRequest('Variation SKU cannot be the same as product SKU');
    }
  }

  /**
   * Проверяет уникальность SKU вариаций внутри продукта
   */
  validateVariationSkusWithinProduct(
    productSku: string,
    variations: readonly ProductVariation[],
  ): void {
    const variationSkus = variations.map((v) => v.sku);
    const uniqueSkus = new Set(variationSkus);

    // Проверка на дубликаты
    if (uniqueSkus.size !== variationSkus.length) {
      throwBadRequest('Variation SKUs must be unique within the product');
    }

    // Проверка что вариации не совпадают с SKU продукта
    if (variationSkus.includes(productSku)) {
      throwBadRequest('Variation SKU cannot be the same as product SKU');
    }
  }
}

// src/products/application/validators/product.validator.ts
import { Injectable } from '@nestjs/common';
import { ProductEntity } from '../../domain/entities/product.entity';
import { SkuValidator } from './sku.validator';
import { CategoryValidator } from './category.validator';
import { AttributeValidator } from './attribute.validator';
import { VariationValidator } from './variation.validator';

@Injectable()
export class ProductValidator {
  constructor(
    private readonly skuValidator: SkuValidator,
    private readonly categoryValidator: CategoryValidator,
    private readonly attributeValidator: AttributeValidator,
    private readonly variationValidator: VariationValidator,
  ) {}

  /**
   * Валидация для создания продукта
   */
  async validateForCreation(product: ProductEntity): Promise<void> {
    // Проверка уникальности slug
    await this.skuValidator.validateProductSlug(product.slug);
    // Проверка SKU продукта
    await this.skuValidator.validateProductSku(product.sku);

    // Проверка категории
    await this.categoryValidator.validateCategory(product.categoryId);

    // Проверка атрибутов продукта
    await this.attributeValidator.validateProductAttributes(product.attributes);

    // Проверка вариаций
    await this.validateProductVariations(product);
  }

  /**
   * Валидация для обновления продукта
   */
  async validateForUpdate(
    product: ProductEntity,
    existing: ProductEntity,
  ): Promise<void> {
    // Проверка SKU (если изменился)
    if (existing.sku !== product.sku) {
      await this.skuValidator.validateProductSku(product.sku, product.id);
    }

    // Проверка категории (если изменилась)
    if (existing.categoryId !== product.categoryId) {
      await this.categoryValidator.validateCategory(product.categoryId);
    }

    // Проверка атрибутов продукта
    await this.attributeValidator.validateProductAttributes(product.attributes);

    // Проверка вариаций
    await this.validateProductVariations(product);
  }

  /**
   * Валидация всех вариаций продукта
   */
  private async validateProductVariations(
    product: ProductEntity,
  ): Promise<void> {
    if (!product.variations || product.variations.length === 0) {
      return;
    }

    // Проверка SKU вариаций
    await this.validateVariationSkus(product);

    // Проверка уникальности комбинаций атрибутов
    await this.variationValidator.validateUniqueVariationAttributes(product);

    // Валидация каждой вариации
    for (const variation of product.variations) {
      this.variationValidator.validateVariationHasAttributes(variation);
      await this.attributeValidator.validateVariationAttributes(
        variation.attributes,
      );
    }
  }

  /**
   * Валидация SKU вариаций
   */
  private async validateVariationSkus(product: ProductEntity): Promise<void> {
    // Проверка внутри продукта
    this.skuValidator.validateVariationSkusWithinProduct(
      product.sku,
      product.variations,
    );

    // Проверка в системе
    for (const variation of product.variations) {
      await this.skuValidator.validateVariationSku(variation.sku);
      this.skuValidator.validateVariationSkuNotEqualsProductSku(
        variation.sku,
        product.sku,
      );
    }
  }
}

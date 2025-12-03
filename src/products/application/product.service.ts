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
import { CategoryRepository } from 'src/categories/domain/repository/category.repository';

@Injectable()
export class ProductApplication {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    @Inject('ProductAttributeRepository')
    private readonly attributeRepository: ProductAttributeRepository,
    @Inject('CategoryRepository')
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async create(product: ProductEntity): Promise<ProductEntity> {
    // Проверка на существование продукта по slug
    const existingBySlug = await this.productRepository.findBySlug(
      product.slug,
    );
    if (existingBySlug) {
      throwConflict('Product with this slug already exists');
    }

    // Проверка на существование продукта по SKU
    const existingBySku = await this.productRepository.findBySku(product.sku);
    if (existingBySku) {
      throwConflict('Product with this SKU already exists');
    }

    // Проверка существования категории
    await this.validateCategoryExists(product.categoryId);

    // Полная валидация вариаций продукта
    await this.validateProductVariations(product);

    // Валидация атрибутов продукта
    await this.validateProductAttributes(product.attributes);

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

    // Проверка уникальности slug (если изменился)
    if (existing.slug !== product.slug) {
      const slugExists = await this.productRepository.findBySlug(product.slug);
      if (slugExists) {
        throwConflict('Product with this slug already exists');
      }
    }

    // Проверка уникальности SKU (если изменился)
    if (existing.sku !== product.sku) {
      const skuExists = await this.productRepository.findBySku(product.sku);
      if (skuExists) {
        throwConflict('Product with this SKU already exists');
      }
    }

    // Проверка категории (если изменилась)
    if (existing.categoryId !== product.categoryId) {
      await this.validateCategoryExists(product.categoryId);
    }

    // Полная валидация вариаций продукта
    await this.validateProductVariations(product);

    // Валидация атрибутов продукта
    await this.validateProductAttributes(product.attributes);

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

    // Бизнес-правило: SKU вариации ≠ SKU продукта
    if (variation.sku === product.sku) {
      throwBadRequest('Variation SKU cannot be the same as product SKU');
    }

    // Проверка уникальности SKU вариации в системе
    const existingBySku = await this.productRepository.findBySku(variation.sku);
    if (existingBySku) {
      throwConflict('Product/Variation with this SKU already exists');
    }

    // Бизнес-правило: уникальность комбинации атрибутов
    await this.validateUniqueVariation(productId, variation.attributes);

    // Валидация атрибутов вариации
    await this.validateVariationAttributes(variation.attributes);

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

    // Бизнес-правило: SKU вариации ≠ SKU продукта
    if (variation.sku === product.sku) {
      throwBadRequest('Variation SKU cannot be the same as product SKU');
    }

    // Находим существующую вариацию
    const existingVariation = product.variations.find(
      (v) => v.id === variation.id,
    );
    if (!existingVariation) {
      throwNotFound('Variation not found');
    }

    // Проверка уникальности SKU (если изменился)
    if (existingVariation.sku !== variation.sku) {
      const existingBySku = await this.productRepository.findBySku(
        variation.sku,
      );
      if (existingBySku) {
        throwConflict('Product/Variation with this SKU already exists');
      }
    }

    // Бизнес-правило: уникальность комбинации атрибутов
    await this.validateUniqueVariation(
      productId,
      variation.attributes,
      variation.id,
    );

    // Валидация атрибутов вариации
    await this.validateVariationAttributes(variation.attributes);

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
   * Полная валидация вариаций продукта
   */
  private async validateProductVariations(
    product: ProductEntity,
  ): Promise<void> {
    if (!product.variations || product.variations.length === 0) {
      return; // Продукт может быть без вариаций
    }

    // Проверка уникальности SKU вариаций в рамках продукта
    this.validateVariationSkusWithinProduct(product);

    // Проверка уникальности SKU вариаций в системе
    await this.validateVariationSkusUniqueness(product.variations);

    // Проверка уникальности комбинаций атрибутов
    await this.validateUniqueVariationAttributes(product);

    // Валидация каждой вариации
    for (const variation of product.variations) {
      // Проверяем что есть атрибуты
      this.validateVariationHasAttributes(variation);

      // Проверяем нет дубликатов значений внутри атрибута
      this.validateNoDuplicateValuesInAttribute(variation.attributes);

      // Проверяем существование атрибутов и значений
      await this.validateVariationAttributes(variation.attributes);
    }
  }

  /**
   * Валидация атрибутов продукта
   */
  private async validateProductAttributes(
    attributes: { attributeId: string; values: string[] }[],
  ): Promise<void> {
    if (!attributes || attributes.length === 0) {
      return; // Продукт может быть без атрибутов
    }

    for (const attr of attributes) {
      const attribute = await this.attributeRepository.findAttributeById(
        attr.attributeId,
      );
      if (!attribute) {
        throwBadRequest(`Attribute with id ${attr.attributeId} not found`);
      }

      // Проверка на дублирование значений
      const uniqueValues = new Set(attr.values);
      if (uniqueValues.size !== attr.values.length) {
        throwBadRequest(`Attribute '${attribute.name}' has duplicate values`);
      }

      for (const slug of attr.values) {
        const value = await this.attributeRepository.findValueBySlug(
          attr.attributeId,
          slug,
        );
        if (!value) {
          throwBadRequest(
            `Value '${slug}' not found for attribute '${attribute.name}'`,
          );
        }

        if (!value.isActive) {
          throwBadRequest(`Value '${value.value}' (${slug}) is inactive`);
        }
      }
    }
  }

  /**
   * Валидация атрибутов вариации
   */
  private async validateVariationAttributes(
    attributes: { attributeId: string; values: string[] }[],
  ): Promise<void> {
    for (const attr of attributes) {
      const attribute = await this.attributeRepository.findAttributeById(
        attr.attributeId,
      );
      if (!attribute) {
        throwBadRequest(`Attribute with id ${attr.attributeId} not found`);
      }

      // Проверка на дублирование значений
      const uniqueValues = new Set(attr.values);
      if (uniqueValues.size !== attr.values.length) {
        throwBadRequest(`Attribute '${attribute.name}' has duplicate values`);
      }

      // findValuesBySlugs возвращает МАССИВ значений
      const values = await this.attributeRepository.findValuesBySlugs(
        attr.attributeId,
        attr.values,
      );

      // Если не все значения найдены
      if (values.length !== attr.values.length) {
        const foundSlugs = values.map((v) => v.slug);
        const missingSlugs = attr.values.filter(
          (slug) => !foundSlugs.includes(slug),
        );
        throwBadRequest(
          `Values [${missingSlugs.join(', ')}] not found for attribute '${attribute.name}'`,
        );
      }

      // Проверяем активность всех значений
      const inactiveValues = values.filter((v) => !v.isActive);
      if (inactiveValues.length > 0) {
        const inactiveNames = inactiveValues.map(
          (v) => `${v.value} (${v.slug})`,
        );
        throwBadRequest(`Values [${inactiveNames.join(', ')}] are inactive`);
      }
    }
  }

  /**
   * Проверка уникальности комбинации атрибутов (для отдельных вариаций)
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
   * Проверка уникальности комбинаций атрибутов в продукте
   */
  private async validateUniqueVariationAttributes(
    product: ProductEntity,
  ): Promise<void> {
    const existingCombinations = new Set();

    for (const variation of product.variations) {
      // Создаем уникальный ключ для комбинации атрибутов
      const key = variation.attributes
        .map(
          (attr) => `${attr.attributeId}:${[...attr.values].sort().join(',')}`,
        )
        .sort()
        .join('|');

      if (existingCombinations.has(key)) {
        throwBadRequest('Duplicate variation attributes combination found');
      }
      existingCombinations.add(key);
    }
  }

  /**
   * Проверка уникальности SKU вариаций в рамках одного продукта
   */
  private validateVariationSkusWithinProduct(product: ProductEntity): void {
    const variationSkus = product.variations.map((v) => v.sku);
    const uniqueSkus = new Set(variationSkus);

    if (uniqueSkus.size !== variationSkus.length) {
      throwBadRequest('Variation SKUs must be unique within the product');
    }

    // SKU вариации ≠ SKU основного продукта
    if (variationSkus.includes(product.sku)) {
      throwBadRequest('Variation SKU cannot be the same as product SKU');
    }
  }

  /**
   * Проверка уникальности SKU вариаций в системе
   */
  private async validateVariationSkusUniqueness(
    variations: readonly ProductVariation[],
  ): Promise<void> {
    for (const variation of variations) {
      const existingProduct = await this.productRepository.findBySku(
        variation.sku,
      );
      if (existingProduct) {
        throwConflict(`Product with SKU '${variation.sku}' already exists`);
      }

      const existingVariation = await this.productRepository.findVariationBySku(
        variation.sku,
      );
      if (existingVariation) {
        throwConflict(
          `Variation with SKU '${variation.sku}' already exists in product ${existingVariation.productId}`,
        );
      }
    }
  }
  /**
   * Проверка что вариация имеет атрибуты
   */
  private validateVariationHasAttributes(variation: ProductVariation): void {
    if (!variation.attributes || variation.attributes.length === 0) {
      throwBadRequest(
        `Variation '${variation.sku}' must have at least one attribute`,
      );
    }
  }

  /**
   * Проверка на дублирование значений внутри одного атрибута
   */
  private validateNoDuplicateValuesInAttribute(attributes: any[]): void {
    for (const attr of attributes) {
      const uniqueValues = new Set(attr.values);
      if (uniqueValues.size !== attr.values.length) {
        throwBadRequest(`Attribute ${attr.attributeId} has duplicate values`);
      }
    }
  }

  /**
   * Сравнение массивов атрибутов (теперь с массивами values)
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

  /**
   * Проверка существования категории
   */
  private async validateCategoryExists(categoryId: string): Promise<void> {
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throwBadRequest(`Category with id ${categoryId} not found`);
    }

    if (!category.isActive) {
      throwBadRequest(`Category '${category.name}' is inactive`);
    }
  }
}

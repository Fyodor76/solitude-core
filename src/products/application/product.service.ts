// src/products/application/product.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { ProductRepository } from '../domain/repository/product.repository';
import {
  ProductEntity,
  ProductVariation,
} from '../domain/entities/product.entity';
import { throwNotFound } from '../../common/exceptions/http-exception.helper';
import { ProductFiltersDto } from './dto/product-filters.dto';
import { ProductValidator } from './validators/product.validator';
import { SkuValidator } from './validators/sku.validator';
import { AttributeValidator } from './validators/attribute.validator';
import { VariationValidator } from './validators/variation.validator';

@Injectable()
export class ProductApplication {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    private readonly productValidator: ProductValidator,
    private readonly skuValidator: SkuValidator,
    private readonly attributeValidator: AttributeValidator,
    private readonly variationValidator: VariationValidator,
  ) {}

  async create(product: ProductEntity): Promise<ProductEntity> {
    await this.productValidator.validateForCreation(product);
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

    await this.productValidator.validateForUpdate(product, existing);
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

    // 1. Проверка SKU вариации
    this.skuValidator.validateVariationSkuNotEqualsProductSku(
      variation.sku,
      product.sku,
    );

    // 2. Проверка уникальности SKU вариации в системе
    await this.skuValidator.validateVariationSku(variation.sku);

    // 3. Проверка что вариация имеет атрибуты
    this.variationValidator.validateVariationHasAttributes(variation);

    // 4. Проверка уникальности комбинации атрибутов
    await this.variationValidator.validateUniqueVariation(
      productId,
      variation.attributes,
    );

    // 5. Валидация атрибутов вариации
    await this.attributeValidator.validateVariationAttributes(
      variation.attributes,
    );

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

    // Находим существующую вариацию
    const existingVariation = product.variations.find(
      (v) => v.id === variation.id,
    );
    if (!existingVariation) {
      throwNotFound('Variation not found');
    }

    // 1. Проверка SKU вариации
    this.skuValidator.validateVariationSkuNotEqualsProductSku(
      variation.sku,
      product.sku,
    );

    // 2. Проверка уникальности SKU (если изменился)
    if (existingVariation.sku !== variation.sku) {
      await this.skuValidator.validateVariationSku(variation.sku);
    }

    // 3. Проверка что вариация имеет атрибуты
    this.variationValidator.validateVariationHasAttributes(variation);

    // 4. Проверка уникальности комбинации атрибутов
    await this.variationValidator.validateUniqueVariation(
      productId,
      variation.attributes,
      variation.id,
    );

    // 5. Валидация атрибутов вариации
    await this.attributeValidator.validateVariationAttributes(
      variation.attributes,
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

    const variationExists = product.variations.some(
      (v) => v.id === variationId,
    );
    if (!variationExists) {
      throwNotFound('Variation not found');
    }

    return await this.productRepository.deleteVariation(productId, variationId);
  }
}

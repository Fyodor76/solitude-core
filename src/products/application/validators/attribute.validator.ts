// src/products/application/validators/attribute.validator.ts
import { Inject, Injectable } from '@nestjs/common';
import { ProductAttributeRepository } from 'src/product-attributes/domain/repository/product-attribute.repository';
import { throwBadRequest } from '../../../common/exceptions/http-exception.helper';

@Injectable()
export class AttributeValidator {
  constructor(
    @Inject('ProductAttributeRepository')
    private readonly attributeRepository: ProductAttributeRepository,
  ) {}

  /**
   * Валидация атрибутов продукта
   */
  async validateProductAttributes(
    attributes: { attributeId: string; values: string[] }[],
  ): Promise<void> {
    if (!attributes || attributes.length === 0) {
      return;
    }

    for (const attr of attributes) {
      await this.validateAttribute(attr.attributeId, attr.values);
    }
  }

  /**
   * Валидация атрибутов вариации
   */
  async validateVariationAttributes(
    attributes: { attributeId: string; values: string[] }[],
  ): Promise<void> {
    for (const attr of attributes) {
      await this.validateAttribute(attr.attributeId, attr.values);
    }
  }

  /**
   * Общая валидация атрибута
   */
  private async validateAttribute(
    attributeId: string,
    values: string[],
  ): Promise<void> {
    const attribute =
      await this.attributeRepository.findAttributeById(attributeId);
    if (!attribute) {
      throwBadRequest(`Attribute with id ${attributeId} not found`);
    }

    // Проверка на дублирование значений
    const uniqueValues = new Set(values);
    if (uniqueValues.size !== values.length) {
      throwBadRequest(`Attribute '${attribute.name}' has duplicate values`);
    }

    // Проверка существования значений
    const foundValues = await this.attributeRepository.findValuesBySlugs(
      attributeId,
      values,
    );

    if (foundValues.length !== values.length) {
      const foundSlugs = foundValues.map((v) => v.slug);
      const missingSlugs = values.filter((slug) => !foundSlugs.includes(slug));
      throwBadRequest(
        `Values [${missingSlugs.join(', ')}] not found for attribute '${attribute.name}'`,
      );
    }

    // Проверка активности значений
    const inactiveValues = foundValues.filter((v) => !v.isActive);
    if (inactiveValues.length > 0) {
      const inactiveNames = inactiveValues.map((v) => `${v.value} (${v.slug})`);
      throwBadRequest(`Values [${inactiveNames.join(', ')}] are inactive`);
    }
  }
}

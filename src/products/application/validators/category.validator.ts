// src/products/application/validators/category.validator.ts
import { Inject, Injectable } from '@nestjs/common';
import { CategoryRepository } from 'src/categories/domain/repository/category.repository';
import { throwBadRequest } from '../../../common/exceptions/http-exception.helper';

@Injectable()
export class CategoryValidator {
  constructor(
    @Inject('CategoryRepository')
    private readonly categoryRepository: CategoryRepository,
  ) {}

  /**
   * Проверяет существование и активность категории
   */
  async validateCategory(categoryId: string): Promise<void> {
    const category = await this.categoryRepository.findById(categoryId);

    if (!category) {
      throwBadRequest(`Category with id ${categoryId} not found`);
    }

    if (!category.isActive) {
      throwBadRequest(`Category '${category.name}' is inactive`);
    }
  }
}

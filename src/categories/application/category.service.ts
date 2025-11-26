import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CategoryRepository } from '../domain/repository/category.repository';
import {
  CategoryEntity,
  CategoryType,
} from '../domain/entities/category.entity';
import {
  throwConflict,
  throwNotFound,
} from '../../common/exceptions/http-exception.helper';

@Injectable()
export class CategoryApplication {
  constructor(
    @Inject('CategoryRepository')
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async create(category: CategoryEntity): Promise<CategoryEntity> {
    const existing = await this.categoryRepository.findBySlug(category.slug);
    if (existing) {
      throwConflict('Category with this slug already exists');
    }

    if (category.parentId) {
      const parent = await this.categoryRepository.findById(category.parentId);
      if (!parent) {
        throwNotFound('Parent category not found');
      }
    }

    return await this.categoryRepository.create(category);
  }

  async getById(id: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throwNotFound('Category not found');
    }
    return category;
  }

  async getBySlug(slug: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findBySlug(slug);
    if (!category) {
      throwNotFound('Category not found');
    }
    return category;
  }

  async getCollections(): Promise<CategoryEntity[]> {
    return await this.categoryRepository.findAll({
      type: CategoryType.COLLECTION,
      isActive: true,
    });
  }

  async getRootCategories(): Promise<CategoryEntity[]> {
    return await this.categoryRepository.findByParentId(null);
  }

  async getChildCategories(parentId: string): Promise<CategoryEntity[]> {
    return await this.categoryRepository.findByParentId(parentId);
  }

  async update(category: CategoryEntity): Promise<CategoryEntity> {
    const existing = await this.categoryRepository.findById(category.id);
    if (!existing) {
      throwNotFound('Category not found');
    }

    if (existing.slug !== category.slug) {
      const slugExists = await this.categoryRepository.findBySlug(
        category.slug,
      );
      if (slugExists) {
        throwConflict('Category with this slug already exists');
      }
    }

    return await this.categoryRepository.update(category);
  }

  async delete(id: string): Promise<void> {
    const category = await this.categoryRepository.findById(id);
    console.log(category, 'category!');
    if (!category) {
      throwNotFound('Category not found');
    }

    const children = await this.categoryRepository.findByParentId(id);
    if (children.length > 0) {
      throw new ConflictException(
        'Cannot delete category with child categories',
      );
    }

    await this.categoryRepository.delete(id);
  }

  async softDelete(id: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throwNotFound('Category not found');
    }

    category.toggleActive();
    return await this.categoryRepository.update(category);
  }
}

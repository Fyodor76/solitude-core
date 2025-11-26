import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  CategoryRepository,
  CategoryFilters,
} from '../../domain/repository/category.repository';
import {
  CategoryEntity,
  CategoryType,
} from '../../domain/entities/category.entity';
import { CategoryModel } from '../orm/category.entity';

@Injectable()
export class SequelizeCategoryRepository implements CategoryRepository {
  constructor(
    @InjectModel(CategoryModel)
    private readonly categoryModel: typeof CategoryModel,
  ) {}

  async create(category: CategoryEntity): Promise<CategoryEntity> {
    const created = await this.categoryModel.create({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      parentId: category.parentId,
      imageId: category.imageId,
      isActive: category.isActive,
      sortOrder: category.sortOrder,
      type: category.type,
    });

    return this.buildCategoryEntity(created);
  }

  async findById(id: string): Promise<CategoryEntity> {
    const found = await this.categoryModel.findByPk(id);
    if (!found) return null;
    return this.buildCategoryEntity(found);
  }

  async findBySlug(slug: string): Promise<CategoryEntity> {
    const found = await this.categoryModel.findOne({ where: { slug } });
    if (!found) return null;
    return this.buildCategoryEntity(found);
  }

  async findAll(filters?: CategoryFilters): Promise<CategoryEntity[]> {
    const where: any = {};

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.parentId !== undefined) {
      where.parentId = filters.parentId;
    }

    const categories = await this.categoryModel.findAll({
      where,
      order: [['sortOrder', 'ASC']],
    });

    return categories.map((category) => this.buildCategoryEntity(category));
  }

  async findByParentId(parentId: string | null): Promise<CategoryEntity[]> {
    const categories = await this.categoryModel.findAll({
      where: { parentId },
      order: [['sortOrder', 'ASC']],
    });

    return categories.map((category) => this.buildCategoryEntity(category));
  }

  async update(category: CategoryEntity): Promise<CategoryEntity> {
    const [affectedCount] = await this.categoryModel.update(
      {
        name: category.name,
        slug: category.slug,
        description: category.description,
        parentId: category.parentId,
        imageId: category.imageId,
        isActive: category.isActive,
        sortOrder: category.sortOrder,
        type: category.type,
        updatedAt: new Date(),
      },
      { where: { id: category.id } },
    );

    if (affectedCount === 0) {
      return null;
    }

    const updated = await this.categoryModel.findByPk(category.id);
    return this.buildCategoryEntity(updated);
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.categoryModel.destroy({
      where: { id },
    });

    if (deleted === 0) {
      throw new Error('Category not found');
    }
  }

  private buildCategoryEntity(model: CategoryModel): CategoryEntity {
    return new CategoryEntity(
      model.id,
      model.name,
      model.slug,
      model.description,
      model.parentId,
      model.imageId,
      model.isActive,
      model.sortOrder,
      model.type as CategoryType,
      model.createdAt,
      model.updatedAt,
    );
  }
}

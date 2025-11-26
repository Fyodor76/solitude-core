import { CategoryEntity } from '../entities/category.entity';
import { CategoryType } from '../entities/category.entity';

export interface CategoryRepository {
  create(category: CategoryEntity): Promise<CategoryEntity>;
  findById(id: string): Promise<CategoryEntity>;
  findBySlug(slug: string): Promise<CategoryEntity>;
  findAll(filters?: CategoryFilters): Promise<CategoryEntity[]>;
  findByParentId(parentId: string | null): Promise<CategoryEntity[]>;
  update(category: CategoryEntity): Promise<CategoryEntity>;
  delete(id: string): Promise<void>;
}

export interface CategoryFilters {
  isActive?: boolean;
  type?: CategoryType;
  parentId?: string | null;
}

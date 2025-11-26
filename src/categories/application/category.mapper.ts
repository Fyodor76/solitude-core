import {
  CategoryEntity,
  CategoryType,
} from 'src/categories/domain/entities/category.entity';
import { CategoryCreateDto } from './dto/category-create.dto';
import { CategoryResponseDto } from './dto/category-response.dto';

export class CategoryMapper {
  static toEntity(dto: CategoryCreateDto, id?: string): CategoryEntity {
    return new CategoryEntity(
      id,
      dto.name,
      dto.slug,
      dto.description || '',
      dto.parentId || null,
      dto.imageId || '',
      true,
      dto.sortOrder || 0,
      dto.type || CategoryType.CATEGORY,
    );
  }

  static toResponse(entity: CategoryEntity): CategoryResponseDto {
    return new CategoryResponseDto({
      id: entity.id,
      name: entity.name,
      slug: entity.slug,
      description: entity.description,
      parentId: entity.parentId,
      imageId: entity.imageId,
      isActive: entity.isActive,
      sortOrder: entity.sortOrder,
      type: entity.type,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}

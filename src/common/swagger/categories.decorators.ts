// src/common/swagger/categories.decorators.ts
import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { CategoryCreateDto } from 'src/categories/application/dto/category-create.dto';
import { CategoryResponseDto } from 'src/categories/application/dto/category-response.dto';
import {
  BaseResponseArrayDtoSwagger,
  BaseResponseDtoSwagger,
} from './swagger-common-types.dto';

export function ApiCreateCategory() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create category',
      description: 'Create a new product category or collection',
    }),
    ApiBody({ type: CategoryCreateDto }),
    ApiResponse({
      status: 201,
      description: 'Category successfully created',
      type: CategoryResponseDto,
      schema: {
        example: {
          success: true,
          data: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Electronics',
            slug: 'electronics',
            description: 'Electronic devices and accessories',
            parentId: null,
            type: 'category',
            isActive: true,
            isCollection: false,
            order: 0,
            image: 'https://example.com/electronics.jpg',
            createdAt: '2024-01-01T10:00:00.000Z',
            updatedAt: '2024-01-01T10:00:00.000Z',
          },
          message: 'Category created successfully',
        },
      },
    }),
    ApiResponse({
      status: 409,
      description: 'Category with this slug already exists',
      schema: {
        example: {
          statusCode: 409,
          message: 'Category with this slug already exists',
          error: 'Conflict',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Parent category not found',
      schema: {
        example: {
          statusCode: 404,
          message: 'Parent category not found',
          error: 'Not Found',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Validation error',
    }),
  );
}

export function ApiGetAllCategories() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get all categories',
      description: 'Retrieve all root categories (categories without parent)',
    }),
    ApiResponse({
      status: 200,
      description: 'Categories retrieved successfully',
      type: BaseResponseArrayDtoSwagger<CategoryResponseDto>,
      schema: {
        example: {
          success: true,
          data: [
            {
              id: '123e4567-e89b-12d3-a456-426614174000',
              name: 'Electronics',
              slug: 'electronics',
              description: 'Electronic devices',
              parentId: null,
              type: 'category',
              isActive: true,
              isCollection: false,
              order: 0,
              image: 'https://example.com/electronics.jpg',
              createdAt: '2024-01-01T10:00:00.000Z',
              updatedAt: '2024-01-01T10:00:00.000Z',
            },
            {
              id: '223e4567-e89b-12d3-a456-426614174000',
              name: 'Clothing',
              slug: 'clothing',
              description: 'Clothes and accessories',
              parentId: null,
              type: 'category',
              isActive: true,
              isCollection: false,
              order: 1,
              image: 'https://example.com/clothing.jpg',
              createdAt: '2024-01-01T10:00:00.000Z',
              updatedAt: '2024-01-01T10:00:00.000Z',
            },
          ],
        },
      },
    }),
  );
}

export function ApiGetCollections() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get all collections',
      description: 'Retrieve all collections (special type of categories)',
    }),
    ApiResponse({
      status: 200,
      description: 'Collections retrieved successfully',
      type: BaseResponseArrayDtoSwagger<CategoryResponseDto>,
    }),
  );
}

export function ApiGetCategoryById() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get category by ID',
      description: 'Retrieve category information by ID',
    }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'Category UUID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiResponse({
      status: 200,
      description: 'Category found',
      type: BaseResponseDtoSwagger<CategoryResponseDto>,
    }),
    ApiResponse({
      status: 404,
      description: 'Category not found',
      schema: {
        example: {
          statusCode: 404,
          message: 'Category not found',
          error: 'Not Found',
        },
      },
    }),
  );
}

export function ApiGetCategoryBySlug() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get category by slug',
      description: 'Retrieve category information by URL-friendly slug',
    }),
    ApiParam({
      name: 'slug',
      type: String,
      description: 'Category slug',
      example: 't-shirts',
    }),
    ApiResponse({
      status: 200,
      description: 'Category found',
      type: BaseResponseDtoSwagger<CategoryResponseDto>,
    }),
    ApiResponse({
      status: 404,
      description: 'Category not found',
    }),
  );
}

export function ApiGetChildCategories() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get child categories',
      description: 'Retrieve all child categories for a parent category',
    }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'Parent category UUID',
    }),
    ApiResponse({
      status: 200,
      description: 'Child categories retrieved successfully',
      type: BaseResponseArrayDtoSwagger<CategoryResponseDto>,
    }),
    ApiResponse({
      status: 404,
      description: 'Parent category not found',
    }),
  );
}

export function ApiDeleteCategory() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete category',
      description: 'Permanently delete a category (only if it has no children)',
    }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'Category UUID to delete',
    }),
    ApiResponse({
      status: 200,
      description: 'Category deleted successfully',
      type: BaseResponseDtoSwagger<{ message: string }>,
      schema: {
        example: {
          success: true,
          data: { message: 'Category deleted successfully' },
          message: 'Category deleted successfully',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Category not found',
    }),
    ApiResponse({
      status: 409,
      description: 'Category has child categories',
      schema: {
        example: {
          statusCode: 409,
          message: 'Cannot delete category with child categories',
          error: 'Conflict',
        },
      },
    }),
  );
}

export function ApiDeactivateCategory() {
  return applyDecorators(
    ApiOperation({
      summary: 'Deactivate category',
      description: 'Soft delete category by deactivating it',
    }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'Category UUID to deactivate',
    }),
    ApiResponse({
      status: 200,
      description: 'Category deactivated successfully',
      type: BaseResponseDtoSwagger<CategoryResponseDto>,
    }),
    ApiResponse({
      status: 404,
      description: 'Category not found',
    }),
  );
}

export function ApiUpdateCategory() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update category',
      description: 'Update category information',
    }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'Category UUID to update',
    }),
    ApiBody({ type: CategoryCreateDto }),
    ApiResponse({
      status: 200,
      description: 'Category updated successfully',
      type: BaseResponseDtoSwagger<CategoryResponseDto>,
    }),
    ApiResponse({
      status: 404,
      description: 'Category not found',
    }),
    ApiResponse({
      status: 409,
      description: 'Category with this slug already exists',
    }),
  );
}

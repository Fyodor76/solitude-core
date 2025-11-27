import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import {
  ProductCreateDto,
  ProductVariationCreateDto,
} from 'src/products/application/dto/product-create.dto';
import { ProductResponseDto } from 'src/products/application/dto/product-response.dto';

export function ApiCreateProduct() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create product',
      description: 'Create a new product with variations and attributes',
    }),
    ApiBody({ type: ProductCreateDto }),
    ApiResponse({
      status: 201,
      description: 'Product successfully created',
      type: ProductResponseDto,
    }),
    ApiResponse({
      status: 409,
      description: 'Product with this slug already exists',
      schema: {
        example: {
          statusCode: 409,
          message: 'Product with this slug already exists',
          error: 'Conflict',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Validation error',
    }),
  );
}

export function ApiGetAllProducts() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get all products',
      description: 'Retrieve all products with optional filtering and sorting',
    }),
    ApiQuery({
      name: 'categoryId',
      required: false,
      type: String,
      description: 'Filter by category ID',
    }),
    ApiQuery({
      name: 'brand',
      required: false,
      type: String,
      description: 'Filter by brand',
    }),
    ApiQuery({
      name: 'isFeatured',
      required: false,
      type: Boolean,
      description: 'Filter featured products',
    }),
    ApiQuery({
      name: 'inStock',
      required: false,
      type: Boolean,
      description: 'Filter products in stock',
    }),
    ApiQuery({
      name: 'minPrice',
      required: false,
      type: Number,
      description: 'Minimum price filter',
    }),
    ApiQuery({
      name: 'maxPrice',
      required: false,
      type: Number,
      description: 'Maximum price filter',
    }),
    ApiQuery({
      name: 'isActive',
      required: false,
      type: Boolean,
      description: 'Filter active products',
    }),
    ApiQuery({
      name: 'search',
      required: false,
      type: String,
      description: 'Search in name and description',
    }),
    ApiQuery({
      name: 'sortBy',
      required: false,
      enum: ['name', 'price', 'createdAt', 'updatedAt'],
      description: 'Field to sort by',
    }),
    ApiQuery({
      name: 'sortOrder',
      required: false,
      enum: ['ASC', 'DESC'],
      description: 'Sort order',
    }),
    ApiResponse({
      status: 200,
      description: 'Products retrieved successfully',
      type: [ProductResponseDto],
    }),
  );
}

export function ApiGetProductById() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get product by ID',
      description: 'Retrieve product information by ID',
    }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'Product UUID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiResponse({
      status: 200,
      description: 'Product found',
      type: ProductResponseDto,
    }),
    ApiResponse({
      status: 404,
      description: 'Product not found',
      schema: {
        example: {
          statusCode: 404,
          message: 'Product not found',
          error: 'Not Found',
        },
      },
    }),
  );
}

export function ApiGetProductBySlug() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get product by slug',
      description: 'Retrieve product information by URL-friendly slug',
    }),
    ApiParam({
      name: 'slug',
      type: String,
      description: 'Product slug',
      example: 'nike-t-shirt-sport',
    }),
    ApiResponse({
      status: 200,
      description: 'Product found',
      type: ProductResponseDto,
    }),
    ApiResponse({
      status: 404,
      description: 'Product not found',
    }),
  );
}

export function ApiGetProductsByCategory() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get products by category',
      description: 'Retrieve all products in a specific category',
    }),
    ApiParam({
      name: 'categoryId',
      type: String,
      description: 'Category UUID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiResponse({
      status: 200,
      description: 'Products retrieved successfully',
      type: [ProductResponseDto],
    }),
  );
}

export function ApiGetProductsByBrand() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get products by brand',
      description: 'Retrieve all products from a specific brand',
    }),
    ApiParam({
      name: 'brand',
      type: String,
      description: 'Brand name',
      example: 'nike',
    }),
    ApiResponse({
      status: 200,
      description: 'Products retrieved successfully',
      type: [ProductResponseDto],
    }),
  );
}

export function ApiUpdateProduct() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update product',
      description: 'Update product information',
    }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'Product UUID to update',
    }),
    ApiBody({ type: ProductCreateDto }),
    ApiResponse({
      status: 200,
      description: 'Product updated successfully',
      type: ProductResponseDto,
    }),
    ApiResponse({
      status: 404,
      description: 'Product not found',
    }),
    ApiResponse({
      status: 409,
      description: 'Product with this slug already exists',
    }),
  );
}

export function ApiDeleteProduct() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete product',
      description: 'Permanently delete a product',
    }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'Product UUID to delete',
    }),
    ApiResponse({
      status: 200,
      description: 'Product deleted successfully',
      schema: {
        example: {
          message: 'Product deleted successfully',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Product not found',
    }),
  );
}

export function ApiAddProductVariation() {
  return applyDecorators(
    ApiOperation({
      summary: 'Add variation to product',
      description: 'Add a new variation to an existing product',
    }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'Product UUID',
    }),
    ApiBody({ type: ProductVariationCreateDto }),
    ApiResponse({
      status: 201,
      description: 'Variation added successfully',
      type: ProductResponseDto,
    }),
    ApiResponse({
      status: 404,
      description: 'Product not found',
    }),
    ApiResponse({
      status: 409,
      description: 'Variation with these attributes already exists',
      schema: {
        example: {
          statusCode: 409,
          message: 'Variation with these attributes already exists',
          error: 'Conflict',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid attribute or value',
    }),
  );
}

export function ApiUpdateProductVariation() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update product variation',
      description: 'Update an existing product variation',
    }),
    ApiParam({
      name: 'productId',
      type: String,
      description: 'Product UUID',
    }),
    ApiParam({
      name: 'variationId',
      type: String,
      description: 'Variation UUID',
    }),
    ApiBody({ type: ProductVariationCreateDto }),
    ApiResponse({
      status: 200,
      description: 'Variation updated successfully',
      type: ProductResponseDto,
    }),
    ApiResponse({
      status: 404,
      description: 'Product or variation not found',
    }),
    ApiResponse({
      status: 409,
      description: 'Variation with these attributes already exists',
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid attribute or value',
    }),
  );
}

export function ApiDeleteProductVariation() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete product variation',
      description: 'Delete a variation from a product',
    }),
    ApiParam({
      name: 'productId',
      type: String,
      description: 'Product UUID',
    }),
    ApiParam({
      name: 'variationId',
      type: String,
      description: 'Variation UUID to delete',
    }),
    ApiResponse({
      status: 200,
      description: 'Variation deleted successfully',
      type: ProductResponseDto,
    }),
    ApiResponse({
      status: 404,
      description: 'Product or variation not found',
    }),
  );
}

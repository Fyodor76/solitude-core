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
      schema: {
        example: {
          success: true,
          data: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Футболка Nike Sport',
            slug: 'nike-t-shirt-sport',
            description: 'Спортивная футболка Nike',
            price: 2990,
            comparePrice: 3490,
            categoryId: '223e4567-e89b-12d3-a456-426614174000',
            brand: 'nike',
            material: 'cotton',
            sku: 'NIKE-TS-BASE',
            isActive: true,
            isFeatured: false,
            inStock: true,
            images: ['https://example.com/tshirt.jpg'],
            attributes: [],
            variations: [],
            createdAt: '2024-01-01T10:00:00.000Z',
            updatedAt: '2024-01-01T10:00:00.000Z',
          },
          message: 'Product created successfully',
        },
      },
    }),
    ApiResponse({
      status: 409,
      description: 'Product with this slug already exists',
      schema: {
        example: {
          success: false,
          statusCode: 409,
          message: 'Product with this slug already exists',
          error: 'Conflict',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Validation error',
      schema: {
        example: {
          success: false,
          statusCode: 400,
          message: ['name must be a string', 'price must be a number'],
          error: 'Bad Request',
        },
      },
    }),
  );
}

export function ApiSearchProducts() {
  return applyDecorators(
    ApiOperation({
      summary: 'Search products with filters',
      description: 'Search products with filters and pagination',
    }),
    ApiResponse({
      status: 200,
      description: 'Products retrieved successfully',
      type: ProductResponseDto,
      schema: {
        example: {
          success: true,
          data: [
            {
              id: '123e4567-e89b-12d3-a456-426614174000',
              name: 'Футболка Nike Sport',
              slug: 'nike-t-shirt-sport',
              description: 'Спортивная футболка Nike',
              price: 2990,
              comparePrice: 3490,
              categoryId: '223e4567-e89b-12d3-a456-426614174000',
              brand: 'nike',
              material: 'cotton',
              sku: 'NIKE-TS-BASE',
              isActive: true,
              isFeatured: false,
              inStock: true,
              images: ['https://example.com/tshirt.jpg'],
              attributes: [],
              variations: [],
              createdAt: '2024-01-01T10:00:00.000Z',
              updatedAt: '2024-01-01T10:00:00.000Z',
            },
          ],
          meta: {
            page: 1,
            limit: 10,
            total: 100,
            totalPages: 10,
            hasNext: true,
            hasPrev: false,
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Validation error',
      schema: {
        example: {
          success: false,
          statusCode: 400,
          message: 'Invalid filter parameters',
          error: 'Bad Request',
        },
      },
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
      schema: {
        example: {
          success: true,
          data: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Футболка Nike Sport',
            slug: 'nike-t-shirt-sport',
            description: 'Спортивная футболка Nike',
            price: 2990,
            comparePrice: 3490,
            categoryId: '223e4567-e89b-12d3-a456-426614174000',
            brand: 'nike',
            material: 'cotton',
            sku: 'NIKE-TS-BASE',
            isActive: true,
            isFeatured: false,
            inStock: true,
            images: ['https://example.com/tshirt.jpg'],
            attributes: [],
            variations: [],
            createdAt: '2024-01-01T10:00:00.000Z',
            updatedAt: '2024-01-01T10:00:00.000Z',
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Product not found',
      schema: {
        example: {
          success: false,
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
      schema: {
        example: {
          success: true,
          data: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Футболка Nike Sport',
            slug: 'nike-t-shirt-sport',
            description: 'Спортивная футболка Nike',
            price: 2990,
            comparePrice: 3490,
            categoryId: '223e4567-e89b-12d3-a456-426614174000',
            brand: 'nike',
            material: 'cotton',
            sku: 'NIKE-TS-BASE',
            isActive: true,
            isFeatured: false,
            inStock: true,
            images: ['https://example.com/tshirt.jpg'],
            attributes: [],
            variations: [],
            createdAt: '2024-01-01T10:00:00.000Z',
            updatedAt: '2024-01-01T10:00:00.000Z',
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Product not found',
      schema: {
        example: {
          success: false,
          statusCode: 404,
          message: 'Product not found',
          error: 'Not Found',
        },
      },
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
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Page number (default: 1)',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Items per page (default: 20, max: 100)',
      example: 20,
    }),
    ApiResponse({
      status: 200,
      description: 'Products retrieved successfully',
      type: ProductResponseDto,
      schema: {
        example: {
          success: true,
          data: [
            {
              id: '123e4567-e89b-12d3-a456-426614174000',
              name: 'Футболка Nike Sport',
              slug: 'nike-t-shirt-sport',
              description: 'Спортивная футболка Nike',
              price: 2990,
              comparePrice: 3490,
              categoryId: '223e4567-e89b-12d3-a456-426614174000',
              brand: 'nike',
              material: 'cotton',
              sku: 'NIKE-TS-BASE',
              isActive: true,
              isFeatured: false,
              inStock: true,
              images: ['https://example.com/tshirt.jpg'],
              attributes: [],
              variations: [],
              createdAt: '2024-01-01T10:00:00.000Z',
              updatedAt: '2024-01-01T10:00:00.000Z',
            },
          ],
          meta: {
            page: 1,
            limit: 20,
            total: 50,
            totalPages: 3,
            hasNext: true,
            hasPrev: false,
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Category not found',
      schema: {
        example: {
          success: false,
          statusCode: 404,
          message: 'Category not found',
          error: 'Not Found',
        },
      },
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
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Page number (default: 1)',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Items per page (default: 20, max: 100)',
      example: 20,
    }),
    ApiResponse({
      status: 200,
      description: 'Products retrieved successfully',
      type: ProductResponseDto,
      schema: {
        example: {
          success: true,
          data: [
            {
              id: '123e4567-e89b-12d3-a456-426614174000',
              name: 'Футболка Nike Sport',
              slug: 'nike-t-shirt-sport',
              description: 'Спортивная футболка Nike',
              price: 2990,
              comparePrice: 3490,
              categoryId: '223e4567-e89b-12d3-a456-426614174000',
              brand: 'nike',
              material: 'cotton',
              sku: 'NIKE-TS-BASE',
              isActive: true,
              isFeatured: false,
              inStock: true,
              images: ['https://example.com/tshirt.jpg'],
              attributes: [],
              variations: [],
              createdAt: '2024-01-01T10:00:00.000Z',
              updatedAt: '2024-01-01T10:00:00.000Z',
            },
          ],
          meta: {
            page: 1,
            limit: 20,
            total: 30,
            totalPages: 2,
            hasNext: true,
            hasPrev: false,
          },
        },
      },
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
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiBody({ type: ProductCreateDto }),
    ApiResponse({
      status: 200,
      description: 'Product updated successfully',
      type: ProductResponseDto,
      schema: {
        example: {
          success: true,
          data: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Обновленная футболка Nike Sport',
            slug: 'nike-t-shirt-sport-updated',
            description: 'Обновленное описание',
            price: 3290,
            comparePrice: 3790,
            categoryId: '223e4567-e89b-12d3-a456-426614174000',
            brand: 'nike',
            material: 'premium-cotton',
            sku: 'NIKE-TS-BASE-UPD',
            isActive: true,
            isFeatured: true,
            inStock: true,
            images: ['https://example.com/tshirt-updated.jpg'],
            attributes: [],
            variations: [],
            createdAt: '2024-01-01T10:00:00.000Z',
            updatedAt: '2024-01-02T10:00:00.000Z',
          },
          message: 'Product updated successfully',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Product not found',
      schema: {
        example: {
          success: false,
          statusCode: 404,
          message: 'Product not found',
          error: 'Not Found',
        },
      },
    }),
    ApiResponse({
      status: 409,
      description: 'Product with this slug already exists',
      schema: {
        example: {
          success: false,
          statusCode: 409,
          message: 'Product with this slug already exists',
          error: 'Conflict',
        },
      },
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
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiResponse({
      status: 200,
      description: 'Product deleted successfully',
      schema: {
        example: {
          success: true,
          data: {
            message: 'Product deleted successfully',
          },
          message: 'Product deleted successfully',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Product not found',
      schema: {
        example: {
          success: false,
          statusCode: 404,
          message: 'Product not found',
          error: 'Not Found',
        },
      },
    }),
    ApiResponse({
      status: 409,
      description: 'Cannot delete product with active orders',
      schema: {
        example: {
          success: false,
          statusCode: 409,
          message: 'Cannot delete product with active orders',
          error: 'Conflict',
        },
      },
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
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiBody({ type: ProductVariationCreateDto }),
    ApiResponse({
      status: 201,
      description: 'Variation added successfully',
      type: ProductResponseDto,
      schema: {
        example: {
          success: true,
          data: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Футболка Nike Sport',
            slug: 'nike-t-shirt-sport',
            description: 'Спортивная футболка Nike',
            price: 2990,
            comparePrice: 3490,
            categoryId: '223e4567-e89b-12d3-a456-426614174000',
            brand: 'nike',
            material: 'cotton',
            sku: 'NIKE-TS-BASE',
            isActive: true,
            isFeatured: false,
            inStock: true,
            images: ['https://example.com/tshirt.jpg'],
            attributes: [],
            variations: [
              {
                id: '323e4567-e89b-12d3-a456-426614174000',
                sku: 'NIKE-TS-RED-M',
                price: 2990,
                comparePrice: 3490,
                stock: 10,
                images: ['https://example.com/red-tshirt.jpg'],
                attributes: [
                  {
                    attributeId: '423e4567-e89b-12d3-a456-426614174000',
                    values: ['red'],
                  },
                ],
                isActive: true,
              },
            ],
            createdAt: '2024-01-01T10:00:00.000Z',
            updatedAt: '2024-01-02T10:00:00.000Z',
          },
          message: 'Variation added successfully',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Product not found',
      schema: {
        example: {
          success: false,
          statusCode: 404,
          message: 'Product not found',
          error: 'Not Found',
        },
      },
    }),
    ApiResponse({
      status: 409,
      description: 'Variation with these attributes already exists',
      schema: {
        example: {
          success: false,
          statusCode: 409,
          message: 'Variation with these attributes already exists',
          error: 'Conflict',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid attribute or value',
      schema: {
        example: {
          success: false,
          statusCode: 400,
          message: 'Attribute value not found',
          error: 'Bad Request',
        },
      },
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
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiParam({
      name: 'variationId',
      type: String,
      description: 'Variation UUID',
      example: '323e4567-e89b-12d3-a456-426614174000',
    }),
    ApiBody({ type: ProductVariationCreateDto }),
    ApiResponse({
      status: 200,
      description: 'Variation updated successfully',
      type: ProductResponseDto,
      schema: {
        example: {
          success: true,
          data: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Футболка Nike Sport',
            slug: 'nike-t-shirt-sport',
            description: 'Спортивная футболка Nike',
            price: 2990,
            comparePrice: 3490,
            categoryId: '223e4567-e89b-12d3-a456-426614174000',
            brand: 'nike',
            material: 'cotton',
            sku: 'NIKE-TS-BASE',
            isActive: true,
            isFeatured: false,
            inStock: true,
            images: ['https://example.com/tshirt.jpg'],
            attributes: [],
            variations: [
              {
                id: '323e4567-e89b-12d3-a456-426614174000',
                sku: 'NIKE-TS-RED-M-UPD',
                price: 3190,
                comparePrice: 3690,
                stock: 15,
                images: ['https://example.com/red-tshirt-updated.jpg'],
                attributes: [
                  {
                    attributeId: '423e4567-e89b-12d3-a456-426614174000',
                    values: ['red'],
                  },
                ],
                isActive: true,
              },
            ],
            createdAt: '2024-01-01T10:00:00.000Z',
            updatedAt: '2024-01-03T10:00:00.000Z',
          },
          message: 'Variation updated successfully',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Product or variation not found',
      schema: {
        example: {
          success: false,
          statusCode: 404,
          message: 'Variation not found',
          error: 'Not Found',
        },
      },
    }),
    ApiResponse({
      status: 409,
      description: 'Variation with these attributes already exists',
      schema: {
        example: {
          success: false,
          statusCode: 409,
          message: 'Variation with these attributes already exists',
          error: 'Conflict',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid attribute or value',
      schema: {
        example: {
          success: false,
          statusCode: 400,
          message: 'Attribute value not found',
          error: 'Bad Request',
        },
      },
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
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiParam({
      name: 'variationId',
      type: String,
      description: 'Variation UUID to delete',
      example: '323e4567-e89b-12d3-a456-426614174000',
    }),
    ApiResponse({
      status: 200,
      description: 'Variation deleted successfully',
      type: ProductResponseDto,
      schema: {
        example: {
          success: true,
          data: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Футболка Nike Sport',
            slug: 'nike-t-shirt-sport',
            description: 'Спортивная футболка Nike',
            price: 2990,
            comparePrice: 3490,
            categoryId: '223e4567-e89b-12d3-a456-426614174000',
            brand: 'nike',
            material: 'cotton',
            sku: 'NIKE-TS-BASE',
            isActive: true,
            isFeatured: false,
            inStock: true,
            images: ['https://example.com/tshirt.jpg'],
            attributes: [],
            variations: [],
            createdAt: '2024-01-01T10:00:00.000Z',
            updatedAt: '2024-01-04T10:00:00.000Z',
          },
          message: 'Variation deleted successfully',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Product or variation not found',
      schema: {
        example: {
          success: false,
          statusCode: 404,
          message: 'Variation not found',
          error: 'Not Found',
        },
      },
    }),
  );
}

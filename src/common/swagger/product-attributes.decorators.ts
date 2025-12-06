import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import {
  ProductAttributeCreateDto,
  AttributeValueCreateDto,
} from 'src/product-attributes/application/dto/attribute-create.dto';
import {
  ProductAttributeResponseDto,
  AttributeValueResponseDto,
} from 'src/product-attributes/application/dto/attribute-response.dto';

export function ApiCreateProductAttribute() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create product attribute',
      description: 'Create a new product attribute (color, size, etc.)',
    }),
    ApiBody({ type: ProductAttributeCreateDto }),
    ApiResponse({
      status: 201,
      description: 'Product attribute successfully created',
      type: ProductAttributeResponseDto,
      schema: {
        example: {
          success: true,
          data: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Color',
            slug: 'color',
            type: 'color',
            description: 'Product color',
            isRequired: true,
            isFilterable: true,
            isActive: true,
            values: [
              {
                id: '223e4567-e89b-12d3-a456-426614174000',
                attributeId: '123e4567-e89b-12d3-a456-426614174000',
                value: 'Red',
                slug: 'red',
                isActive: true,
              },
            ],
            createdAt: '2024-01-01T10:00:00.000Z',
            updatedAt: '2024-01-01T10:00:00.000Z',
          },
          message: 'Product attribute created successfully',
        },
      },
    }),
    ApiResponse({
      status: 409,
      description: 'Product attribute with this slug already exists',
      schema: {
        example: {
          success: false,
          statusCode: 409,
          message: 'Product attribute with this slug already exists',
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
          message: ['name must be a string', 'slug must be a string'],
          error: 'Bad Request',
        },
      },
    }),
  );
}

export function ApiCreateAttributeValue() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create attribute value',
      description:
        'Create a new value for product attribute (e.g., "Red" for color attribute)',
    }),
    ApiParam({
      name: 'attributeId',
      type: String,
      description: 'Attribute UUID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiBody({ type: AttributeValueCreateDto }),
    ApiResponse({
      status: 201,
      description: 'Attribute value successfully created',
      type: AttributeValueResponseDto,
      schema: {
        example: {
          success: true,
          data: {
            id: '223e4567-e89b-12d3-a456-426614174000',
            attributeId: '123e4567-e89b-12d3-a456-426614174000',
            value: 'Red',
            slug: 'red',
            isActive: true,
            createdAt: '2024-01-01T10:00:00.000Z',
            updatedAt: '2024-01-01T10:00:00.000Z',
          },
          message: 'Attribute value created successfully',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Product attribute not found',
      schema: {
        example: {
          success: false,
          statusCode: 404,
          message: 'Product attribute not found',
          error: 'Not Found',
        },
      },
    }),
    ApiResponse({
      status: 409,
      description: 'Attribute value with this slug already exists',
      schema: {
        example: {
          success: false,
          statusCode: 409,
          message: 'Attribute value with this slug already exists',
          error: 'Conflict',
        },
      },
    }),
  );
}

export function ApiGetAllProductAttributes() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get all product attributes',
      description: 'Retrieve all product attributes with their values',
    }),
    ApiResponse({
      status: 200,
      description: 'Product attributes retrieved successfully',
      type: ProductAttributeResponseDto,
      schema: {
        example: {
          success: true,
          data: [
            {
              id: '123e4567-e89b-12d3-a456-426614174000',
              name: 'Color',
              slug: 'color',
              type: 'color',
              description: 'Product color',
              isRequired: true,
              isFilterable: true,
              isActive: true,
              values: [
                {
                  id: '223e4567-e89b-12d3-a456-426614174000',
                  attributeId: '123e4567-e89b-12d3-a456-426614174000',
                  value: 'Red',
                  slug: 'red',
                  isActive: true,
                },
              ],
              createdAt: '2024-01-01T10:00:00.000Z',
              updatedAt: '2024-01-01T10:00:00.000Z',
            },
            {
              id: '323e4567-e89b-12d3-a456-426614174000',
              name: 'Size',
              slug: 'size',
              type: 'size',
              description: 'Product size',
              isRequired: true,
              isFilterable: true,
              isActive: true,
              values: [
                {
                  id: '423e4567-e89b-12d3-a456-426614174000',
                  attributeId: '323e4567-e89b-12d3-a456-426614174000',
                  value: 'M',
                  slug: 'm',
                  isActive: true,
                },
              ],
              createdAt: '2024-01-01T10:00:00.000Z',
              updatedAt: '2024-01-01T10:00:00.000Z',
            },
          ],
        },
      },
    }),
  );
}

export function ApiGetProductAttributeById() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get product attribute by ID',
      description: 'Retrieve product attribute information by ID',
    }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'Attribute UUID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiResponse({
      status: 200,
      description: 'Product attribute found',
      type: ProductAttributeResponseDto,
      schema: {
        example: {
          success: true,
          data: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Color',
            slug: 'color',
            type: 'color',
            description: 'Product color',
            isRequired: true,
            isFilterable: true,
            isActive: true,
            values: [
              {
                id: '223e4567-e89b-12d3-a456-426614174000',
                attributeId: '123e4567-e89b-12d3-a456-426614174000',
                value: 'Red',
                slug: 'red',
                isActive: true,
              },
            ],
            createdAt: '2024-01-01T10:00:00.000Z',
            updatedAt: '2024-01-01T10:00:00.000Z',
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Product attribute not found',
      schema: {
        example: {
          success: false,
          statusCode: 404,
          message: 'Product attribute not found',
          error: 'Not Found',
        },
      },
    }),
  );
}

export function ApiGetProductAttributeBySlug() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get product attribute by slug',
      description:
        'Retrieve product attribute information by URL-friendly slug',
    }),
    ApiParam({
      name: 'slug',
      type: String,
      description: 'Attribute slug',
      example: 'color',
    }),
    ApiResponse({
      status: 200,
      description: 'Product attribute found',
      type: ProductAttributeResponseDto,
      schema: {
        example: {
          success: true,
          data: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Color',
            slug: 'color',
            type: 'color',
            description: 'Product color',
            isRequired: true,
            isFilterable: true,
            isActive: true,
            values: [
              {
                id: '223e4567-e89b-12d3-a456-426614174000',
                attributeId: '123e4567-e89b-12d3-a456-426614174000',
                value: 'Red',
                slug: 'red',
                isActive: true,
              },
            ],
            createdAt: '2024-01-01T10:00:00.000Z',
            updatedAt: '2024-01-01T10:00:00.000Z',
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Product attribute not found',
      schema: {
        example: {
          success: false,
          statusCode: 404,
          message: 'Product attribute not found',
          error: 'Not Found',
        },
      },
    }),
  );
}

export function ApiGetProductAttributesByType() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get product attributes by type',
      description:
        'Retrieve product attributes filtered by type (color, size, volume, etc.)',
    }),
    ApiParam({
      name: 'type',
      enum: ['color', 'size', 'volume', 'weight', 'dimension', 'other'],
      description: 'Attribute type',
      example: 'color',
    }),
    ApiResponse({
      status: 200,
      description: 'Product attributes retrieved successfully',
      type: ProductAttributeResponseDto,
      schema: {
        example: {
          success: true,
          data: [
            {
              id: '123e4567-e89b-12d3-a456-426614174000',
              name: 'Color',
              slug: 'color',
              type: 'color',
              description: 'Product color',
              isRequired: true,
              isFilterable: true,
              isActive: true,
              values: [
                {
                  id: '223e4567-e89b-12d3-a456-426614174000',
                  attributeId: '123e4567-e89b-12d3-a456-426614174000',
                  value: 'Red',
                  slug: 'red',
                  isActive: true,
                },
              ],
              createdAt: '2024-01-01T10:00:00.000Z',
              updatedAt: '2024-01-01T10:00:00.000Z',
            },
          ],
        },
      },
    }),
  );
}

export function ApiGetAttributeValues() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get attribute values',
      description: 'Retrieve all values for a specific product attribute',
    }),
    ApiParam({
      name: 'attributeId',
      type: String,
      description: 'Attribute UUID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiResponse({
      status: 200,
      description: 'Attribute values retrieved successfully',
      type: AttributeValueResponseDto,
      schema: {
        example: {
          success: true,
          data: [
            {
              id: '223e4567-e89b-12d3-a456-426614174000',
              attributeId: '123e4567-e89b-12d3-a456-426614174000',
              value: 'Red',
              slug: 'red',
              isActive: true,
              createdAt: '2024-01-01T10:00:00.000Z',
              updatedAt: '2024-01-01T10:00:00.000Z',
            },
            {
              id: '323e4567-e89b-12d3-a456-426614174000',
              attributeId: '123e4567-e89b-12d3-a456-426614174000',
              value: 'Blue',
              slug: 'blue',
              isActive: true,
              createdAt: '2024-01-01T10:00:00.000Z',
              updatedAt: '2024-01-01T10:00:00.000Z',
            },
          ],
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Product attribute not found',
      schema: {
        example: {
          success: false,
          statusCode: 404,
          message: 'Product attribute not found',
          error: 'Not Found',
        },
      },
    }),
  );
}

export function ApiUpdateProductAttribute() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update product attribute',
      description: 'Update product attribute information',
    }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'Attribute UUID to update',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiBody({ type: ProductAttributeCreateDto }),
    ApiResponse({
      status: 200,
      description: 'Product attribute updated successfully',
      type: ProductAttributeResponseDto,
      schema: {
        example: {
          success: true,
          data: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Updated Color Name',
            slug: 'color',
            type: 'color',
            description: 'Updated description',
            isRequired: true,
            isFilterable: true,
            isActive: true,
            values: [],
            createdAt: '2024-01-01T10:00:00.000Z',
            updatedAt: '2024-01-02T10:00:00.000Z',
          },
          message: 'Product attribute updated successfully',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Product attribute not found',
      schema: {
        example: {
          success: false,
          statusCode: 404,
          message: 'Product attribute not found',
          error: 'Not Found',
        },
      },
    }),
    ApiResponse({
      status: 409,
      description: 'Product attribute with this slug already exists',
      schema: {
        example: {
          success: false,
          statusCode: 409,
          message: 'Product attribute with this slug already exists',
          error: 'Conflict',
        },
      },
    }),
  );
}

export function ApiDeleteProductAttribute() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete product attribute',
      description: 'Permanently delete a product attribute and all its values',
    }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'Attribute UUID to delete',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiResponse({
      status: 200,
      description: 'Product attribute deleted successfully',
      schema: {
        example: {
          success: true,
          data: {
            message: 'Product attribute deleted successfully',
          },
          message: 'Product attribute deleted successfully',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Product attribute not found',
      schema: {
        example: {
          success: false,
          statusCode: 404,
          message: 'Product attribute not found',
          error: 'Not Found',
        },
      },
    }),
    ApiResponse({
      status: 409,
      description: 'Cannot delete attribute with active products',
      schema: {
        example: {
          success: false,
          statusCode: 409,
          message: 'Cannot delete attribute used by products',
          error: 'Conflict',
        },
      },
    }),
  );
}

export function ApiUpdateAttributeValue() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update attribute value',
      description: 'Update attribute value information',
    }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'Attribute value UUID to update',
      example: '223e4567-e89b-12d3-a456-426614174000',
    }),
    ApiBody({ type: AttributeValueCreateDto }),
    ApiResponse({
      status: 200,
      description: 'Attribute value updated successfully',
      type: AttributeValueResponseDto,
      schema: {
        example: {
          success: true,
          data: {
            id: '223e4567-e89b-12d3-a456-426614174000',
            attributeId: '123e4567-e89b-12d3-a456-426614174000',
            value: 'Updated Red',
            slug: 'updated-red',
            isActive: true,
            createdAt: '2024-01-01T10:00:00.000Z',
            updatedAt: '2024-01-02T10:00:00.000Z',
          },
          message: 'Attribute value updated successfully',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Attribute value not found',
      schema: {
        example: {
          success: false,
          statusCode: 404,
          message: 'Attribute value not found',
          error: 'Not Found',
        },
      },
    }),
  );
}

export function ApiDeleteAttributeValue() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete attribute value',
      description: 'Permanently delete an attribute value',
    }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'Attribute value UUID to delete',
      example: '223e4567-e89b-12d3-a456-426614174000',
    }),
    ApiResponse({
      status: 200,
      description: 'Attribute value deleted successfully',
      schema: {
        example: {
          success: true,
          data: {
            message: 'Attribute value deleted successfully',
          },
          message: 'Attribute value deleted successfully',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Attribute value not found',
      schema: {
        example: {
          success: false,
          statusCode: 404,
          message: 'Attribute value not found',
          error: 'Not Found',
        },
      },
    }),
    ApiResponse({
      status: 409,
      description: 'Cannot delete value used by products',
      schema: {
        example: {
          success: false,
          statusCode: 409,
          message: 'Cannot delete value used by products',
          error: 'Conflict',
        },
      },
    }),
  );
}

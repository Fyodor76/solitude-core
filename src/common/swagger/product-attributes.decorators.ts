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
    }),
    ApiResponse({
      status: 409,
      description: 'Product attribute with this slug already exists',
      schema: {
        example: {
          statusCode: 409,
          message: 'Product attribute with this slug already exists',
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
    }),
    ApiResponse({
      status: 404,
      description: 'Product attribute not found',
      schema: {
        example: {
          statusCode: 404,
          message: 'Product attribute not found',
          error: 'Not Found',
        },
      },
    }),
    ApiResponse({
      status: 409,
      description: 'Attribute value with this slug already exists',
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
      type: [ProductAttributeResponseDto],
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
    }),
    ApiResponse({
      status: 404,
      description: 'Product attribute not found',
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
    }),
    ApiResponse({
      status: 404,
      description: 'Product attribute not found',
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
      type: [ProductAttributeResponseDto],
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
    }),
    ApiResponse({
      status: 200,
      description: 'Attribute values retrieved successfully',
      type: [AttributeValueResponseDto],
    }),
    ApiResponse({
      status: 404,
      description: 'Product attribute not found',
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
    }),
    ApiBody({ type: ProductAttributeCreateDto }),
    ApiResponse({
      status: 200,
      description: 'Product attribute updated successfully',
      type: ProductAttributeResponseDto,
    }),
    ApiResponse({
      status: 404,
      description: 'Product attribute not found',
    }),
    ApiResponse({
      status: 409,
      description: 'Product attribute with this slug already exists',
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
    }),
    ApiResponse({
      status: 200,
      description: 'Product attribute deleted successfully',
      schema: {
        example: {
          message: 'Product attribute deleted successfully',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Product attribute not found',
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
    }),
    ApiBody({ type: AttributeValueCreateDto }),
    ApiResponse({
      status: 200,
      description: 'Attribute value updated successfully',
      type: AttributeValueResponseDto,
    }),
    ApiResponse({
      status: 404,
      description: 'Attribute value not found',
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
    }),
    ApiResponse({
      status: 200,
      description: 'Attribute value deleted successfully',
      schema: {
        example: {
          message: 'Attribute value deleted successfully',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Attribute value not found',
    }),
  );
}

import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiConsumes,
} from '@nestjs/swagger';

export function ApiUploadFile() {
  return applyDecorators(
    ApiOperation({
      summary: 'Upload file to CDN',
      description: 'Upload a file to CDN storage and get back file ID and URL',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
            description: 'File to upload (images only: JPEG, PNG, WebP, GIF)',
          },
          folder: {
            type: 'string',
            description: 'Optional folder path for organization',
            example: 'products',
            default: '',
          },
        },
        required: ['file'],
      },
    }),
    ApiResponse({
      status: 201,
      description: 'File successfully uploaded',
      schema: {
        example: {
          fileId: '1701234567890-abc123def456',
          url: 'https://cdn.example.com/products/1701234567890-abc123def456',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Validation error',
      schema: {
        examples: {
          'File required': {
            value: {
              statusCode: 400,
              message: 'File is required',
              error: 'Bad Request',
            },
          },
          'Invalid file type': {
            value: {
              statusCode: 400,
              message: 'Invalid file type. Only images are allowed',
              error: 'Bad Request',
            },
          },
          'File too large': {
            value: {
              statusCode: 400,
              message: 'File size too large. Max 5MB allowed',
              error: 'Bad Request',
            },
          },
          'Upload failed': {
            value: {
              statusCode: 400,
              message: 'File upload failed: [error details]',
              error: 'Bad Request',
            },
          },
        },
      },
    }),
  );
}

export function ApiDeleteFile() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete file by ID',
      description: 'Permanently delete a file from CDN storage',
    }),
    ApiParam({
      name: 'fileId',
      type: String,
      description: 'File ID (without folder path)',
      example: '1701234567890-abc123def456',
    }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          folder: {
            type: 'string',
            description:
              'Folder path if file was uploaded to a specific folder',
            example: 'products',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'File successfully deleted',
      schema: {
        example: {
          message: 'File deleted successfully',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'File deletion failed',
      schema: {
        example: {
          statusCode: 400,
          message: 'File deletion failed',
          error: 'Bad Request',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description:
        'File not found (S3 may return success even if file does not exist)',
    }),
  );
}

export function ApiGetFileUrl() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get file URL by ID',
      description: 'Generate CDN URL for a file by its ID',
    }),
    ApiParam({
      name: 'fileId',
      type: String,
      description: 'File ID (without folder path)',
      example: '1701234567890-abc123def456',
    }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          folder: {
            type: 'string',
            description:
              'Folder path if file was uploaded to a specific folder',
            example: 'products',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'File URL generated successfully',
      schema: {
        example: {
          fileId: '1701234567890-abc123def456',
          url: 'https://cdn.example.com/products/1701234567890-abc123def456',
        },
      },
    }),
  );
}

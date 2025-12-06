import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import {
  CallbackFormDto,
  FormSubmissionResponseDto,
} from 'src/form-submissions/application/dto/form-submission.dto';
import {
  BaseResponseArrayDtoSwagger,
  BaseResponseDtoSwagger,
} from './swagger-common-types.dto';

export function ApiSubmitCallbackForm() {
  return applyDecorators(
    ApiOperation({
      summary: 'Submit callback request',
      description: 'Submit request for callback',
    }),
    ApiBody({ type: CallbackFormDto }),
    ApiResponse({
      status: 201,
      description: 'Callback request successfully submitted',
      type: BaseResponseDtoSwagger<FormSubmissionResponseDto>,
      schema: {
        example: {
          success: true,
          data: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'John Doe',
            phone: '+79991234567',
            comment: 'Interested in product',
            status: 'pending',
            source: 'website',
            ipAddress: '192.168.1.1',
            userAgent: 'Mozilla/5.0...',
            createdAt: '2024-01-01T10:00:00.000Z',
            updatedAt: '2024-01-01T10:00:00.000Z',
          },
          message: 'Form submitted successfully',
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
          message: ['phone must be a valid phone number'],
          error: 'Bad Request',
        },
      },
    }),
  );
}

export function ApiGetAllSubmissions() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get all form submissions',
      description: 'Retrieve all form submissions (admin only)',
    }),
    ApiResponse({
      status: 200,
      description: 'Submissions retrieved successfully',
      type: BaseResponseArrayDtoSwagger<FormSubmissionResponseDto>,
      schema: {
        example: {
          success: true,
          data: [
            {
              id: '123e4567-e89b-12d3-a456-426614174000',
              name: 'John Doe',
              phone: '+79991234567',
              comment: 'Interested in product',
              status: 'pending',
              source: 'website',
              ipAddress: '192.168.1.1',
              userAgent: 'Mozilla/5.0...',
              createdAt: '2024-01-01T10:00:00.000Z',
              updatedAt: '2024-01-01T10:00:00.000Z',
            },
            {
              id: '223e4567-e89b-12d3-a456-426614174000',
              name: 'Jane Smith',
              phone: '+79997654321',
              comment: 'Need consultation',
              status: 'processed',
              source: 'mobile_app',
              ipAddress: '192.168.1.2',
              userAgent: 'Mobile Safari',
              createdAt: '2024-01-02T10:00:00.000Z',
              updatedAt: '2024-01-02T11:00:00.000Z',
            },
          ],
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
      schema: {
        example: {
          success: false,
          statusCode: 401,
          message: 'Unauthorized',
          error: 'Unauthorized',
        },
      },
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden (not admin)',
      schema: {
        example: {
          success: false,
          statusCode: 403,
          message: 'Forbidden resource',
          error: 'Forbidden',
        },
      },
    }),
  );
}

export function ApiGetSubmissionById() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get submission by ID',
      description: 'Retrieve specific form submission by ID',
    }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'Submission UUID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiResponse({
      status: 200,
      description: 'Submission found',
      type: BaseResponseDtoSwagger<FormSubmissionResponseDto>,
      schema: {
        example: {
          success: true,
          data: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'John Doe',
            phone: '+79991234567',
            comment: 'Interested in product',
            status: 'pending',
            source: 'website',
            ipAddress: '192.168.1.1',
            userAgent: 'Mozilla/5.0...',
            createdAt: '2024-01-01T10:00:00.000Z',
            updatedAt: '2024-01-01T10:00:00.000Z',
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Submission not found',
      schema: {
        example: {
          success: false,
          statusCode: 404,
          message: 'Submission not found',
          error: 'Not Found',
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden (not admin)',
    }),
  );
}

export function ApiMarkAsProcessed() {
  return applyDecorators(
    ApiOperation({
      summary: 'Mark submission as processed',
      description: 'Update submission status to processed',
    }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'Submission UUID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiResponse({
      status: 200,
      description: 'Submission marked as processed',
      type: BaseResponseDtoSwagger<FormSubmissionResponseDto>,
      schema: {
        example: {
          success: true,
          data: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'John Doe',
            phone: '+79991234567',
            comment: 'Interested in product',
            status: 'processed',
            source: 'website',
            ipAddress: '192.168.1.1',
            userAgent: 'Mozilla/5.0...',
            createdAt: '2024-01-01T10:00:00.000Z',
            updatedAt: '2024-01-01T11:00:00.000Z',
          },
          message: 'Submission marked as processed',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Submission not found',
      schema: {
        example: {
          success: false,
          statusCode: 404,
          message: 'Submission not found',
          error: 'Not Found',
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden (not admin)',
    }),
  );
}

export function ApiGetStats() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get form submissions statistics',
      description: 'Get counts by status',
    }),
    ApiResponse({
      status: 200,
      description: 'Statistics retrieved successfully',
      type: BaseResponseDtoSwagger<{
        total: number;
        pending: number;
        processed: number;
        rejected: number;
        today: number;
      }>,
      schema: {
        example: {
          success: true,
          data: {
            total: 150,
            pending: 45,
            processed: 95,
            rejected: 10,
            today: 5,
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden (not admin)',
    }),
  );
}

import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

import {
  CallbackFormDto,
  FormSubmissionResponseDto,
} from 'src/form-submissions/application/dto/form-submission.dto';

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
      type: FormSubmissionResponseDto,
    }),
    ApiResponse({
      status: 400,
      description: 'Validation error',
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
    }),
    ApiResponse({
      status: 200,
      description: 'Submission found',
    }),
    ApiResponse({
      status: 404,
      description: 'Submission not found',
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
    }),
    ApiResponse({
      status: 200,
      description: 'Submission marked as processed',
    }),
    ApiResponse({
      status: 404,
      description: 'Submission not found',
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
    }),
  );
}

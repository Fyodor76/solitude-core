import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Req,
  HttpCode,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiSubmitCallbackForm,
  ApiGetAllSubmissions,
  ApiGetSubmissionById,
  ApiMarkAsProcessed,
  ApiGetStats,
} from 'src/common/swagger/form-submission.decorators';
import { getClientInfo } from 'src/common/utils/get-client-info';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { CallbackFormDto } from './application/dto/form-submission.dto';
import { FormSubmissionService } from './application/services/form-submission.service';

@ApiTags('forms')
@Controller('forms')
export class FormSubmissionController {
  constructor(private readonly formSubmissionService: FormSubmissionService) {}

  @Post('callback')
  @HttpCode(201)
  @ApiSubmitCallbackForm()
  async submitCallbackForm(
    @Body() dto: CallbackFormDto,
    @Req() req: Request,
  ): Promise<BaseResponseDto<any>> {
    const { ipAddress, userAgent, source } = getClientInfo(req);
    const result = await this.formSubmissionService.submitCallbackForm(
      dto,
      source,
      ipAddress,
      userAgent,
    );

    return new BaseResponseDto(
      result,
      undefined,
      'Form submitted successfully',
    );
  }

  @Get()
  @ApiGetAllSubmissions()
  async getAllSubmissions(): Promise<BaseResponseDto<any[]>> {
    const submissions = await this.formSubmissionService.getAllSubmissions();
    return new BaseResponseDto(submissions);
  }

  @Get('stats')
  @ApiGetStats()
  async getStats(): Promise<BaseResponseDto<any>> {
    const stats = await this.formSubmissionService.getStats();
    return new BaseResponseDto(stats);
  }

  @Get(':id')
  @ApiGetSubmissionById()
  async getSubmissionById(
    @Param('id') id: string,
  ): Promise<BaseResponseDto<any>> {
    const submission = await this.formSubmissionService.getSubmissionById(id);
    return new BaseResponseDto(submission);
  }

  @Put(':id/process')
  @ApiMarkAsProcessed()
  async markAsProcessed(
    @Param('id') id: string,
  ): Promise<BaseResponseDto<any>> {
    const result = await this.formSubmissionService.markAsProcessed(id);
    return new BaseResponseDto(
      result,
      undefined,
      'Submission marked as processed',
    );
  }

  @Put(':id/reject')
  async markAsRejected(@Param('id') id: string): Promise<BaseResponseDto<any>> {
    const result = await this.formSubmissionService.markAsRejected(id);
    return new BaseResponseDto(
      result,
      undefined,
      'Submission marked as rejected',
    );
  }
}

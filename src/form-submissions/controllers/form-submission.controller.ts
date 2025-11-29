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
import { FormSubmissionService } from '../application/services/form-submission.service';
import { CallbackFormDto } from '../application/dto/form-submission.dto';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiSubmitCallbackForm,
  ApiGetAllSubmissions,
  ApiGetSubmissionById,
  ApiMarkAsProcessed,
  ApiGetStats,
} from 'src/common/swagger/form-submission.decorators';
import { getClientInfo } from 'src/common/utils/get-client-info';

@ApiTags('forms')
@Controller('forms')
export class FormSubmissionController {
  constructor(private readonly formSubmissionService: FormSubmissionService) {}

  @Post('callback')
  @HttpCode(201)
  @ApiSubmitCallbackForm()
  async submitCallbackForm(@Body() dto: CallbackFormDto, @Req() req: Request) {
    const { ipAddress, userAgent, source } = getClientInfo(req);
    return await this.formSubmissionService.submitCallbackForm(
      dto,
      source,
      ipAddress,
      userAgent,
    );
  }

  @Get()
  @ApiGetAllSubmissions()
  async getAllSubmissions() {
    return await this.formSubmissionService.getAllSubmissions();
  }

  @Get('stats')
  @ApiGetStats()
  async getStats() {
    return await this.formSubmissionService.getStats();
  }

  @Get(':id')
  @ApiGetSubmissionById()
  async getSubmissionById(@Param('id') id: string) {
    return await this.formSubmissionService.getSubmissionById(id);
  }

  @Put(':id/process')
  @ApiMarkAsProcessed()
  async markAsProcessed(@Param('id') id: string) {
    return await this.formSubmissionService.markAsProcessed(id);
  }

  @Put(':id/reject')
  async markAsRejected(@Param('id') id: string) {
    return await this.formSubmissionService.markAsRejected(id);
  }
}

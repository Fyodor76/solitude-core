import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Delete,
  Param,
  BadRequestException,
  Get,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileStorageService } from './file-storage.service';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('cdn')
@Controller('cdn')
export class FileStorageController {
  constructor(private readonly fileStorageService: FileStorageService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        folder: { type: 'string', default: '' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload file to CDN' })
  async uploadFile(@UploadedFile() file: any, @Body('folder') folder?: string) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const result = await this.fileStorageService.uploadFile(file, folder);

    return {
      fileId: result.fileId,
      url: result.url,
    };
  }

  @Delete(':fileId')
  @ApiOperation({ summary: 'Delete file by ID' })
  async deleteFile(
    @Param('fileId') fileId: string,
    @Body('folder') folder?: string,
  ) {
    await this.fileStorageService.deleteFile(fileId, folder);
    return { message: 'File deleted successfully' };
  }

  @Get('url/:fileId')
  @ApiOperation({ summary: 'Get file URL by ID' })
  async getFileUrl(
    @Param('fileId') fileId: string,
    @Body('folder') folder?: string,
  ) {
    const url = this.fileStorageService.getFileUrl(fileId, folder);
    return { fileId, url };
  }
}

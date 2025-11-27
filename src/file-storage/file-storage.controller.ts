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
import { ApiTags } from '@nestjs/swagger';
import {
  ApiDeleteFile,
  ApiGetFileUrl,
  ApiUploadFile,
} from 'src/common/swagger/file-uploads.decorators';
import {
  DeleteFileResponseDto,
  FileOperationDto,
  FileUploadResponseDto,
  FileUrlResponseDto,
} from './application/dto/dto/file-operations.dto';

@ApiTags('cdn')
@Controller('cdn')
export class FileStorageController {
  constructor(private readonly fileStorageService: FileStorageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiUploadFile()
  async uploadFile(
    @UploadedFile() file: any,
    @Body() dto: FileOperationDto,
  ): Promise<FileUploadResponseDto> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const result = await this.fileStorageService.uploadFile(file, dto.folder);

    return new FileUploadResponseDto(result.fileId, result.url);
  }

  @Delete(':fileId')
  @ApiDeleteFile()
  async deleteFile(
    @Param('fileId') fileId: string,
    @Body() dto: FileOperationDto,
  ): Promise<DeleteFileResponseDto> {
    await this.fileStorageService.deleteFile(fileId, dto.folder);
    return new DeleteFileResponseDto();
  }

  @Get('url/:fileId')
  @ApiGetFileUrl()
  async getFileUrl(
    @Param('fileId') fileId: string,
    @Body() dto: FileOperationDto,
  ): Promise<FileUrlResponseDto> {
    const url = this.fileStorageService.getFileUrl(fileId, dto.folder);
    return new FileUrlResponseDto(fileId, url);
  }
}

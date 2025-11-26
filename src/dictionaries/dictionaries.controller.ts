import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { DictionaryApplication } from './application/dictionary.service';
import { DictionaryMapper } from './application/mappers/dictionary.mapper';
import { DictionaryCreateDto } from './application/dto/dictionary-create.dto';
import { DictionaryResponseDto } from './application/dto/dictionary-response.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('dictionaries')
@Controller('dictionaries')
export class DictionariesController {
  constructor(private readonly dictionaryApplication: DictionaryApplication) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create dictionary' })
  @ApiResponse({ status: 201, type: DictionaryResponseDto })
  async create(
    @Body() dto: DictionaryCreateDto,
  ): Promise<DictionaryResponseDto> {
    const dictionaryEntity = DictionaryMapper.toEntity(dto);
    const createdDictionary =
      await this.dictionaryApplication.create(dictionaryEntity);
    return DictionaryMapper.toResponse(createdDictionary);
  }

  @Get()
  @ApiOperation({ summary: 'Get all dictionaries' })
  @ApiResponse({ status: 200, type: [DictionaryResponseDto] })
  async findAll(): Promise<DictionaryResponseDto[]> {
    const dictionaries = await this.dictionaryApplication.getAll();
    return dictionaries.map((dictionary) =>
      DictionaryMapper.toResponse(dictionary),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get dictionary by id' })
  @ApiResponse({ status: 200, type: DictionaryResponseDto })
  async findById(@Param('id') id: string): Promise<DictionaryResponseDto> {
    const dictionary = await this.dictionaryApplication.getById(id);
    return DictionaryMapper.toResponse(dictionary);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get dictionary by slug' })
  @ApiResponse({ status: 200, type: DictionaryResponseDto })
  async findBySlug(
    @Param('slug') slug: string,
  ): Promise<DictionaryResponseDto> {
    const dictionary = await this.dictionaryApplication.getBySlug(slug);
    return DictionaryMapper.toResponse(dictionary);
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get dictionaries by type' })
  @ApiResponse({ status: 200, type: [DictionaryResponseDto] })
  async findByType(
    @Param('type') type: string,
  ): Promise<DictionaryResponseDto[]> {
    const dictionaries = await this.dictionaryApplication.getByType(
      type as any,
    );
    return dictionaries.map((dictionary) =>
      DictionaryMapper.toResponse(dictionary),
    );
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update dictionary' })
  @ApiResponse({ status: 200, type: DictionaryResponseDto })
  async update(
    @Param('id') id: string,
    @Body() dto: DictionaryCreateDto,
  ): Promise<DictionaryResponseDto> {
    const dictionaryEntity = DictionaryMapper.toEntity(dto, id);
    const updatedDictionary =
      await this.dictionaryApplication.update(dictionaryEntity);
    return DictionaryMapper.toResponse(updatedDictionary);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete dictionary' })
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    await this.dictionaryApplication.delete(id);
    return { message: 'Dictionary deleted successfully' };
  }
}

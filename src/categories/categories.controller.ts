import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  HttpCode,
  Delete,
  Patch,
} from '@nestjs/common';
import { CategoryApplication } from './application/category.service';
import { CategoryMapper } from './application/mappers/category.mapper';
import { CategoryCreateDto } from './application/dto/category-create.dto';
import { CategoryResponseDto } from './application/dto/category-response.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoryApplication: CategoryApplication) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create category' })
  @ApiResponse({ status: 201, type: CategoryResponseDto })
  async create(@Body() dto: CategoryCreateDto): Promise<CategoryResponseDto> {
    const categoryEntity = CategoryMapper.toEntity(dto);
    const createdCategory =
      await this.categoryApplication.create(categoryEntity);
    return CategoryMapper.toResponse(createdCategory);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, type: [CategoryResponseDto] })
  async findAll(): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryApplication.getRootCategories();
    return categories.map((category) => CategoryMapper.toResponse(category));
  }

  @Get('collections')
  @ApiOperation({ summary: 'Get all collections' })
  @ApiResponse({ status: 200, type: [CategoryResponseDto] })
  async getCollections(): Promise<CategoryResponseDto[]> {
    const collections = await this.categoryApplication.getCollections();
    return collections.map((collection) =>
      CategoryMapper.toResponse(collection),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by id' })
  @ApiResponse({ status: 200, type: CategoryResponseDto })
  async findById(@Param('id') id: string): Promise<CategoryResponseDto> {
    const category = await this.categoryApplication.getById(id);
    return CategoryMapper.toResponse(category);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get category by slug' })
  @ApiResponse({ status: 200, type: CategoryResponseDto })
  async findBySlug(@Param('slug') slug: string): Promise<CategoryResponseDto> {
    const category = await this.categoryApplication.getBySlug(slug);
    return CategoryMapper.toResponse(category);
  }

  @Get(':id/children')
  @ApiOperation({ summary: 'Get child categories' })
  @ApiResponse({ status: 200, type: [CategoryResponseDto] })
  async getChildren(@Param('id') id: string): Promise<CategoryResponseDto[]> {
    const children = await this.categoryApplication.getChildCategories(id);
    return children.map((child) => CategoryMapper.toResponse(child));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete category' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 409, description: 'Category has child categories' })
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    await this.categoryApplication.delete(id);
    return { message: 'Category deleted successfully' };
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Soft delete category (deactivate)' })
  @ApiResponse({ status: 200, type: CategoryResponseDto })
  async deactivate(@Param('id') id: string): Promise<CategoryResponseDto> {
    const deactivatedCategory = await this.categoryApplication.softDelete(id);
    return CategoryMapper.toResponse(deactivatedCategory);
  }
}

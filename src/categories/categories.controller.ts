import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  HttpCode,
  Delete,
  Patch,
  Put,
} from '@nestjs/common';
import { CategoryApplication } from './application/category.service';
import { CategoryMapper } from './application/mappers/category.mapper';
import { CategoryCreateDto } from './application/dto/category-create.dto';
import { CategoryResponseDto } from './application/dto/category-response.dto';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiCreateCategory,
  ApiGetAllCategories,
  ApiGetCollections,
  ApiGetCategoryById,
  ApiGetCategoryBySlug,
  ApiGetChildCategories,
  ApiDeleteCategory,
  ApiDeactivateCategory,
  ApiUpdateCategory,
} from 'src/common/swagger/categories.decorators';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoryApplication: CategoryApplication) {}

  @Post()
  @HttpCode(201)
  @ApiCreateCategory()
  async create(@Body() dto: CategoryCreateDto): Promise<CategoryResponseDto> {
    const categoryEntity = CategoryMapper.toEntity(dto);
    const createdCategory =
      await this.categoryApplication.create(categoryEntity);
    return CategoryMapper.toResponse(createdCategory);
  }

  @Get()
  @ApiGetAllCategories()
  async findAll(): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryApplication.getRootCategories();
    return categories.map((category) => CategoryMapper.toResponse(category));
  }

  @Get('collections')
  @ApiGetCollections()
  async getCollections(): Promise<CategoryResponseDto[]> {
    const collections = await this.categoryApplication.getCollections();
    return collections.map((collection) =>
      CategoryMapper.toResponse(collection),
    );
  }

  @Get(':id')
  @ApiGetCategoryById()
  async findById(@Param('id') id: string): Promise<CategoryResponseDto> {
    const category = await this.categoryApplication.getById(id);
    return CategoryMapper.toResponse(category);
  }

  @Get('slug/:slug')
  @ApiGetCategoryBySlug()
  async findBySlug(@Param('slug') slug: string): Promise<CategoryResponseDto> {
    const category = await this.categoryApplication.getBySlug(slug);
    return CategoryMapper.toResponse(category);
  }

  @Get(':id/children')
  @ApiGetChildCategories()
  async getChildren(@Param('id') id: string): Promise<CategoryResponseDto[]> {
    const children = await this.categoryApplication.getChildCategories(id);
    return children.map((child) => CategoryMapper.toResponse(child));
  }

  @Put(':id')
  @ApiUpdateCategory()
  async update(
    @Param('id') id: string,
    @Body() dto: CategoryCreateDto,
  ): Promise<CategoryResponseDto> {
    const categoryEntity = CategoryMapper.toEntity(dto, id);
    const updatedCategory =
      await this.categoryApplication.update(categoryEntity);
    return CategoryMapper.toResponse(updatedCategory);
  }

  @Delete(':id')
  @ApiDeleteCategory()
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    await this.categoryApplication.delete(id);
    return { message: 'Category deleted successfully' };
  }

  @Patch(':id/deactivate')
  @ApiDeactivateCategory()
  async deactivate(@Param('id') id: string): Promise<CategoryResponseDto> {
    const deactivatedCategory = await this.categoryApplication.softDelete(id);
    return CategoryMapper.toResponse(deactivatedCategory);
  }
}

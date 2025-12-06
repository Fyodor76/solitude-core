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
import { BaseResponseDto } from 'src/common/dto/base-response.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoryApplication: CategoryApplication) {}

  @Post()
  @HttpCode(201)
  @ApiCreateCategory()
  async create(
    @Body() dto: CategoryCreateDto,
  ): Promise<BaseResponseDto<CategoryResponseDto>> {
    const categoryEntity = CategoryMapper.toEntity(dto);
    const createdCategory =
      await this.categoryApplication.create(categoryEntity);
    return new BaseResponseDto(
      CategoryMapper.toResponse(createdCategory),
      undefined,
      'Category created successfully',
    );
  }

  @Get()
  @ApiGetAllCategories()
  async findAll(): Promise<BaseResponseDto<CategoryResponseDto[]>> {
    const categories = await this.categoryApplication.getRootCategories();
    return new BaseResponseDto(
      categories.map((category) => CategoryMapper.toResponse(category)),
    );
  }

  @Get('collections')
  @ApiGetCollections()
  async getCollections(): Promise<BaseResponseDto<CategoryResponseDto[]>> {
    const collections = await this.categoryApplication.getCollections();
    return new BaseResponseDto(
      collections.map((collection) => CategoryMapper.toResponse(collection)),
    );
  }

  @Get(':id')
  @ApiGetCategoryById()
  async findById(
    @Param('id') id: string,
  ): Promise<BaseResponseDto<CategoryResponseDto>> {
    const category = await this.categoryApplication.getById(id);
    return new BaseResponseDto(CategoryMapper.toResponse(category));
  }

  @Get('slug/:slug')
  @ApiGetCategoryBySlug()
  async findBySlug(
    @Param('slug') slug: string,
  ): Promise<BaseResponseDto<CategoryResponseDto>> {
    const category = await this.categoryApplication.getBySlug(slug);
    return new BaseResponseDto(CategoryMapper.toResponse(category));
  }

  @Get(':id/children')
  @ApiGetChildCategories()
  async getChildren(
    @Param('id') id: string,
  ): Promise<BaseResponseDto<CategoryResponseDto[]>> {
    const children = await this.categoryApplication.getChildCategories(id);
    return new BaseResponseDto(
      children.map((child) => CategoryMapper.toResponse(child)),
    );
  }

  @Put(':id')
  @ApiUpdateCategory()
  async update(
    @Param('id') id: string,
    @Body() dto: CategoryCreateDto,
  ): Promise<BaseResponseDto<CategoryResponseDto>> {
    const categoryEntity = CategoryMapper.toEntity(dto, id);
    const updatedCategory =
      await this.categoryApplication.update(categoryEntity);
    return new BaseResponseDto(
      CategoryMapper.toResponse(updatedCategory),
      undefined,
      'Category updated successfully',
    );
  }

  @Delete(':id')
  @ApiDeleteCategory()
  async delete(
    @Param('id') id: string,
  ): Promise<BaseResponseDto<{ message: string }>> {
    await this.categoryApplication.delete(id);
    return new BaseResponseDto(
      { message: 'Category deleted successfully' },
      undefined,
      'Category deleted successfully',
    );
  }

  @Patch(':id/deactivate')
  @ApiDeactivateCategory()
  async deactivate(
    @Param('id') id: string,
  ): Promise<BaseResponseDto<CategoryResponseDto>> {
    const deactivatedCategory = await this.categoryApplication.softDelete(id);
    return new BaseResponseDto(
      CategoryMapper.toResponse(deactivatedCategory),
      undefined,
      'Category deactivated successfully',
    );
  }
}

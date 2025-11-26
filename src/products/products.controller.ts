import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  HttpCode,
  Query,
} from '@nestjs/common';
import { ProductApplication } from './application/product.service';
import { ProductMapper } from './application/mappers/product.mapper';
import {
  ProductCreateDto,
  ProductVariationCreateDto,
} from './application/dto/product-create.dto';
import { ProductResponseDto } from './application/dto/product-response.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductFiltersDto } from './application/dto/product-filters.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productApplication: ProductApplication) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create product' })
  @ApiResponse({ status: 201, type: ProductResponseDto })
  async create(@Body() dto: ProductCreateDto): Promise<ProductResponseDto> {
    const productEntity = ProductMapper.toEntity(dto);
    const createdProduct = await this.productApplication.create(productEntity);
    return ProductMapper.toResponse(createdProduct);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, type: [ProductResponseDto] })
  async findAll(
    @Query() filters: ProductFiltersDto,
  ): Promise<ProductResponseDto[]> {
    const products = await this.productApplication.getAll(filters);
    return products.map((product) => ProductMapper.toResponse(product));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by id' })
  @ApiResponse({ status: 200, type: ProductResponseDto })
  async findById(@Param('id') id: string): Promise<ProductResponseDto> {
    const product = await this.productApplication.getById(id);
    return ProductMapper.toResponse(product);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get product by slug' })
  @ApiResponse({ status: 200, type: ProductResponseDto })
  async findBySlug(@Param('slug') slug: string): Promise<ProductResponseDto> {
    const product = await this.productApplication.getBySlug(slug);
    return ProductMapper.toResponse(product);
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Get products by category' })
  @ApiResponse({ status: 200, type: [ProductResponseDto] })
  async findByCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<ProductResponseDto[]> {
    const products = await this.productApplication.getByCategory(categoryId);
    return products.map((product) => ProductMapper.toResponse(product));
  }

  @Get('brand/:brand')
  @ApiOperation({ summary: 'Get products by brand' })
  @ApiResponse({ status: 200, type: [ProductResponseDto] })
  async findByBrand(
    @Param('brand') brand: string,
  ): Promise<ProductResponseDto[]> {
    const products = await this.productApplication.getByBrand(brand);
    return products.map((product) => ProductMapper.toResponse(product));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update product' })
  @ApiResponse({ status: 200, type: ProductResponseDto })
  async update(
    @Param('id') id: string,
    @Body() dto: ProductCreateDto,
  ): Promise<ProductResponseDto> {
    const productEntity = ProductMapper.toEntity(dto, id);
    const updatedProduct = await this.productApplication.update(productEntity);
    return ProductMapper.toResponse(updatedProduct);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product' })
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    await this.productApplication.delete(id);
    return { message: 'Product deleted successfully' };
  }

  @Post(':id/variations')
  @ApiOperation({ summary: 'Add variation to product' })
  @ApiResponse({ status: 201, type: ProductResponseDto })
  async addVariation(
    @Param('id') productId: string,
    @Body() dto: ProductVariationCreateDto,
  ): Promise<ProductResponseDto> {
    const variationEntity = ProductMapper.toVariationEntity(dto, productId);
    const updatedProduct = await this.productApplication.createVariation(
      productId,
      variationEntity,
    );
    return ProductMapper.toResponse(updatedProduct);
  }

  @Put(':productId/variations/:variationId')
  @ApiOperation({ summary: 'Update product variation' })
  @ApiResponse({ status: 200, type: ProductResponseDto })
  async updateVariation(
    @Param('productId') productId: string,
    @Param('variationId') variationId: string,
    @Body() dto: ProductVariationCreateDto,
  ): Promise<ProductResponseDto> {
    const variationEntity = ProductMapper.toVariationEntity(
      dto,
      productId,
      variationId,
    );
    const updatedProduct = await this.productApplication.updateVariation(
      productId,
      variationEntity,
    );
    return ProductMapper.toResponse(updatedProduct);
  }

  @Delete(':productId/variations/:variationId')
  @ApiOperation({ summary: 'Delete product variation' })
  @ApiResponse({ status: 200, type: ProductResponseDto })
  async deleteVariation(
    @Param('productId') productId: string,
    @Param('variationId') variationId: string,
  ): Promise<ProductResponseDto> {
    const updatedProduct = await this.productApplication.deleteVariation(
      productId,
      variationId,
    );
    return ProductMapper.toResponse(updatedProduct);
  }
}

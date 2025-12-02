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
import { ProductApplication } from './application/product.service';
import { ProductMapper } from './application/mappers/product.mapper';
import {
  ProductCreateDto,
  ProductVariationCreateDto,
} from './application/dto/product-create.dto';
import { ProductResponseDto } from './application/dto/product-response.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductFiltersDto } from './application/dto/product-filters.dto';

import {
  ApiCreateProduct,
  ApiGetProductById,
  ApiGetProductBySlug,
  ApiGetProductsByCategory,
  ApiGetProductsByBrand,
  ApiUpdateProduct,
  ApiDeleteProduct,
  ApiAddProductVariation,
  ApiUpdateProductVariation,
  ApiDeleteProductVariation,
} from 'src/common/swagger/products.decorators';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productApplication: ProductApplication) {}

  @Post()
  @HttpCode(201)
  @ApiCreateProduct()
  async create(@Body() dto: ProductCreateDto): Promise<ProductResponseDto> {
    const productEntity = ProductMapper.toEntity(dto);
    const createdProduct = await this.productApplication.create(productEntity);
    return ProductMapper.toResponse(createdProduct);
  }

  @Post('search')
  @ApiOperation({ summary: 'Поиск товаров с фильтрами' })
  async searchProducts(
    @Body() filters: ProductFiltersDto,
  ): Promise<ProductResponseDto[]> {
    const products = await this.productApplication.getAll(filters);
    return products.map((product) => ProductMapper.toResponse(product));
  }

  @Get(':id')
  @ApiGetProductById()
  async findById(@Param('id') id: string): Promise<ProductResponseDto> {
    const product = await this.productApplication.getById(id);
    return ProductMapper.toResponse(product);
  }

  @Get('slug/:slug')
  @ApiGetProductBySlug()
  async findBySlug(@Param('slug') slug: string): Promise<ProductResponseDto> {
    const product = await this.productApplication.getBySlug(slug);
    return ProductMapper.toResponse(product);
  }

  @Get('category/:categoryId')
  @ApiGetProductsByCategory()
  async findByCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<ProductResponseDto[]> {
    const products = await this.productApplication.getByCategory(categoryId);
    return products.map((product) => ProductMapper.toResponse(product));
  }

  @Get('brand/:brand')
  @ApiGetProductsByBrand()
  async findByBrand(
    @Param('brand') brand: string,
  ): Promise<ProductResponseDto[]> {
    const products = await this.productApplication.getByBrand(brand);
    return products.map((product) => ProductMapper.toResponse(product));
  }

  @Put(':id')
  @ApiUpdateProduct()
  async update(
    @Param('id') id: string,
    @Body() dto: ProductCreateDto,
  ): Promise<ProductResponseDto> {
    const productEntity = ProductMapper.toEntity(dto, id);
    const updatedProduct = await this.productApplication.update(productEntity);
    return ProductMapper.toResponse(updatedProduct);
  }

  @Delete(':id')
  @ApiDeleteProduct()
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    await this.productApplication.delete(id);
    return { message: 'Product deleted successfully' };
  }

  @Post(':id/variations')
  @HttpCode(201)
  @ApiAddProductVariation()
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
  @ApiUpdateProductVariation()
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
  @ApiDeleteProductVariation()
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

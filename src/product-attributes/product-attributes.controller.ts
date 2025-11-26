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
import { ProductAttributeApplication } from './application/product-attribute.service';
import { ProductAttributeMapper } from './application/mappers/product-attribute.mapper';
import {
  ProductAttributeCreateDto,
  AttributeValueCreateDto,
} from './application/dto/attribute-create.dto';
import { ProductAttributeResponseDto } from './application/dto/attribute-response.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('product-attributes')
@Controller('product-attributes')
export class ProductAttributesController {
  constructor(
    private readonly attributeApplication: ProductAttributeApplication,
  ) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create product attribute' })
  @ApiResponse({ status: 201, type: ProductAttributeResponseDto })
  async createAttribute(
    @Body() dto: ProductAttributeCreateDto,
  ): Promise<ProductAttributeResponseDto> {
    const attributeEntity = ProductAttributeMapper.toAttributeEntity(dto);
    const createdAttribute =
      await this.attributeApplication.createAttribute(attributeEntity);
    return ProductAttributeMapper.toAttributeResponse(createdAttribute);
  }

  @Post(':attributeId/values')
  @HttpCode(201)
  @ApiOperation({ summary: 'Create attribute value' })
  async createValue(
    @Param('attributeId') attributeId: string,
    @Body() dto: AttributeValueCreateDto,
  ) {
    const valueEntity = ProductAttributeMapper.toValueEntity(dto, attributeId);
    const createdValue =
      await this.attributeApplication.createValue(valueEntity);
    return createdValue;
  }

  @Get()
  @ApiOperation({ summary: 'Get all product attributes' })
  @ApiResponse({ status: 200, type: [ProductAttributeResponseDto] })
  async findAll(): Promise<ProductAttributeResponseDto[]> {
    const attributes = await this.attributeApplication.getAllAttributes();
    return attributes.map((attribute) =>
      ProductAttributeMapper.toAttributeResponse(attribute),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product attribute by id' })
  @ApiResponse({ status: 200, type: ProductAttributeResponseDto })
  async findById(
    @Param('id') id: string,
  ): Promise<ProductAttributeResponseDto> {
    const attribute = await this.attributeApplication.getAttributeById(id);
    return ProductAttributeMapper.toAttributeResponse(attribute);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get product attribute by slug' })
  @ApiResponse({ status: 200, type: ProductAttributeResponseDto })
  async findBySlug(
    @Param('slug') slug: string,
  ): Promise<ProductAttributeResponseDto> {
    const attribute = await this.attributeApplication.getAttributeBySlug(slug);
    return ProductAttributeMapper.toAttributeResponse(attribute);
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get product attributes by type' })
  @ApiResponse({ status: 200, type: [ProductAttributeResponseDto] })
  async findByType(
    @Param('type') type: string,
  ): Promise<ProductAttributeResponseDto[]> {
    const attributes = await this.attributeApplication.getAttributesByType(
      type as any,
    );
    return attributes.map((attribute) =>
      ProductAttributeMapper.toAttributeResponse(attribute),
    );
  }

  @Get(':attributeId/values')
  @ApiOperation({ summary: 'Get attribute values' })
  async getValues(@Param('attributeId') attributeId: string) {
    const values =
      await this.attributeApplication.getValuesByAttributeId(attributeId);
    return values;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update product attribute' })
  @ApiResponse({ status: 200, type: ProductAttributeResponseDto })
  async updateAttribute(
    @Param('id') id: string,
    @Body() dto: ProductAttributeCreateDto,
  ): Promise<ProductAttributeResponseDto> {
    const attributeEntity = ProductAttributeMapper.toAttributeEntity(dto, id);
    const updatedAttribute =
      await this.attributeApplication.updateAttribute(attributeEntity);
    return ProductAttributeMapper.toAttributeResponse(updatedAttribute);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product attribute' })
  async deleteAttribute(@Param('id') id: string): Promise<{ message: string }> {
    await this.attributeApplication.deleteAttribute(id);
    return { message: 'Product attribute deleted successfully' };
  }
}

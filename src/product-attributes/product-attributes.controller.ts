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
import { ApiTags } from '@nestjs/swagger';
import {
  ApiCreateProductAttribute,
  ApiCreateAttributeValue,
  ApiGetAllProductAttributes,
  ApiGetProductAttributeById,
  ApiGetProductAttributeBySlug,
  ApiGetProductAttributesByType,
  ApiGetAttributeValues,
  ApiUpdateProductAttribute,
  ApiDeleteProductAttribute,
} from 'src/common/swagger/product-attributes.decorators';

@ApiTags('product-attributes')
@Controller('product-attributes')
export class ProductAttributesController {
  constructor(
    private readonly attributeApplication: ProductAttributeApplication,
  ) {}

  @Post()
  @HttpCode(201)
  @ApiCreateProductAttribute()
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
  @ApiCreateAttributeValue()
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
  @ApiGetAllProductAttributes()
  async findAll(): Promise<ProductAttributeResponseDto[]> {
    const attributes = await this.attributeApplication.getAllAttributes();
    return attributes.map((attribute) =>
      ProductAttributeMapper.toAttributeResponse(attribute),
    );
  }

  @Get(':id')
  @ApiGetProductAttributeById()
  async findById(
    @Param('id') id: string,
  ): Promise<ProductAttributeResponseDto> {
    const attribute = await this.attributeApplication.getAttributeById(id);
    return ProductAttributeMapper.toAttributeResponse(attribute);
  }

  @Get('slug/:slug')
  @ApiGetProductAttributeBySlug()
  async findBySlug(
    @Param('slug') slug: string,
  ): Promise<ProductAttributeResponseDto> {
    const attribute = await this.attributeApplication.getAttributeBySlug(slug);
    return ProductAttributeMapper.toAttributeResponse(attribute);
  }

  @Get('type/:type')
  @ApiGetProductAttributesByType()
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
  @ApiGetAttributeValues()
  async getValues(@Param('attributeId') attributeId: string) {
    const values =
      await this.attributeApplication.getValuesByAttributeId(attributeId);
    return values;
  }

  @Put(':id')
  @ApiUpdateProductAttribute()
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
  @ApiDeleteProductAttribute()
  async deleteAttribute(@Param('id') id: string): Promise<{ message: string }> {
    await this.attributeApplication.deleteAttribute(id);
    return { message: 'Product attribute deleted successfully' };
  }
}

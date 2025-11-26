# Скрипт для создания модуля Products
$productsPath = ".\products"

# Создаем структуру папок
$folders = @(
    "$productsPath",
    "$productsPath\application",
    "$productsPath\application\dto", 
    "$productsPath\application\mappers",
    "$productsPath\domain",
    "$productsPath\domain\entities",
    "$productsPath\domain\repository",
    "$productsPath\infrastructure", 
    "$productsPath\infrastructure\orm",
    "$productsPath\infrastructure\repositories"
)

foreach ($folder in $folders) {
    New-Item -ItemType Directory -Force -Path $folder
    Write-Host "Created folder: $folder"
}

# 1. Domain Entity - Product
$productEntityContent = @'
export class ProductEntity {
  constructor(
    public id: string,
    public name: string,
    public slug: string,
    public description: string,
    public price: number,
    public comparePrice?: number,
    public categoryId: string,
    public brand: string,
    public material: string,
    public sku: string,
    public isActive: boolean = true,
    public isFeatured: boolean = false,
    public inStock: boolean = true,
    public images: string[] = [],
    public attributes: ProductAttribute[] = [],
    public variations: ProductVariation[] = [],
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}

  addVariation(variation: ProductVariation): void {
    this.variations.push(variation);
    this.updatedAt = new Date();
  }

  toggleActive(): void {
    this.isActive = !this.isActive;
    this.updatedAt = new Date();
  }

  updatePrice(newPrice: number): void {
    this.price = newPrice;
    this.updatedAt = new Date();
  }

  hasVariations(): boolean {
    return this.variations.length > 0;
  }
}

export class ProductAttribute {
  constructor(
    public attributeId: string,
    public values: string[], // slugs of attribute values
  ) {}
}

export class ProductVariation {
  constructor(
    public id: string,
    public sku: string,
    public price: number,
    public comparePrice?: number,
    public stock: number = 0,
    public images: string[] = [],
    public attributes: VariationAttribute[] = [],
    public isActive: boolean = true,
  ) {}

  updateStock(newStock: number): void {
    this.stock = newStock;
  }

  isInStock(): boolean {
    return this.stock > 0;
  }
}

export class VariationAttribute {
  constructor(
    public attributeId: string,
    public valueSlug: string,
  ) {}
}
'@

# 2. Domain Repository
$productRepositoryContent = @'
import { ProductEntity } from '../entities/product.entity';

export interface ProductRepository {
  create(product: ProductEntity): Promise<ProductEntity>;
  findById(id: string): Promise<ProductEntity>;
  findBySlug(slug: string): Promise<ProductEntity>;
  findByCategory(categoryId: string): Promise<ProductEntity[]>;
  findByBrand(brand: string): Promise<ProductEntity[]>;
  findAll(filters?: ProductFilters): Promise<ProductEntity[]>;
  update(product: ProductEntity): Promise<ProductEntity>;
  delete(id: string): Promise<void>;
  
  // Variation operations
  createVariation(productId: string, variation: ProductVariation): Promise<ProductEntity>;
  updateVariation(productId: string, variation: ProductVariation): Promise<ProductEntity>;
  deleteVariation(productId: string, variationId: string): Promise<ProductEntity>;
}

export interface ProductFilters {
  isActive?: boolean;
  categoryId?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isFeatured?: boolean;
}
'@

# 3. Infrastructure ORM Entities
$productModelContent = @'
import { Table, Column, Model, DataType, HasMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { CategoryModel } from '../../../categories/infrastructure/orm/category.entity';
import { ProductVariationModel } from './product-variation.entity';

@Table({ tableName: 'products' })
export class ProductModel extends Model<ProductModel> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  slug: string;

  @Column({ type: DataType.TEXT })
  description: string;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  price: number;

  @Column({ type: DataType.DECIMAL(10, 2) })
  comparePrice: number;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ForeignKey(() => CategoryModel)
  categoryId: string;

  @Column({ type: DataType.STRING })
  brand: string;

  @Column({ type: DataType.STRING })
  material: string;

  @Column({ type: DataType.STRING, unique: true })
  sku: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isActive: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isFeatured: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  inStock: boolean;

  @Column({ type: DataType.JSON, defaultValue: [] })
  images: string[];

  @Column({ type: DataType.JSON, defaultValue: [] })
  attributes: any[];

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  createdAt: Date;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  updatedAt: Date;

  // Relations
  @BelongsTo(() => CategoryModel)
  category: CategoryModel;

  @HasMany(() => ProductVariationModel)
  variations: ProductVariationModel[];
}
'@

$productVariationModelContent = @'
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { ProductModel } from './product.entity';

@Table({ tableName: 'product_variations' })
export class ProductVariationModel extends Model<ProductVariationModel> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ForeignKey(() => ProductModel)
  productId: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  sku: string;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  price: number;

  @Column({ type: DataType.DECIMAL(10, 2) })
  comparePrice: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  stock: number;

  @Column({ type: DataType.JSON, defaultValue: [] })
  images: string[];

  @Column({ type: DataType.JSON, defaultValue: [] })
  attributes: any[];

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isActive: boolean;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  createdAt: Date;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  updatedAt: Date;

  // Relations
  @BelongsTo(() => ProductModel)
  product: ProductModel;
}
'@

# 4. Infrastructure Repository
$sequelizeProductRepoContent = @'
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductRepository, ProductFilters } from '../../domain/repository/product.repository';
import { ProductEntity, ProductVariation } from '../../domain/entities/product.entity';
import { ProductModel } from '../orm/product.entity';
import { ProductVariationModel } from '../orm/product-variation.entity';
import { Op } from 'sequelize';

@Injectable()
export class SequelizeProductRepository implements ProductRepository {
  constructor(
    @InjectModel(ProductModel)
    private readonly productModel: typeof ProductModel,
    @InjectModel(ProductVariationModel)
    private readonly variationModel: typeof ProductVariationModel,
  ) {}

  async create(product: ProductEntity): Promise<ProductEntity> {
    const created = await this.productModel.create({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      comparePrice: product.comparePrice,
      categoryId: product.categoryId,
      brand: product.brand,
      material: product.material,
      sku: product.sku,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      inStock: product.inStock,
      images: product.images,
      attributes: product.attributes,
    });

    // Create variations if any
    if (product.variations.length > 0) {
      await this.variationModel.bulkCreate(
        product.variations.map(variation => ({
          id: variation.id,
          productId: created.id,
          sku: variation.sku,
          price: variation.price,
          comparePrice: variation.comparePrice,
          stock: variation.stock,
          images: variation.images,
          attributes: variation.attributes,
          isActive: variation.isActive,
        }))
      );
    }

    return this.buildProductEntity(created);
  }

  async findById(id: string): Promise<ProductEntity> {
    const found = await this.productModel.findByPk(id, {
      include: [ProductVariationModel],
    });
    if (!found) return null;
    return this.buildProductEntity(found);
  }

  async findBySlug(slug: string): Promise<ProductEntity> {
    const found = await this.productModel.findOne({ 
      where: { slug },
      include: [ProductVariationModel],
    });
    if (!found) return null;
    return this.buildProductEntity(found);
  }

  async findByCategory(categoryId: string): Promise<ProductEntity[]> {
    const products = await this.productModel.findAll({
      where: { categoryId },
      include: [ProductVariationModel],
      order: [['createdAt', 'DESC']],
    });

    return products.map(product => this.buildProductEntity(product));
  }

  async findByBrand(brand: string): Promise<ProductEntity[]> {
    const products = await this.productModel.findAll({
      where: { brand },
      include: [ProductVariationModel],
      order: [['createdAt', 'DESC']],
    });

    return products.map(product => this.buildProductEntity(product));
  }

  async findAll(filters?: ProductFilters): Promise<ProductEntity[]> {
    const where: any = {};
    
    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }
    
    if (filters?.categoryId) {
      where.categoryId = filters.categoryId;
    }
    
    if (filters?.brand) {
      where.brand = filters.brand;
    }
    
    if (filters?.inStock !== undefined) {
      where.inStock = filters.inStock;
    }
    
    if (filters?.isFeatured !== undefined) {
      where.isFeatured = filters.isFeatured;
    }
    
    if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) {
        where.price[Op.gte] = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.price[Op.lte] = filters.maxPrice;
      }
    }

    const products = await this.productModel.findAll({
      where,
      include: [ProductVariationModel],
      order: [['createdAt', 'DESC']],
    });

    return products.map(product => this.buildProductEntity(product));
  }

  async update(product: ProductEntity): Promise<ProductEntity> {
    const [affectedCount] = await this.productModel.update(
      {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        comparePrice: product.comparePrice,
        categoryId: product.categoryId,
        brand: product.brand,
        material: product.material,
        sku: product.sku,
        isActive: product.isActive,
        isFeatured: product.isFeatured,
        inStock: product.inStock,
        images: product.images,
        attributes: product.attributes,
        updatedAt: new Date(),
      },
      { where: { id: product.id } }
    );

    if (affectedCount === 0) {
      return null;
    }

    const updated = await this.productModel.findByPk(product.id, {
      include: [ProductVariationModel],
    });
    return this.buildProductEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.productModel.destroy({ where: { id } });
  }

  async createVariation(productId: string, variation: ProductVariation): Promise<ProductEntity> {
    await this.variationModel.create({
      id: variation.id,
      productId,
      sku: variation.sku,
      price: variation.price,
      comparePrice: variation.comparePrice,
      stock: variation.stock,
      images: variation.images,
      attributes: variation.attributes,
      isActive: variation.isActive,
    });

    const product = await this.productModel.findByPk(productId, {
      include: [ProductVariationModel],
    });
    return this.buildProductEntity(product);
  }

  async updateVariation(productId: string, variation: ProductVariation): Promise<ProductEntity> {
    const [affectedCount] = await this.variationModel.update(
      {
        sku: variation.sku,
        price: variation.price,
        comparePrice: variation.comparePrice,
        stock: variation.stock,
        images: variation.images,
        attributes: variation.attributes,
        isActive: variation.isActive,
        updatedAt: new Date(),
      },
      { where: { id: variation.id, productId } }
    );

    if (affectedCount === 0) {
      return null;
    }

    const product = await this.productModel.findByPk(productId, {
      include: [ProductVariationModel],
    });
    return this.buildProductEntity(product);
  }

  async deleteVariation(productId: string, variationId: string): Promise<ProductEntity> {
    await this.variationModel.destroy({ 
      where: { id: variationId, productId } 
    });

    const product = await this.productModel.findByPk(productId, {
      include: [ProductVariationModel],
    });
    return this.buildProductEntity(product);
  }

  private buildProductEntity(model: ProductModel): ProductEntity {
    const variations = model.variations ? model.variations.map(v => this.buildVariationEntity(v)) : [];
    
    return new ProductEntity(
      model.id,
      model.name,
      model.slug,
      model.description,
      parseFloat(model.price as any),
      model.comparePrice ? parseFloat(model.comparePrice as any) : undefined,
      model.categoryId,
      model.brand,
      model.material,
      model.sku,
      model.isActive,
      model.isFeatured,
      model.inStock,
      model.images || [],
      model.attributes || [],
      variations,
      model.createdAt,
      model.updatedAt,
    );
  }

  private buildVariationEntity(model: ProductVariationModel): ProductVariation {
    return new ProductVariation(
      model.id,
      model.sku,
      parseFloat(model.price as any),
      model.comparePrice ? parseFloat(model.comparePrice as any) : undefined,
      model.stock,
      model.images || [],
      model.attributes || [],
      model.isActive,
    );
  }
}
'@

# 5. Application DTOs
$productCreateDtoContent = @'
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsArray, ValidateNested, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ProductAttributeDto {
  @ApiProperty({ example: "attr-color-123" })
  @IsString()
  @IsNotEmpty()
  attributeId: string;

  @ApiProperty({ example: ["red", "blue"] })
  @IsArray()
  @IsString({ each: true })
  values: string[];
}

export class VariationAttributeDto {
  @ApiProperty({ example: "attr-color-123" })
  @IsString()
  @IsNotEmpty()
  attributeId: string;

  @ApiProperty({ example: "red" })
  @IsString()
  @IsNotEmpty()
  valueSlug: string;
}

export class ProductVariationCreateDto {
  @ApiProperty({ example: "NIKE-TS-RED-S" })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ example: 2990 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 3490 })
  @IsNumber()
  @IsOptional()
  comparePrice?: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsOptional()
  stock: number;

  @ApiProperty({ example: ["https://example.com/red-tshirt.jpg"] })
  @IsArray()
  @IsUrl({}, { each: true })
  @IsOptional()
  images: string[];

  @ApiProperty({ type: [VariationAttributeDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariationAttributeDto)
  attributes: VariationAttributeDto[];
}

export class ProductCreateDto {
  @ApiProperty({ example: "Футболка Nike Sport" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "nike-t-shirt-sport" })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: "Спортивная футболка Nike" })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ example: 2990 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 3490 })
  @IsNumber()
  @IsOptional()
  comparePrice?: number;

  @ApiProperty({ example: "cat-tshirts-123" })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ example: "nike" })
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiProperty({ example: "cotton-100" })
  @IsString()
  @IsNotEmpty()
  material: string;

  @ApiProperty({ example: "NIKE-TS-BASE" })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  isFeatured: boolean;

  @ApiProperty({ example: ["https://example.com/tshirt.jpg"] })
  @IsArray()
  @IsUrl({}, { each: true })
  @IsOptional()
  images: string[];

  @ApiProperty({ type: [ProductAttributeDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductAttributeDto)
  @IsOptional()
  attributes: ProductAttributeDto[];

  @ApiProperty({ type: [ProductVariationCreateDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariationCreateDto)
  @IsOptional()
  variations: ProductVariationCreateDto[];
}
'@

$productResponseDtoContent = @'
import { ApiProperty } from '@nestjs/swagger';

export class VariationAttributeResponseDto {
  @ApiProperty()
  attributeId: string;

  @ApiProperty()
  valueSlug: string;

  constructor(attribute: { attributeId: string; valueSlug: string }) {
    this.attributeId = attribute.attributeId;
    this.valueSlug = attribute.valueSlug;
  }
}

export class ProductVariationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  sku: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  comparePrice?: number;

  @ApiProperty()
  stock: number;

  @ApiProperty()
  images: string[];

  @ApiProperty({ type: [VariationAttributeResponseDto] })
  attributes: VariationAttributeResponseDto[];

  @ApiProperty()
  isActive: boolean;

  constructor(variation: {
    id: string;
    sku: string;
    price: number;
    comparePrice?: number;
    stock: number;
    images: string[];
    attributes: VariationAttributeResponseDto[];
    isActive: boolean;
  }) {
    this.id = variation.id;
    this.sku = variation.sku;
    this.price = variation.price;
    this.comparePrice = variation.comparePrice;
    this.stock = variation.stock;
    this.images = variation.images;
    this.attributes = variation.attributes;
    this.isActive = variation.isActive;
  }
}

export class ProductAttributeResponseDto {
  @ApiProperty()
  attributeId: string;

  @ApiProperty()
  values: string[];

  constructor(attribute: { attributeId: string; values: string[] }) {
    this.attributeId = attribute.attributeId;
    this.values = attribute.values;
  }
}

export class ProductResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  comparePrice?: number;

  @ApiProperty()
  categoryId: string;

  @ApiProperty()
  brand: string;

  @ApiProperty()
  material: string;

  @ApiProperty()
  sku: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  isFeatured: boolean;

  @ApiProperty()
  inStock: boolean;

  @ApiProperty()
  images: string[];

  @ApiProperty({ type: [ProductAttributeResponseDto] })
  attributes: ProductAttributeResponseDto[];

  @ApiProperty({ type: [ProductVariationResponseDto] })
  variations: ProductVariationResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    comparePrice?: number;
    categoryId: string;
    brand: string;
    material: string;
    sku: string;
    isActive: boolean;
    isFeatured: boolean;
    inStock: boolean;
    images: string[];
    attributes: ProductAttributeResponseDto[];
    variations: ProductVariationResponseDto[];
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = product.id;
    this.name = product.name;
    this.slug = product.slug;
    this.description = product.description;
    this.price = product.price;
    this.comparePrice = product.comparePrice;
    this.categoryId = product.categoryId;
    this.brand = product.brand;
    this.material = product.material;
    this.sku = product.sku;
    this.isActive = product.isActive;
    this.isFeatured = product.isFeatured;
    this.inStock = product.inStock;
    this.images = product.images;
    this.attributes = product.attributes;
    this.variations = product.variations;
    this.createdAt = product.createdAt;
    this.updatedAt = product.updatedAt;
  }
}
'@

# 6. Application Mappers
$productMapperContent = @'
import { ProductEntity, ProductAttribute, ProductVariation, VariationAttribute } from '../../domain/entities/product.entity';
import { ProductCreateDto, ProductAttributeDto, ProductVariationCreateDto, VariationAttributeDto } from '../dto/product-create.dto';
import { ProductResponseDto, ProductAttributeResponseDto, ProductVariationResponseDto, VariationAttributeResponseDto } from '../dto/product-response.dto';

export class ProductMapper {
  static toEntity(dto: ProductCreateDto, id?: string): ProductEntity {
    const attributes = dto.attributes?.map(attr => 
      new ProductAttribute(attr.attributeId, attr.values)
    ) || [];

    const variations = dto.variations?.map(variation => 
      new ProductVariation(
        Math.random().toString(36).substring(2, 15), // temp ID
        variation.sku,
        variation.price,
        variation.comparePrice,
        variation.stock || 0,
        variation.images || [],
        variation.attributes.map(attr => 
          new VariationAttribute(attr.attributeId, attr.valueSlug)
        ),
        true
      )
    ) || [];

    return new ProductEntity(
      id,
      dto.name,
      dto.slug,
      dto.description || '',
      dto.price,
      dto.comparePrice,
      dto.categoryId,
      dto.brand,
      dto.material,
      dto.sku,
      dto.isActive !== undefined ? dto.isActive : true,
      dto.isFeatured || false,
      true,
      dto.images || [],
      attributes,
      variations,
    );
  }

  static toResponse(entity: ProductEntity): ProductResponseDto {
    const attributeResponses = entity.attributes.map(attr => 
      new ProductAttributeResponseDto({
        attributeId: attr.attributeId,
        values: attr.values,
      })
    );

    const variationResponses = entity.variations.map(variation => 
      new ProductVariationResponseDto({
        id: variation.id,
        sku: variation.sku,
        price: variation.price,
        comparePrice: variation.comparePrice,
        stock: variation.stock,
        images: variation.images,
        attributes: variation.attributes.map(attr =>
          new VariationAttributeResponseDto({
            attributeId: attr.attributeId,
            valueSlug: attr.valueSlug,
          })
        ),
        isActive: variation.isActive,
      })
    );

    return new ProductResponseDto({
      id: entity.id,
      name: entity.name,
      slug: entity.slug,
      description: entity.description,
      price: entity.price,
      comparePrice: entity.comparePrice,
      categoryId: entity.categoryId,
      brand: entity.brand,
      material: entity.material,
      sku: entity.sku,
      isActive: entity.isActive,
      isFeatured: entity.isFeatured,
      inStock: entity.inStock,
      images: entity.images,
      attributes: attributeResponses,
      variations: variationResponses,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
'@

# 7. Application Service
$productAppServiceContent = @'
import { Inject, Injectable } from '@nestjs/common';
import { ProductRepository } from '../domain/repository/product.repository';
import { ProductEntity } from '../domain/entities/product.entity';
import { throwConflict, throwNotFound } from '../../common/exceptions/http-exception.helper';

@Injectable()
export class ProductApplication {
  constructor(
    @Inject('ProductRepository') private readonly productRepository: ProductRepository,
  ) {}

  async create(product: ProductEntity): Promise<ProductEntity> {
    // Check if slug already exists
    const existingBySlug = await this.productRepository.findBySlug(product.slug);
    if (existingBySlug) {
      throwConflict('Product with this slug already exists');
    }

    // Check if SKU already exists
    // Note: You might want to add a findBySku method to repository
    // const existingBySku = await this.productRepository.findBySku(product.sku);
    // if (existingBySku) {
    //   throwConflict('Product with this SKU already exists');
    // }

    return await this.productRepository.create(product);
  }

  async getById(id: string): Promise<ProductEntity> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throwNotFound('Product not found');
    }
    return product;
  }

  async getBySlug(slug: string): Promise<ProductEntity> {
    const product = await this.productRepository.findBySlug(slug);
    if (!product) {
      throwNotFound('Product not found');
    }
    return product;
  }

  async getByCategory(categoryId: string): Promise<ProductEntity[]> {
    return await this.productRepository.findByCategory(categoryId);
  }

  async getByBrand(brand: string): Promise<ProductEntity[]> {
    return await this.productRepository.findByBrand(brand);
  }

  async getAll(): Promise<ProductEntity[]> {
    return await this.productRepository.findAll();
  }

  async update(product: ProductEntity): Promise<ProductEntity> {
    const existing = await this.productRepository.findById(product.id);
    if (!existing) {
      throwNotFound('Product not found');
    }

    if (existing.slug !== product.slug) {
      const slugExists = await this.productRepository.findBySlug(product.slug);
      if (slugExists) {
        throwConflict('Product with this slug already exists');
      }
    }

    return await this.productRepository.update(product);
  }

  async delete(id: string): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throwNotFound('Product not found');
    }

    await this.productRepository.delete(id);
  }

  async createVariation(productId: string, variation: any): Promise<ProductEntity> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throwNotFound('Product not found');
    }

    return await this.productRepository.createVariation(productId, variation);
  }

  async deleteVariation(productId: string, variationId: string): Promise<ProductEntity> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throwNotFound('Product not found');
    }

    return await this.productRepository.deleteVariation(productId, variationId);
  }
}
'@

# 8. Controller
$productsControllerContent = @'
import { Controller, Post, Body, Get, Param, Put, Delete, HttpCode, Query } from '@nestjs/common';
import { ProductApplication } from './application/product.service';
import { ProductMapper } from './application/mappers/product.mapper';
import { ProductCreateDto } from './application/dto/product-create.dto';
import { ProductResponseDto } from './application/dto/product-response.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

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
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'brand', required: false })
  @ApiQuery({ name: 'isFeatured', required: false, type: Boolean })
  @ApiResponse({ status: 200, type: [ProductResponseDto] })
  async findAll(
    @Query('categoryId') categoryId?: string,
    @Query('brand') brand?: string,
    @Query('isFeatured') isFeatured?: boolean,
  ): Promise<ProductResponseDto[]> {
    const filters: any = {};
    if (categoryId) filters.categoryId = categoryId;
    if (brand) filters.brand = brand;
    if (isFeatured !== undefined) filters.isFeatured = isFeatured === true;

    const products = await this.productApplication.getAll();
    return products.map(product => ProductMapper.toResponse(product));
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
  async findByCategory(@Param('categoryId') categoryId: string): Promise<ProductResponseDto[]> {
    const products = await this.productApplication.getByCategory(categoryId);
    return products.map(product => ProductMapper.toResponse(product));
  }

  @Get('brand/:brand')
  @ApiOperation({ summary: 'Get products by brand' })
  @ApiResponse({ status: 200, type: [ProductResponseDto] })
  async findByBrand(@Param('brand') brand: string): Promise<ProductResponseDto[]> {
    const products = await this.productApplication.getByBrand(brand);
    return products.map(product => ProductMapper.toResponse(product));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update product' })
  @ApiResponse({ status: 200, type: ProductResponseDto })
  async update(@Param('id') id: string, @Body() dto: ProductCreateDto): Promise<ProductResponseDto> {
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
}
'@

# 9. Module
$productsModuleContent = @'
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductsController } from './products.controller';
import { ProductApplication } from './application/product.service';
import { SequelizeProductRepository } from './infrastructure/repositories/sequelize-product.repository';
import { ProductModel } from './infrastructure/orm/product.entity';
import { ProductVariationModel } from './infrastructure/orm/product-variation.entity';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [
    SequelizeModule.forFeature([ProductModel, ProductVariationModel]),
    CategoriesModule,
  ],
  providers: [
    ProductApplication,
    {
      provide: 'ProductRepository',
      useClass: SequelizeProductRepository,
    },
  ],
  controllers: [ProductsController],
  exports: ['ProductRepository'],
})
export class ProductsModule {}
'@

# Создаем файлы
$files = @{
    "$productsPath\domain\entities\product.entity.ts" = $productEntityContent
    "$productsPath\domain\repository\product.repository.ts" = $productRepositoryContent
    "$productsPath\infrastructure\orm\product.entity.ts" = $productModelContent
    "$productsPath\infrastructure\orm\product-variation.entity.ts" = $productVariationModelContent
    "$productsPath\infrastructure\repositories\sequelize-product.repository.ts" = $sequelizeProductRepoContent
    "$productsPath\application\dto\product-create.dto.ts" = $productCreateDtoContent
    "$productsPath\application\dto\product-response.dto.ts" = $productResponseDtoContent
    "$productsPath\application\mappers\product.mapper.ts" = $productMapperContent
    "$productsPath\application\product.service.ts" = $productAppServiceContent
    "$productsPath\products.controller.ts" = $productsControllerContent
    "$productsPath\products.module.ts" = $productsModuleContent
}

foreach ($file in $files.GetEnumerator()) {
    Set-Content -Path $file.Key -Value $file.Value
    Write-Host "Created file: $($file.Key)"
}

Write-Host "`n✅ Module 'products' successfully created!"
Write-Host "📁 Location: $productsPath"
Write-Host "📋 Total files created: $($files.Count)"
Write-Host "`nDon't forget to:"
Write-Host "1. Add ProductsModule to your AppModule imports"
Write-Host "2. Create database migration for products and product_variations tables"
Write-Host "3. Run the migration"
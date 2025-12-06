import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ProductRepository } from '../../domain/repository/product.repository';
import {
  ProductAttribute,
  ProductEntity,
  ProductVariation,
  VariationAttribute,
} from '../../domain/entities/product.entity';
import { ProductModel } from '../orm/product.entity';
import { ProductVariationModel } from '../orm/product-variation.entity';
import { VariationAttributeModel } from '../orm/variation-attribute.entity';
import { ProductAttributeLinkModel } from '../orm/product-attribute-link.entity';
import { ProductFiltersDto } from 'src/products/application/dto/product-filters.dto';

@Injectable()
export class SequelizeProductRepository implements ProductRepository {
  constructor(
    @InjectModel(ProductModel)
    private readonly productModel: typeof ProductModel,
    @InjectModel(ProductVariationModel)
    private readonly variationModel: typeof ProductVariationModel,
    @InjectModel(ProductAttributeLinkModel)
    private readonly productAttributeLinkModel: typeof ProductAttributeLinkModel,
    @InjectModel(VariationAttributeModel)
    private readonly variationAttributeModel: typeof VariationAttributeModel,
  ) {}

  async create(product: ProductEntity): Promise<ProductEntity> {
    const transaction = await this.productModel.sequelize.transaction();

    try {
      const created = await this.productModel.create(
        {
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
        },
        { transaction },
      );

      if (product.attributes.length > 0) {
        const productAttributeLinksData = product.attributes.map((attr) => ({
          productId: created.id,
          attributeId: attr.attributeId,
          values: attr.values,
        }));

        await this.productAttributeLinkModel.bulkCreate(
          productAttributeLinksData,
          { transaction },
        );
      }

      if (product.variations.length > 0) {
        for (const variation of product.variations) {
          const createdVariation = await this.variationModel.create(
            {
              id: variation.id,
              productId: created.id,
              sku: variation.sku,
              price: variation.price,
              comparePrice: variation.comparePrice,
              stock: variation.stock,
              images: variation.images,
              isActive: variation.isActive,
            },
            { transaction },
          );

          if (variation.attributes.length > 0) {
            const variationAttributesData = variation.attributes.map(
              (attr) => ({
                variationId: createdVariation.id,
                attributeId: attr.attributeId,
                values: attr.values,
              }),
            );

            await this.variationAttributeModel.bulkCreate(
              variationAttributesData,
              { transaction },
            );
          }
        }
      }

      await transaction.commit();
      try {
        const createdProduct = await this.findById(created.id);
        return createdProduct;
      } catch (findError) {
        throw findError;
      }
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async findBySku(sku: string): Promise<ProductEntity | null> {
    const productModel = await this.productModel.findOne({
      where: { sku },
      include: [
        {
          model: ProductVariationModel,
          include: [VariationAttributeModel],
        },
        ProductAttributeLinkModel,
      ],
    });

    return productModel ? this.buildProductEntity(productModel) : null;
  }

  async findVariationBySku(
    sku: string,
  ): Promise<{ productId: string; variationId: string } | null> {
    const variation = await this.variationModel.findOne({
      where: { sku },
      attributes: ['id', 'productId'],
    });

    if (!variation) return null;

    return {
      productId: variation.productId,
      variationId: variation.id,
    };
  }

  async findById(id: string): Promise<ProductEntity> {
    const found = await this.productModel.findByPk(id, {
      include: [
        {
          model: ProductVariationModel,
          include: [VariationAttributeModel],
        },
        ProductAttributeLinkModel,
      ],
    });
    return found ? this.buildProductEntity(found) : null;
  }

  async findBySlug(slug: string): Promise<ProductEntity> {
    const found = await this.productModel.findOne({
      where: { slug },
      include: [
        {
          model: ProductVariationModel,
          include: [VariationAttributeModel],
        },
        ProductAttributeLinkModel,
      ],
    });
    return found ? this.buildProductEntity(found) : null;
  }

  async findByCategory(categoryId: string): Promise<ProductEntity[]> {
    const products = await this.productModel.findAll({
      where: { categoryId },
      include: [
        {
          model: ProductVariationModel,
          include: [VariationAttributeModel],
        },
        ProductAttributeLinkModel,
      ],
      order: [['createdAt', 'DESC']],
    });

    return products.map((product) => this.buildProductEntity(product));
  }

  async findByBrand(brand: string): Promise<ProductEntity[]> {
    const products = await this.productModel.findAll({
      where: { brand },
      include: [
        {
          model: ProductVariationModel,
          include: [VariationAttributeModel],
        },
        ProductAttributeLinkModel,
      ],
      order: [['createdAt', 'DESC']],
    });

    return products.map((product) => this.buildProductEntity(product));
  }

  async findAll(
    filters?: ProductFiltersDto,
    pagination?: {
      page: number;
      limit: number;
    },
  ): Promise<ProductEntity[]> {
    const where = this.buildWhereClause(filters);
    const order = this.buildOrderClause(filters);

    const queryOptions: any = {
      where,
      order,
      include: [
        {
          model: ProductVariationModel,
          include: [VariationAttributeModel],
        },
        ProductAttributeLinkModel,
      ],
    };

    if (pagination) {
      const offset = (pagination.page - 1) * pagination.limit;
      queryOptions.limit = pagination.limit;
      queryOptions.offset = offset;
    }

    const products = await this.productModel.findAll(queryOptions);
    return products.map((product) => this.buildProductEntity(product));
  }

  async getTotalProducts(filters?: ProductFiltersDto): Promise<number> {
    const where = this.buildWhereClause(filters);
    return await this.productModel.count({ where });
  }

  async update(product: ProductEntity): Promise<ProductEntity> {
    const transaction = await this.productModel.sequelize.transaction();

    try {
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
          updatedAt: new Date(),
        },
        { where: { id: product.id }, transaction },
      );

      if (affectedCount === 0) {
        await transaction.rollback();
        return null;
      }

      await this.productAttributeLinkModel.destroy({
        where: { productId: product.id },
        transaction,
      });

      if (product.attributes.length > 0) {
        const productAttributeLinksData = product.attributes.map((attr) => ({
          productId: product.id,
          attributeId: attr.attributeId,
          values: attr.values,
        }));

        await this.productAttributeLinkModel.bulkCreate(
          productAttributeLinksData,
          { transaction },
        );
      }

      await transaction.commit();
      return await this.findById(product.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    await this.productModel.destroy({ where: { id } });
  }

  async createVariation(
    productId: string,
    variation: ProductVariation,
  ): Promise<ProductEntity> {
    const transaction = await this.productModel.sequelize.transaction();

    try {
      const createdVariation = await this.variationModel.create(
        {
          id: variation.id,
          productId,
          sku: variation.sku,
          price: variation.price,
          comparePrice: variation.comparePrice,
          stock: variation.stock,
          images: variation.images,
          isActive: variation.isActive,
        },
        { transaction },
      );

      if (variation.attributes.length > 0) {
        const variationAttributesData = variation.attributes.map((attr) => ({
          variationId: createdVariation.id,
          attributeId: attr.attributeId,
          values: attr.values,
        }));

        await this.variationAttributeModel.bulkCreate(variationAttributesData, {
          transaction,
        });
      }

      await transaction.commit();
      return await this.findById(productId);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updateVariation(
    productId: string,
    variation: ProductVariation,
  ): Promise<ProductEntity> {
    const transaction = await this.productModel.sequelize.transaction();

    try {
      const [affectedCount] = await this.variationModel.update(
        {
          sku: variation.sku,
          price: variation.price,
          comparePrice: variation.comparePrice,
          stock: variation.stock,
          images: variation.images,
          isActive: variation.isActive,
          updatedAt: new Date(),
        },
        { where: { id: variation.id, productId }, transaction },
      );

      if (affectedCount === 0) {
        await transaction.rollback();
        return null;
      }

      await this.variationAttributeModel.destroy({
        where: { variationId: variation.id },
        transaction,
      });

      if (variation.attributes.length > 0) {
        const variationAttributesData = variation.attributes.map((attr) => ({
          variationId: variation.id,
          attributeId: attr.attributeId,
          values: attr.values,
        }));

        await this.variationAttributeModel.bulkCreate(variationAttributesData, {
          transaction,
        });
      }

      await transaction.commit();
      return await this.findById(productId);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async deleteVariation(
    productId: string,
    variationId: string,
  ): Promise<ProductEntity> {
    const transaction = await this.productModel.sequelize.transaction();

    try {
      await this.variationAttributeModel.destroy({
        where: { variationId },
        transaction,
      });

      await this.variationModel.destroy({
        where: { id: variationId, productId },
        transaction,
      });

      await transaction.commit();
      return await this.findById(productId);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  private buildProductEntity(model: ProductModel): ProductEntity {
    const attributes = model.attributeLinks
      ? model.attributeLinks.map(
          (attr) => new ProductAttribute(attr.attributeId, attr.values),
        )
      : [];

    const variations = model.variations
      ? model.variations.map((v) => this.buildVariationEntity(v))
      : [];

    return new ProductEntity(
      model.id,
      model.name,
      model.slug,
      model.description,
      model.price,
      model.comparePrice,
      model.categoryId,
      model.brand,
      model.material,
      model.sku,
      model.isActive,
      model.isFeatured,
      model.inStock,
      model.images || [],
      attributes,
      variations,
      model.createdAt,
      model.updatedAt,
    );
  }

  private buildOrderClause(filters?: ProductFiltersDto): any[] {
    if (!filters?.sort) {
      return [['createdAt', 'DESC']];
    }

    switch (filters.sort) {
      case 'newest':
        return [['createdAt', 'DESC']];
      case 'price_asc':
        return [['price', 'ASC']];
      case 'price_desc':
        return [['price', 'DESC']];
      case 'name_asc':
        return [['name', 'ASC']];
      case 'name_desc':
        return [['name', 'DESC']];
      default:
        return [['createdAt', 'DESC']];
    }
  }

  private buildWhereClause(filters?: ProductFiltersDto): any {
    if (!filters) return {};

    const where: any = {};

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters.categoryIds && filters.categoryIds.length > 0) {
      where.categoryId = {
        [Op.in]: filters.categoryIds,
      };
    }

    if (filters.brand) {
      where.brand = filters.brand;
    }

    if (filters.inStock !== undefined) {
      where.inStock = filters.inStock;
    }

    if (filters.isFeatured !== undefined) {
      where.isFeatured = filters.isFeatured;
    }

    if (filters.search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${filters.search}%` } },
        { description: { [Op.iLike]: `%${filters.search}%` } },
      ];
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) {
        where.price[Op.gte] = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.price[Op.lte] = filters.maxPrice;
      }
    }

    return where;
  }

  private buildVariationEntity(model: ProductVariationModel): ProductVariation {
    const attributes = model.attributes
      ? model.attributes.map(
          (attr) => new VariationAttribute(attr.attributeId, attr.values),
        )
      : [];

    return new ProductVariation(
      model.id,
      model.sku,
      model.price,
      model.comparePrice,
      model.stock,
      model.images || [],
      attributes,
      model.isActive,
    );
  }
}

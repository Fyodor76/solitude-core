import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  ProductAttributeRepository,
  AttributeFilters,
} from '../../domain/repository/product-attribute.repository';
import {
  ProductAttributeEntity,
  AttributeType,
} from '../../domain/entities/product-attribute.entity';
import { AttributeValueEntity } from '../../domain/entities/attribute-value.entity';
import { ProductAttributeModel } from '../orm/product-attribute.entity';
import { AttributeValueModel } from '../orm/attribute-value.entity';

@Injectable()
export class SequelizeProductAttributeRepository
  implements ProductAttributeRepository
{
  constructor(
    @InjectModel(ProductAttributeModel)
    private readonly attributeModel: typeof ProductAttributeModel,
    @InjectModel(AttributeValueModel)
    private readonly valueModel: typeof AttributeValueModel,
  ) {}

  // Attribute operations
  async createAttribute(
    attribute: ProductAttributeEntity,
  ): Promise<ProductAttributeEntity> {
    const created = await this.attributeModel.create({
      id: attribute.id,
      name: attribute.name,
      slug: attribute.slug,
      type: attribute.type,
      description: attribute.description,
      isActive: attribute.isActive,
      sortOrder: attribute.sortOrder,
    });

    return this.buildAttributeEntity(created);
  }

  async findAttributeById(id: string): Promise<ProductAttributeEntity> {
    const found = await this.attributeModel.findByPk(id, {
      include: [AttributeValueModel],
    });
    if (!found) return null;
    return this.buildAttributeEntity(found);
  }

  async findAttributeBySlug(slug: string): Promise<ProductAttributeEntity> {
    const found = await this.attributeModel.findOne({
      where: { slug },
      include: [AttributeValueModel],
    });
    if (!found) return null;
    return this.buildAttributeEntity(found);
  }

  async findAttributesByType(
    type: AttributeType,
  ): Promise<ProductAttributeEntity[]> {
    const attributes = await this.attributeModel.findAll({
      where: { type },
      include: [AttributeValueModel],
      order: [['sortOrder', 'ASC']],
    });

    return attributes.map((attr) => this.buildAttributeEntity(attr));
  }

  async findAllAttributes(
    filters?: AttributeFilters,
  ): Promise<ProductAttributeEntity[]> {
    const where: any = {};

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters?.type) {
      where.type = filters.type;
    }

    const attributes = await this.attributeModel.findAll({
      where,
      include: [AttributeValueModel],
      order: [['sortOrder', 'ASC']],
    });

    return attributes.map((attr) => this.buildAttributeEntity(attr));
  }

  async updateAttribute(
    attribute: ProductAttributeEntity,
  ): Promise<ProductAttributeEntity> {
    const [affectedCount] = await this.attributeModel.update(
      {
        name: attribute.name,
        slug: attribute.slug,
        type: attribute.type,
        description: attribute.description,
        isActive: attribute.isActive,
        sortOrder: attribute.sortOrder,
        updatedAt: new Date(),
      },
      { where: { id: attribute.id } },
    );

    if (affectedCount === 0) {
      return null;
    }

    const updated = await this.attributeModel.findByPk(attribute.id, {
      include: [AttributeValueModel],
    });
    return this.buildAttributeEntity(updated);
  }

  async deleteAttribute(id: string): Promise<void> {
    await this.attributeModel.destroy({ where: { id } });
  }

  async createValue(
    value: AttributeValueEntity,
  ): Promise<AttributeValueEntity> {
    const created = await this.valueModel.create({
      id: value.id,
      attributeId: value.attributeId,
      value: value.value,
      slug: value.slug,
      sortOrder: value.sortOrder,
      isActive: value.isActive,
      hexCode: value.hexCode,
      metadata: value.metadata,
    });

    return this.buildValueEntity(created);
  }

  async findValueById(id: string): Promise<AttributeValueEntity> {
    const found = await this.valueModel.findByPk(id, {
      include: [ProductAttributeModel],
    });
    if (!found) return null;
    return this.buildValueEntity(found);
  }

  async findValuesByAttributeId(
    attributeId: string,
  ): Promise<AttributeValueEntity[]> {
    const values = await this.valueModel.findAll({
      where: { attributeId },
      include: [ProductAttributeModel],
      order: [['sortOrder', 'ASC']],
    });

    return values.map((value) => this.buildValueEntity(value));
  }

  async findValueBySlug(
    attributeId: string,
    slug: string,
  ): Promise<AttributeValueEntity> {
    const found = await this.valueModel.findOne({
      where: { attributeId, slug },
      include: [ProductAttributeModel],
    });
    if (!found) return null;
    return this.buildValueEntity(found);
  }

  async updateValue(
    value: AttributeValueEntity,
  ): Promise<AttributeValueEntity> {
    const [affectedCount] = await this.valueModel.update(
      {
        value: value.value,
        slug: value.slug,
        sortOrder: value.sortOrder,
        isActive: value.isActive,
        hexCode: value.hexCode,
        metadata: value.metadata,
        updatedAt: new Date(),
      },
      { where: { id: value.id } },
    );

    if (affectedCount === 0) {
      return null;
    }

    const updated = await this.valueModel.findByPk(value.id, {
      include: [ProductAttributeModel],
    });
    return this.buildValueEntity(updated);
  }

  async deleteValue(id: string): Promise<void> {
    await this.valueModel.destroy({ where: { id } });
  }

  async deleteValuesByAttributeId(attributeId: string): Promise<void> {
    await this.valueModel.destroy({ where: { attributeId } });
  }

  private buildAttributeEntity(
    model: ProductAttributeModel,
  ): ProductAttributeEntity {
    const values = model.values
      ? model.values.map((v) => this.buildValueEntity(v))
      : [];

    return new ProductAttributeEntity(
      model.id,
      model.name,
      model.slug,
      model.type as AttributeType,
      model.description,
      model.isActive,
      model.sortOrder,
      values,
      model.createdAt,
      model.updatedAt,
    );
  }

  private buildValueEntity(model: AttributeValueModel): AttributeValueEntity {
    return new AttributeValueEntity(
      model.id,
      model.attributeId,
      model.value,
      model.slug,
      model.sortOrder,
      model.isActive,
      model.hexCode,
      model.metadata,
      model.createdAt,
      model.updatedAt,
    );
  }
}

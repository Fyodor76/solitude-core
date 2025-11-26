import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  DictionaryRepository,
  DictionaryFilters,
} from '../../domain/repository/dictionary.repository';
import {
  DictionaryEntity,
  DictionaryType,
  DictionaryValue,
} from '../../domain/entities/dictionary.entity';
import { DictionaryModel } from '../orm/dictionary.entity';

@Injectable()
export class SequelizeDictionaryRepository implements DictionaryRepository {
  constructor(
    @InjectModel(DictionaryModel)
    private readonly dictionaryModel: typeof DictionaryModel,
  ) {}

  async create(dictionary: DictionaryEntity): Promise<DictionaryEntity> {
    const created = await this.dictionaryModel.create({
      id: dictionary.id,
      name: dictionary.name,
      slug: dictionary.slug,
      type: dictionary.type,
      values: dictionary.values.map((v) => this.serializeValue(v)),
      isActive: dictionary.isActive,
      sortOrder: dictionary.sortOrder,
      description: dictionary.description,
    });

    return this.buildDictionaryEntity(created);
  }

  async findById(id: string): Promise<DictionaryEntity> {
    const found = await this.dictionaryModel.findByPk(id);
    if (!found) return null;
    return this.buildDictionaryEntity(found);
  }

  async findBySlug(slug: string): Promise<DictionaryEntity> {
    const found = await this.dictionaryModel.findOne({ where: { slug } });
    if (!found) return null;
    return this.buildDictionaryEntity(found);
  }

  async findByType(type: DictionaryType): Promise<DictionaryEntity[]> {
    const dictionaries = await this.dictionaryModel.findAll({
      where: { type },
      order: [['sortOrder', 'ASC']],
    });

    return dictionaries.map((dict) => this.buildDictionaryEntity(dict));
  }

  async findAll(filters?: DictionaryFilters): Promise<DictionaryEntity[]> {
    const where: any = {};

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters?.type) {
      where.type = filters.type;
    }

    const dictionaries = await this.dictionaryModel.findAll({
      where,
      order: [['sortOrder', 'ASC']],
    });

    return dictionaries.map((dict) => this.buildDictionaryEntity(dict));
  }

  async update(dictionary: DictionaryEntity): Promise<DictionaryEntity> {
    const [affectedCount] = await this.dictionaryModel.update(
      {
        name: dictionary.name,
        slug: dictionary.slug,
        type: dictionary.type,
        values: dictionary.values.map((v) => this.serializeValue(v)),
        isActive: dictionary.isActive,
        sortOrder: dictionary.sortOrder,
        description: dictionary.description,
        updatedAt: new Date(),
      },
      { where: { id: dictionary.id } },
    );

    if (affectedCount === 0) {
      return null;
    }

    const updated = await this.dictionaryModel.findByPk(dictionary.id);
    return this.buildDictionaryEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.dictionaryModel.destroy({ where: { id } });
  }

  async addValue(
    dictionaryId: string,
    value: DictionaryValue,
  ): Promise<DictionaryEntity> {
    const dictionary = await this.dictionaryModel.findByPk(dictionaryId);
    if (!dictionary) return null;

    const values = dictionary.values || [];
    values.push(this.serializeValue(value));

    await dictionary.update({ values });
    return this.buildDictionaryEntity(dictionary);
  }

  async updateValue(
    dictionaryId: string,
    valueId: string,
    value: Partial<DictionaryValue>,
  ): Promise<DictionaryEntity> {
    const dictionary = await this.dictionaryModel.findByPk(dictionaryId);
    if (!dictionary) return null;

    const values = dictionary.values.map((v) =>
      v.id === valueId ? { ...v, ...value } : v,
    );

    await dictionary.update({ values });
    return this.buildDictionaryEntity(dictionary);
  }

  async removeValue(
    dictionaryId: string,
    valueId: string,
  ): Promise<DictionaryEntity> {
    const dictionary = await this.dictionaryModel.findByPk(dictionaryId);
    if (!dictionary) return null;

    const values = dictionary.values.filter((v) => v.id !== valueId);

    await dictionary.update({ values });
    return this.buildDictionaryEntity(dictionary);
  }

  private buildDictionaryEntity(model: DictionaryModel): DictionaryEntity {
    return new DictionaryEntity(
      model.id,
      model.name,
      model.slug,
      model.type as DictionaryType,
      model.values.map((v) => this.deserializeValue(v)),
      model.isActive,
      model.sortOrder,
      model.description,
      model.createdAt,
      model.updatedAt,
    );
  }

  private serializeValue(value: DictionaryValue): any {
    return {
      id: value.id,
      value: value.value,
      slug: value.slug,
      sortOrder: value.sortOrder,
      isActive: value.isActive,
      metadata: value.metadata,
      hexCode: value.hexCode,
      createdAt: value.createdAt,
    };
  }

  private deserializeValue(data: any): DictionaryValue {
    return new DictionaryValue(
      data.id,
      data.value,
      data.slug,
      data.sortOrder,
      data.isActive,
      data.metadata,
      data.hexCode,
      new Date(data.createdAt),
    );
  }
}

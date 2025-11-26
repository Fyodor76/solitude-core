import { Inject, Injectable } from '@nestjs/common';
import { DictionaryRepository } from '../domain/repository/dictionary.repository';
import {
  DictionaryEntity,
  DictionaryType,
} from '../domain/entities/dictionary.entity';
import {
  throwConflict,
  throwNotFound,
} from '../../common/exceptions/http-exception.helper';

@Injectable()
export class DictionaryApplication {
  constructor(
    @Inject('DictionaryRepository')
    private readonly dictionaryRepository: DictionaryRepository,
  ) {}

  async create(dictionary: DictionaryEntity): Promise<DictionaryEntity> {
    const existing = await this.dictionaryRepository.findBySlug(
      dictionary.slug,
    );
    if (existing) {
      throwConflict('Dictionary with this slug already exists');
    }

    return await this.dictionaryRepository.create(dictionary);
  }

  async getById(id: string): Promise<DictionaryEntity> {
    const dictionary = await this.dictionaryRepository.findById(id);
    if (!dictionary) {
      throwNotFound('Dictionary not found');
    }
    return dictionary;
  }

  async getBySlug(slug: string): Promise<DictionaryEntity> {
    const dictionary = await this.dictionaryRepository.findBySlug(slug);
    if (!dictionary) {
      throwNotFound('Dictionary not found');
    }
    return dictionary;
  }

  async getByType(type: DictionaryType): Promise<DictionaryEntity[]> {
    return await this.dictionaryRepository.findByType(type);
  }

  async getAll(): Promise<DictionaryEntity[]> {
    return await this.dictionaryRepository.findAll();
  }

  async update(dictionary: DictionaryEntity): Promise<DictionaryEntity> {
    const existing = await this.dictionaryRepository.findById(dictionary.id);
    if (!existing) {
      throwNotFound('Dictionary not found');
    }

    if (existing.slug !== dictionary.slug) {
      const slugExists = await this.dictionaryRepository.findBySlug(
        dictionary.slug,
      );
      if (slugExists) {
        throwConflict('Dictionary with this slug already exists');
      }
    }

    return await this.dictionaryRepository.update(dictionary);
  }

  async delete(id: string): Promise<void> {
    const dictionary = await this.dictionaryRepository.findById(id);
    if (!dictionary) {
      throwNotFound('Dictionary not found');
    }

    await this.dictionaryRepository.delete(id);
  }

  async addValue(dictionaryId: string, value: any): Promise<DictionaryEntity> {
    const dictionary = await this.dictionaryRepository.findById(dictionaryId);
    if (!dictionary) {
      throwNotFound('Dictionary not found');
    }

    return await this.dictionaryRepository.addValue(dictionaryId, value);
  }

  async removeValue(
    dictionaryId: string,
    valueId: string,
  ): Promise<DictionaryEntity> {
    const dictionary = await this.dictionaryRepository.findById(dictionaryId);
    if (!dictionary) {
      throwNotFound('Dictionary not found');
    }

    return await this.dictionaryRepository.removeValue(dictionaryId, valueId);
  }
}

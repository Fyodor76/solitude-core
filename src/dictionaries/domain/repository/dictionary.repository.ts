import {
  DictionaryEntity,
  DictionaryType,
} from '../entities/dictionary.entity';

export interface DictionaryRepository {
  create(dictionary: DictionaryEntity): Promise<DictionaryEntity>;
  findById(id: string): Promise<DictionaryEntity>;
  findBySlug(slug: string): Promise<DictionaryEntity>;
  findByType(type: DictionaryType): Promise<DictionaryEntity[]>;
  findAll(filters?: DictionaryFilters): Promise<DictionaryEntity[]>;
  update(dictionary: DictionaryEntity): Promise<DictionaryEntity>;
  delete(id: string): Promise<void>;

  addValue(
    dictionaryId: string,
    value: DictionaryValue,
  ): Promise<DictionaryEntity>;
  updateValue(
    dictionaryId: string,
    valueId: string,
    value: Partial<DictionaryValue>,
  ): Promise<DictionaryEntity>;
  removeValue(dictionaryId: string, valueId: string): Promise<DictionaryEntity>;
}

export interface DictionaryFilters {
  isActive?: boolean;
  type?: DictionaryType;
}

export interface DictionaryValue {
  id: string;
  value: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
  metadata: Record<string, any>;
  hexCode?: string;
  createdAt: Date;
}

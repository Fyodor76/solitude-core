import {
  DictionaryEntity,
  DictionaryValue,
} from 'src/dictionaries/domain/entities/dictionary.entity';
import { DictionaryCreateDto } from '../dto/dictionary-create.dto';
import {
  DictionaryResponseDto,
  DictionaryValueResponseDto,
} from '../dto/dictionary-response.dto';

export class DictionaryMapper {
  static toEntity(dto: DictionaryCreateDto, id?: string): DictionaryEntity {
    const values =
      dto.values?.map(
        (valueDto) =>
          new DictionaryValue(
            Math.random().toString(36).substring(2, 15),
            valueDto.value,
            valueDto.slug,
            valueDto.sortOrder || 0,
            true,
            valueDto.metadata || {},
            valueDto.hexCode,
          ),
      ) || [];

    return new DictionaryEntity(
      id,
      dto.name,
      dto.slug,
      dto.type,
      values,
      true,
      dto.sortOrder || 0,
      dto.description || '',
    );
  }

  static toResponse(entity: DictionaryEntity): DictionaryResponseDto {
    const valueResponses = entity.values.map(
      (value) =>
        new DictionaryValueResponseDto({
          id: value.id,
          value: value.value,
          slug: value.slug,
          sortOrder: value.sortOrder,
          isActive: value.isActive,
          metadata: value.metadata,
          hexCode: value.hexCode,
          createdAt: value.createdAt,
        }),
    );

    return new DictionaryResponseDto({
      id: entity.id,
      name: entity.name,
      slug: entity.slug,
      type: entity.type,
      values: valueResponses,
      isActive: entity.isActive,
      sortOrder: entity.sortOrder,
      description: entity.description,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}

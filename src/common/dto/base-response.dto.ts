// src/common/dto/base-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseDto<T = any, M = Record<string, any>> {
  @ApiProperty({ description: 'Успешность выполнения запроса' })
  success: boolean;

  @ApiProperty({ description: 'Основные данные ответа' })
  data: T;

  @ApiProperty({ description: 'Мета-информация', required: false })
  meta?: M; // ← Типизированный meta

  @ApiProperty({ description: 'Сообщение об ошибке', required: false })
  message?: string;

  constructor(data: T, meta?: M, message?: string) {
    this.success = true;
    this.data = data;
    if (meta) this.meta = meta;
    if (message) this.message = message;
  }
}

export class PaginationMetaDto {
  @ApiProperty({ description: 'Текущая страница' })
  page: number;

  @ApiProperty({ description: 'Лимит на странице' })
  limit: number;

  @ApiProperty({ description: 'Общее количество элементов' })
  total: number;

  @ApiProperty({ description: 'Общее количество страниц' })
  totalPages: number;

  @ApiProperty({ description: 'Есть ли следующая страница' })
  hasNext: boolean;

  @ApiProperty({ description: 'Есть ли предыдущая страница' })
  hasPrev: boolean;

  constructor(
    page: number,
    limit: number,
    total: number,
    totalPages: number,
    hasNext: boolean,
    hasPrev: boolean,
  ) {
    this.page = page;
    this.limit = limit;
    this.total = total;
    this.totalPages = totalPages;
    this.hasNext = hasNext;
    this.hasPrev = hasPrev;
  }

  static create(total: number, page: number, limit: number): PaginationMetaDto {
    const totalPages = Math.ceil(total / limit);

    return new PaginationMetaDto(
      page,
      limit,
      total,
      totalPages,
      page < totalPages,
      page > 1,
    );
  }
}

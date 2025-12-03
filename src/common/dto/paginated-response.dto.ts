// src/common/dto/paginated-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty({ example: 150, description: 'Общее количество элементов' })
  total: number;

  @ApiProperty({ example: 1, description: 'Текущая страница' })
  page: number;

  @ApiProperty({ example: 20, description: 'Количество элементов на странице' })
  limit: number;

  @ApiProperty({ example: 8, description: 'Общее количество страниц' })
  totalPages: number;

  @ApiProperty({ example: true, description: 'Есть ли следующая страница' })
  hasNext: boolean;

  @ApiProperty({ example: false, description: 'Есть ли предыдущая страница' })
  hasPrev: boolean;

  constructor(total: number, page: number, limit: number) {
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.totalPages = Math.ceil(total / limit);
    this.hasNext = page < this.totalPages;
    this.hasPrev = page > 1;
  }
}

export class PaginatedResponseDto<T> {
  @ApiProperty({ description: 'Массив данных' })
  data: T[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;

  constructor(data: T[], meta: PaginationMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}

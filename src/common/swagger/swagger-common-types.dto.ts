// src/common/dto/swagger-types.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from '../dto/base-response.dto';

export class BaseResponseDtoSwagger<T> {
  @ApiProperty({ description: 'Успешность выполнения запроса' })
  success: boolean;

  @ApiProperty({ description: 'Основные данные ответа' })
  data: T;

  @ApiProperty({ description: 'Мета-информация', required: false })
  meta?: any;

  @ApiProperty({ description: 'Сообщение об ошибке', required: false })
  message?: string;
}

export class BaseResponseArrayDtoSwagger<T> {
  @ApiProperty({ description: 'Успешность выполнения запроса' })
  success: boolean;

  @ApiProperty({ description: 'Основные данные ответа', type: [Object] })
  data: T[];

  @ApiProperty({ description: 'Мета-информация', required: false })
  meta?: any;

  @ApiProperty({ description: 'Сообщение об ошибке', required: false })
  message?: string;
}

export class PaginatedResponseDtoSwagger<T> {
  @ApiProperty({ description: 'Успешность выполнения запроса' })
  success: boolean;

  @ApiProperty({ description: 'Основные данные ответа', type: [Object] })
  data: T[];

  @ApiProperty({ description: 'Мета-информация о пагинации' })
  meta: PaginationMetaDto;

  @ApiProperty({ description: 'Сообщение об ошибке', required: false })
  message?: string;
}

import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsBoolean,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
  IsPhoneNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CallbackFormDto {
  @ApiProperty({
    example: 'Петр Петров',
    description: 'Имя пользователя',
  })
  @IsString()
  @IsNotEmpty({ message: 'Имя обязательно для заполнения' })
  @MinLength(2, { message: 'Имя должно содержать минимум 2 символа' })
  @MaxLength(50, { message: 'Имя не должно превышать 50 символов' })
  @Matches(/^[a-zA-Zа-яА-ЯёЁ\s\-]+$/, {
    message: 'Имя может содержать только буквы, пробелы и дефисы',
  })
  name: string;

  @ApiProperty({
    example: '+7 (999) 888-77-66',
    description: 'Номер телефона',
  })
  @IsString()
  @IsNotEmpty({ message: 'Телефон обязателен для заполнения' })
  @IsPhoneNumber('RU', { message: 'Некорректный формат номера телефона' })
  phone: string;

  @ApiProperty({
    example: 'petr@example.com',
    description: 'Email адрес',
  })
  @IsEmail({}, { message: 'Некорректный формат email' })
  @IsNotEmpty({ message: 'Email обязателен для заполнения' })
  email: string;

  @ApiProperty({
    example: 'Хочу получить консультацию',
    description: 'Комментарий',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000, { message: 'Комментарий не должен превышать 1000 символов' })
  comment?: string;

  @ApiProperty({
    example: true,
    description: 'Согласие на обработку персональных данных',
  })
  @IsBoolean()
  @IsNotEmpty({ message: 'Необходимо согласие с политикой' })
  @IsBoolean({ message: 'Поле agreeToPolicy должно быть булевым значением' })
  agreeToPolicy: boolean;
}

export class FormSubmissionResponseDto {
  @ApiProperty({
    example: true,
    description: 'Статус успешности',
  })
  success: boolean;

  @ApiProperty({
    example: 'Форма успешно отправлена',
    description: 'Сообщение',
  })
  message: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID заявки',
  })
  submissionId: string;

  constructor(success: boolean, message: string, submissionId: string) {
    this.success = success;
    this.message = message;
    this.submissionId = submissionId;
  }
}

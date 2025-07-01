import { Controller, Post, Body, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiProperty,
} from '@nestjs/swagger';
import { AppService } from './app.service';
import { MailService } from './mailer/mailer.service';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendTestEmailDto {
  @ApiProperty({ example: 'example@mail.ru', description: 'Email получателя' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Иван', description: 'Имя получателя' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
@ApiTags('app')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly mailService: MailService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Проверка работоспособности сервера' })
  @ApiResponse({
    status: 200,
    description: 'Возвращает приветственное сообщение',
  })
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('test-email')
  @ApiOperation({ summary: 'Отправить тестовое письмо' })
  @ApiBody({ type: SendTestEmailDto })
  @ApiResponse({ status: 201, description: 'Письмо успешно отправлено' })
  @ApiResponse({ status: 400, description: 'Неверный формат запроса' })
  async sendTestEmail(@Body() body: SendTestEmailDto): Promise<string> {
    const { email, name } = body;

    const link = 'https://yandex.by/';
    await this.mailService.sendConfirmationEmail(email, name, link);

    return `Тестовое письмо отправлено на ${email} для ${name}!`;
  }
}

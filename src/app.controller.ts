import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { MailService } from './mailer/mailer.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly mailService: MailService,
  ) {}

  @Post('test-email')
  async sendTestEmail(
    @Body() body: { email: string; name: string },
  ): Promise<string> {
    const { email, name } = body;

    if (!email || !name) {
      return 'Пожалуйста, укажите email и имя в теле запроса.';
    }

    const link = 'https://yandex.by/';

    await this.mailService.sendConfirmationEmail(email, name, link);

    return `Тестовое письмо отправлено на ${email} для ${name}!`;
  }
}

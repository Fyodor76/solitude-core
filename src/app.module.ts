import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { createDatabaseConfig } from './config/database.config';
import { TestsModule } from './tests/tests.module';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { Test } from './tests/tests.entity';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Question } from './questions/questions.entity';
import { MailModule } from './mailer/mailer.module';
import { ChatModule } from './widgets/chat/chat.module';
import { Chat } from './widgets/chat/entitites/chat.entity';
import { Message } from './widgets/chat/entitites/message.entity';
import { ChatParticipant } from './widgets/chat/entitites/chat-participant.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        createDatabaseConfig(configService),
      inject: [ConfigService],
    }),
    SequelizeModule.forFeature([
      User,
      Test,
      Question,
      Chat,
      Message,
      ChatParticipant,
    ]),
    TestsModule,
    UsersModule,
    MailModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

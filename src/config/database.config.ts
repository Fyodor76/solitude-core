import { ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { Test } from '../tests/tests.entity';
import { User } from '../users/user.entity';
import { Question } from '../questions/questions.entity';
import { Chat } from 'src/widgets/chat/chat.entity';
import { Message } from 'src/widgets/chat/message.entity';
import { ChatParticipant } from 'src/widgets/chat/chat-participant.entity';

export const createDatabaseConfig = (
  configService: ConfigService,
): SequelizeModuleOptions => ({
  dialect: 'postgres',
  host: 'postgres',
  port: configService.get<number>('POSTGRES_PORT'),
  username: configService.get<string>('POSTGRES_USER'),
  password: configService.get<string>('POSTGRES_PASSWORD'),
  database: configService.get<string>('POSTGRES_DB'),
  models: [User, Test, Question, Chat, Message, ChatParticipant],
  autoLoadModels: true,
  synchronize: true,
});

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Chat } from './entitites/chat.entity';
import { Message } from './entitites/message.entity';
import { ChatService } from './application/chat.service';
import { ChatContoller } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { UserModel } from '../../users/infrastructure/orm/user.entity';
import { ChatParticipant } from './entitites/chat-participant.entity';
import { UsersModule } from './../../users/users.module';
import { ChatCrudService } from './domain/chat-crud.service';
import { ChatParticipantService } from './domain/chat-participants-service';
import { MessageService } from './domain/message.service';
import { TypingStatusManager } from './application/typing-status.manager';
import { SocketConnectionManager } from './application/socket-connection.manager';
import { LoggerModule } from '../../common/logger/logger.module';
import { RedisModule } from './../../redis/redis.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Chat, Message, UserModel, ChatParticipant]),
    UsersModule,
    LoggerModule,
    RedisModule,
  ],
  providers: [
    ChatService,
    ChatGateway,
    ChatCrudService,
    ChatParticipantService,
    MessageService,
    TypingStatusManager,
    SocketConnectionManager,
  ],
  controllers: [ChatContoller],
})
export class ChatModule {}

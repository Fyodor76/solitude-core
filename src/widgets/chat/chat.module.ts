import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Chat } from './entitites/chat.entity';
import { Message } from './entitites/message.entity';
import { ChatService } from './application/chat.service';
import { ChatContoller } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { User } from 'src/users/user.entity';
import { ChatParticipant } from './entitites/chat-participant.entity';
import { UsersModule } from 'src/users/users.module';
import { ChatCrudService } from './domain/services/ChatCrudService';
import { ChatParticipantService } from './domain/services/ChatParticipantService';
import { MessageService } from './domain/services/MessageService';
import { TypingStatusManager } from './application/typing-status.manager';
import { SocketConnectionManager } from './application/socket-connection.manager';
import { LoggerModule } from 'src/common/logger/logger.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Chat, Message, User, ChatParticipant]),
    UsersModule,
    LoggerModule,
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

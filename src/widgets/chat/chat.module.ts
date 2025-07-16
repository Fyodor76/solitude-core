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

@Module({
  imports: [
    SequelizeModule.forFeature([Chat, Message, User, ChatParticipant]),
    UsersModule,
  ],
  providers: [
    ChatService,
    ChatGateway,
    ChatCrudService,
    ChatParticipantService,
    MessageService,
  ],
  controllers: [ChatContoller],
})
export class ChatModule {}

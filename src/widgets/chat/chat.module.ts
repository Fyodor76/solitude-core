import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Chat } from './chat.entity';
import { Message } from './message.entity';
import { ChatService } from './chat.service';
import { ChatContoller } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { User } from 'src/users/user.entity';
import { ChatParticipant } from './chat-participant.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Chat, Message, User, ChatParticipant]),
    UsersModule,
  ],
  providers: [ChatService, ChatGateway],
  controllers: [ChatContoller],
})
export class ChatModule {}

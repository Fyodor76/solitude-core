import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Chat } from './chat.entity';
import { Message } from './message.entity';
import { ChatParticipant } from './chat-participant.entity';
import { User } from '../../users/user.entity';
import { RequestMessageDto } from './dto/request-message.dto';
import { ChatStatus, DEFAULT_CHAT_STATUS } from './types';
import { tryCatch, tryCatchWs } from '../../common/utils/try-catch.helper';
import { throwNotFound } from 'src/common/exceptions/http-exception.helper';
import { UsersService } from 'src/users/users.service';
import { OpenChatRequestDto } from './dto/open-chat-request.dto';
import { OpenedChatResponseDto } from './dto/open-chat-repsponse.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat) private chatModel: typeof Chat,
    @InjectModel(Message) private messageModel: typeof Message,
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(ChatParticipant)
    private chatParticipantModel: typeof ChatParticipant,

    private readonly usersService: UsersService,
  ) {}

  async getOrCreateChat(
    payload: OpenChatRequestDto,
  ): Promise<OpenedChatResponseDto> {
    return tryCatchWs(async () => {
      let userId = payload.userId;
      let isGuest = false;

      if (!userId) {
        userId = await this.usersService.createGuestUser();
        isGuest = true;
        console.log('Guest userId created:', userId);
      } else {
        console.log('UserId from payload:', userId);
      }

      const participant = await this.chatParticipantModel.findOne({
        where: { userId },
        include: [{ model: Chat, where: { status: DEFAULT_CHAT_STATUS } }],
        order: [['createdAt', 'DESC']],
      });

      if (participant) {
        const chatParticipants = await this.getChatParticipants(
          participant.chat.id,
        );
        return {
          chatParticipants,
          chat: participant.chat,
          user: { id: userId, isGuest },
        };
      }

      const chat = await this.chatModel.create({ status: DEFAULT_CHAT_STATUS });
      await this.chatParticipantModel.create({ chatId: chat.id, userId });
      const chatParticipants = await this.getChatParticipants(chat.id);
      return {
        chat,
        user: { id: userId, isGuest },
        chatParticipants,
      };
    }, 'ChatService:getOrCreateChat');
  }

  async createMessage(dto: RequestMessageDto) {
    return tryCatchWs(async () => {
      const message = await this.messageModel.create({
        chatId: dto.chatId,
        userId: dto.userId,
        text: dto.text,
      });

      return await this.messageModel.findOne({
        where: { id: message.id },
        include: [
          {
            model: User,
            attributes: ['id', 'username', 'role'],
          },
        ],
      });
    }, 'ChatService:createMessage');
  }

  async getChatMessages(chatId: string) {
    return tryCatchWs(async () => {
      return await this.messageModel.findAll({
        where: { chatId },
        include: [
          {
            model: User,
            attributes: ['id', 'username', 'role'],
          },
        ],
        order: [['createdAt', 'ASC']],
      });
    }, 'ChatService:getChatMessages');
  }

  async joinChat(chatId: string, userId: string): Promise<Chat> {
    return tryCatchWs(async () => {
      const chat = await this.chatModel.findByPk(chatId);
      if (!chat) throwNotFound('Chat not found');

      const existingParticipant = await this.chatParticipantModel.findOne({
        where: { chatId, userId },
      });

      if (!existingParticipant) {
        await this.chatParticipantModel.create({ chatId, userId });
      }

      return chat;
    }, 'ChatService:joinChat');
  }

  async closeChat(chatId: string): Promise<Chat> {
    return tryCatchWs(async () => {
      const chat = await this.chatModel.findByPk(chatId);
      if (!chat) throwNotFound('Chat not found');

      chat.status = ChatStatus.CLOSED;
      await chat.save();

      return chat;
    }, 'ChatService:closeChat');
  }

  async getAllActiveChats() {
    return tryCatch(async () => {
      // Получаем чаты с участниками и юзерами
      return this.chatModel.findAll({
        where: { status: ChatStatus.ACTIVE },
        include: [
          {
            model: this.chatParticipantModel,
            as: 'participants',
            include: [{ model: User, attributes: ['id', 'username', 'role'] }],
          },
        ],
        order: [['updatedAt', 'DESC']],
      });
    }, 'ChatService:getAllActiveChats');
  }

  async getChatParticipants(chatId: string) {
    return tryCatch(async () => {
      return this.userModel.findAll({
        attributes: ['id', 'username', 'role'],
        include: [
          {
            model: this.chatParticipantModel,
            where: { chatId },
            attributes: [],
          },
        ],
        raw: true,
      });
    }, 'ChatService:getChatParticipants');
  }
}

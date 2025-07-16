import { Injectable } from '@nestjs/common';
import { Chat } from '../entitites/chat.entity';
import { RequestMessageDto } from '../dto/request-message.dto';
import { DEFAULT_CHAT_STATUS } from '../types/status';
import { tryCatch, tryCatchWs } from '../../../common/utils/try-catch.helper';
import { throwNotFound } from 'src/common/exceptions/http-exception.helper';
import { UsersService } from 'src/users/users.service';
import { OpenChatRequestDto } from '../dto/open-chat-request.dto';
import { OpenedChatResponseDto } from '../dto/open-chat-repsponse.dto';
import { ChatParticipantService } from '../domain/services/ChatParticipantService';
import { MessageService } from '../domain/services/MessageService';
import { ChatCrudService } from '../domain/services/ChatCrudService';
import { AppLogger } from 'src/common/logger/app-logger.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatCrudService: ChatCrudService,
    private readonly messageService: MessageService,
    private readonly chatParticipantService: ChatParticipantService,
    private readonly usersService: UsersService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(ChatService.name);
  }

  async getOrCreateChat(
    payload: OpenChatRequestDto,
  ): Promise<OpenedChatResponseDto> {
    return tryCatchWs(async () => {
      let userId = payload.userId;
      let isGuest = false;

      if (!userId) {
        userId = await this.usersService.createGuestUser();
        isGuest = true;
        this.logger.log(`Создан гостевой пользователь: ${userId}`);
      } else {
        this.logger.log(`Получен userId из payload: ${userId}`);
      }

      const participant =
        await this.chatParticipantService.findByUserId(userId);

      if (participant) {
        this.logger.log(
          `Найден существующий чат для userId: ${userId}, chatId: ${participant.chat.id}`,
        );
        return this.buildOpenedChatResponse(participant.chat, userId, isGuest);
      }

      const chat = await this.chatCrudService.create(DEFAULT_CHAT_STATUS);
      await this.chatParticipantService.join(chat.id, userId);
      this.logger.log(
        `Создан новый чат: ${chat.id}, добавлен участник userId: ${userId}`,
      );

      return this.buildOpenedChatResponse(chat, userId, isGuest);
    }, 'ChatService:getOrCreateChat');
  }

  async createMessage(dto: RequestMessageDto) {
    return tryCatchWs(async () => {
      const message = await this.messageService.create(dto);
      this.logger.log(
        `Создано сообщение: ${message.id}, chatId: ${dto.chatId}, userId: ${dto.userId}`,
      );
      return this.messageService.getByIdWithUser(message.id);
    }, 'ChatService:createMessage');
  }

  async getChatMessages(chatId: string) {
    return tryCatchWs(async () => {
      this.logger.log(`Получение сообщений для чата: ${chatId}`);
      return this.messageService.findAllByChatIdWithUsers(chatId);
    }, 'ChatService:getChatMessages');
  }

  async joinChat(chatId: string, userId: string): Promise<Chat> {
    return tryCatchWs(async () => {
      const chat = await this.chatCrudService.findById(chatId);
      if (!chat) {
        this.logger.warn(
          `Попытка присоединиться к несуществующему чату: ${chatId}`,
        );
        throwNotFound('Chat not found');
      }

      await this.chatParticipantService.join(chatId, userId);
      this.logger.log(`Пользователь ${userId} присоединился к чату ${chatId}`);

      return chat;
    }, 'ChatService:joinChat');
  }

  async closeChat(chatId: string): Promise<Chat> {
    return tryCatchWs(async () => {
      const chat = await this.chatCrudService.close(chatId);
      this.logger.log(`Чат закрыт: ${chatId}`);
      return chat;
    }, 'ChatService:closeChat');
  }

  async getAllActiveChats() {
    return tryCatch(async () => {
      this.logger.log('Получение всех активных чатов');
      return this.chatCrudService.findActiveWithParticipants();
    }, 'ChatService:getAllActiveChats');
  }

  async getChatParticipants(chatId: string) {
    return tryCatch(async () => {
      this.logger.log(`Получение участников для чата: ${chatId}`);
      return this.chatParticipantService.findParticipantsByChatId(chatId);
    }, 'ChatService:getChatParticipants');
  }

  private async buildOpenedChatResponse(
    chat: Chat,
    userId: string,
    isGuest: boolean,
  ): Promise<OpenedChatResponseDto> {
    const chatParticipants = await this.getChatParticipants(chat.id);
    this.logger.log(
      `Сборка ответа для открытого чата: ${chat.id}, userId: ${userId}, isGuest: ${isGuest}`,
    );
    return {
      chatParticipants,
      chat,
      user: { id: userId, isGuest },
    };
  }
}

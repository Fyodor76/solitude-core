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

@Injectable()
export class ChatService {
  constructor(
    private readonly chatCrudService: ChatCrudService,
    private readonly messageService: MessageService,
    private readonly chatParticipantService: ChatParticipantService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Получить существующий чат для пользователя или создать новый.
   * Если userId отсутствует — создаёт гостевого пользователя.
   * Возвращает DTO с чатом, участниками и информацией о пользователе.
   * @param payload DTO с userId (может отсутствовать)
   * @returns Открытый чат с участниками и пользователем
   */
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

      const participant =
        await this.chatParticipantService.findByUserId(userId);

      if (participant) {
        return this.buildOpenedChatResponse(participant.chat, userId, isGuest);
      }

      const chat = await this.chatCrudService.create(DEFAULT_CHAT_STATUS);
      await this.chatParticipantService.join(chat.id, userId);

      return this.buildOpenedChatResponse(chat, userId, isGuest);
    }, 'ChatService:getOrCreateChat');
  }

  /**
   * Создаёт новое сообщение в чате.
   * Использует сервис сообщений для создания, затем возвращает сообщение с данными пользователя.
   * @param dto Данные сообщения (chatId, userId, текст)
   * @returns Сообщение с информацией о пользователе
   */
  async createMessage(dto: RequestMessageDto) {
    return tryCatchWs(async () => {
      const message = await this.messageService.create(dto);
      return this.messageService.getByIdWithUser(message.id);
    }, 'ChatService:createMessage');
  }

  /**
   * Получить все сообщения чата с информацией об авторах.
   * @param chatId Идентификатор чата
   * @returns Список сообщений с данными пользователей
   */
  async getChatMessages(chatId: string) {
    return tryCatchWs(async () => {
      return this.messageService.findAllByChatIdWithUsers(chatId);
    }, 'ChatService:getChatMessages');
  }

  /**
   * Добавляет пользователя в чат.
   * Проверяет существование чата, затем добавляет участника.
   * @param chatId Идентификатор чата
   * @param userId Идентификатор пользователя
   * @returns Обновлённый объект чата
   */
  async joinChat(chatId: string, userId: string): Promise<Chat> {
    return tryCatchWs(async () => {
      const chat = await this.chatCrudService.findById(chatId);
      if (!chat) throwNotFound('Chat not found');

      await this.chatParticipantService.join(chatId, userId);

      return chat;
    }, 'ChatService:joinChat');
  }

  /**
   * Закрывает чат, меняя его статус.
   * @param chatId Идентификатор чата
   * @returns Обновлённый объект чата
   */
  async closeChat(chatId: string): Promise<Chat> {
    return tryCatchWs(async () => {
      return this.chatCrudService.close(chatId);
    }, 'ChatService:closeChat');
  }

  /**
   * Получить список всех активных чатов с их участниками.
   * @returns Массив активных чатов с участниками
   */
  async getAllActiveChats() {
    return tryCatch(async () => {
      return this.chatCrudService.findActiveWithParticipants();
    }, 'ChatService:getAllActiveChats');
  }

  /**
   * Получить список участников чата по идентификатору чата.
   * @param chatId Идентификатор чата
   * @returns Список участников с их данными
   */
  async getChatParticipants(chatId: string) {
    return tryCatch(async () => {
      return this.chatParticipantService.findParticipantsByChatId(chatId);
    }, 'ChatService:getChatParticipants');
  }

  /**
   * Вспомогательный метод для сборки DTO с открытым чатом.
   * Формирует объект с чатами, участниками и пользователем.
   * @param chat Объект чата
   * @param userId Идентификатор пользователя
   * @param isGuest Флаг гостевого пользователя
   * @returns DTO с открытым чатом и участниками
   */
  private async buildOpenedChatResponse(
    chat: Chat,
    userId: string,
    isGuest: boolean,
  ): Promise<OpenedChatResponseDto> {
    const chatParticipants = await this.getChatParticipants(chat.id);
    return {
      chatParticipants,
      chat,
      user: { id: userId, isGuest },
    };
  }
}

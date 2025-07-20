import { Injectable } from '@nestjs/common';
import { Chat } from '../entitites/chat.entity';
import { RequestMessageDto } from '../dto/request-message.dto';
import { DEFAULT_CHAT_STATUS } from '../types/status';
import { tryCatch, tryCatchWs } from '../../../common/utils/try-catch.helper';
import { throwNotFound } from 'src/common/exceptions/http-exception.helper';
import { UsersService } from 'src/users/users.service';
import { OpenChatRequestDto } from '../dto/open-chat-request.dto';
import { ChatParticipantService } from '../domain/services/ChatParticipantService';
import { MessageService } from '../domain/services/MessageService';
import { ChatCrudService } from '../domain/services/ChatCrudService';
import { AppLogger } from '../../../common/logger/app-logger.service';
import { mapChatToDto } from '../mappers/map-chat-to-dto';
import { User } from 'src/users/user.entity';
import { mapUserToDto } from '../mappers/map-user-to-dto';
import { mapMessageToDto } from '../mappers/map-message-to-dto';

/**
 * Сервис для управления логикой чата.
 * Отвечает за создание чатов, отправку сообщений, получение участников и сообщений.
 */
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

  /**
   * Получает существующий чат для пользователя или создаёт новый.
   * Если userId не передан, создаётся гостевой пользователь.
   *
   * @param payload - Данные для открытия чата
   * @returns Объект с данными чата, пользователя и участников
   */
  async getOrCreateChat(payload: OpenChatRequestDto) {
    return tryCatchWs(async () => {
      let user;

      if (!payload.userId) {
        user = await this.usersService.createGuestUser();
        this.logger.log(`Создан гостевой пользователь: ${user.id}`);
      } else {
        user = await this.usersService.findById(payload.userId);
        this.logger.log(`Получен userId из payload: ${payload.userId}`);
      }

      const participant = await this.chatParticipantService.findByUserId(
        user.id,
      );

      if (participant) {
        this.logger.log(
          `Найден существующий чат для userId: ${participant.userId}, chatId: ${participant.chat.id}`,
        );
        return this.buildOpenedChatResponse(participant.chat, user);
      }

      const chat = await this.chatCrudService.create(DEFAULT_CHAT_STATUS);
      await this.chatParticipantService.join(chat.id, user.id);
      this.logger.log(
        `Создан новый чат: ${chat.id}, добавлен участник userId: ${user.id}`,
      );

      return this.buildOpenedChatResponse(chat, user);
    }, 'ChatService:getOrCreateChat');
  }

  /**
   * Создаёт новое сообщение в чате.
   *
   * @param dto - Данные сообщения
   * @returns DTO созданного сообщения
   */
  async createMessage(dto: RequestMessageDto) {
    return tryCatchWs(async () => {
      const message = await this.messageService.create(dto);
      this.logger.log(
        `Создано сообщение: ${message.id}, chatId: ${dto.chatId}, userId: ${dto.userId}`,
      );
      return mapMessageToDto(message);
    }, 'ChatService:createMessage');
  }

  /**
   * Получает все сообщения для указанного чата.
   *
   * @param chatId - Идентификатор чата
   * @returns Список сообщений в DTO формате
   */
  async getChatMessages(chatId: string) {
    return tryCatchWs(async () => {
      this.logger.log(`Получение сообщений для чата: ${chatId}`);
      const messages =
        await this.messageService.findAllByChatIdWithUsers(chatId);
      return messages.map((m) => mapMessageToDto(m));
    }, 'ChatService:getChatMessages');
  }

  /**
   * Присоединяет пользователя к чату.
   *
   * @param chatId - Идентификатор чата
   * @param userId - Идентификатор пользователя
   * @returns DTO чата
   */
  async joinChat(chatId: string, userId: string) {
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

      return mapChatToDto(chat);
    }, 'ChatService:joinChat');
  }

  /**
   * Закрывает указанный чат.
   *
   * @param chatId - Идентификатор чата
   * @returns DTO закрытого чата
   */
  async closeChat(chatId: string) {
    return tryCatchWs(async () => {
      const chat = await this.chatCrudService.close(chatId);
      this.logger.log(`Чат закрыт: ${chatId}`);
      return mapChatToDto(chat);
    }, 'ChatService:closeChat');
  }

  /**
   * Получает все активные чаты (например, для админки или мониторинга).
   *
   * @returns Список активных чатов в DTO формате
   */
  async getAllActiveChats() {
    return tryCatch(async () => {
      this.logger.log('Получение всех активных чатов');
      const activeChats =
        await this.chatCrudService.findActiveWithParticipants();
      return activeChats.map((chat) => mapChatToDto(chat));
    }, 'ChatService:getAllActiveChats');
  }

  /**
   * Получает список участников для указанного чата.
   *
   * @param chatId - Идентификатор чата
   * @returns Список участников чата
   */
  async getChatParticipants(chatId: string) {
    return tryCatch(async () => {
      this.logger.log(`Получение участников для чата: ${chatId}`);
      return this.chatParticipantService.findParticipantsByChatId(chatId);
    }, 'ChatService:getChatParticipants');
  }

  /**
   * Формирует ответ при открытии чата, включая участников и пользователя.
   *
   * @param chat - Сущность чата
   * @param user - Сущность пользователя
   * @returns DTO с чатом, пользователем и участниками
   */
  private async buildOpenedChatResponse(chat: Chat, user: User) {
    const chatParticipants = await this.getChatParticipants(chat.id);
    this.logger.log(
      `Сборка ответа для открытого чата: ${chat.id}, userId: ${user.id}, role: ${user.role}`,
    );
    return {
      chatParticipants: chatParticipants.map((p) => mapUserToDto(p)),
      chat: mapChatToDto(chat),
      user: mapUserToDto(user),
    };
  }
}

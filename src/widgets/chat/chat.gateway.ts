import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';

import { OpenChatRequestDto } from './dto/open-chat-request.dto';
import { JoinChatRequestDto } from './dto/join-chat-request.dto';
import { CloseChatRequestDto } from './dto/close-chat-request.dto';
import { RequestMessageDto } from './dto/request-message.dto';
import { OpenedChatResponseDto } from './dto/open-chat-repsponse.dto';
import { UserJoinedResponseDto } from './dto/user-joined-reponse.dto';
import { ChatClosedResponseDto } from './dto/close-chat-response.dto';
import { Events, SocketEvents } from './const/chat-events';

import { UseFilters } from '@nestjs/common';
import { AllWsExceptionsFilter } from 'src/common/filters/all-ws-exceptions.filter';
import { mapMessageWithUserDto } from './helpers/mapMessageWithUserDto';
import { mapActiveChatWithDto } from './helpers/mapActiveChatWithDto';
import { Logger } from '@nestjs/common';
/**
 * WebSocket Gateway для чата.
 * Обрабатывает подключения, отключения и события чата.
 */
@UseFilters(AllWsExceptionsFilter)
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatGateway.name);

  constructor(private chatService: ChatService) {}

  private server: Server;

  /**
   * Отображение clientId сокета на userId.
   * Нужно для отслеживания, какой пользователь связан с каким соединением.
   */
  private socketUserMap: Map<string, string> = new Map();

  /**
   * Структура для отслеживания, в каких чатах и с какими клиентами подключен пользователь.
   * Формат: userId -> Map<chatId, Set<clientId>>
   */
  private userChatsMap: Map<string, Map<string, Set<string>>> = new Map();

  /**
   * Структура для отслеживания чата, в котором человек начинает печатать
   * Формат: ChatId -> Set<UserId>
   */
  private typingUsersMap: Map<string, Set<string>> = new Map();

  /**
   * Карта таймаутов для отслеживания активности печатания пользователей.
   * Формат: userId -> NodeJS.Timeout
   */
  private typingTimeoutsMap: Map<string, Map<string, NodeJS.Timeout>> =
    new Map();

  /**
   * Вызывается после инициализации WebSocket сервера.
   * @param server Экземпляр Socket.IO сервера.
   */
  afterInit(server: Server): void {
    this.server = server;
    this.logger.log('WebSocket initialized');
  }

  /**
   * Обрабатывает событие подключения нового клиента.
   * @param client Подключённый клиентский сокет.
   */
  handleConnection(client: Socket): void {
    this.logger.log(`Client connected: ${client.id}`);
  }

  /**
   * Обрабатывает событие отключения клиента.
   * Удаляет клиента из всех чатов и внутренних структур.
   * @param client Подключённый клиентский сокет.
   */
  handleDisconnect(client: Socket): void {
    this.logger.warn(`Client disconnected: ${client.id}`);
    this.removeClientFromChats(client.id);
  }

  /**
   * Обработка запроса на открытие чата.
   * Получает или создаёт чат и связывает клиента с ним.
   * @param data Данные запроса на открытие чата.
   * @param client Сокет клиента.
   */
  @SubscribeMessage(SocketEvents.OPEN_CHAT)
  async handleOpenChat(
    @MessageBody() data: OpenChatRequestDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const chatData = await this.chatService.getOrCreateChat(data);
    await this.connectClientToChat(client, chatData.chat.id, chatData.user.id);

    const chatOpenedResponse: OpenedChatResponseDto = {
      ...chatData,
    };

    client.emit(Events.CHAT_OPENED, chatOpenedResponse);

    const activeChats = await this.chatService.getAllActiveChats();
    this.server.emit(
      Events.ACTIVE_CHATS_UPDATED,
      activeChats.map((activeChat) => mapActiveChatWithDto(activeChat)),
    );
  }

  /**
   * Обработка отправки нового сообщения.
   * Создаёт сообщение через сервис и рассылает всем участникам чата.
   * @param data Данные сообщения, включая chatId и контент.
   */
  @SubscribeMessage(SocketEvents.SEND_MESSAGE)
  async handleMessage(@MessageBody() data: RequestMessageDto) {
    const messages = await this.chatService.createMessage(data);
    this.server
      .to(data.chatId)
      .emit(Events.NEW_MESSAGE, mapMessageWithUserDto(messages));
  }

  /**
   * Обработка запроса пользователя присоединиться к чату.
   * Связывает клиента с чатом и оповещает других участников.
   * @param data Данные с chatId и userId.
   * @param client Сокет клиента.
   */
  @SubscribeMessage(SocketEvents.JOIN_CHAT)
  async handleJoinChat(
    @MessageBody() data: JoinChatRequestDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const chat = await this.chatService.joinChat(data.chatId, data.userId);

    await this.connectClientToChat(client, chat.id, data.userId);

    const chatParticipants = await this.chatService.getChatParticipants(
      data.chatId,
    );
    const chatInfo: UserJoinedResponseDto = {
      userId: data.userId,
      chatParticipants: chatParticipants,
    };
    this.server.to(chat.id).emit(Events.USER_JOINED, chatInfo);
  }

  /**
   * Обработка закрытия чата.
   * Закрывает чат через сервис и оповещает всех участников.
   * @param data Данные с chatId.
   */
  @SubscribeMessage(SocketEvents.CLOSE_CHAT)
  async handleCloseChat(
    @MessageBody() data: CloseChatRequestDto,
  ): Promise<void> {
    const chat = await this.chatService.closeChat(data.chatId);

    const response: ChatClosedResponseDto = {
      chatId: chat.id,
    };

    this.server.to(chat.id).emit(Events.CHAT_CLOSED, response);
  }

  /**
   * Обработчик события начала печатания пользователя в чате.
   * Добавляет пользователя в список печатающих и устанавливает таймаут для автоматического удаления.
   *
   * @param data Объект с идентификатором чата
   * @param client Сокет-клиент, от которого пришло событие
   */
  @SubscribeMessage(SocketEvents.TYPING)
  async handleTyping(
    @MessageBody() data: { chatId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const userId = this.socketUserMap.get(client.id);
      if (!userId) {
        throw new WsException('User not found in socketUserMap');
      }

      this.clearTypingTimeout(data.chatId, userId);

      // Инициализируем Set для чата, если его нет
      if (!this.typingUsersMap.has(data.chatId)) {
        this.typingUsersMap.set(data.chatId, new Set<string>());
      }

      const typingUsers = this.typingUsersMap.get(data.chatId);
      if (!typingUsers) {
        throw new WsException('Failed to get typingUsers set');
      }

      typingUsers.add(userId);

      this.setTypingTimeout(client, userId, data.chatId);

      this.notifyChatAboutTyping(client, data.chatId);
    } catch (error) {
      throw new WsException('Error processing typing event');
    }
  }

  /**
   * Обработчик события прекращения печатания пользователя в чате.
   * Немедленно удаляет пользователя из списка печатающих.
   *
   * @param data Объект с идентификатором чата
   * @param client Сокет-клиент, от которого пришло событие
   */
  @SubscribeMessage(SocketEvents.STOP_TYPING)
  async handleStopTyping(
    @MessageBody() data: { chatId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = this.socketUserMap.get(client.id);
    if (!userId) return;

    this.clearTypingTimeout(data.chatId, userId);

    const typingUsers = this.typingUsersMap.get(data.chatId);
    if (typingUsers?.has(userId)) {
      typingUsers.delete(userId);
      this.notifyChatAboutTyping(client, data.chatId);
    }
  }

  /** PRIVATE METHODS */
  /**
   * Привязывает клиента к чату:
   * - Добавляет в внутренние структуры для отслеживания участия пользователя.
   * - Присоединяет сокет к комнате Socket.IO с идентификатором чата.
   * - Отправляет клиенту историю сообщений чата.
   *
   * @param client Клиентский сокет.
   * @param chatId Идентификатор чата.
   * @param userId Идентификатор пользователя.
   */
  private async connectClientToChat(
    client: Socket,
    chatId: string,
    userId: string | null,
  ): Promise<void> {
    if (userId) this.registerClientInChat(userId, chatId, client.id);

    if (!client.rooms.has(chatId)) client.join(chatId);

    const messages = await this.chatService.getChatMessages(chatId);

    client.emit(
      Events.CHAT_HISTORY,
      messages.map((m) => mapMessageWithUserDto(m)),
    );
  }

  @SubscribeMessage(SocketEvents.GET_ACTIVE_CHATS)
  async handleGetActiveChats(@ConnectedSocket() client: Socket) {
    const activeChats = await this.chatService.getAllActiveChats();

    client.emit(
      Events.ACTIVE_CHATS_UPDATED,
      activeChats.map((activeChat) => mapActiveChatWithDto(activeChat)),
    );
  }

  /**
   * Добавляет клиентский сокет в структуру отслеживания чатов пользователя.
   *
   * userId -> chatId -> Set<socketId>
   *
   * @param userId   Пользователь, который подключается к чату.
   * @param chatId   Чат, к которому он подключается.
   * @param clientId socket.id клиента (вкладка / соединение).
   */
  private registerClientInChat(
    userId: string,
    chatId: string,
    clientId: string,
  ): void {
    // Привязываем socketId к userId
    this.socketUserMap.set(clientId, userId);
    // socketUserMap:
    // socketId -> userId

    // Получаем карту чатов для пользователя (userId -> Map<chatId, Set<socketId>>)
    let chatMap = this.userChatsMap.get(userId);

    // Если пользователь ещё нигде не участвовал → создаём новую мапу
    if (!chatMap) {
      chatMap = new Map();
      this.userChatsMap.set(userId, chatMap);
    }

    // Получаем множество socketId для чата (чтобы понимать, в скольких вкладках юзер сидит в чате)
    let clientSet = chatMap.get(chatId);

    // Если пользователь ещё не подключался к этому чату → создаём Set
    if (!clientSet) {
      clientSet = new Set();
      chatMap.set(chatId, clientSet);
    }

    // Добавляем конкретный socketId в множество сокетов для этого чата
    clientSet.add(clientId);
  }

  /**
   * Удаляет клиента из всех чатов, в которых он был зарегистрирован.
   * Если в чате после этого никого не осталось — отправляет событие о выходе.
   *
   * @param clientId Идентификатор сокет-клиента.
   */
  private removeClientFromChats(clientId: string): void {
    const userId = this.socketUserMap.get(clientId);
    if (!userId) return;

    const chatMap = this.userChatsMap.get(userId);
    if (!chatMap) return;

    for (const [chatId, clientSet] of chatMap.entries()) {
      clientSet.delete(clientId);
      if (clientSet.size === 0) {
        this.server.to(chatId).emit(Events.USER_LEFT, { userId });
        chatMap.delete(chatId);
      }
    }

    for (const [chatId, typingUsers] of this.typingUsersMap.entries()) {
      typingUsers.delete(userId);
      this.clearTypingTimeout(chatId, userId);

      if (typingUsers.size === 0) {
        this.typingUsersMap.delete(chatId);
      }
    }

    if (chatMap.size === 0) {
      this.userChatsMap.delete(userId);
    }

    this.socketUserMap.delete(clientId);
  }

  /**
   * Очищает таймаут печатания для указанного пользователя.
   *
   * @param userId Идентификатор пользователя, для которого нужно очистить таймаут
   */
  private clearTypingTimeout(chatId: string, userId: string) {
    const chatTimeouts = this.typingTimeoutsMap.get(chatId);
    if (chatTimeouts && chatTimeouts.has(userId)) {
      clearTimeout(chatTimeouts.get(userId));
      chatTimeouts.delete(userId);
      if (chatTimeouts.size === 0) this.typingTimeoutsMap.delete(chatId);
    }
  }

  /**
   * Устанавливает новый таймаут для автоматического удаления пользователя из списка печатающих.
   *
   * @param client Сокет-клиент
   * @param userId Идентификатор пользователя
   * @param chatId Идентификатор чата
   */
  private setTypingTimeout(client: Socket, userId: string, chatId: string) {
    // Получаем или создаём Map для конкретного чата
    let chatTimeouts = this.typingTimeoutsMap.get(chatId);
    if (!chatTimeouts) {
      chatTimeouts = new Map<string, NodeJS.Timeout>();
      this.typingTimeoutsMap.set(chatId, chatTimeouts);
    }

    // Если уже есть таймер для этого пользователя — очистим старый
    if (chatTimeouts.has(userId)) {
      clearTimeout(chatTimeouts.get(userId));
    }

    // Ставим новый таймер
    const timeout = setTimeout(() => {
      const typingUsers = this.typingUsersMap.get(chatId);
      if (typingUsers) {
        typingUsers.delete(userId);
        this.notifyChatAboutTyping(client, chatId);
      }

      chatTimeouts.delete(userId);
      if (chatTimeouts.size === 0) {
        this.typingTimeoutsMap.delete(chatId);
      }
    }, 2000);

    // Запоминаем таймер
    chatTimeouts.set(userId, timeout);
  }

  /**
   * Отправляет обновленный список печатающих пользователей всем участникам чата,
   * исключая отправителя события.
   *
   * @param client Сокет-клиент, инициировавший событие
   * @param chatId Идентификатор чата
   */
  private notifyChatAboutTyping(client: Socket, chatId: string) {
    const typingUsers = this.typingUsersMap.get(chatId) || new Set();
    const userIds = Array.from(typingUsers);

    client.to(chatId).emit(Events.ACTIVE_TYPING_USERS, {
      chatId,
      userIds,
    });
  }
}

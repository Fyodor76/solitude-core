import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
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
  constructor(private chatService: ChatService) {}

  private server: Server;

  /**
   * Отображение clientId сокета на userId.
   * Нужно для отслеживания, какой пользователь связан с каким соединением.
   */
  private socketUserMap = new Map<string, string>();

  /**
   * Структура для отслеживания, в каких чатах и с какими клиентами подключен пользователь.
   * Формат: userId -> Map<chatId, Set<clientId>>
   */
  private userChatsMap = new Map<string, Map<string, Set<string>>>();

  /**
   * Вызывается после инициализации WebSocket сервера.
   * @param server Экземпляр Socket.IO сервера.
   */
  afterInit(server: Server): void {
    this.server = server;
    console.log('WebSocket initialized');
  }

  /**
   * Обрабатывает событие подключения нового клиента.
   * @param client Подключённый клиентский сокет.
   */
  handleConnection(client: Socket): void {
    console.log(`Client connected: ${client.id}`);
  }

  /**
   * Обрабатывает событие отключения клиента.
   * Удаляет клиента из всех чатов и внутренних структур.
   * @param client Подключённый клиентский сокет.
   */
  handleDisconnect(client: Socket): void {
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
    const { chat, user } = await this.chatService.getOrCreateChat(data);

    await this.setupClientForChat(client, chat.id, user.id);

    const chatOpenedResponse: OpenedChatResponseDto = {
      chat,
      user,
    };

    client.emit(Events.CHAT_OPENED, chatOpenedResponse);

    const activeChats = await this.chatService.getAllActiveChats();
    this.server.emit(
      'active_chats_updated',
      activeChats.map((activeChat) => mapActiveChatWithDto(activeChat)),
    );
  }

  /**
   * Обработка отправки нового сообщения.
   * Создаёт сообщение через сервис и рассылает всем участникам чата.
   * @param data Данные сообщения, включая chatId и текст.
   * @returns Созданное сообщение.
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

    await this.setupClientForChat(client, chat.id, data.userId);

    const response: UserJoinedResponseDto = { userId: data.userId };
    client.to(chat.id).emit(Events.USER_JOINED, response);
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
   * Привязывает клиента к чату:
   * - Добавляет в внутренние структуры для отслеживания участия пользователя.
   * - Присоединяет сокет к комнате Socket.IO с идентификатором чата.
   * - Отправляет клиенту историю сообщений чата.
   *
   * @param client Клиентский сокет.
   * @param chatId Идентификатор чата.
   * @param userId Идентификатор пользователя.
   */
  private async setupClientForChat(
    client: Socket,
    chatId: string,
    userId: string | null,
  ): Promise<void> {
    if (userId) this.addClientToChat(userId, chatId, client.id);

    if (!client.rooms.has(chatId)) client.join(chatId);

    const messages = await this.chatService.getChatMessages(chatId);

    client.emit(
      Events.CHAT_HISTORY,
      messages.map((m) => mapMessageWithUserDto(m)),
    );
  }

  @SubscribeMessage('get_active_chats')
  async handleGetActiveChats(@ConnectedSocket() client: Socket) {
    const activeChats = await this.chatService.getAllActiveChats();

    client.emit(
      'active_chats_updated',
      activeChats.map((activeChat) => mapActiveChatWithDto(activeChat)),
    );
  }

  /**
   * Добавляет клиента (socketId) к внутренним структурам для отслеживания,
   * что пользователь участвует в конкретном чате.
   *
   * @param userId Идентификатор пользователя.
   * @param chatId Идентификатор чата.
   * @param clientId Идентификатор сокет-клиента.
   */
  private addClientToChat(
    userId: string,
    chatId: string,
    clientId: string,
  ): void {
    this.socketUserMap.set(clientId, userId);

    let chatMap = this.userChatsMap.get(userId);
    if (!chatMap) {
      chatMap = new Map();
      this.userChatsMap.set(userId, chatMap);
    }

    let clientSet = chatMap.get(chatId);
    if (!clientSet) {
      clientSet = new Set();
      chatMap.set(chatId, clientSet);
    }

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
        // Оповещаем остальных участников, что пользователь вышел из чата
        this.server.to(chatId).emit(Events.USER_LEFT, { userId });
        chatMap.delete(chatId);
      }
    }

    if (chatMap.size === 0) {
      this.userChatsMap.delete(userId);
    }

    this.socketUserMap.delete(clientId);
  }
}

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
import { ChatService } from './application/chat.service';
import { Server, Socket } from 'socket.io';

import { OpenChatRequestDto } from './dto/open-chat-request.dto';
import { JoinChatRequestDto } from './dto/join-chat-request.dto';
import { CloseChatRequestDto } from './dto/close-chat-request.dto';
import { RequestMessageDto } from './dto/request-message.dto';
import { Events, SocketEvents } from './const/chat-events';

import { UseFilters } from '@nestjs/common';
import { AllWsExceptionsFilter } from 'src/common/filters/all-ws-exceptions.filter';
import { mapMessageWithUserDto } from './domain/helpers/mapMessageWithUserDto';
import { mapActiveChatWithDto } from './domain/helpers/mapActiveChatWithDto';
import { SocketConnectionManager } from './application/socket-connection.manager';
import { TypingStatusManager } from './application/typing-status.manager';
import { AppLogger } from 'src/common/logger/app-logger.service';

/**
 * WebSocket Gateway для чата.
 * Обрабатывает подключения, отключения и события чата
 */
@UseFilters(AllWsExceptionsFilter)
@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private server: Server;

  constructor(
    private chatService: ChatService,
    private typingManager: TypingStatusManager,
    private connectionManager: SocketConnectionManager,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(ChatGateway.name);
  }

  /**
   * Инициализация WebSocket сервера.
   * @param server - WebSocket сервер
   */
  afterInit(server: Server): void {
    this.server = server;
    this.typingManager.setServer(server);
    this.logger.log('WebSocket initialized');
  }

  /**
   * Обработка подключения клиента
   * @param client - Socket клиент
   */
  handleConnection(client: Socket): void {
    this.logger.log(`Client connected: ${client.id}`);
  }

  /**
   * Обработка отключения клиента
   * @param client - Socket клиент
   */
  handleDisconnect(client: Socket): void {
    this.logger.warn(`Client disconnected: ${client.id}`);
    const { userId, leftChats } = this.connectionManager.removeClient(
      client.id,
    );

    if (userId) {
      this.typingManager.removeUserFromAllChats(userId);
      leftChats.forEach((chatId) => {
        this.logger.debug(`User ${userId} left chat ${chatId}`);
        this.server.to(chatId).emit(Events.USER_LEFT, { userId });
      });
    }
  }

  /**
   * Открытие чата или получение существующего.
   * @param data - Данные для открытия чата
   * @param client - Socket клиент
   */
  @SubscribeMessage(SocketEvents.OPEN_CHAT)
  async handleOpenChat(
    @MessageBody() data: OpenChatRequestDto,
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Opening chat for user: ${data.userId}`);
    const chatData = await this.chatService.getOrCreateChat(data);

    await this.connectClientToChat(client, chatData.chat.id, chatData.user.id);

    client.emit(Events.CHAT_OPENED, chatData);

    const activeChats = await this.chatService.getAllActiveChats();
    this.server.emit(
      Events.ACTIVE_CHATS_UPDATED,
      activeChats.map(mapActiveChatWithDto),
    );

    this.logger.debug(`Chat ${chatData.chat.id} opened and client joined`);
  }

  /**
   * Отправка сообщения в чат
   * @param data - Данные сообщения
   */
  @SubscribeMessage(SocketEvents.SEND_MESSAGE)
  async handleMessage(@MessageBody() data: RequestMessageDto) {
    this.logger.log(`Sending message to chat ${data.chatId}`);
    const message = await this.chatService.createMessage(data);
    this.server
      .to(data.chatId)
      .emit(Events.NEW_MESSAGE, mapMessageWithUserDto(message));
  }

  /**
   * Присоединение пользователя к чату
   * @param data - Данные для подключения к чату
   * @param client - Socket клиент
   */
  @SubscribeMessage(SocketEvents.JOIN_CHAT)
  async handleJoinChat(
    @MessageBody() data: JoinChatRequestDto,
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`User ${data.userId} joining chat ${data.chatId}`);
    const chat = await this.chatService.joinChat(data.chatId, data.userId);
    await this.connectClientToChat(client, chat.id, data.userId);

    const participants = await this.chatService.getChatParticipants(
      data.chatId,
    );
    this.server.to(chat.id).emit(Events.USER_JOINED, {
      userId: data.userId,
      chatParticipants: participants,
    });
  }

  /**
   * Закрытие чата
   * @param data - Данные для закрытия чата
   */
  @SubscribeMessage(SocketEvents.CLOSE_CHAT)
  async handleCloseChat(@MessageBody() data: CloseChatRequestDto) {
    this.logger.warn(`Closing chat ${data.chatId}`);
    const chat = await this.chatService.closeChat(data.chatId);
    this.server.to(chat.id).emit(Events.CHAT_CLOSED, { chatId: chat.id });
  }

  /**
   * Обработка события начала набора текста
   * @param data - ID чата
   * @param client - Socket клиент
   */
  @SubscribeMessage(SocketEvents.TYPING)
  async handleTyping(
    @MessageBody() data: { chatId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = this.connectionManager.getUserIdBySocket(client.id);
    if (!userId) {
      this.logger.error(`Typing event: User not found for socket ${client.id}`);
      throw new WsException('User not found');
    }

    this.logger.debug(`User ${userId} is typing in chat ${data.chatId}`);
    this.typingManager.userStartedTyping(userId, data.chatId);
  }

  /**
   * Обработка события остановки набора текста
   * @param data - ID чата
   * @param client - Socket клиент
   */
  @SubscribeMessage(SocketEvents.STOP_TYPING)
  async handleStopTyping(
    @MessageBody() data: { chatId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = this.connectionManager.getUserIdBySocket(client.id);
    if (!userId) {
      this.logger.warn(`StopTyping: userId not found for socket ${client.id}`);
      return;
    }

    this.logger.debug(`User ${userId} stopped typing in chat ${data.chatId}`);
    this.typingManager.userStoppedTyping(data.chatId, userId);
  }

  /**
   * Получение списка активных чатов
   * @param client - Socket клиент
   */
  @SubscribeMessage(SocketEvents.GET_ACTIVE_CHATS)
  async handleGetActiveChats(@ConnectedSocket() client: Socket) {
    this.logger.debug(`Client ${client.id} requested active chats`);
    const activeChats = await this.chatService.getAllActiveChats();
    client.emit(
      Events.ACTIVE_CHATS_UPDATED,
      activeChats.map(mapActiveChatWithDto),
    );
  }

  /**
   * Подключение клиента к конкретному чату
   * @param client - Socket клиент
   * @param chatId - ID чата
   * @param userId - ID пользователя
   */
  private async connectClientToChat(
    client: Socket,
    chatId: string,
    userId: string,
  ) {
    this.logger.debug(`Connecting user ${userId} to chat ${chatId}`);
    this.connectionManager.registerClientInChat(userId, chatId, client.id);
    client.join(chatId);

    const messages = await this.chatService.getChatMessages(chatId);
    client.emit(Events.CHAT_HISTORY, messages.map(mapMessageWithUserDto));
  }
}

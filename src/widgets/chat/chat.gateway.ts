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
import { Logger } from '@nestjs/common';
import { SocketConnectionManager } from './application/socket-connection.manager';
import { TypingStatusManager } from './application/typing-status.manager';
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
  private logger = new Logger(ChatGateway.name);

  constructor(
    private chatService: ChatService,
    private typingManager: TypingStatusManager,
    private connectionManager: SocketConnectionManager,
  ) {}

  afterInit(server: Server): void {
    this.server = server;
    this.typingManager.setServer(server);
    this.logger.log('WebSocket initialized');
  }

  handleConnection(client: Socket): void {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    this.logger.warn(`Client disconnected: ${client.id}`);
    const { userId, leftChats } = this.connectionManager.removeClient(
      client.id,
    );

    if (userId) {
      this.typingManager.removeUserFromAllChats(userId);

      leftChats.forEach((chatId) => {
        this.server.to(chatId).emit(Events.USER_LEFT, { userId });
      });
    }
  }

  @SubscribeMessage(SocketEvents.OPEN_CHAT)
  async handleOpenChat(
    @MessageBody() data: OpenChatRequestDto,
    @ConnectedSocket() client: Socket,
  ) {
    const chatData = await this.chatService.getOrCreateChat(data);
    await this.connectClientToChat(client, chatData.chat.id, chatData.user.id);

    client.emit(Events.CHAT_OPENED, chatData);

    const activeChats = await this.chatService.getAllActiveChats();
    this.server.emit(
      Events.ACTIVE_CHATS_UPDATED,
      activeChats.map(mapActiveChatWithDto),
    );
  }

  @SubscribeMessage(SocketEvents.SEND_MESSAGE)
  async handleMessage(@MessageBody() data: RequestMessageDto) {
    const message = await this.chatService.createMessage(data);
    this.server
      .to(data.chatId)
      .emit(Events.NEW_MESSAGE, mapMessageWithUserDto(message));
  }

  @SubscribeMessage(SocketEvents.JOIN_CHAT)
  async handleJoinChat(
    @MessageBody() data: JoinChatRequestDto,
    @ConnectedSocket() client: Socket,
  ) {
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

  @SubscribeMessage(SocketEvents.CLOSE_CHAT)
  async handleCloseChat(@MessageBody() data: CloseChatRequestDto) {
    const chat = await this.chatService.closeChat(data.chatId);
    this.server.to(chat.id).emit(Events.CHAT_CLOSED, { chatId: chat.id });
  }

  @SubscribeMessage(SocketEvents.TYPING)
  async handleTyping(
    @MessageBody() data: { chatId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = this.connectionManager.getUserIdBySocket(client.id);
    if (!userId) throw new WsException('User not found');
    this.typingManager.userStartedTyping(userId, data.chatId);
  }

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
    this.typingManager.userStoppedTyping(data.chatId, userId);
  }

  @SubscribeMessage(SocketEvents.GET_ACTIVE_CHATS)
  async handleGetActiveChats(@ConnectedSocket() client: Socket) {
    const activeChats = await this.chatService.getAllActiveChats();
    client.emit(
      Events.ACTIVE_CHATS_UPDATED,
      activeChats.map(mapActiveChatWithDto),
    );
  }

  private async connectClientToChat(
    client: Socket,
    chatId: string,
    userId: string,
  ) {
    this.connectionManager.registerClientInChat(userId, chatId, client.id);
    client.join(chatId);

    const messages = await this.chatService.getChatMessages(chatId);
    client.emit(Events.CHAT_HISTORY, messages.map(mapMessageWithUserDto));
  }
}

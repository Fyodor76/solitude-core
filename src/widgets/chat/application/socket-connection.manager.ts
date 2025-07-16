import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SocketConnectionManager {
  private socketUserMap: Map<string, string> = new Map();
  private userChatsMap: Map<string, Map<string, Set<string>>> = new Map();
  private readonly logger = new Logger(SocketConnectionManager.name);

  registerClientInChat(userId: string, chatId: string, socketId: string): void {
    this.socketUserMap.set(socketId, userId);

    const chats = this.userChatsMap.get(userId) ?? new Map();
    this.userChatsMap.set(userId, chats);

    const sockets = chats.get(chatId) ?? new Set();
    chats.set(chatId, sockets);

    sockets.add(socketId);
  }

  removeClient(socketId: string): { userId?: string; leftChats: string[] } {
    const userId = this.socketUserMap.get(socketId);
    if (!userId) {
      this.logger.warn(`Socket ${socketId} not registered in socketUserMap`);
      return { leftChats: [] };
    }

    const chats = this.userChatsMap.get(userId);
    const leftChats: string[] = [];

    if (chats) {
      for (const [chatId, socketSet] of chats.entries()) {
        socketSet.delete(socketId);
        if (socketSet.size === 0) {
          leftChats.push(chatId);
          chats.delete(chatId);
        }
      }

      if (chats.size === 0) {
        this.userChatsMap.delete(userId);
      }
    }

    this.socketUserMap.delete(socketId);

    return { userId, leftChats };
  }

  getUserIdBySocket(socketId: string): string | undefined {
    return this.socketUserMap.get(socketId);
  }

  getSocketsForUserInChat(
    userId: string,
    chatId: string,
  ): Set<string> | undefined {
    return this.userChatsMap.get(userId)?.get(chatId);
  }

  removeUserFromChat(userId: string, chatId: string) {
    const chats = this.userChatsMap.get(userId);
    if (!chats) return;

    chats.delete(chatId);
    if (chats.size === 0) {
      this.userChatsMap.delete(userId);
    }
  }
}

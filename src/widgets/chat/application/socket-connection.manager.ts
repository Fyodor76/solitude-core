import { Injectable, Logger } from '@nestjs/common';

/**
 * Менеджер сокет-подключений для отслеживания пользователей и их чатов.
 * Позволяет регистрировать подключения, удалять их, получать связанные сокеты.
 */
@Injectable()
export class SocketConnectionManager {
  /**
   * Соответствие socketId → userId.
   */
  private socketUserMap: Map<string, string> = new Map();

  /**
   * Соответствие userId → { chatId → Set(socketId) }.
   */
  private userChatsMap: Map<string, Map<string, Set<string>>> = new Map();

  private readonly logger = new Logger(SocketConnectionManager.name);

  /**
   * Регистрирует подключение пользователя к чату.
   *
   * @param userId - Идентификатор пользователя
   * @param chatId - Идентификатор чата
   * @param socketId - Идентификатор сокет-сессии
   */
  registerClientInChat(userId: string, chatId: string, socketId: string): void {
    this.socketUserMap.set(socketId, userId);

    const chats = this.userChatsMap.get(userId) ?? new Map();
    this.userChatsMap.set(userId, chats);

    const sockets = chats.get(chatId) ?? new Set();
    chats.set(chatId, sockets);

    sockets.add(socketId);
  }

  /**
   * Удаляет подключение пользователя по socketId.
   * Если пользователь покинул все чаты, полностью очищает его данные.
   *
   * @param socketId - Идентификатор сокет-сессии
   * @returns Объект с userId (если найден) и списком чатов, из которых пользователь вышел
   */
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

  /**
   * Получает userId по socketId.
   *
   * @param socketId - Идентификатор сокета
   * @returns Идентификатор пользователя или undefined, если не найден
   */
  getUserIdBySocket(socketId: string): string | undefined {
    return this.socketUserMap.get(socketId);
  }

  /**
   * Получает все socketId пользователя в конкретном чате.
   *
   * @param userId - Идентификатор пользователя
   * @param chatId - Идентификатор чата
   * @returns Множество socketId или undefined, если не найдено
   */
  getSocketsForUserInChat(
    userId: string,
    chatId: string,
  ): Set<string> | undefined {
    return this.userChatsMap.get(userId)?.get(chatId);
  }

  /**
   * Удаляет пользователя из чата (все его сокеты из конкретного чата).
   * Если после этого у пользователя нет чатов — он полностью удаляется из userChatsMap.
   *
   * @param userId - Идентификатор пользователя
   * @param chatId - Идентификатор чата
   */
  removeUserFromChat(userId: string, chatId: string) {
    const chats = this.userChatsMap.get(userId);
    if (!chats) return;

    chats.delete(chatId);
    if (chats.size === 0) {
      this.userChatsMap.delete(userId);
    }
  }
}

import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { Events } from '../const/chat-events';

/**
 * Менеджер статуса "пользователь печатает".
 * Отслеживает пользователей, которые активно печатают в чатах,
 * и рассылает события с обновлением статуса.
 */
@Injectable()
export class TypingStatusManager {
  /**
   * Хранит активных печатающих пользователей по chatId.
   * Map<chatId, Set<userId>>
   */
  private typingUsersMap: Map<string, Set<string>> = new Map();

  /**
   * Хранит таймауты для прекращения статуса "печатает" по chatId и userId.
   * Map<chatId, Map<userId, Timeout>>
   */
  private typingTimeoutsMap: Map<string, Map<string, NodeJS.Timeout>> =
    new Map();

  /**
   * Экземпляр socket.io сервера.
   */
  private server: Server;

  /**
   * Устанавливает socket.io сервер для отправки событий.
   *
   * @param server - Экземпляр socket.io Server
   */
  setServer(server: Server) {
    this.server = server;
  }

  /**
   * Обрабатывает событие начала набора текста пользователем.
   * Запускает таймер на автоматическое прекращение статуса "печатает".
   *
   * @param userId - Идентификатор пользователя
   * @param chatId - Идентификатор чата
   */
  userStartedTyping(userId: string, chatId: string) {
    if (!this.typingUsersMap.has(chatId)) {
      this.typingUsersMap.set(chatId, new Set());
    }

    this.typingUsersMap.get(chatId)!.add(userId);
    this.resetTypingTimeout(userId, chatId);
    this.notifyTypingUpdate(chatId);
  }

  /**
   * Обрабатывает событие прекращения набора текста пользователем.
   * Удаляет пользователя из списка печатающих и рассылает обновление.
   *
   * @param userId - Идентификатор пользователя
   * @param chatId - Идентификатор чата
   */
  userStoppedTyping(userId: string, chatId: string) {
    this.clearTypingTimeout(userId, chatId);

    const users = this.typingUsersMap.get(chatId);
    if (users) {
      users.delete(userId);
      if (users.size === 0) {
        this.typingUsersMap.delete(chatId);
      }
    }

    this.notifyTypingUpdate(chatId);
  }

  /**
   * Удаляет пользователя из всех чатов, где он числится как печатающий.
   *
   * @param userId - Идентификатор пользователя
   */
  removeUserFromAllChats(userId: string) {
    for (const [chatId, users] of this.typingUsersMap.entries()) {
      if (users.has(userId)) {
        users.delete(userId);
        this.clearTypingTimeout(userId, chatId);
        if (users.size === 0) {
          this.typingUsersMap.delete(chatId);
        }
        this.notifyTypingUpdate(chatId);
      }
    }
  }

  /**
   * Сбрасывает таймер статуса "печатает" для пользователя в чате.
   * Через 2 секунды после последнего события "печатает" статус сбрасывается автоматически.
   *
   * @param userId - Идентификатор пользователя
   * @param chatId - Идентификатор чата
   */
  private resetTypingTimeout(userId: string, chatId: string) {
    if (!this.typingTimeoutsMap.has(chatId)) {
      this.typingTimeoutsMap.set(chatId, new Map());
    }

    const chatTimeouts = this.typingTimeoutsMap.get(chatId)!;

    if (chatTimeouts.has(userId)) {
      clearTimeout(chatTimeouts.get(userId)!);
    }

    const timeout = setTimeout(() => {
      this.userStoppedTyping(userId, chatId);
    }, 2000);

    chatTimeouts.set(userId, timeout);
  }

  /**
   * Очищает таймер статуса "печатает" для пользователя в чате.
   *
   * @param userId - Идентификатор пользователя
   * @param chatId - Идентификатор чата
   */
  private clearTypingTimeout(userId: string, chatId: string) {
    const chatTimeouts = this.typingTimeoutsMap.get(chatId);
    if (chatTimeouts?.has(userId)) {
      clearTimeout(chatTimeouts.get(userId)!);
      chatTimeouts.delete(userId);
      if (chatTimeouts.size === 0) this.typingTimeoutsMap.delete(chatId);
    }
  }

  /**
   * Рассылает в чат событие с актуальным списком печатающих пользователей.
   *
   * @param chatId - Идентификатор чата
   */
  private notifyTypingUpdate(chatId: string) {
    const users = Array.from(this.typingUsersMap.get(chatId) || []);
    this.server.to(chatId).emit(Events.ACTIVE_TYPING_USERS, {
      chatId,
      userIds: users,
    });
  }
}

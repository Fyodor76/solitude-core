import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { Events } from '../const/chat-events';

@Injectable()
export class TypingStatusManager {
  private typingUsersMap: Map<string, Set<string>> = new Map();
  private typingTimeoutsMap: Map<string, Map<string, NodeJS.Timeout>> =
    new Map();
  private server: Server;

  setServer(server: Server) {
    this.server = server;
  }

  userStartedTyping(userId: string, chatId: string) {
    if (!this.typingUsersMap.has(chatId)) {
      this.typingUsersMap.set(chatId, new Set());
    }

    this.typingUsersMap.get(chatId)!.add(userId);
    this.resetTypingTimeout(userId, chatId);
    this.notifyTypingUpdate(chatId);
  }

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

  private clearTypingTimeout(userId: string, chatId: string) {
    const chatTimeouts = this.typingTimeoutsMap.get(chatId);
    if (chatTimeouts?.has(userId)) {
      clearTimeout(chatTimeouts.get(userId)!);
      chatTimeouts.delete(userId);
      if (chatTimeouts.size === 0) this.typingTimeoutsMap.delete(chatId);
    }
  }

  private notifyTypingUpdate(chatId: string) {
    const users = Array.from(this.typingUsersMap.get(chatId) || []);
    this.server.to(chatId).emit(Events.ACTIVE_TYPING_USERS, {
      chatId,
      userIds: users,
    });
  }
}

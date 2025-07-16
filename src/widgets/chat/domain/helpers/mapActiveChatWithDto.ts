import { Chat } from '../../entitites/chat.entity';

export const mapActiveChatWithDto = (chat: Chat) => {
  return {
    chat: {
      id: chat.id,
      status: chat.status,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    },
    participants: (chat.participants || []).map((p) => p.user),
  };
};

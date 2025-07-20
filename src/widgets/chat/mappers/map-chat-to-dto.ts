import { Chat } from '../entitites/chat.entity';

export const mapChatToDto = (chat: Chat) => {
  return {
    id: chat.id,
    status: chat.status,
    createdAt: chat.createdAt,
    updatedAt: chat.updatedAt,
    participants: (chat.participants || []).map((p) => p.user),
  };
};

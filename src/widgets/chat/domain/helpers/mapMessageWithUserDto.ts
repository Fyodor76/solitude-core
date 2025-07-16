import { Message } from '../../entitites/message.entity';

export const mapMessageWithUserDto = (msg: Message) => {
  return {
    message: {
      id: msg.id,
      chatId: msg.chatId,
      content: msg.text,
      createdAt: msg.createdAt,
    },
    user: {
      id: msg.user.id,
      username: msg.user.username,
      role: msg.user.role,
    },
  };
};

import { Message } from '../entitites/message.entity';

export const mapMessageToDto = (message: Message) => {
  return {
    message: {
      id: message.id,
      userId: message.userId,
      chatId: message.chatId,
      text: message.text,
    },
    user: {
      id: message.user?.id,
    },
  };
};

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Chat } from '../../entitites/chat.entity';
import { DEFAULT_CHAT_STATUS } from '../../types/status';
import { User } from 'src/users/user.entity';
import { ChatParticipant } from '../../entitites/chat-participant.entity';

@Injectable()
export class ChatParticipantService {
  constructor(
    @InjectModel(ChatParticipant)
    private participantModel: typeof ChatParticipant,

    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  /**
   * Добавляет пользователя в чат (участник присоединяется к чату).
   * @param chatId Идентификатор чата
   * @param userId Идентификатор пользователя
   * @returns Созданная запись участника чата
   */
  async join(chatId: string, userId: string) {
    return this.participantModel.create({ chatId, userId });
  }

  /**
   * Находит участника по идентификатору пользователя.
   * Возвращает последний созданный участник, у которого чат в статусе по умолчанию.
   * @param userId Идентификатор пользователя
   * @returns Объект участника с вложенным чатом или null, если не найден
   */
  async findByUserId(userId: string) {
    return this.participantModel.findOne({
      where: { userId },
      include: [{ model: Chat, where: { status: DEFAULT_CHAT_STATUS } }],
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Получает список пользователей, участвующих в указанном чате.
   * Возвращает только id, username и роль пользователя.
   * @param chatId Идентификатор чата
   * @returns Массив пользователей (участников чата)
   */
  async findParticipantsByChatId(chatId: string) {
    return this.userModel.findAll({
      attributes: ['id', 'username', 'role'],
      include: [
        {
          model: ChatParticipant,
          where: { chatId },
          attributes: [],
        },
      ],
      raw: true,
    });
  }
}

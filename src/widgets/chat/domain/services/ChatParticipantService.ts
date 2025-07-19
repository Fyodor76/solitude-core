import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Chat } from '../../entitites/chat.entity';
import { DEFAULT_CHAT_STATUS } from '../../types/status';
import { User } from 'src/users/user.entity';
import { ChatParticipant } from '../../entitites/chat-participant.entity';
import { AppLogger } from 'src/common/logger/app-logger.service';

@Injectable()
export class ChatParticipantService {
  /**
   * Конструктор сервиса для работы с участниками чатов.
   * @param participantModel - Sequelize модель ChatParticipant
   * @param userModel - Sequelize модель User
   * @param logger - сервис логирования приложения
   */
  constructor(
    @InjectModel(ChatParticipant)
    private participantModel: typeof ChatParticipant,

    @InjectModel(User)
    private userModel: typeof User,

    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(ChatParticipantService.name);
  }

  /**
   * Добавляет пользователя в чат (создаёт запись участника).
   * @param chatId - идентификатор чата
   * @param userId - идентификатор пользователя
   * @returns Promise с созданной записью участника чата
   */
  async join(chatId: string, userId: string): Promise<ChatParticipant> {
    this.logger.log(`Добавление участника: userId=${userId}, chatId=${chatId}`);
    return this.participantModel.create({ chatId, userId });
  }

  /**
   * Находит последнего участника по userId, у которого чат в статусе по умолчанию.
   * Возвращает участника с вложенным объектом чата.
   * @param userId - идентификатор пользователя
   * @returns Promise с объектом участника или null, если не найден
   */
  async findByUserId(userId: string): Promise<ChatParticipant> {
    this.logger.log(`Поиск участника по userId: ${userId}`);
    return this.participantModel.findOne({
      where: { userId },
      include: [{ model: Chat, where: { status: DEFAULT_CHAT_STATUS } }],
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Получает список пользователей, которые участвуют в чате.
   * Возвращает только id, username и роль пользователя.
   * @param chatId - идентификатор чата
   * @returns Promise с массивом участников (пользователей)
   */
  async findParticipantsByChatId(chatId: string): Promise<User[]> {
    this.logger.log(`Получение участников для чата: ${chatId}`);
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

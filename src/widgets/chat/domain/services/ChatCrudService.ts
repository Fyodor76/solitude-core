import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ChatStatus } from '../../types/status';
import { Chat } from '../../entitites/chat.entity';
import { throwNotFound } from 'src/common/exceptions/http-exception.helper';
import { User } from 'src/users/user.entity';
import { ChatParticipant } from '../../entitites/chat-participant.entity';

@Injectable()
export class ChatCrudService {
  constructor(@InjectModel(Chat) private chatModel: typeof Chat) {}

  /**
   * Создаёт новый чат с заданным статусом.
   * @param status Статус чата (например, ACTIVE, CLOSED)
   * @returns Созданный объект чата
   */
  async create(status: ChatStatus): Promise<Chat> {
    return this.chatModel.create({ status });
  }

  /**
   * Получить все чаты со статусом ACTIVE.
   * @returns Массив активных чатов
   */
  async findActive(): Promise<Chat[]> {
    return this.chatModel.findAll({ where: { status: ChatStatus.ACTIVE } });
  }

  /**
   * Закрыть чат по идентификатору.
   * Меняет статус чата на CLOSED.
   * @param chatId Идентификатор чата
   * @throws Ошибка, если чат не найден
   * @returns Обновлённый объект чата
   */
  async close(chatId: string): Promise<Chat> {
    const chat = await this.chatModel.findByPk(chatId);
    if (!chat) throwNotFound('Chat not found');
    chat.status = ChatStatus.CLOSED;
    return chat.save();
  }

  /**
   * Найти чат по его идентификатору.
   * @param chatId Идентификатор чата
   * @returns Объект чата или null, если не найден
   */
  async findById(chatId: string): Promise<Chat> {
    return this.chatModel.findByPk(chatId);
  }

  /**
   * Получить все активные чаты с их участниками и данными пользователей.
   * Участники загружаются с полями: id, username, role.
   * Результат отсортирован по обновлению чата (по убыванию).
   * @returns Массив активных чатов с участниками и пользователями
   */
  async findActiveWithParticipants(): Promise<Chat[]> {
    return this.chatModel.findAll({
      where: { status: ChatStatus.ACTIVE },
      include: [
        {
          model: ChatParticipant,
          as: 'participants',
          include: [{ model: User, attributes: ['id', 'username', 'role'] }],
        },
      ],
      order: [['updatedAt', 'DESC']],
    });
  }
}

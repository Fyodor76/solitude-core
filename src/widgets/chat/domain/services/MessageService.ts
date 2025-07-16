import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RequestMessageDto } from '../../dto/request-message.dto';
import { Message } from '../../entitites/message.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class MessageService {
  constructor(@InjectModel(Message) private messageModel: typeof Message) {}

  /**
   * Создаёт новое сообщение на основе переданных данных.
   * @param dto Данные сообщения (RequestMessageDto)
   * @returns Созданное сообщение
   */
  async create(dto: RequestMessageDto) {
    return this.messageModel.create(dto);
  }

  /**
   * Получает все сообщения, относящиеся к определённому чату.
   * @param chatId Идентификатор чата
   * @returns Массив сообщений без дополнительной информации о пользователях
   */
  async findAllByChatId(chatId: string) {
    return this.messageModel.findAll({ where: { chatId } });
  }

  /**
   * Получает сообщение по его идентификатору вместе с информацией о пользователе,
   * который отправил сообщение.
   * @param messageId Идентификатор сообщения
   * @returns Сообщение с данными пользователя
   */
  async getByIdWithUser(messageId: string) {
    return this.messageModel.findOne({
      where: { id: messageId },
      include: [{ model: User, attributes: ['id', 'username', 'role'] }],
      order: [['createdAt', 'ASC']],
    });
  }

  /**
   * Получает все сообщения чата с информацией о пользователях,
   * которые их отправили, отсортированные по дате создания.
   * @param chatId Идентификатор чата
   * @returns Массив сообщений с данными пользователей
   */
  async findAllByChatIdWithUsers(chatId: string) {
    return this.messageModel.findAll({
      where: { chatId },
      include: [{ model: User, attributes: ['id', 'username', 'role'] }],
      order: [['createdAt', 'ASC']],
    });
  }
}

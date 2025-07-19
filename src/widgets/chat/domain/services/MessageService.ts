import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RequestMessageDto } from '../../dto/request-message.dto';
import { Message } from '../../entitites/message.entity';
import { User } from 'src/users/user.entity';
import { AppLogger } from 'src/common/logger/app-logger.service';

@Injectable()
export class MessageService {
  /**
   * Конструктор сервиса для работы с сообщениями.
   * @param messageModel - Sequelize модель Message
   * @param logger - сервис логирования приложения
   */
  constructor(
    @InjectModel(Message) private messageModel: typeof Message,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(MessageService.name);
  }

  /**
   * Создаёт новое сообщение на основе переданных данных.
   * @param dto - DTO с данными сообщения (chatId, userId, текст)
   * @returns Promise с созданным сообщением
   */
  async create(dto: RequestMessageDto): Promise<Message> {
    this.logger.log(
      `Создание сообщения: chatId=${dto.chatId}, userId=${dto.userId}`,
    );
    return this.messageModel.create(dto);
  }

  /**
   * Получает все сообщения для указанного чата.
   * @param chatId - идентификатор чата
   * @returns Promise с массивом сообщений (без данных пользователя)
   */
  async findAllByChatId(chatId: string): Promise<Message[]> {
    this.logger.log(`Получение сообщений для чата: ${chatId}`);
    return this.messageModel.findAll({ where: { chatId } });
  }

  /**
   * Получает сообщение по идентификатору вместе с информацией о пользователе-авторе.
   * @param messageId - идентификатор сообщения
   * @returns Promise с сообщением и вложенным объектом пользователя
   */
  async getByIdWithUser(messageId: string): Promise<Message> {
    this.logger.log(`Получение сообщения по id с пользователем: ${messageId}`);
    return this.messageModel.findOne({
      where: { id: messageId },
      include: [{ model: User, attributes: ['id', 'username', 'role'] }],
      order: [['createdAt', 'ASC']],
    });
  }

  /**
   * Получает все сообщения чата с данными пользователей, которые их отправили.
   * Результат отсортирован по дате создания.
   * @param chatId - идентификатор чата
   * @returns Promise с массивом сообщений с данными пользователей
   */
  async findAllByChatIdWithUsers(chatId: string): Promise<Message[]> {
    this.logger.log(`Получение сообщений с пользователями для чата: ${chatId}`);
    return this.messageModel.findAll({
      where: { chatId },
      include: [{ model: User, attributes: ['id', 'username', 'role'] }],
      order: [['createdAt', 'ASC']],
    });
  }
}

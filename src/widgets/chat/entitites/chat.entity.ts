import { Optional } from 'sequelize';
import { Column, DataType, HasMany, Table, Model } from 'sequelize-typescript';
import { Message } from './message.entity';
import {
  ChatStatus,
  ChatStatusType,
  DEFAULT_CHAT_STATUS,
} from '../types/status';
import { ChatParticipant } from './chat-participant.entity';

interface ChatAttributes {
  id: string;
  status: ChatStatusType;
}

interface ChatCreationAttributes
  extends Optional<ChatAttributes, 'id' | 'status'> {}

@Table({ tableName: 'chats' })
export class Chat extends Model<ChatAttributes, ChatCreationAttributes> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.ENUM(...Object.values(ChatStatus)),
    defaultValue: DEFAULT_CHAT_STATUS,
  })
  status: ChatStatusType;

  @HasMany(() => ChatParticipant, { as: 'participants', foreignKey: 'chatId' })
  participants: ChatParticipant[];

  @HasMany(() => Message)
  messages: Message[];
}

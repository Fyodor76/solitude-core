import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Chat } from './chat.entity';
import { User } from 'src/users/user.entity';

interface MessageAttributes {
  id: string;
  chatId: string;
  text: string;
  userId?: string | null;
}

interface MessageCreationAttributes extends Omit<MessageAttributes, 'id'> {}

@Table({ tableName: 'messages' })
export class Message extends Model<
  MessageAttributes,
  MessageCreationAttributes
> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Chat)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  chatId: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  userId: string | null;

  @BelongsTo(() => User)
  user: User;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  text: string;

  @BelongsTo(() => Chat)
  chat: Chat;
}

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

@Table({ tableName: 'chat_participants' })
export class ChatParticipant extends Model<ChatParticipant> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => Chat)
  @Column(DataType.UUID)
  chatId: string;

  @BelongsTo(() => Chat)
  chat: Chat;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId: string;

  @BelongsTo(() => User)
  user: User;
}

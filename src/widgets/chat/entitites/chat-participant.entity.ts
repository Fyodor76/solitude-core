import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { UserModel } from 'src/users/infrastructure/orm/user.entity';
import { Chat } from './chat.entity';

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

  @ForeignKey(() => UserModel)
  @Column(DataType.UUID)
  userId: string;

  @BelongsTo(() => UserModel)
  user: UserModel;
}

// Enum со статусами чата
export enum ChatStatus {
  ACTIVE = 'active',
  CLOSED = 'closed',
}

// Тип, объединяющий все значения enum ChatStatus
export type ChatStatusType = (typeof ChatStatus)[keyof typeof ChatStatus];

// Константа с дефолтным статусом чата
export const DEFAULT_CHAT_STATUS = ChatStatus.ACTIVE;

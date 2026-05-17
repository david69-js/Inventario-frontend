export enum NotificationType {
  LOW_STOCK = 'LOW_STOCK',
  MOVEMENT = 'MOVEMENT',
  SYSTEM = 'SYSTEM',
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}

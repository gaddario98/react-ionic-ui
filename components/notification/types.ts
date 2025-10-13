import type { TOptions } from "i18next";

export interface NotificationMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  autoHideDuration?: number;
  translationOption?: TOptions;
  header?: string; // Opzionale per il titolo delle notifiche Ionic
  position?: 'top' | 'middle' | 'bottom'; // Posizionamento per Ionic Toast
}

type TypeNotification = 'like' | 'message' | 'comments' | 'follow';

interface UserNotification {
    uid: string;
    type: TypeNotification;
    postId?: string;
    typePost?: string;
    token: string;
    message?: string;
    data?: Date;
    read: boolean;
    notificationId: string;
    nickname?: string;
    titlePost?: string;
}

type NotificationConfig = Partial<Omit<NotificationMessage, 'id'>>;

export type { NotificationConfig, UserNotification };
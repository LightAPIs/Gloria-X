declare namespace enhanced {
  interface NotificationOptions extends chrome.notifications.NotificationOptions {
    id?: string | null;
    url?: string | null;
    autoCloseTime?: number | null;
    detectIcon?: boolean | string;
    defaultIconUrl?: string;
    silent?: boolean;
    customSound?: boolean;
    isTest?: boolean;
    onClick?: ((notificationId: string) => void) | null;
    onClose?: ((notificationId: string, byUser: boolean) => void) | null;
    onButton0Click?: ((notificationId: string, buttonIndex: number) => void) | null;
    onButton1Click?: ((notificationId: string, buttonIndex: number) => void) | null;
  }
  type NotificationTypes = 'basic' | 'image';

  type BasicNotificationOptions = NotificationOptions;

  interface ImageNotificationOptions extends NotificationOptions {
    imageUrl: string;
    defaultImageUrl?: string;
  }
}

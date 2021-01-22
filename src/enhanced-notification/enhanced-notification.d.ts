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
    onClick?: (() => void) | null;
    onClose?: (() => void) | null;
    onButton1Click?: (() => void) | null;
    onButton2Click?: (() => void) | null;
  }
  type NotificationTypes = 'basic' | 'image';

  type BasicNotificationOptions = NotificationOptions;

  interface ImageNotificationOptions extends NotificationOptions {
    imageUrl: string;
    defaultImageUrl?: string;
  }
}

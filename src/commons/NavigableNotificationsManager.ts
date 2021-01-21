import BasicNotification from '@/enhanced-notification/BasicNotification';
import ImageNotification from '@/enhanced-notification/ImageNotification';
import { APP_ICON_URL as DEFAULT_ICON_URL } from '@/commons/var';

class NavigableNotificationsManager {
  add(options: enhanced.NotificationOptions) {
    try {
      const cn = this.notification(options);
      cn && cn.create();
    } catch (e) {
      console.error(e);
    }
  }

  notification(options: enhanced.NotificationOptions) {
    options.defaultIconUrl = DEFAULT_ICON_URL;

    if (!(typeof options.detectIcon === 'string')) {
      if (options.url && options.iconUrl === DEFAULT_ICON_URL && options.detectIcon) {
        options.detectIcon = true;
      } else {
        options.detectIcon = false;
      }
    }

    if (options.type === 'basic') {
      return new BasicNotification(options);
    } else if (options.type === 'image') {
      const notif = new ImageNotification(options as enhanced.ImageNotificationOptions);
      notif.experimental = true;
      return notif;
    } else {
      return null;
    }
  }
}

export default NavigableNotificationsManager;

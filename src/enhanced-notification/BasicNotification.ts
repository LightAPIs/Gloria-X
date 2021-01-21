import Notification from './Notification';

class BasicNotification extends Notification<enhanced.BasicNotificationOptions> {
  protected readonly finalType = 'basic';

  protected readonly disallowOptions = ['imageUrl'];

  protected defaultOptions: enhanced.BasicNotificationOptions = {
    type: this.finalType,
    title: '',
    message: '',
    iconUrl: Notification.DEFAULT_ICON_URL,
  };
}

export default BasicNotification;

/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from 'lodash';
import { asLink } from '@/commons/ui';
import { APP_ICON_URL } from '@/commons/var';
import { TRANSPARENT_IMAGE, loadImage, imageToDataURI } from './common';
import { v4 as uuid } from 'uuid';
import scrapFavicon from 'scrap-favicon';
import store from '@/store';

enum NotificationState {
  IDLE,
  LOADING,
  READY,
  CREATED,
}

abstract class Notification<T extends enhanced.NotificationOptions> implements EventTarget {
  [key: string]: any;

  static readonly BEST_IMAGE_WIDTH = 360;
  static readonly BEST_IMAGE_HEIGHT = 240;
  static readonly BEST_IMAGE_RATIO = Notification.BEST_IMAGE_WIDTH / Notification.BEST_IMAGE_HEIGHT;

  static readonly DEFAULT_ICON_URL = TRANSPARENT_IMAGE;
  static readonly DEFAULT_IMAGE_URL = TRANSPARENT_IMAGE;

  protected abstract readonly finalType: enhanced.NotificationTypes;

  protected readonly allowOptions: string[] = [
    'buttons', // Text and icons for up to two notification action buttons.
    'contextMessage',
    'eventTime',
    'iconUrl',
    'imageUrl', // The image is not visible for Mac OS X users.
    'isClickable',
    'message',
    'priority',
    'requireInteraction',
    'silent',
    'title',
    'type',
  ];
  protected readonly templateTypes = ['basic', 'image', 'list', 'progress'];

  protected abstract defaultOptions: T;

  protected optionsSetter: (options: T, prop: string, value: any, receiver: any) => boolean = () => {
    return false;
  };

  protected disallowOptions: string[] = [];

  protected _state: NotificationState = NotificationState.IDLE;
  get state(): NotificationState {
    return this._state;
  }
  set state(value: NotificationState) {
    ////
  }

  protected _id: string | null | undefined = null;
  get id(): string | null | undefined {
    return this._id;
  }
  set id(value: string | null | undefined) {
    ////
  }

  private originIconUrl: string | undefined;
  private originIcon: HTMLImageElement | undefined;
  private onclick: any;
  private onclose: any;
  private onbutton1click: any;
  private onbutton2click: any;
  private events: { [index: string]: EventListenerOrEventListenerObject[] } = {};

  constructor(protected _options: T) {}

  options: T = new Proxy({} as T, {
    set: (options: T, prop: string, value: any, receiver: any): boolean => {
      let status = false;
      switch (prop) {
        case 'id':
          if (_.isString(value) || _.isUndefined(value) || _.isNull(value)) {
            options.id = value;
            status = true;
          }
          break;
        case 'url':
          if (_.isString(value) || _.isUndefined(value) || _.isNull(value)) {
            options.url = value;
            status = true;
          }
          break;
        case 'autoCloseTime':
          if ((_.isNumber(value) && value > 0) || _.isUndefined(value) || _.isNull(value)) {
            options.autoCloseTime = value;
            status = true;
          }
          break;
        case 'detectIcon':
          if (_.isString(value) || _.isBoolean(value) || _.isUndefined(value)) {
            options.detectIcon = value;
            status = true;
          }
          break;
        case 'defaultIconUrl':
          if (_.isString(value) || _.isUndefined(value)) {
            options.defaultIconUrl = value;
            status = true;
          }
          break;
        case 'onClick':
          if (_.isFunction(value) || _.isUndefined(value) || _.isNull(value)) {
            this.onclick = value;
            status = true;
          }
          break;
        case 'onClose':
          if (_.isFunction(value) || _.isUndefined(value) || _.isNull(value)) {
            this.onclose = value;
            status = true;
          }
          break;
        case 'onButton1Click':
          if (_.isFunction(value) || _.isUndefined(value) || _.isNull(value)) {
            this.onbutton1click = value;
            status = true;
          }
          break;
        case 'onButton2Click':
          if (_.isFunction(value) || _.isUndefined(value) || _.isNull(value)) {
            this.onbutton2click = value;
            status = true;
          }
          break;
        case 'buttons':
          if (_.isArray(value) && value.length <= 2) {
            for (const i in value) {
              if (_.isFunction(value[i].onClick)) {
                if (i == '0') {
                  options.onButton1Click = value[i].onClick;
                } else if (i == '1') {
                  options.onButton2Click = value[i].onClick;
                }
              }
            }
            options.buttons = value;
            status = true;
          } else if (_.isUndefined(value)) {
            options.buttons = value;
            status = true;
          }
          break;
        case 'contextMessage':
          if (_.isString(value) || _.isUndefined(value)) {
            options.contextMessage = value;
            status = true;
          }
          break;
        case 'eventTime':
          if (_.isNumber(value) || _.isUndefined(value)) {
            options.eventTime = value;
            status = true;
          }
          break;
        case 'iconUrl':
          if (_.isString(value) || _.isUndefined(value)) {
            options.iconUrl = value;
            status = true;
          }
          break;
        case 'isClickable':
          if (_.isBoolean(value) || _.isUndefined(value)) {
            options.isClickable = value;
            status = true;
          }
          break;
        case 'message':
          if (_.isString(value) || _.isUndefined(value)) {
            options.message = value;
            status = true;
          }
          break;
        case 'priority':
          //? Priority ranges from -2 to 2. 2 is highest. Zero is default.
          //? On platforms that don't support a notification center (Windows, Linux & Mac), -2 and -1 result in an error as notifications with those priorities will not be shown at all.
          if ((_.isInteger(value) && value >= 0 && value <= 2) || _.isUndefined(value)) {
            options.priority = value;
            status = true;
          }
          break;
        case 'requireInteraction':
          if (_.isBoolean(value) || _.isUndefined(value)) {
            options.requireInteraction = value;
            status = true;
          }
          break;
        case 'silent':
          //* Windows10
          if (_.isBoolean(value) || _.isUndefined(value)) {
            options.silent = value;
            status = true;
          }
          break;
        case 'customSound':
          //? 用于处理 Windows7 系统以及 Windows10 系统下将 chrome://flags/#enable-native-notifications 设置为 Disabled 的情况
          if (_.isBoolean(value) || _.isUndefined(value)) {
            options.customSound = value;
            status = true;
          }
          break;
        case 'title':
          if (_.isString(value) || _.isUndefined(value)) {
            options.title = value;
            status = true;
          }
          break;
        case 'type':
          if ((_.isString(value) && this.templateTypes.includes(value)) || _.isUndefined(value)) {
            options.type = value;
            status = true;
          }
          break;
        default:
          status = this.optionsSetter(options, prop, value, receiver);
          break;
      }

      return status;
    },
  });

  private async detectIcon(url: string) {
    let iconUrl: string | null = null;
    try {
      const iconList = await scrapFavicon(url, {
        timeout: 5000,
      });
      const { images } = iconList;
      if (_.isArray(images) && images.length > 0) {
        let tempImg: any = {};
        images.forEach(img => {
          if (img.success && img.url) {
            if (!tempImg.height || tempImg.height < img.height) {
              tempImg = img;
            }
          }
        });
        iconUrl = tempImg.url;
      } else {
        iconUrl = null;
      }
    } catch (e) {
      console.error(e);
      iconUrl = null;
    }
    return iconUrl;
  }

  addEventListener(type: string, listener: EventListenerOrEventListenerObject): void {
    if (_.isString(type)) {
      type = _.toLower(type);
    } else {
      throw new Error('Event type must be a string.');
    }

    if (_.isArray(this.events[type]) && !this.events[type].includes(listener)) {
      this.events[type].push(listener);
    } else {
      this.events[type] = [listener];
    }
  }

  removeEventListener(type: string, listener: EventListenerOrEventListenerObject): void {
    if (_.isString(type)) {
      type = _.toLower(type);
    } else {
      throw new Error('Event type must be a string.');
    }

    if (_.isArray(this.events[type])) {
      const index = this.events[type].indexOf(listener);
      if (index) {
        this.events[type].splice(index, 1);
      }
    }
  }

  dispatchEvent(evt: CustomEvent): boolean {
    const type = _.toLower(evt.type);
    if (_.isArray(this.events[type])) {
      this.events[type].filter(_.isFunction).forEach(fn => (fn as any)(...evt.detail));
    }
    if (_.isFunction(this[`on${type}`])) {
      this[`on${type}`]();
    }
    return true;
  }

  format(options: { [key: string]: any }) {
    const strictOptions: { [key: string]: any } = {};
    for (const key of Object.keys(options)) {
      if (this.allowOptions.includes(key) && !this.disallowOptions.includes(key)) {
        strictOptions[key] = options[key];
      }
    }

    return Object.assign({}, this.defaultOptions, strictOptions);
  }

  protected async init(): Promise<void> {
    Object.assign(this.options, this._options);

    const targetUrl = this.options.url;

    if (_.isString(targetUrl)) {
      if (!this.onclick) {
        this.options.onClick = async () => {
          chrome.tabs.query(
            {
              url: asLink(targetUrl as string),
            },
            tabs => {
              if (!chrome.runtime.lastError && tabs[0]) {
                const { windowId, index } = tabs[0];
                chrome.tabs.highlight({
                  windowId,
                  tabs: index,
                });
              } else {
                chrome.windows.getCurrent(
                  {
                    windowTypes: ['normal'],
                  },
                  win => {
                    if (!chrome.runtime.lastError && win) {
                      chrome.tabs.create({ url: targetUrl });
                    } else {
                      chrome.windows.create(w => {
                        w &&
                          chrome.tabs.create({
                            url: targetUrl,
                            windowId: w.id,
                          });
                      });
                    }
                  }
                );
              }
            }
          );

          await this.clear();
        };
      }

      if (this.options.detectIcon === true) {
        try {
          const iconUrl = await this.detectIcon(targetUrl);
          if (iconUrl) {
            this.options.iconUrl = iconUrl;
          }
        } catch (e) {
          console.error(e);
        }
      }
    }

    if (_.isString(this.options.detectIcon)) {
      try {
        const iconUrl = await this.detectIcon(this.options.detectIcon);
        if (iconUrl) {
          this.options.iconUrl = iconUrl;
        }
      } catch (e) {
        console.error(e);
      }
    }

    if (this.options.iconUrl) {
      try {
        this.originIconUrl = this.options.iconUrl;
        this.originIcon = await loadImage(this.originIconUrl);
        this.options.iconUrl = imageToDataURI(this.originIcon);
      } catch (e) {
        if (this.options.defaultIconUrl) {
          try {
            this.originIconUrl = this.options.defaultIconUrl;
            this.originIcon = await loadImage(this.originIconUrl);
            this.options.iconUrl = imageToDataURI(this.originIcon);
          } catch (e) {
            this.options.iconUrl = TRANSPARENT_IMAGE;
          }
        } else {
          this.options.iconUrl = TRANSPARENT_IMAGE;
        }
      }
    }
  }

  private buttonClickHandler = (id: string, buttonIndex: number) => {
    if (id === this.id) {
      this.dispatchEvent(
        new CustomEvent(`Button${buttonIndex}Click`, {
          bubbles: false,
          cancelable: false,
          detail: [buttonIndex],
        })
      );
      chrome.notifications.onButtonClicked.removeListener(this.buttonClickHandler);
    }
  };

  private closeHandler = (id: string) => {
    if (id === this.id) {
      this._state = NotificationState.READY;
      this.dispatchEvent(
        new CustomEvent('Close', {
          bubbles: false,
          cancelable: false,
        })
      );
      chrome.notifications.onClosed.removeListener(this.closeHandler);
    }
  };

  private clickHandler = (id: string) => {
    if (id === this.id) {
      this.dispatchEvent(
        new CustomEvent('Click', {
          bubbles: false,
          cancelable: false,
        })
      );
      chrome.notifications.onClosed.removeListener(this.clickHandler);
    }
  };

  create(): Promise<string> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      if (this.state === NotificationState.IDLE) {
        this._state = NotificationState.LOADING;
        await this.init();
        this._state = NotificationState.READY;
      }

      if (this.state === NotificationState.READY) {
        //! 将消息添加到通知记录中
        //? 理论上测试用的通知在此刻 id 还没有被赋值
        if (
          this.options.id &&
          this.options.detectIcon &&
          this.options.iconUrl !== TRANSPARENT_IMAGE &&
          this.options.iconUrl !== APP_ICON_URL
        ) {
          store.commit('updateNotification', {
            id: this.options.id,
            options: {
              iconUrl: this.options.iconUrl,
            },
          });
        }

        chrome.notifications.create(this.options.id || uuid(), this.format(this.options), (id: string) => {
          if (chrome.runtime.lastError) {
            return reject(chrome.runtime.lastError);
          }

          if (!this.options.silent && this.options.customSound) {
            this.audio();
          }

          chrome.notifications.onClosed.addListener(this.closeHandler);
          chrome.notifications.onClicked.addListener(this.clickHandler);
          chrome.notifications.onButtonClicked.addListener(this.buttonClickHandler);

          if (this.options.autoCloseTime) {
            if (_.isNumber(this.options.autoCloseTime)) {
              setTimeout(this.clear, this.options.autoCloseTime);
            }
          }

          this._id = id;
          this._state = NotificationState.CREATED;

          resolve(id);
        });
      }
    });
  }

  update(): Promise<boolean> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      if (this.state === NotificationState.IDLE) {
        return reject(new Error('notification is not ready.'));
      }

      if (this.state === NotificationState.READY) {
        await this.create();
      } else if (this.state === NotificationState.CREATED) {
        chrome.notifications.update(this.id as string, this.format(this.options), wasUpdated => {
          if (chrome.runtime.lastError) {
            return reject(chrome.runtime.lastError);
          }
          resolve(wasUpdated);
        });
      }
    });
  }

  clear(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.id) {
        return reject(new Error('Cannot call clear() becasue this notification is not created.'));
      }

      chrome.notifications.clear(this.id, wasCleared => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }

        chrome.notifications.onClosed.removeListener(this.closeHandler);
        chrome.notifications.onClicked.removeListener(this.clickHandler);
        chrome.notifications.onButtonClicked.removeListener(this.buttonClickHandler);

        this._id = undefined;
        this._state = NotificationState.READY;

        resolve(wasCleared);
      });
    });
  }

  static audioDebounce = _.debounce(
    function(func) {
      func();
    },
    2000,
    {
      leading: true,
      trailing: false,
    }
  );

  audio() {
    Notification.audioDebounce(() => {
      const sound = new Audio('sound/bell.ogg');
      sound.play();
    });
  }
}

export default Notification;

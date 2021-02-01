/* eslint-disable @typescript-eslint/no-explicit-any */
import debounce from 'lodash.debounce';
import isInteger from 'lodash.isinteger';
import isNull from 'lodash.isnull';
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
  private onbutton0click: any;
  private onbutton1click: any;
  private events: { [index: string]: EventListenerOrEventListenerObject[] } = {};

  constructor(protected _options: T) {}

  options: T = new Proxy({} as T, {
    set: (options: T, prop: string, value: any, receiver: any): boolean => {
      let status = false;
      switch (prop) {
        case 'id':
          if (typeof value === 'string' || typeof value === 'undefined' || isNull(value)) {
            options.id = value;
            status = true;
          }
          break;
        case 'url':
          if (typeof value === 'string' || typeof value === 'undefined' || isNull(value)) {
            options.url = value;
            status = true;
          }
          break;
        case 'autoCloseTime':
          if ((typeof value === 'number' && value > 0) || typeof value === 'undefined' || isNull(value)) {
            options.autoCloseTime = value;
            status = true;
          }
          break;
        case 'detectIcon':
          if (typeof value === 'string' || typeof value === 'boolean' || typeof value === 'undefined') {
            options.detectIcon = value;
            status = true;
          }
          break;
        case 'defaultIconUrl':
          if (typeof value === 'string' || typeof value === 'undefined') {
            options.defaultIconUrl = value;
            status = true;
          }
          break;
        case 'onClick':
          if (typeof value === 'function' || typeof value === 'undefined' || isNull(value)) {
            options.onClick = value;
            status = true;
          }
          break;
        case 'onClose':
          if (typeof value === 'function' || typeof value === 'undefined' || isNull(value)) {
            options.onClose = value;
            status = true;
          }
          break;
        case 'onButton0Click':
          if (typeof value === 'function' || typeof value === 'undefined' || isNull(value)) {
            options.onButton0Click = value;
            status = true;
          }
          break;
        case 'onButton1Click':
          if (typeof value === 'function' || typeof value === 'undefined' || isNull(value)) {
            options.onButton1Click = value;
            status = true;
          }
          break;
        case 'buttons':
          if (Array.isArray(value) && value.length <= 2) {
            // for (const i in value) {
            //   if (typeof value[i].onClick === 'function') {
            //     if (i == '0') {
            //       options.onButton0Click = value[i].onClick;
            //     } else if (i == '1') {
            //       options.onButton1Click = value[i].onClick;
            //     }
            //   }
            // }
            //? 遵循 Chrome 的限制，不再允许直接在 buttons 中包含相应事件
            options.buttons = value;
            status = true;
          } else if (typeof value === 'undefined') {
            options.buttons = value;
            status = true;
          }
          break;
        case 'contextMessage':
          if (typeof value === 'string' || typeof value === 'undefined') {
            options.contextMessage = value;
            status = true;
          }
          break;
        case 'eventTime':
          if (typeof value === 'number' || typeof value === 'undefined') {
            options.eventTime = value;
            status = true;
          }
          break;
        case 'iconUrl':
          if (typeof value === 'string' || typeof value === 'undefined') {
            options.iconUrl = value;
            status = true;
          }
          break;
        case 'isClickable':
          if (typeof value === 'boolean' || typeof value === 'undefined') {
            options.isClickable = value;
            status = true;
          }
          break;
        case 'message':
          if (typeof value === 'string' || typeof value === 'undefined') {
            options.message = value;
            status = true;
          }
          break;
        case 'priority':
          //? Priority ranges from -2 to 2. 2 is highest. Zero is default.
          //? On platforms that don't support a notification center (Windows, Linux & Mac), -2 and -1 result in an error as notifications with those priorities will not be shown at all.
          if ((isInteger(value) && value >= 0 && value <= 2) || typeof value === 'undefined') {
            options.priority = value;
            status = true;
          }
          break;
        case 'requireInteraction':
          if (typeof value === 'boolean' || typeof value === 'undefined') {
            options.requireInteraction = value;
            status = true;
          }
          break;
        case 'silent':
          //* Windows10 原生通知可以受此选项控制
          if (typeof value === 'boolean' || typeof value === 'undefined') {
            options.silent = value;
            status = true;
          }
          break;
        case 'customSound':
          //? 用于处理 Windows7 系统以及 Windows10 系统下将 chrome://flags/#enable-native-notifications 设置为 Disabled 的情况
          if (typeof value === 'boolean' || typeof value === 'undefined') {
            options.customSound = value;
            status = true;
          }
          break;
        case 'isTest':
          if (typeof value === 'boolean' || typeof value === 'undefined') {
            options.isTest = value;
            status = true;
          }
          break;
        case 'title':
          if (typeof value === 'string' || typeof value === 'undefined') {
            options.title = value;
            status = true;
          }
          break;
        case 'type':
          if ((typeof value === 'string' && this.templateTypes.includes(value)) || typeof value === 'undefined') {
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
      if (Array.isArray(images) && images.length > 0) {
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
    if (typeof type === 'string') {
      type = type.toLowerCase();
    } else {
      throw new Error('Event type must be a string.');
    }

    if (Array.isArray(this.events[type]) && !this.events[type].includes(listener)) {
      this.events[type].push(listener);
    } else {
      this.events[type] = [listener];
    }
  }

  removeEventListener(type: string, listener: EventListenerOrEventListenerObject): void {
    if (typeof type === 'string') {
      type = type.toLowerCase();
    } else {
      throw new Error('Event type must be a string.');
    }

    if (Array.isArray(this.events[type])) {
      const index = this.events[type].indexOf(listener);
      if (index) {
        this.events[type].splice(index, 1);
      }
    }
  }

  dispatchEvent(evt: CustomEvent): boolean {
    const type = evt.type.toLowerCase();
    if (Array.isArray(this.events[type])) {
      this.events[type].filter(x => typeof x === 'function').forEach(fn => (fn as any)(...evt.detail));
    }

    if (typeof this[`on${type}`] === 'function') {
      this[`on${type}`](...evt.detail);
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

    if (typeof targetUrl === 'string') {
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

    if (typeof this.options.detectIcon === 'string') {
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

    if (!this.options.onClick) {
      if (typeof targetUrl === 'string') {
        //* 默认点击打开相应的网址
        this.onclick = async () => {
          chrome.tabs.query(
            {
              url: asLink(targetUrl),
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
              !this.options.isTest && store.commit('decreaseUnread');
            }
          );

          await this.clear();
        };
      }
    } else {
      this.onclick = async (id: string) => {
        if (typeof this.options.onClick === 'function') {
          this.options.onClick(id);
        }
        await this.clear();
      };
    }

    if (!this.options.onClose) {
      this.onclose = async (_id: string, byUser: boolean) => {
        if (byUser) {
          //* 仅用户手动点击关闭按钮会触发
          !this.options.isTest && store.commit('decreaseUnread');
        }
        await this.clear();
      };
    } else {
      this.opclose = async (id: string, byUser: boolean) => {
        if (typeof this.options.onClose === 'function') {
          this.options.onClose(id, byUser);
        }
        await this.clear();
      };
    }

    if (this.options.onButton0Click) {
      this.onbutton0click = async (id: string, buttonIndex: number) => {
        if (typeof this.options.onButton0Click === 'function') {
          this.options.onButton0Click(id, buttonIndex);
        }
        await this.clear();
      };
    }

    if (this.options.onButton1Click) {
      this.onbutton1click = async (id: string, buttonIndex: number) => {
        if (typeof this.options.onButton1Click === 'function') {
          this.options.onButton1Click(id, buttonIndex);
        }
        await this.clear();
      };
    }
  }

  private buttonClickHandler = (id: string, buttonIndex: number) => {
    if (id === this.id) {
      this.dispatchEvent(
        new CustomEvent(`Button${buttonIndex}Click`, {
          bubbles: false,
          cancelable: false,
          detail: [id, buttonIndex],
        })
      );
      chrome.notifications.onButtonClicked.removeListener(this.buttonClickHandler);
    }
  };

  private closeHandler = (id: string, byUser: boolean) => {
    //! 注:实测在使用 Windows10 原生通知中心时是无法触发关闭事件的
    if (id === this.id) {
      this._state = NotificationState.READY;
      this.dispatchEvent(
        new CustomEvent('Close', {
          bubbles: false,
          cancelable: false,
          detail: [id, byUser],
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
          detail: [id],
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
        //! 将消息自动检测到的图标信息添加到通知记录中
        //? 理论上测试用的通知在此刻 id 还没有被赋值
        if (
          !this.options.isTest &&
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
            if (typeof this.options.autoCloseTime === 'number') {
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

  static audioDebounce = debounce(
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

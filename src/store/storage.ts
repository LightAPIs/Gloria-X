import { toRaw } from 'vue';
import debounce from 'lodash.debounce';

class ChromeStorage {
  static readonly WAIT_TIME = 500;
  static readonly OPTIONS = {
    leading: true,
  };

  private implicitPush: (func: () => void) => void;
  private lastActiveTab: (func: () => void) => void;
  private lastCheckTasksUpdate: (func: () => void) => void;
  private tasks: (func: () => void) => void;
  private notifications: (func: () => void) => void;
  private stages: (func: () => void) => void;
  private configs: (func: () => void) => void;
  private reducer: (func: () => void) => void;
  private unread: (func: () => void) => void;
  private blockLog: boolean;

  constructor(blockLog?: boolean) {
    this.blockLog = blockLog || false;

    this.implicitPush = debounce(
      function (func) {
        func();
      },
      ChromeStorage.WAIT_TIME,
      ChromeStorage.OPTIONS
    );

    this.lastActiveTab = debounce(
      function (func) {
        func();
      },
      ChromeStorage.WAIT_TIME,
      ChromeStorage.OPTIONS
    );

    this.lastCheckTasksUpdate = debounce(
      function (func) {
        func();
      },
      ChromeStorage.WAIT_TIME,
      ChromeStorage.OPTIONS
    );

    this.tasks = debounce(
      function (func) {
        func();
      },
      ChromeStorage.WAIT_TIME,
      ChromeStorage.OPTIONS
    );

    this.notifications = debounce(
      function (func) {
        func();
      },
      ChromeStorage.WAIT_TIME,
      ChromeStorage.OPTIONS
    );

    this.stages = debounce(
      function (func) {
        func();
      },
      ChromeStorage.WAIT_TIME,
      ChromeStorage.OPTIONS
    );

    this.configs = debounce(
      function (func) {
        func();
      },
      ChromeStorage.WAIT_TIME,
      ChromeStorage.OPTIONS
    );

    this.reducer = debounce(
      function (func) {
        func();
      },
      ChromeStorage.WAIT_TIME,
      ChromeStorage.OPTIONS
    );

    this.unread = debounce(
      function (func) {
        func();
      },
      ChromeStorage.WAIT_TIME,
      ChromeStorage.OPTIONS
    );
  }

  setImplicitPush(data: boolean, message?: string): void {
    this.implicitPush(() => {
      chrome.storage.local.set(
        {
          implicitPush: toRaw(data),
        },
        () => {
          !this.blockLog && message && console.log(message);
        }
      );
    });
  }

  setLastActiveTab(data: string, message?: string): void {
    this.lastActiveTab(() => {
      chrome.storage.local.set(
        {
          lastActiveTab: toRaw(data),
        },
        () => {
          !this.blockLog && message && console.log(message);
        }
      );
    });
  }

  setLastCheckTasksUpdate(data: string, message?: string): void {
    this.lastCheckTasksUpdate(() => {
      chrome.storage.local.set(
        {
          lastCheckTasksUpdate: toRaw(data),
        },
        () => {
          !this.blockLog && message && console.log(message);
        }
      );
    });
  }

  setTasks(data: myStore.GloriaTask[], message?: string): void {
    this.tasks(() => {
      chrome.storage.local.set(
        {
          tasks: toRaw(data),
        },
        () => {
          !this.blockLog && message && console.log(message);
        }
      );
    });
  }

  setNotifications(data: myStore.GloriaNotification[], message?: string): void {
    this.notifications(() => {
      chrome.storage.local.set(
        {
          notifications: toRaw(data),
        },
        () => {
          !this.blockLog && message && console.log(message);
        }
      );
    });
  }

  setStages(data: myStore.GloriaStage[], message?: string): void {
    this.stages(() => {
      chrome.storage.local.set(
        {
          stages: toRaw(data),
        },
        () => {
          !this.blockLog && message && console.log(message);
        }
      );
    });
  }

  setConfigs(data: myStore.GloriaConfig, message?: string): void {
    this.configs(() => {
      chrome.storage.local.set(
        {
          configs: toRaw(data),
        },
        () => {
          !this.blockLog && message && console.log(message);
        }
      );
    });
  }

  setReducer(data: string, message?: string): void {
    this.reducer(() => {
      chrome.storage.local.set(
        {
          reducer: toRaw(data),
        },
        () => {
          !this.blockLog && message && console.log(message);
        }
      );
    });
  }

  setUnread(data: number, message?: string): void {
    this.unread(() => {
      chrome.storage.local.set(
        {
          unread: toRaw(data),
        },
        () => {
          !this.blockLog && message && console.log(message);
        }
      );
    });
  }
}

export default ChromeStorage;

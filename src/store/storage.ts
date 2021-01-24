import { debounce } from 'lodash';

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
  private blockLog: boolean;

  constructor(blockLog?: boolean) {
    this.blockLog = blockLog || false;

    this.implicitPush = debounce(
      function(func) {
        func();
      },
      ChromeStorage.WAIT_TIME,
      ChromeStorage.OPTIONS
    );

    this.lastActiveTab = debounce(
      function(func) {
        func();
      },
      ChromeStorage.WAIT_TIME,
      ChromeStorage.OPTIONS
    );

    this.lastCheckTasksUpdate = debounce(
      function(func) {
        func();
      },
      ChromeStorage.WAIT_TIME,
      ChromeStorage.OPTIONS
    );

    this.tasks = debounce(
      function(func) {
        func();
      },
      ChromeStorage.WAIT_TIME,
      ChromeStorage.OPTIONS
    );

    this.notifications = debounce(
      function(func) {
        func();
      },
      ChromeStorage.WAIT_TIME,
      ChromeStorage.OPTIONS
    );

    this.stages = debounce(
      function(func) {
        func();
      },
      ChromeStorage.WAIT_TIME,
      ChromeStorage.OPTIONS
    );

    this.configs = debounce(
      function(func) {
        func();
      },
      ChromeStorage.WAIT_TIME,
      ChromeStorage.OPTIONS
    );

    this.reducer = debounce(
      function(func) {
        func();
      },
      ChromeStorage.WAIT_TIME,
      ChromeStorage.OPTIONS
    );
  }

  setImplicitPush(data: boolean, message?: string) {
    this.implicitPush(() => {
      chrome.storage.local.set(
        {
          implicitPush: data,
        },
        () => {
          !this.blockLog && message && console.log(message);
        }
      );
    });
  }

  setLastActiveTab(data: string, message?: string) {
    this.lastActiveTab(() => {
      chrome.storage.local.set(
        {
          lastActiveTab: data,
        },
        () => {
          !this.blockLog && message && console.log(message);
        }
      );
    });
  }

  setLastCheckTasksUpdate(data: string, message?: string) {
    this.lastCheckTasksUpdate(() => {
      chrome.storage.local.set(
        {
          lastCheckTasksUpdate: data,
        },
        () => {
          !this.blockLog && message && console.log(message);
        }
      );
    });
  }

  setTasks(data: store.GloriaTask[], message?: string) {
    this.tasks(() => {
      chrome.storage.local.set(
        {
          tasks: data,
        },
        () => {
          !this.blockLog && message && console.log(message);
        }
      );
    });
  }

  setNotifications(data: store.GloriaNotification[], message?: string) {
    this.notifications(() => {
      chrome.storage.local.set(
        {
          notifications: data,
        },
        () => {
          !this.blockLog && message && console.log(message);
        }
      );
    });
  }

  setStages(data: store.GloriaStage[], message?: string) {
    this.stages(() => {
      chrome.storage.local.set(
        {
          stages: data,
        },
        () => {
          !this.blockLog && message && console.log(message);
        }
      );
    });
  }

  setConfigs(data: store.GloriaConfig, message?: string) {
    this.configs(() => {
      chrome.storage.local.set(
        {
          configs: data,
        },
        () => {
          !this.blockLog && message && console.log(message);
        }
      );
    });
  }

  setReducer(data: string, message?: string) {
    this.reducer(() => {
      chrome.storage.local.set(
        {
          reducer: data,
        },
        () => {
          !this.blockLog && message && console.log(message);
        }
      );
    });
  }
}

export default ChromeStorage;

import { evalUntrusted, inflatedRequestHeaders } from '@/commons/eval-untrusted';
import IntervalAlarmsManager from '@/commons/IntervalAlarmsManager';
import NotificationsManager from '@/commons/NavigableNotificationsManager';
import store from '../store';
import { isAfterInterval, remainingTime, nowLTS, today, waitingTime, waitingTomorrowTime, isBeforeNow, dayjsLocale } from '@/commons/calc';
import { i18n } from '@/commons/ui';
import { APP_ICON_URL as DEFAULT_ICON_URL, IS_CHROME } from '@/commons/var';
import { v4 as uuid } from 'uuid';
import { commitFormat, reduceNotification } from '@/store/reducer';
import { Observable, Observer, Subject } from 'rxjs';

dayjsLocale();
let runningCount = 0;
let runLimit = 5;
const alarmsManager = new IntervalAlarmsManager();
const notificationsManager = new NotificationsManager();
const taskList: Observable<unknown>[] = [];
const taskSubject: Subject<Observable<unknown>> = new Subject();

taskSubject.subscribe({
  next: v => {
    if (runLimit == 0 || runningCount < runLimit) {
      runningCount++;
      const subscription = v.subscribe({
        next: func => {
          if (typeof func === 'function') {
            func();
          }
        },
        complete: () => {
          runningCount--;
          subscription.unsubscribe();
          if (taskList.length > 0) {
            const top = taskList.shift();
            top && taskSubject.next(top);
          }
        },
      });
    } else {
      taskList.push(v);
    }
  },
});

function createTaskTimer(task: myStore.GloriaTask, immediately = false) {
  const { notificationSound, notificationCustomSound, notificationDisableError } = store.state.configs;
  const { id, code, type, triggerInterval, triggerDate, onTimeMode, earliestTime, name } = task;
  function run() {
    const taskObservable = new Observable((obsever: Observer<unknown>) => {
      obsever.next(() => {
        store.commit('triggerTask', id);
        evalUntrusted(code)
          .then(dataList => {
            if (!dataList || (Array.isArray(dataList) && dataList.length === 0)) {
              return;
            }

            store.commit('executionTaskSuccess', id);

            store.dispatch('handleData', {
              taskId: id,
              data: commitFormat(dataList),
            });
          })
          .catch(err => {
            console.error(err);
            !notificationDisableError &&
              notificationsManager.add({
                title: i18n('notificationCodeError', [name]),
                message: err.message,
                iconUrl: DEFAULT_ICON_URL,
                type: 'basic',
                id: uuid(),
                contextMessage: 'Gloria-X',
                requireInteraction: false,
                eventTime: Date.now(),
                priority: 0,
                silent: !notificationSound,
                customSound: notificationCustomSound,
                detectIcon: false,
                isTest: true,
                buttons: [
                  {
                    title: i18n('notificationTerminateTask'),
                  },
                ],
                onButton0Click: () => {
                  store.commit('updateIsEnable', {
                    id,
                    checked: false,
                  });
                },
              });

            //* 将错误记录至任务中
            store.commit('executionTaskError', id);
          })
          .finally(() => {
            obsever.complete();
          });
      });
    });

    taskSubject.next(taskObservable);
  }

  //! 在这里处理两种任务的区别
  if (immediately) {
    if (type === 'daily') {
      alarmsManager.add(id, waitingTomorrowTime(earliestTime), 24 * 60, run);
    } else {
      alarmsManager.add(id, triggerInterval, triggerInterval, run);
    }

    run();
  } else {
    if (type === 'daily') {
      if (today(triggerDate)) {
        //* 今天已经执行过了
        alarmsManager.add(id, waitingTomorrowTime(earliestTime), 24 * 60, run);
      } else {
        if (isBeforeNow(earliestTime)) {
          alarmsManager.add(id, waitingTomorrowTime(earliestTime), 24 * 60, run);
          run();
        } else {
          //* 没有到达执行时间
          alarmsManager.add(id, waitingTime(earliestTime), 24 * 60, run);
        }
      }
    } else {
      if (onTimeMode) {
        if (isAfterInterval(triggerDate, triggerInterval)) {
          alarmsManager.add(id, triggerInterval, triggerInterval, run);
          run();
        } else {
          alarmsManager.add(id, remainingTime(triggerDate, triggerInterval), triggerInterval, run);
        }
      } else {
        alarmsManager.add(id, triggerInterval, triggerInterval, run);
        run();
      }
    }
  }
}

function createCheckCodeUpdateTimer(checkId: string, immediately = false) {
  function check() {
    store.commit('triggerLastCheckTasksUpdate');
    const {
      tasks,
      configs: { notificationSound, notificationCustomSound },
    } = store.state;
    tasks.forEach(task => {
      if (task.origin && task.origin.match(/:\/\/gloria\.pub\/task\/(?:\w+)/)) {
        const originId = (/:\/\/gloria\.pub\/task\/(\w+)/.exec(task.origin) as string[])[1];
        try {
          fetch('https://api.gloria.pub/task/' + originId)
            .then(res => res.json())
            .then((r: { name: string; code: string }) => {
              if (r.code.trim() && r.code.trim() !== task.code.trim()) {
                notificationsManager.add({
                  title: i18n('notificationCodeUpdate', [r.name]),
                  message: i18n('notificationCodeUpdateTip'),
                  iconUrl: DEFAULT_ICON_URL,
                  type: 'basic',
                  id: uuid(),
                  contextMessage: 'Gloria-X',
                  requireInteraction: false,
                  eventTime: Date.now(),
                  priority: 0,
                  silent: !notificationSound,
                  customSound: notificationCustomSound,
                  detectIcon: false,
                  isTest: true,
                  buttons: [
                    {
                      title: i18n('notificationCodeUpdateGo'),
                    },
                    {
                      title: i18n('notificationCodeUpdateDisconnect'),
                    },
                  ],
                  onButton0Click: id => {
                    id &&
                      chrome.windows.getCurrent(
                        {
                          //! 该属性从 Firefox 62 起已被弃用
                          windowTypes: ['normal'],
                        },
                        win => {
                          if (!chrome.runtime.lastError && win) {
                            chrome.tabs.create({
                              url: task.origin,
                            });
                          } else {
                            chrome.windows.create(w => {
                              w &&
                                chrome.tabs.create({
                                  url: task.origin,
                                  windowId: w.id,
                                });
                            });
                          }
                        }
                      );
                  },
                  onButton1Click: id => {
                    id && store.commit('disconnectTask', task.id);
                  },
                });
              }
            });
        } catch (e) {
          console.error(e);
        }
      }
    });
  }

  if (immediately) {
    alarmsManager.add(checkId, -1, 60 * 6, check);
    check();
  } else {
    const { lastCheckTasksUpdate } = store.state;
    if (isAfterInterval(lastCheckTasksUpdate, 60 * 6)) {
      alarmsManager.add(checkId, -1, 60 * 6, check);
      check();
    } else {
      alarmsManager.add(checkId, remainingTime(lastCheckTasksUpdate, 60 * 6), 60 * 6, check);
    }
  }
}

function resetTaskTimer(task: myStore.GloriaTask, immediately: boolean) {
  alarmsManager.remove(task.id, () => {
    createTaskTimer(task, immediately);
  });
}

function removeTaskTimer(task: myStore.GloriaTask) {
  alarmsManager.remove(task.id);
}

function createNotification(options: enhanced.NotificationOptions) {
  const { url, iconUrl, imageUrl } = options;

  if (iconUrl && iconUrl.match(/^https?:\/\//)) {
    window.sessionStorage['request.image.' + options.iconUrl] = JSON.stringify({
      referer: url || iconUrl,
    });
  }

  if (imageUrl && imageUrl.match(/^https?:\/\//)) {
    window.sessionStorage['request.image.' + options.imageUrl] = JSON.stringify({
      referer: url || imageUrl,
    });
  }

  notificationsManager.add(options);
}

function createNotificationOptions(task: myStore.GloriaTask, data: myStore.MessageData, configs: myStore.GloriaConfig, isTest?: boolean) {
  const { name, needInteraction } = task;
  const { notificationId, title, message, iconUrl, url, imageUrl } = data;
  const { notificationSound, notificationCustomSound, notificationDetectIcon, notificationLaterMark } = configs;
  const options: enhanced.NotificationOptions = {
    //* defaultIconUrl 属性由管理器内添加
    //* 若未指定 onClick，通知对象内部会自动添加点击打开 url 的事件
    title: title || '',
    message: message || '',
    iconUrl: iconUrl || DEFAULT_ICON_URL,
    type: imageUrl ? 'image' : 'basic',
    id: notificationId || '',
    contextMessage: i18n('notificationContextMessage', [nowLTS(), name]),
    requireInteraction: needInteraction || false,
    buttons: undefined,
    eventTime: Date.now(),
    priority: 0,
    isClickable: !!url,
    url: url || undefined,
    silent: !notificationSound,
    customSound: notificationCustomSound,
    detectIcon: notificationDetectIcon,
    isTest,
  };

  if (options.type === 'image') {
    options.imageUrl = imageUrl;
  }

  if (notificationLaterMark && !options.isTest && options.url) {
    options.buttons = [
      {
        title: i18n('notificationLater'),
      },
    ];
    options.onButton0Click = id => {
      id && store.commit('markLaterNotification', id);
    };
  }

  return options;
}

function syncCodeUpdate() {
  const checkCodeUpdateIdList = new Set([] as string[]);
  const { taskAutoCheckUpdate } = store.state.configs;
  if (taskAutoCheckUpdate) {
    const checkId = uuid();
    createCheckCodeUpdateTimer(checkId);
    checkCodeUpdateIdList.add(checkId);
  }

  store.watch(
    (state: myStore.VuexState): boolean => state.configs.taskAutoCheckUpdate,
    (val: boolean) => {
      if (val) {
        if (checkCodeUpdateIdList.size === 0) {
          const checkId = uuid();
          createCheckCodeUpdateTimer(checkId);
          checkCodeUpdateIdList.add(checkId);
        }
      } else {
        checkCodeUpdateIdList.forEach(timerId => {
          alarmsManager.remove(timerId);
        });
        checkCodeUpdateIdList.clear();
      }
    }
  );
}

function syncTasks() {
  const activeTaskIdList = new Set([] as string[]);

  store.subscribe((mutation, state) => {
    if (mutation.type.includes('setTasks')) {
      const {
        configs: { internalStartDelay, internalDelayTime },
        tasks,
      } = state;
      //* 处理插件启动时延迟执行任务
      if (internalStartDelay) {
        window.setTimeout(() => {
          tasks.forEach(task => {
            if (task.isEnable) {
              createTaskTimer(task, false);
              activeTaskIdList.add(task.id);
            }
          });
        }, internalDelayTime * 1000);
      } else {
        tasks.forEach(task => {
          if (task.isEnable) {
            createTaskTimer(task, false);
            activeTaskIdList.add(task.id);
          }
        });
      }
    }

    if (mutation.type.includes('mergeTasks')) {
      const { tasks } = state;
      activeTaskIdList.forEach(id => {
        alarmsManager.remove(id);
      });
      activeTaskIdList.clear();
      tasks.forEach(task => {
        if (task.isEnable) {
          createTaskTimer(task, false);
          activeTaskIdList.add(task.id);
        }
      });
    }

    if (mutation.type.includes('createTaskBasic')) {
      const { operationTask } = state;
      if (operationTask && operationTask.isEnable) {
        createTaskTimer(operationTask, false);
        activeTaskIdList.add(operationTask.id);
      }
    }

    if (mutation.type.includes('updateIsEnable')) {
      const { operationTask } = state;
      if (operationTask) {
        if (operationTask.isEnable) {
          createTaskTimer(operationTask, false);
          activeTaskIdList.add(operationTask.id);
        } else {
          removeTaskTimer(operationTask);
          activeTaskIdList.delete(operationTask.id);
        }
      }
    }

    if (mutation.type.includes('updateTaskBasic')) {
      const { operationTask } = state;
      if (operationTask && operationTask.isEnable) {
        resetTaskTimer(operationTask, false);
      }
    }

    if (mutation.type.includes('removeTaskItem')) {
      const { operationTask } = state;
      if (operationTask) {
        removeTaskTimer(operationTask);
        activeTaskIdList.delete(operationTask.id);
      }
    }

    if (mutation.type.includes('clearTasks')) {
      activeTaskIdList.forEach(id => {
        alarmsManager.remove(id);
      });
      activeTaskIdList.clear();
    }
  });
}

function syncMessageFlow() {
  const pushMessageList = new Set([] as string[]);

  store.subscribe((mutation, state) => {
    if (mutation.type.includes('addMessageFlow')) {
      const { payload: messageFlow } = mutation;
      const { id, taskId, data } = messageFlow;
      const { tasks } = state;
      const { configs, implicitPush } = store.state;
      if (!implicitPush && !pushMessageList.has(id)) {
        for (const task of tasks) {
          if (task.id === taskId) {
            data.forEach((item: myStore.MessageData) => {
              const options = createNotificationOptions(task, item, configs);
              createNotification(options);
            });
            pushMessageList.add(id);
            break;
          }
        }
      }
    }
  });
}

function syncUnreadNumber() {
  chrome.browserAction.setBadgeBackgroundColor({
    color: '#cc0033',
  });

  store.watch(
    (state: myStore.VuexState): number => state.unread,
    (val: number) => {
      if (val > 0) {
        chrome.browserAction.setBadgeText({
          text: val.toString(),
        });
      } else {
        chrome.browserAction.setBadgeText({
          text: '',
        });
      }
    }
  );
}

function syncImplicitStatus() {
  //* 在扩展程序图标上注册相应 checkbox 菜单
  chrome.contextMenus.create({
    id: 'gloriaXImplicitStatus',
    type: 'checkbox',
    title: i18n('contextMenusImplicitPush'),
    checked: false,
    contexts: ['browser_action'],
    onclick() {
      if (!chrome.runtime.lastError) {
        store.commit('switchImplicitPush');
      }
    },
  });

  store.watch(
    (state: myStore.VuexState): boolean => state.implicitPush,
    (val: boolean) => {
      if (val) {
        chrome.browserAction.setIcon({
          path: {
            '16': 'icons/invisible/invisible-16.png',
            '19': 'icons/invisible/invisible-19.png',
            '24': 'icons/invisible/invisible-24.png',
            '32': 'icons/invisible/invisible-32.png',
            '48': 'icons/invisible/invisible-48.png',
            '64': 'icons/invisible/invisible-64.png',
            '96': 'icons/invisible/invisible-96.png',
            '128': 'icons/invisible/invisible-128.png',
          },
        });
      } else {
        chrome.browserAction.setIcon({
          path: {
            '16': 'icons/app/icon-16.png',
            '19': 'icons/app/icon-19.png',
            '24': 'icons/app/icon-24.png',
            '32': 'icons/app/icon-32.png',
            '48': 'icons/app/icon-48.png',
            '64': 'icons/app/icon-64.png',
            '96': 'icons/app/icon-96.png',
            '128': 'icons/app/icon-128.png',
          },
        });
      }

      chrome.contextMenus.update('gloriaXImplicitStatus', {
        type: 'checkbox',
        checked: val,
      });
    }
  );
}

function registerMenu() {
  chrome.contextMenus.create({
    id: 'gloriaXSelection',
    title: i18n('contextMenusSelection'),
    contexts: ['browser_action', 'page'],
    documentUrlPatterns: ['http://*/*', 'https://*/*', 'file://*/*', 'ftp://*/*'],
    onclick() {
      if (!chrome.runtime.lastError) {
        chrome.tabs.query(
          {
            active: true,
            currentWindow: true,
          },
          tabs => {
            if (!chrome.runtime.lastError && tabs && tabs[0] && tabs[0].url) {
              if (!tabs[0].url.match(/^(?:chrome|chrome-extension|file|moz-extension|about):/i)) {
                chrome.tabs.executeScript({
                  file: 'js/selection.js',
                });
              }
            }
          }
        );
      }
    },
  });

  chrome.contextMenus.create({
    id: 'gloriaXSeparator',
    type: 'separator',
    contexts: ['browser_action'],
  });

  if (!IS_CHROME) {
    chrome.contextMenus.create({
      id: 'gloriaXSettings',
      title: i18n('optionsTitle'),
      contexts: ['browser_action'],
      onclick() {
        if (!chrome.runtime.lastError) {
          chrome.tabs.create({
            url: './options.html#/settings',
          });
        }
      },
    });
  }

  chrome.contextMenus.create({
    id: 'gloriaXDebug',
    title: i18n('optionsDebugMenu'),
    contexts: ['browser_action'],
    onclick() {
      if (!chrome.runtime.lastError) {
        chrome.tabs.create({
          url: './options.html#/debug',
        });
      }
    },
  });

  const moreMenus = [
    {
      id: 'gloriaXState',
      title: 'optionsStateMenu',
      url: './options.html#/state',
    },
    {
      id: 'gloriaXHeaders',
      title: 'optionsHeadersMenu',
      url: './options.html#/headers',
    },
    {
      id: 'gloriaXReducer',
      title: 'optionsReducerMenu',
      url: './options.html#/reducer',
    },
    {
      id: 'gloriaXShare',
      title: 'popupTaskShare',
      url: 'https://gloria.pub/',
    },
    {
      id: 'gloriaXBook',
      title: 'popupTaskBook',
      url: 'https://github.com/LightAPIs/Gloria-X',
    },
  ];

  chrome.contextMenus.create({
    id: 'gloriaXMore',
    title: i18n('contextMenusMore'),
    contexts: ['browser_action'],
  });

  moreMenus.forEach(menu => {
    if (menu) {
      chrome.contextMenus.create({
        id: menu.id,
        parentId: 'gloriaXMore',
        title: i18n(menu.title),
        contexts: ['browser_action'],
        onclick() {
          if (!chrome.runtime.lastError) {
            chrome.tabs.create({
              url: menu.url,
            });
          }
        },
      });
    }
  });
}

function testVirtualNotification(dataList: myStore.CommitData | myStore.CommitData[]) {
  if (!dataList || (Array.isArray(dataList) && dataList.length === 0)) {
    return;
  }

  if (!Array.isArray(dataList)) {
    dataList = [dataList];
  }

  const { configs } = store.state;
  const virtualTask: myStore.GloriaTask = {
    id: '',
    code: '',
    name: i18n('notificationTestName'),
    type: '',
    triggerInterval: 0,
    needInteraction: false,
    origin: '',
    onTimeMode: false,
    earliestTime: '',
    isEnable: false,
    triggerCount: 0,
    pushCount: 0,
    triggerDate: '',
    pushDate: '',
    executionError: 0,
  };

  (dataList as myStore.MessageData[]).forEach(item => {
    const options = createNotificationOptions(virtualTask, item, configs, true);
    createNotification(options);
  });
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  const { type, data } = message;
  switch (type) {
    case 'executeTask':
      for (let i = 0; i < store.state.tasks.length; i++) {
        if (store.state.tasks[i].id === data) {
          resetTaskTimer(store.state.tasks[i], true);
          sendResponse({
            result: 'success',
          });
          break;
        }
      }
      return true;
    case 'reloadTasks':
      if (typeof data === 'number') {
        runLimit = data;
        sendResponse({
          result: 'ok',
        });
      } else {
        sendResponse({
          result: 'error',
        });
      }
      return true;
    case 'testCode':
      evalUntrusted(data)
        .then(res => {
          const formatRes = res ? commitFormat(res) : res;
          console.debug(formatRes);
          sendResponse({
            result: formatRes,
          });
          return formatRes;
        })
        .then(dataList => {
          testVirtualNotification(dataList);
        })
        .catch(e => {
          console.error(e);
          sendResponse({
            err: {
              message: e.message,
              stack: e.stack,
            },
          });
        });

      //? 从事件侦听器中返回 true，这使得 sendResponse 函数在侦听器返回后保持有效
      return true;
    case 'testNoMsgCode':
      evalUntrusted(data)
        .then(res => {
          const formatRes = res ? commitFormat(res) : res;
          console.debug(formatRes);
          sendResponse({
            result: formatRes,
          });
        })
        .catch(e => {
          console.error(e);
          sendResponse({
            err: {
              message: e.message,
              stack: e.stack,
            },
          });
        });
      return true;
    case 'testReducer':
      try {
        const virtualData = JSON.parse(data);
        const formatData = commitFormat(virtualData);
        const { reducer } = store.state;
        const resultData = reduceNotification(formatData, reducer);
        sendResponse({
          result: resultData,
        });
        testVirtualNotification(resultData);
      } catch (e) {
        console.error(e);
        sendResponse({
          err: {
            message: JSON.stringify(e),
          },
        });
      }
      return true;
    case 'testReducerNoMsg':
      try {
        const virtualData = JSON.parse(data);
        const formatData = commitFormat(virtualData);
        const { reducer } = store.state;
        const resultData = reduceNotification(formatData, reducer);
        sendResponse({
          result: resultData,
        });
      } catch (e) {
        console.error(e);
        sendResponse({
          err: {
            message: JSON.stringify(e),
          },
        });
      }
      return true;
    case 'manuallyCheckUpdate':
      try {
        fetch(data)
          .then(res => {
            if (res.status >= 200 && res.status < 300) {
              return res.json();
            } else {
              return res.text().then(msg => {
                throw {
                  status: res.status,
                  statusText: msg,
                };
              });
            }
          })
          .then(r => {
            if (r.code.trim()) {
              sendResponse({
                result: r.code.trim(),
              });
            } else {
              sendResponse({
                result: false,
              });
            }
          });
      } catch (e) {
        sendResponse({
          result: false,
          err: {
            message: JSON.stringify(e),
          },
        });
      }
      return true;
    case 'checkInstall':
      if (store.getters.hasInstalledTask(data)) {
        sendResponse({
          result: true,
        });
      } else {
        sendResponse({
          result: false,
        });
      }
      return true;
    case 'installTask':
      try {
        fetch(data)
          .then(res => {
            if (res.status >= 200 && res.status < 300) {
              return res.json();
            } else {
              return res.text().then(msg => {
                throw {
                  status: res.status,
                  statusText: msg,
                };
              });
            }
          })
          .then(r => {
            if (r.code.trim()) {
              store.dispatch('installTask', {
                id: uuid(),
                code: r.code.trim(),
                name: r.name || r.description || r.author || r._id,
                origin: data.replace('api.', ''),
              });
              sendResponse({
                result: true,
              });
              chrome.notifications.create(
                {
                  title: i18n('notificationTaskTitle'),
                  message: i18n('notificationTaskInstall', [r.name]),
                  iconUrl: DEFAULT_ICON_URL,
                  type: 'basic',
                },
                () => {
                  if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError);
                  }
                }
              );
            } else {
              sendResponse({
                result: false,
              });
            }
          });
      } catch (e) {
        sendResponse({
          result: false,
          err: {
            message: JSON.stringify(e),
          },
        });
      }
      return true;
    case 'updateTask':
      try {
        fetch(data)
          .then(res => {
            if (res.status >= 200 && res.status < 300) {
              return res.json();
            } else {
              return res.text().then(msg => {
                throw {
                  status: res.status,
                  statusText: msg,
                };
              });
            }
          })
          .then(r => {
            if (r.code.trim()) {
              store.dispatch('updateTaskByOrigin', {
                code: r.code.trim(),
                url: data.replace('api.', ''),
              });
              sendResponse({
                result: true,
              });
              chrome.notifications.create(
                {
                  title: i18n('notificationTaskTitle'),
                  message: i18n('notificationTaskUpdate', [r.name]),
                  iconUrl: DEFAULT_ICON_URL,
                  type: 'basic',
                },
                () => {
                  if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError);
                  }
                }
              );
            } else {
              sendResponse({
                result: false,
              });
            }
          });
      } catch (e) {
        sendResponse({
          result: false,
          err: {
            message: JSON.stringify(e),
          },
        });
      }
      return true;
    case 'uninstallTask':
      if (data) {
        store.dispatch('removeTaskByOrigin', data);
        sendResponse({
          result: true,
        });
        chrome.notifications.create(
          {
            title: i18n('notificationTaskTitle'),
            message: i18n('notificationTaskUninstall', data),
            iconUrl: DEFAULT_ICON_URL,
            type: 'basic',
          },
          () => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError);
            }
          }
        );
      } else {
        sendResponse({
          result: false,
        });
      }
      return true;
    case 'clearCaches':
      for (const key in window.sessionStorage) {
        if (key.startsWith('import-scripts.cache.')) {
          window.sessionStorage.removeItem(key);
        }
      }
      return true;
    //! 以下是处理 Firefox 上内容脚本的通信部分
    case 'getPageUrl-firefox':
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        tabs => {
          if (!chrome.runtime.lastError && tabs && tabs[0] && tabs[0].id) {
            chrome.tabs.sendMessage(
              tabs[0].id,
              {
                type: 'getPageUrl',
                data: '',
              },
              res => {
                sendResponse(res);
              }
            );
          }
        }
      );
      return true;
    case 'firefox-message':
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        tabs => {
          if (!chrome.runtime.lastError && tabs && tabs[0] && tabs[0].id) {
            chrome.tabs.sendMessage(tabs[0].id, {
              type: data.type,
              data: data.data,
            });
          }
        }
      );
      return true;
  }
});

chrome.webRequest.onBeforeSendHeaders.addListener(
  inflatedRequestHeaders,
  {
    urls: ['<all_urls>'],
  },
  IS_CHROME ? ['blocking', 'requestHeaders', 'extraHeaders'] : ['blocking', 'requestHeaders']
);

chrome.webRequest.onCompleted.addListener(
  details => {
    window.sessionStorage['request.id.' + details.requestId] && window.sessionStorage.removeItem('request.id.' + details.requestId);
  },
  {
    urls: ['<all_urls>'],
  }
);

chrome.storage.local.get(
  ['implicitPush', 'configs', 'tasks', 'rules', 'stages', 'notifications', 'reducer', 'lastCheckTasksUpdate', 'lastActiveTab', 'unread'],
  res => {
    console.log(res);
    const { implicitPush, configs, tasks, rules, stages, notifications, reducer, lastCheckTasksUpdate, lastActiveTab, unread } = res;
    store.commit('setImplicitPush', implicitPush);
    store.commit('setLastCheckTasksUpdate', lastCheckTasksUpdate);
    store.commit('setLastActiveTab', lastActiveTab);
    store.commit('setConfigs', configs);
    runLimit = (configs && configs.internalExecutionLimit) || 5;
    store.commit('setUnread', unread);
    store.commit('setNotifications', notifications);
    store.commit('setStages', stages);
    store.commit('setReducer', reducer);
    store.commit('setRules', rules);
    store.commit('setTasks', tasks);
  }
);

syncTasks();
syncMessageFlow();
syncUnreadNumber();
syncImplicitStatus();
syncCodeUpdate();
registerMenu();

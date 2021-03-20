import { evalUntrusted, inflatedRequestHeaders } from '@/commons/eval-untrusted';
import IntervalAlarmsManager from '@/commons/IntervalAlarmsManager';
import NotificationsManager from '@/commons/NavigableNotificationsManager';
import store from '../store';
import { isAfterInterval, remainingTime, nowLTS, dayjsLocale } from '@/commons/calc';
import { i18n } from '@/commons/ui';
import { APP_ICON_URL as DEFAULT_ICON_URL } from '@/commons/var';
import { v4 as uuid } from 'uuid';
import { commitFormat, reduceNotification } from '@/store/reducer';

const alarmsManager = new IntervalAlarmsManager();
const notificationsManager = new NotificationsManager();
dayjsLocale();

function createTaskTimer(task: store.GloriaTask, immediately = false) {
  const { notificationSound, notificationCustomSound, notificationDisableError } = store.state.configs;
  const { id, code, triggerInterval, triggerDate, onTimeMode, name } = task;
  function run() {
    store.commit('triggerTask', id);
    setTimeout(() => {
      evalUntrusted(code)
        .then(dataList => {
          if (!dataList || (Array.isArray(dataList) && dataList.length === 0)) {
            return;
          }

          store.dispatch('handleData', {
            taskId: id,
            data: commitFormat(dataList as store.CommitData | store.CommitData[]),
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
          store.commit('executionError', id);
        });
    }, 0);
  }

  if (immediately) {
    if (onTimeMode) {
      if (isAfterInterval(triggerDate, triggerInterval)) {
        alarmsManager.add(id, -1, triggerInterval, run);
        run();
      } else {
        alarmsManager.add(id, remainingTime(triggerDate, triggerInterval), triggerInterval, run);
      }
    } else {
      alarmsManager.add(id, -1, triggerInterval, run);
      run();
    }
  } else {
    alarmsManager.add(id, -1, triggerInterval, run);
  }
}

function createCheckCodeUpdateTimer(checkId: string, immediately = false) {
  function check() {
    store.commit('triggerLastCheckTasksUpdate');
    const { tasks, configs } = store.state;
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
                  silent: !configs.notificationSound,
                  customSound: configs.notificationCustomSound,
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
    const { lastCheckTasksUpdate } = store.state;
    if (isAfterInterval(lastCheckTasksUpdate, 60 * 6)) {
      alarmsManager.add(checkId, -1, 60 * 6, check);
      check();
    } else {
      alarmsManager.add(checkId, remainingTime(lastCheckTasksUpdate, 60 * 6), 60 * 6, check);
    }
  } else {
    alarmsManager.add(checkId, -1, 60 * 6, check);
  }
}

function resetTaskTimer(task: store.GloriaTask) {
  alarmsManager.remove(task.id, () => {
    createTaskTimer(task, true);
  });
}

function removeTaskTimer(task: store.GloriaTask) {
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

function createNotificationOptions(task: store.GloriaTask, data: store.MessageData, configs: store.GloriaConfig, isTest?: boolean) {
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
    createCheckCodeUpdateTimer(checkId, true);
    checkCodeUpdateIdList.add(checkId);
  }

  store.watch(
    (state: store.VuexState): boolean => state.configs.taskAutoCheckUpdate,
    (val: boolean) => {
      if (val) {
        if (checkCodeUpdateIdList.size === 0) {
          const checkId = uuid();
          createCheckCodeUpdateTimer(checkId, true);
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
      const { tasks } = state;
      tasks.forEach(task => {
        if (task.isEnable) {
          createTaskTimer(task, true);
          activeTaskIdList.add(task.id);
        }
      });
    }

    if (mutation.type.includes('mergeTasks')) {
      const { tasks } = state;
      activeTaskIdList.forEach(id => {
        alarmsManager.remove(id);
      });
      activeTaskIdList.clear();
      tasks.forEach(task => {
        if (task.isEnable) {
          createTaskTimer(task, true);
          activeTaskIdList.add(task.id);
        }
      });
    }

    if (mutation.type.includes('createTaskBasic')) {
      const { operationTask } = state;
      if (operationTask && operationTask.isEnable) {
        createTaskTimer(operationTask, true);
        activeTaskIdList.add(operationTask.id);
      }
    }

    if (mutation.type.includes('updateIsEnable')) {
      const { operationTask } = state;
      if (operationTask) {
        if (operationTask.isEnable) {
          createTaskTimer(operationTask, true);
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
        resetTaskTimer(operationTask);
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
            data.forEach((item: store.MessageData) => {
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
    (state: store.VuexState): number => state.unread,
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
    (state: store.VuexState): boolean => state.implicitPush,
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

function syncSelection() {
  chrome.contextMenus.create({
    id: 'gloriaXSelection',
    title: i18n('contextMenusSelection'),
    contexts: ['browser_action', 'page'],
    onclick() {
      if (!chrome.runtime.lastError) {
        chrome.tabs.query(
          {
            active: true,
            currentWindow: true,
          },
          tabs => {
            if (!chrome.runtime.lastError && tabs && tabs[0] && tabs[0].url) {
              if (!tabs[0].url.match(/^chrome:|^chrome-extension:|^file:/i)) {
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
}

function testVirtualNotification(dataList: store.CommitData | store.CommitData[]) {
  if (!dataList || (Array.isArray(dataList) && dataList.length === 0)) {
    return;
  }

  if (!Array.isArray(dataList)) {
    dataList = [dataList];
  }

  const { configs } = store.state;
  const virtualTask: store.GloriaTask = {
    id: '',
    code: '',
    name: i18n('notificationTestName'),
    triggerInterval: 0,
    needInteraction: false,
    origin: '',
    onTimeMode: false,
    isEnable: false,
    triggerCount: 0,
    pushCount: 0,
    triggerDate: '',
    pushDate: '',
    lastExecutionError: false,
  };

  (dataList as store.MessageData[]).forEach(item => {
    const options = createNotificationOptions(virtualTask, item, configs, true);
    createNotification(options);
  });
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  const { type, data } = message;
  switch (type) {
    case 'testCode':
      evalUntrusted(data)
        .then(res => {
          const formatRes = commitFormat(res as store.CommitData | store.CommitData[]);
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
          const formatRes = commitFormat(res as store.CommitData | store.CommitData[]);
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
        if (key.startsWith('import-cripts.cache.')) {
          window.sessionStorage.removeItem(key);
        }
      }
      break;
  }
});

chrome.webRequest.onBeforeSendHeaders.addListener(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inflatedRequestHeaders as any,
  {
    urls: ['<all_urls>'],
  },
  ['blocking', 'requestHeaders', 'extraHeaders']
);

chrome.webRequest.onBeforeSendHeaders.addListener(
  details => {
    const name = 'request.image.' + details.url;
    if (
      window.sessionStorage[name] &&
      details.type === 'image' &&
      details.frameId === 0 &&
      details.parentFrameId === -1 &&
      details.tabId === -1
    ) {
      let refererIndex = -1;
      const { requestHeaders = [] } = details;
      for (let i = 0; i < requestHeaders.length; i++) {
        const header = requestHeaders[i];
        if (header && header.name && header.name.toLowerCase() === 'referer') {
          refererIndex = i;
        }
      }

      let data = {
        referer: '',
      };
      try {
        data = JSON.parse(window.sessionStorage[name]);
      } catch (e) {
        console.error(e);
        data = {
          referer: '',
        };
      }

      if (refererIndex === -1) {
        requestHeaders.push({
          name: 'Referer',
          value: data.referer || details.url,
        });
      }
    }
    return {
      requestHeaders: details.requestHeaders,
    };
  },
  {
    urls: ['<all_urls>'],
  },
  ['blocking', 'requestHeaders', 'extraHeaders']
);

//? 虽然文档中未指出，但是第二个参数是必须给出的
chrome.webRequest.onCompleted.addListener(
  details => {
    window.sessionStorage['request.id.' + details.requestId] && window.sessionStorage.removeItem('request.id.' + details.requestId);
  },
  {
    urls: ['<all_urls>'],
  }
);

chrome.storage.local.get(
  ['implicitPush', 'configs', 'tasks', 'stages', 'notifications', 'reducer', 'lastCheckTasksUpdate', 'lastActiveTab', 'unread'],
  res => {
    console.log(res);
    const { implicitPush, configs, tasks, stages, notifications, reducer, lastCheckTasksUpdate, lastActiveTab, unread } = res;
    store.commit('setImplicitPush', implicitPush);
    store.commit('setLastCheckTasksUpdate', lastCheckTasksUpdate);
    store.commit('setLastActiveTab', lastActiveTab);
    store.commit('setConfigs', configs);
    store.commit('setUnread', unread);
    store.commit('setNotifications', notifications);
    store.commit('setStages', stages);
    store.commit('setReducer', reducer);
    store.commit('setTasks', tasks);
  }
);

syncTasks();
syncMessageFlow();
syncUnreadNumber();
syncImplicitStatus();
syncCodeUpdate();
syncSelection();

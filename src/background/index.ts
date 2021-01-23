import { evalUntrusted, inflatedRequestHeaders } from '@/commons/eval-untrusted';
import IntervalAlarmsManager from '@/commons/IntervalAlarmsManager';
import NotificationsManager from '@/commons/NavigableNotificationsManager';
import store from '../store';
import { isAfterInterval, remainingTime, nowLTS, momentLocale } from '@/commons/calc';
import { i18n } from '@/commons/ui';
import { APP_ICON_URL as DEFAULT_ICON_URL } from '@/commons/var';
import { v4 as uuid } from 'uuid';
import { commitFormat, reduceNotification } from '@/store/reducer';

const alarmsManager = new IntervalAlarmsManager();
const notificationsManager = new NotificationsManager();
momentLocale();

chrome.storage.local.get(['implicitPush', 'configs', 'tasks', 'stages', 'notifications', 'reducer'], res => {
  console.log(res);
  const { implicitPush, configs, tasks, stages, notifications, reducer } = res;
  store.commit('setImplicitPush', implicitPush);
  store.commit('setConfigs', configs);
  store.commit('setNotifications', notifications);
  store.commit('setStages', stages);
  store.commit('setReducer', reducer);
  store.commit('setTasks', tasks);
});

function createTaskTimer(task: store.GloriaTask, immediately = false) {
  const { id, code, triggerInterval, triggerDate, onTimeMode } = task;
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

function resetTaskTimer(task: store.GloriaTask) {
  alarmsManager.remove(task.id, () => {
    createTaskTimer(task, true);
  });
}

function removeTaskTimer(task: store.GloriaTask) {
  alarmsManager.remove(task.id);
}

function createNotification(options: enhanced.NotificationOptions) {
  if (options.url) {
    window.sessionStorage['request.image.' + options.iconUrl] = JSON.stringify({
      referer: options.url,
    });
    window.sessionStorage['request.image.' + options.imageUrl] = JSON.stringify({
      referer: options.url,
    });
  } else {
    window.sessionStorage['request.image.' + options.iconUrl] = JSON.stringify({
      referer: options.iconUrl,
    });
    window.sessionStorage['request.image.' + options.imageUrl] = JSON.stringify({
      referer: options.imageUrl,
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

//todo function checkOriginUpdate() {}

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
  };

  (dataList as store.MessageData[]).forEach(item => {
    const options = createNotificationOptions(virtualTask, item, configs, true);
    createNotification(options);
  });
}

chrome.runtime.onMessageExternal.addListener((message, _sender, sendResponse) => {
  let originTasks: store.GloriaTask[];
  switch (message.type) {
    case 'task.install':
      store.dispatch('installTask', {
        id: uuid(),
        code: message.code,
        name: message.name,
        triggerInterval: 5,
        needInteraction: false,
        onTimeMode: false,
        origin: message.origin,
      });
      sendResponse(true);
      chrome.notifications.create(
        {
          title: i18n('notificationTaskTitle'),
          message: i18n('notificationTaskInstall', [message.name]),
          iconUrl: DEFAULT_ICON_URL,
          type: 'basic',
        },
        () => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
          }
        }
      );
      break;
    case 'task.is-exist':
      if (message.origin) {
        originTasks = store.state.tasks.filter(task => task.origin === message.origin);
        if (originTasks.length > 0) {
          if (originTasks[0].code === message.code) {
            sendResponse(true);
          } else {
            sendResponse('diff');
          }
        } else {
          sendResponse(false);
        }
      } else {
        sendResponse(false);
      }
      break;
    case 'task.uninstall':
      if (message.origin) {
        store.dispatch('removeTaskByOrigin', message.origin);
        sendResponse(true);
      } else {
        sendResponse(false);
      }
      break;
    case 'task.update':
      if (message.origin) {
        store.dispatch('updateTaskByOrigin', {
          url: message.origin,
          code: message.code,
        });
        sendResponse(true);
      } else {
        sendResponse(false);
      }
      break;
    case 'extension.version':
      sendResponse(chrome.runtime.getManifest().version); // Gloria-X is usually bigger than Gloria version.
      break;
  }
});

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
      let refererIndex;
      const { requestHeaders = [] } = details;
      for (let i = 0; i < requestHeaders.length; i++) {
        if (requestHeaders[i].name === 'Referer') {
          refererIndex = i;
        }
      }
      const data = JSON.parse(window.sessionStorage[name]);
      if (!refererIndex) {
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
  }
);

//? 虽然文档中未指出，但是第二个参数是必须给出的
chrome.webRequest.onCompleted.addListener(
  details => {
    window.sessionStorage.removeItem('request.id.' + details.requestId);
  },
  {
    urls: ['<all_urls>'],
  }
);

// chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
//   //todo 处理稍后查阅功能
//   try {
//     const { id, origin } = JSON.parse(notificationId);
//     if (buttonIndex === 0) {
//       // 打开更新网站
//       chrome.windows.getCurrent(
//         {
//           windowTypes: ['normal'],
//         },
//         win => {
//           if (!chrome.runtime.lastError && win) {
//             chrome.tabs.create({
//               url: origin,
//             });
//           } else {
//             chrome.windows.create(w => {
//               w &&
//                 chrome.tabs.create({
//                   url: origin,
//                   windowId: w.id,
//                 });
//             });
//           }
//         }
//       );
//     } else if (buttonIndex === 1) {
//       //todo 原程序在此处有一个删除任务的 origin 的操作
//     }
//   } catch (e) {
//     console.error(e);
//   } finally {
//     chrome.notifications.clear(notificationId);
//   }
// });

syncTasks();
syncMessageFlow();
syncUnreadNumber();
syncImplicitStatus();

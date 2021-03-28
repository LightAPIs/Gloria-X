import { now } from '@/commons/calc';
import ChromeStorage from './storage';
import { defaultTask, normalizeTask } from './state';

const chromeStorage = new ChromeStorage();
const STAGE_LIMIT = 200;

export default {
  setImplicitPush(state: store.VuexState, newStatus: boolean) {
    state.implicitPush = newStatus || false;
  },
  updateImplicitPush(state: store.VuexState, newStatus: boolean) {
    state.implicitPush = newStatus || false;
    chromeStorage.setImplicitPush(state.implicitPush, `set implicitPush -> ${state.implicitPush}`);
  },
  switchImplicitPush(state: store.VuexState) {
    state.implicitPush = !state.implicitPush;
    chromeStorage.setImplicitPush(state.implicitPush, `switch implicitPush -> ${state.implicitPush}`);
  },

  setLastActiveTab(state: store.VuexState, newTab: string) {
    state.lastActiveTab = newTab || 'tasks';
  },
  updateLastActiveTab(state: store.VuexState, newTab: string) {
    state.lastActiveTab = newTab;
    chromeStorage.setLastActiveTab(state.lastActiveTab, `update active tab: "${state.lastActiveTab}".`);
  },

  setLastCheckTasksUpdate(state: store.VuexState, newTime: string) {
    state.lastCheckTasksUpdate = newTime || now();
  },
  triggerLastCheckTasksUpdate(state: store.VuexState) {
    state.lastCheckTasksUpdate = now();
    chromeStorage.setLastCheckTasksUpdate(state.lastCheckTasksUpdate, `trigger check tasks update: "${state.lastCheckTasksUpdate}".`);
  },

  setConfigs(state: store.VuexState, newCofings: store.GloriaConfig) {
    Object.assign(state.configs, newCofings || {});
  },
  updateConfigs(state: store.VuexState, config: store.GloriaConfigItem) {
    const { name, value } = config;
    if (typeof name === 'string') {
      state.configs[name] = value;

      //* 处理通知记录数量上限
      if (name === 'notificationMaxinum') {
        if (state.configs.notificationMaxinum && state.notifications.length > state.configs.notificationMaxinum) {
          const diffNum = state.notifications.length - state.configs.notificationMaxinum;
          for (let i = 0; i < diffNum; i++) {
            state.notifications.pop();
          }
          chromeStorage.setNotifications(state.notifications, `update "notifications maxinum".`);
        }
      }

      //* 处理扩展程序图标显示未读通知数
      if (name === 'notificationShowBadge') {
        if (!state.configs.notificationShowBadge) {
          // 关闭选项时清零
          if (state.unread > 0) {
            state.unread = 0;
            chromeStorage.setUnread(state.unread, 'sync clear unread number.');
          }
        }
      }

      chromeStorage.setConfigs(state.configs, `set "configs.${name}: ${value}".`);
    }
  },

  setTasks(state: store.VuexState, newTasks: store.GloriaTask[]) {
    if (newTasks && Array.isArray(newTasks) && newTasks.length > 0) {
      state.tasks = newTasks.map(task => Object.assign(defaultTask(), normalizeTask(task)));
    } else {
      state.tasks = [];
    }
  },
  mergeTasks(state: store.VuexState, newTasks: store.GloriaTask[]) {
    if (Array.isArray(newTasks)) {
      const length = state.tasks.length;
      for (let i = 0; i < newTasks.length; i++) {
        let merge = false;
        for (let j = 0; j < length; j++) {
          if (newTasks[i].id === state.tasks[j].id) {
            Object.assign(state.tasks[j], normalizeTask(newTasks[i]));
            merge = true;
            break;
          }
        }
        !merge && state.tasks.push(Object.assign(defaultTask(), normalizeTask(newTasks[i])));
      }

      chromeStorage.setTasks(state.tasks, 'merge tasks.');
    }
  },
  updateIsEnable(state: store.VuexState, newChecked: store.SwitchChecked) {
    const { id, checked } = newChecked;
    let mod = false;
    for (let i = 0; i < state.tasks.length; i++) {
      if (state.tasks[i].id === id) {
        state.tasks[i].isEnable = checked;
        state.operationTask = state.tasks[i];
        mod = true;
        break;
      }
    }

    mod && chromeStorage.setTasks(state.tasks, `set "tasks -> ${id} -> isEnable: ${checked}".`);
  },
  updateTaskBasic(state: store.VuexState, taskBasic: store.GloriaTaskBasic) {
    const { id, ...rest } = taskBasic;
    let mod = false;
    for (let i = 0; i < state.tasks.length; i++) {
      if (state.tasks[i].id === id) {
        Object.assign(state.tasks[i], rest);
        state.operationTask = state.tasks[i];
        mod = true;
        break;
      }
    }
    mod && chromeStorage.setTasks(state.tasks, `set "tasks -> ${id}".`);
  },
  createTaskBasic(state: store.VuexState, taskBasic: store.GloriaTaskBasic) {
    const { taskOnTop } = state.configs;
    const newTask = Object.assign(defaultTask(), taskBasic);
    if (taskOnTop) {
      state.tasks.unshift(newTask);
    } else {
      state.tasks.push(newTask);
    }
    state.operationTask = newTask;

    chromeStorage.setTasks(state.tasks, 'create a new task.');
  },
  removeTaskItem(state: store.VuexState, taskId: string) {
    let del = false,
      delStage = false;
    for (let i = 0; i < state.tasks.length; i++) {
      if (state.tasks[i].id === taskId) {
        state.operationTask = state.tasks[i];
        state.tasks.splice(i, 1);
        //* 处理自动移除对应的 STAGES 组件缓存
        if (state.configs.taskAutoRemoveStage) {
          for (let j = 0; j < state.stages.length; j++) {
            if (state.stages[j].id === taskId) {
              state.stages.splice(j, 1);
              delStage = true;
              break;
            }
          }
        }
        del = true;
        break;
      }
    }
    del && chromeStorage.setTasks(state.tasks, `delete "tasks -> ${taskId}".`);
    delStage && chromeStorage.setStages(state.stages, `delete "stages -> ${taskId}".`);
  },
  triggerTask(state: store.VuexState, taskId: string) {
    let trigger = false;
    for (let i = 0; i < state.tasks.length; i++) {
      if (state.tasks[i].id === taskId) {
        state.tasks[i].triggerCount++;
        state.tasks[i].triggerDate = now();
        trigger = true;
        break;
      }
    }
    trigger && chromeStorage.setTasks(state.tasks, `trigger task: "${taskId}".`);
  },
  executionTaskSuccess(state: store.VuexState, taskId: string) {
    let reset = false;
    for (let i = 0; i < state.tasks.length; i++) {
      if (state.tasks[i].id === taskId) {
        if (state.tasks[i].executionError > 0) {
          state.tasks[i].executionError = 0;
          reset = true;
        }
        break;
      }
    }

    reset && chromeStorage.setTasks(state.tasks, `task execution success: "${taskId}".`);
  },
  executionTaskError(state: store.VuexState, taskId: string) {
    let err = false;
    for (let i = 0; i < state.tasks.length; i++) {
      if (state.tasks[i].id === taskId) {
        state.tasks[i].executionError++;
        err = true;
        break;
      }
    }

    err && chromeStorage.setTasks(state.tasks, `task execution error: "${taskId}".`);
  },
  clearTasks(state: store.VuexState) {
    let delStage = false;
    //* 处理自动移除对应的 STAGES 组件缓存
    if (state.configs.taskAutoRemoveStage) {
      const { tasks } = state;
      const tasksIds: string[] = [];
      tasks.forEach(task => {
        tasksIds.push(task.id);
      });
      state.stages = state.stages.filter(v => !tasksIds.includes(v.id));
      delStage = true;
    }
    state.tasks = [];
    chromeStorage.setTasks(state.tasks, 'clear tasks.');
    delStage && chromeStorage.setStages(state.stages, 'auto clear stages.');
  },
  disconnectTask(state: store.VuexState, id: string) {
    let dis = false;
    for (let i = 0; i < state.tasks.length; i++) {
      if (id === state.tasks[i].id) {
        state.tasks[i].origin = '';
        dis = true;
        break;
      }
    }
    dis && chromeStorage.setTasks(state.tasks, `disconnect task -> "${id}".`);
  },

  setStages(state: store.VuexState, newStages: store.GloriaStage[]) {
    if (newStages && Array.isArray(newStages) && newStages.length > 0) {
      state.stages = [...newStages];
    } else {
      state.stages = [];
    }
  },
  updateStage(state: store.VuexState, newStage: { id: string; stage: store.Stage | store.Stage[] }) {
    const { id, stage } = newStage;
    for (let i = 0; i < state.stages.length; i++) {
      if (id === state.stages[i].id) {
        if (Array.isArray(stage) && stage.length > STAGE_LIMIT) {
          stage.splice(0, stage.length - STAGE_LIMIT);
        }

        state.stages[i].stage = stage || [];
      }
    }

    chromeStorage.setStages(state.stages, `set "stages -> ${id}".`);
  },
  addStage(state: store.VuexState, newStage: { id: string; stage: store.Stage | store.Stage[] }) {
    const { id, stage } = newStage;
    if (Array.isArray(stage) && stage.length > STAGE_LIMIT) {
      stage.splice(0, stage.length - STAGE_LIMIT);
    }
    state.stages.push({
      id,
      stage,
    });

    chromeStorage.setStages(state.stages, 'create a new stage.');
  },
  clearStages(state: store.VuexState) {
    state.stages = [];
    chromeStorage.setStages(state.stages, 'clear stages.');
  },
  clearExpiredStages(state: store.VuexState) {
    const tasksSet = new Set(
      state.tasks.map(task => {
        return task.id;
      })
    );
    const stagesSet = new Set(
      state.stages.map(stage => {
        return stage.id;
      })
    );
    const difference = new Set([...stagesSet].filter(x => !tasksSet.has(x)));
    for (const diffId of difference) {
      for (let i = 0; i < state.stages.length; i++) {
        if (state.stages[i].id === diffId) {
          state.stages.splice(i, 1);
          break;
        }
      }
    }

    difference.size > 0 && chromeStorage.setStages(state.stages, 'clear expired stages.');
  },

  addMessageFlow(state: store.VuexState, newMessageFlow: store.MessageFlow) {
    //! 推送消息流是虚拟的
    const { taskId, data } = newMessageFlow;
    const { notificationShowBadge, notificationMaxinum } = state.configs;
    let push = false;
    for (let i = 0; i < state.tasks.length; i++) {
      if (taskId === state.tasks[i].id) {
        state.tasks[i].pushCount += data.length;
        state.tasks[i].pushDate = now();
        const contextMessage = state.tasks[i].name;

        //! 若启用自动获取网站图标时，为了在通知记录中能保存自动获取到的网站图标
        //! 会在订阅器上再次对通知记录进行处理
        data.forEach(item => {
          const { notificationId, iconUrl, ...rest } = item;
          state.notifications.unshift({
            id: notificationId,
            options: {
              type: rest.imageUrl ? 'image' : 'basic',
              contextMessage,
              eventTime: Date.now(),
              ...rest,
              //? 为了能在观察内部状态时动态显示缓存的图标信息，提前手动赋值
              iconUrl: iconUrl || '',
            },
            later: false,
          });
        });
        //* 处理通知记录数量上限
        if (notificationMaxinum && state.notifications.length > notificationMaxinum) {
          const diffNum = state.notifications.length - notificationMaxinum;
          for (let i = 0; i < diffNum; i++) {
            state.notifications.pop();
          }
        }
        if (notificationShowBadge) {
          state.unread += data.length;
          chromeStorage.setUnread(state.unread, `store unread number to "${state.unread}".`);
        }

        push = true;
        break;
      }
    }

    if (push) {
      chromeStorage.setTasks(state.tasks, 'task push new message.');
      chromeStorage.setNotifications(state.notifications, 'add new notifications.');
    }
  },

  setNotifications(state: store.VuexState, newNotifications: store.GloriaConfig) {
    if (newNotifications && Array.isArray(newNotifications) && newNotifications.length > 0) {
      state.notifications = [...newNotifications];
    } else {
      state.notifications = [];
    }
  },
  updateNotification(state: store.VuexState, notification: { id: string; options: store.GloriaNotificationOptions }) {
    const { id, options } = notification;
    let upd = false;
    for (let i = 0; i < state.notifications.length; i++) {
      if (id === state.notifications[i].id) {
        Object.assign(state.notifications[i].options, options);
        upd = true;
        break;
      }
    }
    upd && chromeStorage.setNotifications(state.notifications, `update notifications -> "${id}".`);
  },
  markLaterNotification(state: store.VuexState, notificationId: string) {
    let mark = false;
    for (let i = 0; i < state.notifications.length; i++) {
      if (notificationId === state.notifications[i].id) {
        state.notifications[i].later = true;
        mark = true;
      }
    }

    mark && chromeStorage.setNotifications(state.notifications, `mark later notificaiton -> "${notificationId}".`);
  },
  checkedNotification(state: store.VuexState, notificationId: string) {
    let checked = false;
    for (let i = 0; i < state.notifications.length; i++) {
      if (notificationId === state.notifications[i].id) {
        state.notifications[i].later = false;
        checked = true;
      }
    }

    checked && chromeStorage.setNotifications(state.notifications, `checked notification -> "${notificationId}".`);
  },
  removeNotification(state: store.VuexState, notificationId: string) {
    let del = false;
    for (let i = 0; i < state.notifications.length; i++) {
      if (notificationId === state.notifications[i].id) {
        state.notifications.splice(i, 1);
        del = true;
        break;
      }
    }

    del && chromeStorage.setNotifications(state.notifications, `remove notification: "${notificationId}".`);
  },
  clearLaterCount(state: store.VuexState) {
    let clc = false;
    for (let i = 0; i < state.notifications.length; i++) {
      if (state.notifications[i].later) {
        state.notifications[i].later = false;
        clc = true;
      }
    }

    clc && chromeStorage.setNotifications(state.notifications, 'clear later count.');
  },
  markLaterByName(state: store.VuexState, name: string) {
    let mark = false;
    for (let i = 0; i < state.notifications.length; i++) {
      if (state.notifications[i].options.contextMessage === name) {
        if (state.notifications[i].options.url && !state.notifications[i].later) {
          state.notifications[i].later = true;
          mark = true;
        }
      }
    }

    mark && chromeStorage.setNotifications(state.notifications, `mark later by name: "${name}".`);
  },
  removeLaterByName(state: store.VuexState, name: string) {
    let rm = false;
    for (let i = 0; i < state.notifications.length; i++) {
      if (state.notifications[i].options.contextMessage === name) {
        if (state.notifications[i].later) {
          state.notifications[i].later = false;
          rm = true;
        }
      }
    }

    rm && chromeStorage.setNotifications(state.notifications, `remove later by name: "${name}".`);
  },
  removeNotificationsByName(state: store.VuexState, name: string) {
    state.notifications = state.notifications.filter(notify => notify.options.contextMessage !== name);

    chromeStorage.setNotifications(state.notifications, `remove notifications by name: "${name}".`);
  },
  clearNotifications(state: store.VuexState) {
    if (state.notifications.length > 0) {
      state.notifications = [];
      chromeStorage.setNotifications(state.notifications, 'clear notifications.');
    }

    if (state.unread > 0) {
      state.unread = 0;
      chromeStorage.setUnread(state.unread, 'sync clear unread number.');
    }
  },

  setReducer(state: store.VuexState, newReducer: string) {
    state.reducer = newReducer || '';
  },
  updateReducer(state: store.VuexState, newReducer: string) {
    state.reducer = newReducer;
    chromeStorage.setReducer(state.reducer, 'update reducer.');
  },

  setUnread(state: store.VuexState, newNum: number) {
    state.unread = newNum > 0 ? newNum : 0;
  },
  decreaseUnread(state: store.VuexState) {
    if (state.unread > 0) {
      state.unread--;
      chromeStorage.setUnread(state.unread, `decrease unread number to "${state.unread}".`);
    }
  },
  clearUnread(state: store.VuexState) {
    if (state.unread > 0) {
      state.unread = 0;
      chromeStorage.setUnread(state.unread, 'clear unread number.');
    }
  },
};

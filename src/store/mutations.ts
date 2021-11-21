import { now } from '@/commons/calc';
import ChromeStorage from './storage';
import { defaultTask, defaultRule, normalizeTask, normalizeRule } from './basic';

const chromeStorage = new ChromeStorage();
const STAGE_LIMIT = 200;

export default {
  setImplicitPush(state: myStore.VuexState, newStatus: boolean): void {
    state.implicitPush = newStatus || false;
  },
  updateImplicitPush(state: myStore.VuexState, newStatus: boolean): void {
    state.implicitPush = newStatus || false;
    chromeStorage.setImplicitPush(state.implicitPush, `set implicitPush -> ${state.implicitPush}`);
  },
  switchImplicitPush(state: myStore.VuexState): void {
    state.implicitPush = !state.implicitPush;
    chromeStorage.setImplicitPush(state.implicitPush, `switch implicitPush -> ${state.implicitPush}`);
  },

  setLastActiveTab(state: myStore.VuexState, newTab: string): void {
    state.lastActiveTab = newTab || 'tasks';
  },
  updateLastActiveTab(state: myStore.VuexState, newTab: string): void {
    state.lastActiveTab = newTab;
    chromeStorage.setLastActiveTab(state.lastActiveTab, `update active tab: "${state.lastActiveTab}".`);
  },

  setLastCheckTasksUpdate(state: myStore.VuexState, newTime: string): void {
    state.lastCheckTasksUpdate = newTime || now();
  },
  triggerLastCheckTasksUpdate(state: myStore.VuexState): void {
    state.lastCheckTasksUpdate = now();
    chromeStorage.setLastCheckTasksUpdate(state.lastCheckTasksUpdate, `trigger check tasks update: "${state.lastCheckTasksUpdate}".`);
  },

  setConfigs(state: myStore.VuexState, newCofings: myStore.GloriaConfig): void {
    Object.assign(state.configs, newCofings || {});
  },
  updateConfigs(state: myStore.VuexState, config: myStore.GloriaConfigItem): void {
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

  setTasks(state: myStore.VuexState, newTasks: myStore.GloriaTask[]): void {
    if (newTasks && Array.isArray(newTasks) && newTasks.length > 0) {
      state.tasks = newTasks.map(task => Object.assign(defaultTask(), normalizeTask(task)));
    } else {
      state.tasks = [];
    }
  },
  mergeTasks(state: myStore.VuexState, newTasks: myStore.GloriaTask[]): void {
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
  updateIsEnable(state: myStore.VuexState, newChecked: myStore.SwitchChecked): void {
    const { id, checked } = newChecked;
    let mod = false;
    state.operationTask = null;
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
  updateTaskBasic(state: myStore.VuexState, taskBasic: myStore.GloriaTaskBasic): void {
    const { id, ...rest } = taskBasic;
    let mod = false;
    state.operationTask = null;
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
  createTaskBasic(state: myStore.VuexState, taskBasic: myStore.GloriaTaskBasic): void {
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
  removeTaskItem(state: myStore.VuexState, taskId: string): void {
    let del = false,
      delStage = false;
    state.operationTask = null;
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
  executionTaskSuccess(state: myStore.VuexState, taskId: string): void {
    let trigger = false;
    for (let i = 0; i < state.tasks.length; i++) {
      if (state.tasks[i].id === taskId) {
        state.tasks[i].triggerCount++;
        state.tasks[i].triggerDate = now();
        trigger = true;
        if (state.tasks[i].executionError > 0) {
          state.tasks[i].executionError = 0;
        }
        break;
      }
    }

    trigger && chromeStorage.setTasks(state.tasks, `task execution success: "${taskId}".`);
  },
  executionTaskError(state: myStore.VuexState, taskId: string): void {
    let trigger = false;
    for (let i = 0; i < state.tasks.length; i++) {
      if (state.tasks[i].id === taskId) {
        state.tasks[i].triggerCount++;
        state.tasks[i].triggerDate = now();
        state.tasks[i].executionError++;
        trigger = true;
        break;
      }
    }

    trigger && chromeStorage.setTasks(state.tasks, `task execution error: "${taskId}".`);
  },
  clearTasks(state: myStore.VuexState): void {
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
  disconnectTask(state: myStore.VuexState, id: string): void {
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

  setRules(state: myStore.VuexState, newRules: myStore.RequestHeadersRule[]): void {
    if (newRules && Array.isArray(newRules) && newRules.length > 0) {
      state.rules = [...newRules];
    } else {
      state.rules = [];
    }
  },
  mergeRules(state: myStore.VuexState, newRules: myStore.RequestHeadersRule[]): void {
    if (Array.isArray(newRules)) {
      const length = state.rules.length;
      for (let i = 0; i < newRules.length; i++) {
        let merge = false;
        for (let j = 0; j < length; j++) {
          if (newRules[i].id === state.rules[j].id) {
            Object.assign(state.rules[j], normalizeRule(newRules[i]));
            merge = true;
            break;
          }
        }
        !merge && state.rules.push(Object.assign(defaultRule(), normalizeRule(newRules[i])));
      }

      chromeStorage.setRules(state.rules, 'merge rules.');
    }
  },
  updateRule(state: myStore.VuexState, newRule: myStore.RequestHeadersRule): void {
    if (newRule) {
      let upd = false;
      const { id, domain, headers } = newRule;
      for (let i = 0; i < state.rules.length; i++) {
        if (id === state.rules[i].id) {
          state.rules[i].domain = domain;
          state.rules[i].headers = headers;
          upd = true;
          break;
        }
      }

      if (!upd) {
        state.rules.push({
          id,
          domain,
          headers,
        });
      }

      chromeStorage.setRules(state.rules, `update rule -> "${id}".`);
    }
  },
  removeRule(state: myStore.VuexState, ruleId: string): void {
    let del = false;
    for (let i = 0; i < state.rules.length; i++) {
      if (ruleId === state.rules[i].id) {
        state.rules.splice(i, 1);
        del = true;
        break;
      }
    }

    del && chromeStorage.setRules(state.rules, `remove rule -> "${ruleId}".`);
  },

  setStages(state: myStore.VuexState, newStages: myStore.GloriaStage[]): void {
    if (newStages && Array.isArray(newStages) && newStages.length > 0) {
      state.stages = [...newStages];
    } else {
      state.stages = [];
    }
  },
  updateStage(state: myStore.VuexState, newStage: { id: string; stage: myStore.Stage | myStore.Stage[] }): void {
    const { id, stage } = newStage;
    let upd = false;
    for (let i = 0; i < state.stages.length; i++) {
      if (id === state.stages[i].id) {
        if (Array.isArray(stage) && stage.length > STAGE_LIMIT) {
          stage.splice(0, stage.length - STAGE_LIMIT);
        }

        state.stages[i].stage = stage || [];
        upd = true;
        break;
      }
    }

    upd && chromeStorage.setStages(state.stages, `set "stages -> ${id}".`);
  },
  addStage(state: myStore.VuexState, newStage: { id: string; stage: myStore.Stage | myStore.Stage[] }): void {
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
  removeStageItem(state: myStore.VuexState, taskId: string): void {
    let del = false;
    for (let i = 0; i < state.stages.length; i++) {
      if (state.stages[i].id === taskId) {
        state.stages.splice(i, 1);
        del = true;
        break;
      }
    }
    del && chromeStorage.setStages(state.stages, `delete "stages -> ${taskId}".`);
  },
  clearStages(state: myStore.VuexState): void {
    state.stages = [];
    chromeStorage.setStages(state.stages, 'clear stages.');
  },
  clearExpiredStages(state: myStore.VuexState): void {
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

  addMessageFlow(state: myStore.VuexState, newMessageFlow: myStore.MessageFlow): void {
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
          //? 在处理消息流时先已经将通知记录至历史记录当中
          //* 此时通知不一定已经弹出
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
            visited: false,
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

  setNotifications(state: myStore.VuexState, newNotifications: myStore.GloriaNotification[]): void {
    if (newNotifications && Array.isArray(newNotifications) && newNotifications.length > 0) {
      state.notifications = newNotifications.map(notify => {
        notify.later = notify.later || false;
        notify.visited = notify.visited || false;
        return notify;
      });
    } else {
      state.notifications = [];
    }
  },
  addNotification(state: myStore.VuexState, newNotification: myStore.GloriaNotification): void {
    //? 这是单独添加通知至历史记录的方法，与任务无关
    if (newNotification) {
      const { notificationShowBadge, notificationMaxinum } = state.configs;
      state.notifications.unshift(newNotification);

      //* 处理通知记录数量上限
      if (notificationMaxinum && state.notifications.length > notificationMaxinum) {
        state.notifications.pop();
      }
      if (notificationShowBadge) {
        state.unread++;
        chromeStorage.setUnread(state.unread, `store unread number to "${state.unread}".`);
      }
      chromeStorage.setNotifications(state.notifications, 'add a new notification.');
    }
  },
  updateNotification(state: myStore.VuexState, notification: { id: string; options: myStore.GloriaNotificationOptions }): void {
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
  markLaterNotification(state: myStore.VuexState, notificationId: string): void {
    let mark = false;
    for (let i = 0; i < state.notifications.length; i++) {
      if (notificationId === state.notifications[i].id) {
        state.notifications[i].later = true;
        mark = true;
        break;
      }
    }

    mark && chromeStorage.setNotifications(state.notifications, `mark later notificaiton -> "${notificationId}".`);
  },
  checkedNotification(state: myStore.VuexState, notificationId: string): void {
    let checked = false;
    for (let i = 0; i < state.notifications.length; i++) {
      if (notificationId === state.notifications[i].id) {
        state.notifications[i].later = false;
        checked = true;
        break;
      }
    }

    checked && chromeStorage.setNotifications(state.notifications, `checked notification -> "${notificationId}".`);
  },
  visitNotification(state: myStore.VuexState, notificationId: string): void {
    let v = false;
    for (let i = 0; i < state.notifications.length; i++) {
      if (notificationId === state.notifications[i].id) {
        state.notifications[i].visited = true;
        v = true;
        break;
      }
    }

    v && chromeStorage.setNotifications(state.notifications, `visited notification -> "${notificationId}".`);
  },
  removeNotification(state: myStore.VuexState, notificationId: string): void {
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
  clearLaterCount(state: myStore.VuexState): void {
    let clc = false;
    for (let i = 0; i < state.notifications.length; i++) {
      if (state.notifications[i].later) {
        state.notifications[i].later = false;
        clc = true;
      }
    }

    clc && chromeStorage.setNotifications(state.notifications, 'clear later count.');
  },
  markLaterByName(state: myStore.VuexState, name: string): void {
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
  removeLaterByName(state: myStore.VuexState, name: string): void {
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
  removeNotificationsByName(state: myStore.VuexState, name: string): void {
    state.notifications = state.notifications.filter(notify => notify.options.contextMessage !== name);

    chromeStorage.setNotifications(state.notifications, `remove notifications by name: "${name}".`);
  },
  removeNotificationsByVisited(state: myStore.VuexState): void {
    state.notifications = state.notifications.filter(notify => !notify.visited);

    chromeStorage.setNotifications(state.notifications, 'remove notifications by visited.');
  },
  clearNotifications(state: myStore.VuexState): void {
    if (state.notifications.length > 0) {
      state.notifications = [];
      chromeStorage.setNotifications(state.notifications, 'clear notifications.');
    }

    if (state.unread > 0) {
      state.unread = 0;
      chromeStorage.setUnread(state.unread, 'sync clear unread number.');
    }
  },

  setReducer(state: myStore.VuexState, newReducer: string): void {
    state.reducer = newReducer || '';
  },
  updateReducer(state: myStore.VuexState, newReducer: string): void {
    state.reducer = newReducer;
    chromeStorage.setReducer(state.reducer, 'update reducer.');
  },

  setUnread(state: myStore.VuexState, newNum: number): void {
    state.unread = newNum > 0 ? newNum : 0;
  },
  decreaseUnread(state: myStore.VuexState): void {
    if (state.unread > 0) {
      state.unread--;
      chromeStorage.setUnread(state.unread, `decrease unread number to "${state.unread}".`);
    }
  },
  clearUnread(state: myStore.VuexState): void {
    if (state.unread > 0) {
      state.unread = 0;
      chromeStorage.setUnread(state.unread, 'clear unread number.');
    }
  },
};

export default {
  activeTab(state: myStore.VuexState): string {
    const { lastActiveTab } = state;
    let tab = 'tasks';
    if (lastActiveTab && ['tasks', 'notifications'].includes(lastActiveTab)) {
      tab = lastActiveTab;
    }
    return tab;
  },
  notificationsTitleList(state: myStore.VuexState): string[] {
    const titleList: string[] = [];
    state.notifications.forEach(info => {
      const { options } = info;
      if (options.contextMessage && !titleList.includes(options.contextMessage)) {
        titleList.push(options.contextMessage);
      }
    });
    return titleList;
  },
  hasInstalledTask: (state: myStore.VuexState) => (url: string): myStore.GloriaTask | undefined => {
    return state.tasks.find(task => task.origin === url);
  },
  laterCount: (state: myStore.VuexState): number => {
    let num = 0;
    const { notifications } = state;
    notifications.forEach(notify => {
      notify.later && num++;
    });
    return num;
  },
  laterList(state: myStore.VuexState): myStore.GloriaNotification[] {
    const arr: myStore.GloriaNotification[] = [];
    const { notifications } = state;
    notifications.forEach(notify => {
      if (notify.later) {
        arr.push(notify);
      }
    });
    return arr;
  },
  notificationsList: (state: myStore.VuexState) => (
    loadIndex: number,
    menuName: string,
    filterText: string,
    isLater: boolean
  ): myStore.GloriaNotification[] => {
    const { notifications } = state;
    const notifyList: myStore.GloriaNotification[] = [];

    for (const notify of notifications) {
      if (isLater) {
        if (notify.later) {
          if (filterText) {
            if (notify.options.title && notify.options.title.toLowerCase().includes(filterText.toLowerCase())) {
              notifyList.push(notify);
            } else if (notify.options.message && notify.options.message.toLowerCase().includes(filterText.toLowerCase())) {
              notifyList.push(notify);
            } else if (notify.options.contextMessage && notify.options.contextMessage.toLowerCase().includes(filterText.toLowerCase())) {
              notifyList.push(notify);
            }
          } else {
            notifyList.push(notify);
          }
        }
      } else if (menuName) {
        if (notify.options.contextMessage === menuName) {
          if (filterText) {
            if (notify.options.title && notify.options.title.toLowerCase().includes(filterText.toLowerCase())) {
              notifyList.push(notify);
            } else if (notify.options.message && notify.options.message.toLowerCase().includes(filterText.toLowerCase())) {
              notifyList.push(notify);
            } else if (notify.options.contextMessage && notify.options.contextMessage.toLowerCase().includes(filterText.toLowerCase())) {
              notifyList.push(notify);
            }
          } else {
            notifyList.push(notify);
          }
        }
      } else {
        if (filterText) {
          if (notify.options.title && notify.options.title.toLowerCase().includes(filterText.toLowerCase())) {
            notifyList.push(notify);
          } else if (notify.options.message && notify.options.message.toLowerCase().includes(filterText.toLowerCase())) {
            notifyList.push(notify);
          } else if (notify.options.contextMessage && notify.options.contextMessage.toLowerCase().includes(filterText.toLowerCase())) {
            notifyList.push(notify);
          }
        } else {
          notifyList.push(notify);
        }
      }

      if (notifyList.length >= loadIndex) {
        break;
      }
    }

    return notifyList;
  },
  notificationCount: (state: myStore.VuexState) => (name: string): number => {
    let count = 0;
    const { notifications } = state;
    notifications.forEach(notify => {
      if (notify.options.contextMessage === name) {
        count++;
      }
    });
    return count;
  },
  notificationsAllCount(state: myStore.VuexState): number {
    return state.notifications.length;
  },
  taskIsEnable: (state: myStore.VuexState) => (id: string): boolean => {
    let is = false;
    const { tasks } = state;
    for (const task of tasks) {
      if (task.id === id) {
        is = task.isEnable;
        break;
      }
    }
    return is;
  },
  taskName: (state: myStore.VuexState) => (id: string): string => {
    let name = '';
    const { tasks } = state;
    for (const task of tasks) {
      if (task.id === id) {
        name = task.name;
        break;
      }
    }
    return name;
  },
  taskCode: (state: myStore.VuexState) => (id: string): string => {
    let code = '';
    const { tasks } = state;
    for (const task of tasks) {
      if (task.id === id) {
        code = task.code;
        break;
      }
    }
    return code;
  },
  taskOnTimeMode: (state: myStore.VuexState) => (id: string): boolean => {
    let onTime = false;
    const { tasks } = state;
    for (const task of tasks) {
      if (task.id === id) {
        onTime = task.onTimeMode;
        break;
      }
    }
    return onTime;
  },
  taskNeedInteraction: (state: myStore.VuexState) => (id: string): boolean => {
    let need = false;
    const { tasks } = state;
    for (const task of tasks) {
      if (task.id === id) {
        need = task.needInteraction;
        break;
      }
    }
    return need;
  },
  activeTask: (state: myStore.VuexState) => (taskId: string): myStore.GloriaTask | null => {
    let active: myStore.GloriaTask | null = null;
    const { tasks } = state;
    for (const task of tasks) {
      if (task.id === taskId) {
        active = task;
        break;
      }
    }
    return active;
  },
};

export default {
  activeTab(state: store.VuexState) {
    const { lastActiveTab } = state;
    let tab = 'tasks';
    if (lastActiveTab && ['tasks', 'notifications'].includes(lastActiveTab)) {
      tab = lastActiveTab;
    }
    return tab;
  },
  notificationsTitleList(state: store.VuexState) {
    const titleList: string[] = [];
    state.notifications.forEach(info => {
      const { options } = info;
      if (options.contextMessage && !titleList.includes(options.contextMessage)) {
        titleList.push(options.contextMessage);
      }
    });
    return titleList;
  },
  hasInstalledTask: (state: store.VuexState) => (url: string) => {
    return state.tasks.find(task => task.origin === url);
  },
  laterCount: (state: store.VuexState) => {
    let num = 0;
    const { notifications } = state;
    notifications.forEach(notify => {
      notify.later && num++;
    });
    return num;
  },
};

const devMode = process.env.NODE_ENV !== 'production';

export default {
  setTasks(state: store.VuexState, newTasks: store.GloriaTask[]) {
    if (newTasks && Array.isArray(newTasks)) {
      state.tasks = [...newTasks];
    }
  },
  setConfigs(state: store.VuexState, newCofings: store.GloriaConfig) {
    Object.assign(state.configs, newCofings);
  },
  setNotifications(state: store.VuexState, newNotifications: store.GloriaConfig) {
    if (newNotifications && Array.isArray(newNotifications)) {
      state.notifications = [...newNotifications];
    }
  },
  updateConfigsLastActiveTab(state: store.VuexState, tabName: string) {
    state.configs.lastActiveTab = tabName;
    chrome.storage.local.set(
      {
        configs: state.configs,
      },
      () => {
        devMode && console.log(`set "configs.lastActiveTab: ${tabName}".`);
      }
    );
  },
  updateIsEnable(state: store.VuexState, newChecked: store.SwitchChecked) {
    const { id, checked } = newChecked;
    let mod = false;
    for (let i = 0; i < state.tasks.length; i++) {
      if (state.tasks[i].id === id) {
        state.tasks[i].isEnable = checked;
        mod = true;
        break;
      }
    }
    mod &&
      chrome.storage.local.set(
        {
          tasks: state.tasks,
        },
        () => {
          devMode && console.log(`set "tasks -> ${id} -> isEnable: ${checked}".`);
        }
      );
  },
  updateTaskBasis(state: store.VuexState, taskBasis: store.GloriaTaskBasis) {
    const { id, name, code, triggerInterval, needInteraction, strictMode } = taskBasis;
    let mod = false;
    for (let i = 0; i < state.tasks.length; i++) {
      if (state.tasks[i].id === id) {
        Object.assign(state.tasks[i], {
          name,
          code,
          triggerInterval,
          needInteraction,
          strictMode,
        });
        mod = true;
        break;
      }
    }
    mod &&
      chrome.storage.local.set(
        {
          tasks: state.tasks,
        },
        () => {
          devMode && console.log(`set "tasks -> ${id}".`);
        }
      );
  },
  createTaskBasis(state: store.VuexState, taskBasis: store.GloriaTaskBasis) {
    state.tasks.push({
      ...taskBasis,
      triggerCount: 0,
      pushCount: 0,
      triggerDate: '',
      pushDate: '',
      origin: '',
      isEnable: true,
    });

    chrome.storage.local.set(
      {
        tasks: state.tasks,
      },
      () => {
        devMode && console.log('create new task.');
      }
    );
  },
  deleteTaskItem(state: store.VuexState, taskId: string) {
    let del = false;
    for (let i = 0; i < state.tasks.length; i++) {
      if (state.tasks[i].id === taskId) {
        state.tasks.splice(i, 1);
        del = true;
      }

      del &&
        chrome.storage.local.set(
          {
            tasks: state.tasks,
          },
          () => {
            devMode && console.log(`delete "tasks -> ${taskId}".`);
          }
        );
    }
  },
};

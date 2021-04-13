const taskKeys = [
  'id',
  'name',
  'code',
  'origin',
  'triggerInterval',
  'needInteraction',
  'onTimeMode',
  'triggerCount',
  'pushCount',
  'triggerDate',
  'pushDate',
  'isEnable',
  'executionError',
];

function defaultConfigs(): myStore.GloriaConfig {
  return {
    taskAutoCheckUpdate: false,
    taskOnTimeMode: false,
    taskNeedInteraction: false,
    taskOnTop: false,
    taskShowSearchInput: false,
    taskAutoRemoveStage: false,
    taskTriggerInterval: 5,
    notificationSound: false,
    notificationCustomSound: false,
    notificationLaterMark: false,
    notificationDetectIcon: false,
    notificationDisableError: false,
    notificationShowUrl: false,
    notificationLazyLoading: false,
    notificationShowSearchInput: false,
    notificationShowBadge: false,
    notificationShowMenuCount: false,
    notificationMaxinum: 200,
  };
}

function defaultTaskBasic(): myStore.GloriaTaskBasic {
  return {
    id: '',
    name: '',
    code: '',
    origin: '',
    triggerInterval: 5,
    needInteraction: false,
    onTimeMode: false,
  };
}

function defaultTask(): myStore.GloriaTask {
  return {
    ...defaultTaskBasic(),
    triggerCount: 0,
    pushCount: 0,
    triggerDate: '',
    pushDate: '',
    isEnable: true,
    executionError: 0,
  };
}

function normalizeTask(task: myStore.GloriaTask): myStore.GloriaTask {
  Object.keys(task).forEach(key => {
    if (!taskKeys.includes(key)) {
      delete task[key];
    }
  });

  return task;
}

export { defaultConfigs, defaultTaskBasic, defaultTask, normalizeTask };

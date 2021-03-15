function defaultConfigs(): store.GloriaConfig {
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

function defaultTaskBasic(): store.GloriaTaskBasic {
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

function defaultTask(): store.GloriaTask {
  return {
    ...defaultTaskBasic(),
    triggerCount: 0,
    pushCount: 0,
    triggerDate: '',
    pushDate: '',
    origin: '',
    isEnable: true,
    lastExecutionError: false,
  };
}

export { defaultConfigs, defaultTaskBasic, defaultTask };

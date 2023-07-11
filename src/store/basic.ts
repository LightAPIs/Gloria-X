const taskKeys = [
  'id',
  'name',
  'code',
  'type',
  'origin',
  'triggerInterval',
  'earliestTime',
  'needInteraction',
  'implicit',
  'onTimeMode',
  'triggerCount',
  'pushCount',
  'triggerDate',
  'pushDate',
  'isEnable',
  'executionError',
];

const ruleKeys = ['id', 'domain', 'headers'];

function defaultConfigs(): myStore.GloriaConfig {
  return {
    appearanceInterface: 'default',
    appearancePopup: false,
    useAppearanceZoom: false,
    appearanceZoom: 100,
    appearanceContextMenus: false,
    taskAutoCheckUpdate: false,
    taskImplicit: false,
    taskOnTimeMode: false,
    taskNeedInteraction: false,
    taskOnTop: false,
    taskShowSearchInput: false,
    taskAutoRemoveStage: false,
    taskTriggerInterval: 5,
    taskEarliestTime: '00:05',
    notificationSound: false,
    notificationCustomSound: false,
    notificationLaterMark: false,
    notificationDetectIcon: false,
    notificationDisableError: false,
    notificationRecordError: false,
    notificationShowUrl: false,
    notificationLazyLoading: false,
    notificationShowSearchInput: false,
    notificationShowBadge: false,
    notificationShowMenuCount: false,
    notificationOpenInterval: 500,
    notificationMaxinum: 200,
    internalStartDelay: false,
    internalDelayTime: 5,
    internalExecutionLimit: 5,
  };
}

function defaultTaskBasic(): myStore.GloriaTaskBasic {
  return {
    id: '',
    name: '',
    type: 'timed',
    code: '',
    origin: '',
    triggerInterval: 5,
    needInteraction: false,
    implicit: false,
    onTimeMode: false,
    earliestTime: '',
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

function defaultRule(): myStore.RequestHeadersRule {
  return {
    id: '',
    domain: '',
    headers: [
      {
        name: '',
        value: '',
      },
    ],
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

function normalizeRule(rule: myStore.RequestHeadersRule): myStore.RequestHeadersRule {
  Object.keys(rule).forEach(key => {
    if (!ruleKeys.includes(key)) {
      delete rule[key];
    }
  });

  return rule;
}

function isIncludeNotification(notify: myStore.GloriaNotification, filterText: string): boolean {
  if (filterText) {
    if (notify.options.title && notify.options.title.toLowerCase().includes(filterText.toLowerCase())) {
      return true;
    } else if (notify.options.message && notify.options.message.toLowerCase().includes(filterText.toLowerCase())) {
      return true;
    } else if (notify.options.contextMessage && notify.options.contextMessage.toLowerCase().includes(filterText.toLowerCase())) {
      return true;
    }
  } else {
    return true;
  }
  return false;
}

export { defaultConfigs, defaultTaskBasic, defaultTask, defaultRule, normalizeTask, normalizeRule, isIncludeNotification };

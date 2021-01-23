declare namespace store {
  interface Stage {
    id: string;
    title: string;
    message: string;
  }

  interface CommitData {
    id?: string;
    title?: string;
    message?: string;
    iconUrl?: string;
    imageUrl?: string;
    url?: string;
  }

  interface MessageData extends CommitData {
    readonly notificationId: string;
  }

  interface GloriaNotificationOptions {
    readonly type: string;
    title?: string;
    message?: string;
    iconUrl?: string;
    imageUrl?: string;
    url?: string;
    contextMessage: string;
    eventTime: number;
  }

  interface GloriaTaskBasic {
    readonly id: string;
    code: string;
    name: string;
    triggerInterval: number;
    needInteraction: boolean;
    origin: string;
    onTimeMode: boolean;
  }

  interface GloriaTask extends GloriaTaskBasic {
    isEnable: boolean;
    triggerCount: number;
    pushCount: number;
    triggerDate: string;
    pushDate: string;
  }

  interface GloriaNotification {
    readonly id: string;
    later?: boolean;
    options: GloriaNotificationOptions;
  }

  interface GloriaStage {
    readonly id: string;
    stage: Stage | Stage[];
  }

  interface GloriaConfigItem {
    name: string;
    value: string | boolean | number;
  }

  interface GloriaConfig {
    [key: string]: string | number | boolean;
    lastActiveTab?: string;
    taskOnTimeMode?: boolean;
    taskOnTop?: boolean;
    taskShowSearchInput?: boolean;
    taskAutoRemoveStage?: boolean;
    taskTriggerInterval?: number;
    notificationSound?: boolean;
    notificationCustomSound?: boolean;
    notificationLaterMark?: boolean;
    notificationDetectIcon?: boolean;
    notificationShowUrl?: boolean;
    notificationLazyLoading?: boolean;
    notificationShowSearchInput?: boolean;
    notificationShowBadge?: boolean;
    notificationMaximun?: number;
  }

  interface MessageFlow {
    readonly id: string;
    taskId: string;
    data: MessageData[];
  }

  interface VuexState {
    implicitPush: boolean;
    tasks: GloriaTask[];
    operationTask: GloriaTask | null;
    notifications: GloriaNotification[];
    stages: GloriaStage[];
    configs: GloriaConfig;
    reducer: string;
    unread: number;
  }

  interface GloriaGetter {
    activeTab: string;
  }

  interface SwitchChecked {
    id: string;
    checked: boolean;
  }

  interface OriginCode {
    id: string;
    origin: string;
    code: string;
  }
}

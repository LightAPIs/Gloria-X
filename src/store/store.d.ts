declare namespace store {
  interface Stage {
    title?: string;
    message: string;
    iconUrl?: string;
    imageUrl?: string;
    url?: string;
  }

  interface GloriaNotificationOptions extends Stage {
    readonly type: string;
    contextMessage: string;
  }

  interface StageStorage extends Stage {
    unread: boolean;
  }

  interface GloriaTaskBasis {
    readonly id: string;
    name: string;
    code: string;
    triggerInterval: number;
    needInteraction: boolean;
    strictMode?: boolean;
  }

  interface GloriaTask extends GloriaTaskBasis {
    triggerCount: number;
    pushCount: number;
    isEnable: boolean;
    origin: string;
    triggerDate: string;
    pushDate: string;
  }

  interface GloriaNotification {
    readonly id: string;
    options: GloriaNotificationOptions;
  }

  interface GloriaStage {
    readonly id: string;
    stage: StageStorage | StageStorage[];
  }

  interface GloriaConfig {
    lastActiveDate?: string;
    lastActiveTab?: string;
  }

  interface VuexState {
    tasks: GloriaTask[];
    notifications: GloriaNotification[];
    stages: GloriaStage[];
    configs: GloriaConfig;
  }

  interface GloriaGetter {
    activeTab: string;
  }

  interface SwitchChecked {
    id: string;
    checked: boolean;
  }
}

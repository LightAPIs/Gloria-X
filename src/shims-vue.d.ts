declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;

  namespace ui {
    interface I18n {
      (first: string, sub?: string[]): string;
    }
    interface Nbsp {
      (val: string): string | undefined;
    }
    interface IsLink {
      (url: string): boolean;
    }
    interface AsLink {
      (url: string): string;
    }
  }

  namespace calc {
    interface Date {
      (d?: string): string;
    }
    interface Duration {
      (d: number): string;
    }
  }

  declare module 'vue/types/vue' {
    interface Vue {
      i18n: ui.I18n;
      n2br: ui.Nbsp;
      nbsp: ui.Nbsp;
      isLink: ui.IsLink;
      asLink: ui.AsLink;
      displayTime: calc.Date;
      intervalTime: calc.Duration;
      uuid: () => string;
    }
  }
}

declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;

  declare module 'vue/types/vue' {
    interface Vue {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      $contextmenu: any;
      i18n: (first: string, sub?: string[]) => string;
      n2br: (val: string) => string | undefined;
      nbsp: (val: string) => string | undefined;
      isLink: (url: string) => boolean;
      asLink: (url: string) => string;
      displayTime: (d?: string | number) => string;
      intervalTime: (d: number) => string;
      now: () => string;
      uuid: () => string;
      textareaTab: (element: HTMLInputElement, event: KeyboardEvent) => void;
      copyToClip: (content: string, copyCompleted?: () => void, copyError?: () => void) => void;
    }
  }
}

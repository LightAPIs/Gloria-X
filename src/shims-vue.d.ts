// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ComponentCustomProperties } from 'vue';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    i18n: (first: string, sub?: string | string[]) => string;
    n2br: (val: string) => string | undefined;
    nbsp: (val: string) => string | undefined;
    isLink: (url: string) => boolean;
    asLink: (url: string) => string;
    htmlEncode: (str: string) => string;
    findAll: (str: string, val: string) => number[];
    copyToClip: (content: string, copyCompleted?: () => void, copyError?: () => void) => void;
    displayTime: (d?: string | number) => string;
    intervalTime: (d: number) => string;
    now: () => string;
    nowLTS: () => string;
    today: (date: string) => boolean;
    hm2date: (date: string) => string;
    date2hm: (date: string) => string;
    hm2min: (hm: string) => number;
    isBeforeNow: (hm: string) => boolean;
    isAfterInterval: (date: number | string, interval = 1) => boolean;
    remainingTime: (date: number | string, interval: number) => number;
    waitingTime: (hm: string) => number;
    waitingTomorrowTime: (hm: string) => number;
    diff: (lhs: myStore.Stage, rhs: myStore.Stage) => boolean;
    dayjsLocale: (language?: string) => void;
    days: (m: number) => number;
    hours: (m: number) => number;
    minutes: (m: number) => number;
    uuid: () => string;
  }
}

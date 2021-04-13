import { i18n } from './ui';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/zh-tw';
import duration from 'dayjs/plugin/duration';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(duration);
dayjs.extend(localizedFormat);

// dayjs.locale(chrome.i18n.getUILanguage() || navigator.language);
//? 由于在单元测试时，若直接进行全局设置语言环境,会因为 chrome 没有被定义而报错。

function dayjsLocale(language?: string): void {
  let lang = '';
  if (language) {
    lang = language.toLowerCase();
  } else {
    lang = (chrome.i18n.getUILanguage() || navigator.language).toLowerCase();
  }

  if (lang !== dayjs.locale())
    switch (lang) {
      case 'zh-cn':
        dayjs.locale('zh-cn');
        break;
      case 'zh-tw':
        dayjs.locale('zh-tw');
        break;
      default:
        dayjs.locale('en');
        break;
    }
}

function displayTime(d?: string | number): string {
  if (d) {
    return dayjs(d).format('ll LTS');
  } else {
    return i18n('calcUndefined');
  }
}

function days(m: number): number {
  return dayjs.duration(m, 'm').days();
}

function hours(m: number): number {
  return dayjs.duration(m, 'm').hours();
}

function minutes(m: number): number {
  return dayjs.duration(m, 'm').minutes();
}

function intervalTime(d: number): string {
  return dayjs.duration(d, 'm').toISOString().replace(/[PT]/g, '');
}

function now(): string {
  return dayjs().toJSON();
}

function nowLTS(): string {
  return dayjs().format('LTS');
}

function isAfterInterval(date: number | string, interval = 1): boolean {
  if (!date) {
    return true;
  }

  return dayjs().diff(date, 'm') >= interval;
}

function remainingTime(date: number | string, interval: number): number {
  const rtime = interval - dayjs().diff(date, 'm');
  return rtime > 0 ? rtime : 1;
}

function diff(lhs: myStore.Stage, rhs: myStore.Stage): boolean {
  return lhs.id !== rhs.id || lhs.title !== rhs.title || lhs.message !== rhs.message;
}

export { displayTime, intervalTime, now, nowLTS, isAfterInterval, remainingTime, diff, dayjsLocale, days, hours, minutes };

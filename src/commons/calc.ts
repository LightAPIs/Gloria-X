import { i18n } from './ui';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/zh-tw';
import duration from 'dayjs/plugin/duration';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import isToday from 'dayjs/plugin/isToday';
dayjs.extend(duration);
dayjs.extend(localizedFormat);
dayjs.extend(isToday);

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

function today(date: string): boolean {
  return date ? dayjs(date).isToday() : false;
}

function hm2date(hm: string): string {
  return `${dayjs().format('YYYY-MM-DD')} ${hm}:00`;
}

function date2hm(date: string): string {
  return dayjs(date).format('HH:mm');
}

function hm2Tomorrow(hm: string): string {
  return `${dayjs().add(1, 'day').format('YYYY-MM-DD')} ${hm}:00`;
}

function isAfterNow(hm: string): boolean {
  return dayjs().diff(hm2date(hm), 'm') >= 0;
}

function isAfterInterval(date: number | string, interval = 1): boolean {
  if (!date) {
    return true;
  }
  return dayjs().diff(date, 'm') >= interval;
}

function remainingTime(date: number | string, interval: number): number {
  const rTime = interval - dayjs().diff(date, 'm');
  return rTime > 0 ? rTime : 1;
}

function waitingTime(hm: string): number {
  const wTime = -dayjs().diff(hm2date(hm), 'm');
  return wTime > 0 ? wTime : 1;
}

function waitingTomorrowTime(hm: string): number {
  const wTime = -dayjs().diff(hm2Tomorrow(hm), 'm');
  return wTime > 0 ? wTime : 1;
}

function diff(lhs: myStore.Stage, rhs: myStore.Stage): boolean {
  return lhs.id !== rhs.id || lhs.title !== rhs.title || lhs.message !== rhs.message;
}

export {
  displayTime,
  intervalTime,
  now,
  nowLTS,
  today,
  hm2date,
  date2hm,
  isAfterNow,
  isAfterInterval,
  remainingTime,
  waitingTime,
  waitingTomorrowTime,
  diff,
  dayjsLocale,
  days,
  hours,
  minutes,
};

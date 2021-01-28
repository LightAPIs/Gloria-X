import { i18n } from './ui';
import { toLower } from 'lodash';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/zh-tw';
import duration from 'dayjs/plugin/duration';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(duration);
dayjs.extend(localizedFormat);

// dayjs.locale(chrome.i18n.getUILanguage() || navigator.language);
//? 由于在单元测试时，若直接进行全局设置语言环境,会因为 chrome 没有被定义而报错。

function dayjsLocale(language?: string) {
  let lang = '';
  if (language) {
    lang = toLower(language);
  } else {
    lang = toLower(chrome.i18n.getUILanguage() || navigator.language);
    console.log(lang);
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

  console.log(dayjs.locale());
}

function displayTime(d?: string | number) {
  if (d) {
    return dayjs(d).format('ll LTS');
  } else {
    return i18n('calcUndefined');
  }
}

function intervalTime(d: number) {
  return dayjs
    .duration(d, 'm')
    .toISOString()
    .replace(/[PT]/g, '');
}

function now() {
  return dayjs().toJSON();
}

function nowLTS() {
  return dayjs().format('LTS');
}

function isAfterInterval(date: number | string, interval = 1) {
  if (!date) {
    return true;
  }

  return dayjs().diff(date, 'm') >= interval;
}

function remainingTime(date: number | string, interval: number) {
  const rtime = interval - dayjs().diff(date, 'm');
  return rtime > 0 ? rtime : 1;
}

function diff(lhs: store.Stage, rhs: store.Stage) {
  return lhs.id !== rhs.id || lhs.title !== rhs.title || lhs.message !== rhs.message;
}

export { displayTime, intervalTime, now, nowLTS, isAfterInterval, remainingTime, diff, dayjsLocale };

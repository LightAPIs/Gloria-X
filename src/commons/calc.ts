import { i18n } from './ui';
import moment from 'moment';

// moment.locale(chrome.i18n.getUILanguage() || navigator.language);
//? 由于在单元测试时，若直接进行全局设置语言环境,会因为 chrome 没有被定义而报错。

function momentLocale(language?: string) {
  if (language) {
    if (moment.locale() !== language) {
      moment.locale(language);
    }
  } else {
    const lang = chrome.i18n.getUILanguage() || navigator.language;
    if (moment.locale() !== lang) {
      moment.locale(lang);
    }
  }
}

function date(d?: string | number) {
  if (d) {
    const dm = moment(d);
    return dm.format('ll LTS');
  } else {
    return i18n('calcUndefined');
  }
}

function duration(d: number) {
  return moment
    .duration(d, 'm')
    .toISOString()
    .replace('PT', '');
}

function now() {
  return moment().toJSON();
}

function nowLTS() {
  return moment().format('LTS');
}

function isAfterInterval(date: number | string, interval = 1) {
  if (!date) {
    return true;
  }

  return moment().diff(date, 'm') >= interval;
}

function remainingTime(date: number | string, interval: number) {
  const rtime = interval - moment().diff(date, 'm');
  return rtime > 0 ? rtime : 1;
}

function diff(lhs: store.Stage, rhs: store.Stage) {
  return lhs.id !== rhs.id || lhs.title !== rhs.title || lhs.message !== rhs.message;
}

export { date as displayTime, duration as intervalTime, now, nowLTS, isAfterInterval, remainingTime, diff, momentLocale };

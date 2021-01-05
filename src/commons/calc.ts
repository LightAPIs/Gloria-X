// 计算方法
import { i18n } from './ui';
import moment from 'moment';

moment.locale(chrome.i18n.getUILanguage() || navigator.language);

function date(d?: string | number) {
  if (d) {
    const dm = moment(d);
    return dm.format('lll');
  } else {
    return i18n('calcUndefined');
  }
}

function duration(d: number) {
  return moment
    .duration(d, 'm')
    .toISOString()
    .replace(/^PT(\d+H)?(\d+M)?$/i, (_arg0, arg1, arg2) => {
      if (arg1 && arg2) {
        return (
          (arg1.length === 3 ? arg1.replace('H', ':') : '0' + arg1.replace('H', ':')) +
          (arg2.length === 3 ? arg2.replace('M', '') : '0' + arg2.replace('M', ''))
        );
      } else if (arg1) {
        return (arg1.length === 3 ? arg1.replace('H', ':') : '0' + arg1.replace('H', ':')) + '00';
      } else {
        return '00:' + (arg2.length === 3 ? arg2.replace('M', '') : '0' + arg2.replace('M', ''));
      }
    });
}

export { date as displayTime, duration as intervalTime };

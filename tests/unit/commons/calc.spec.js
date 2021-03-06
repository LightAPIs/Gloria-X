'use strict';

import { expect } from 'chai';
import chrome from 'sinon-chrome';
import {
  displayTime,
  intervalTime,
  now,
  nowLTS,
  isAfterInterval,
  remainingTime,
  diff,
  dayjsLocale,
  isBeforeNow,
  date2hm,
  waitingTime,
  waitingTomorrowTime,
} from '@/commons/calc';

describe('Test calc:', function () {
  before(function () {
    global.chrome = chrome;
  });

  dayjsLocale('zh-cn');

  describe('Method: displayTime', function () {
    it('display time is normal.', function () {
      const date1 = displayTime('2021-01-25T07:34:11.461Z');
      const date2 = displayTime(1611560574155);
      expect(date1).to.equal('2021年1月25日 15:34:11');
      expect(date2).to.equal('2021年1月25日 15:42:54');
    });
  });

  describe('Method: intervalTime', function () {
    it('interval time is normal.', function () {
      const time1 = intervalTime(1440);
      expect(time1).to.equal('1D');
    });
  });

  describe('Method: now', function () {
    it('now() is normal.', function () {
      const date1 = now();
      expect(date1).to.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });
  });

  describe('Method: nowLTS', function () {
    it('nowLTS() is normal.', function () {
      const date1 = nowLTS();
      expect(date1).to.match(/^\d{2}:\d{2}:\d{2}$/);
    });
  });

  describe('Method: isAfterInterval', function () {
    it('isAfterInterval() is normal.', function () {
      const result1 = isAfterInterval('2021-01-20T07:34:20.884Z', 360);
      const result2 = isAfterInterval(Date.now() - 1000 * 60 * 30, 60);
      expect(result1).to.be.true;
      expect(result2).to.be.false;
    });
  });

  describe('Method: remainingTime', function () {
    it('remainng time is normal.', function () {
      const time1 = remainingTime(Date.now() - 1000 * 60 * 5, 60);
      expect(time1).to.equal(55);
    });
  });

  describe('Method: diff', function () {
    it('diff is normal.', function () {
      const result1 = diff(
        {
          id: 'a',
          title: 'test',
          message: 'test string.',
        },
        {
          id: 'a',
          title: 'test',
          message: 'test string.',
        }
      );
      const result2 = diff(
        {
          id: 'a',
          title: 'test',
          message: 'test string.',
        },

        {
          id: 'b',
          title: 'test',
          message: 'test string.',
        }
      );
      expect(result1).to.be.false;
      expect(result2).to.be.true;
    });
  });

  describe('Method: isBeforeNow', function () {
    it('isBeforeNow is normal.', function () {
      const result1 = isBeforeNow('00:01');
      const result2 = isBeforeNow('23:59');
      expect(result1).to.be.true;
      expect(result2).to.be.false;
    });
  });

  describe('Method: date2hm', function () {
    it('date2hm if normal.', function () {
      const result1 = date2hm(undefined);
      const result2 = date2hm(null);
      expect(result1).not.undefined;
      expect(result2).not.null;
    });
  });

  describe('Method: waittingTime', function () {
    it('waitingTime is normal.', function () {
      const time = Date.now() + 180000;
      const result = waitingTime(date2hm(time));
      expect(result).to.equal(3);
    });
  });

  describe('Method: waitingTomorrowTime', function () {
    it('waitingTomorrowTime is normal.', function () {
      const time = Date.now() + 180000;
      const result = waitingTomorrowTime(date2hm(time));
      expect(result).to.be.equal(1443);
    });
  });

  after(function () {
    chrome.flush();
    delete global.chrome;
  });
});

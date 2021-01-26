'use strict';

import { expect } from 'chai';
import { commitFormat, reduceNotification } from '@/store/reducer';

describe('Test reducer:', function() {
  describe('Method: commitFormat', function() {
    it('commitFormat is normal.', function() {
      const commitData = {
        id: '1',
        title: 'Test',
        name: 'Test',
        message: 'Test string.',
      };
      const result = commitFormat(commitData);
      expect(result).to.have.property('id', '1');
      expect(result).to.have.property('title', 'Test');
      expect(result).to.have.property('message', 'Test string.');
      expect(result.name).to.be.undefined;
    });
  });

  describe('Method: reduceNotification', function() {
    it('reduceNotification is normal.', function() {
      const commitData1 = {
        id: '1',
        title: '1',
        message: '1',
      };
      const commitData2 = {
        id: '2',
        title: '2',
        message: '2',
      };
      const commitData3 = {
        id: '3',
        title: '3',
        message: '3',
      };
      const reduce = `
      function r(notify) {
          if (notify.title === '2') {
            return null;
          }

          if (notify.title === '1') {
            notify.message = '4'
          }
          return notify;
        }
      `;
      const result1 = reduceNotification(commitData1, reduce);
      const result2 = reduceNotification(commitData2, reduce);
      const result3 = reduceNotification(commitData3, reduce);
      expect(result1).to.have.property('message', '4');
      expect(result2).to.be.null;
      expect(result3).to.have.property('message', '3');
    });
  });
});

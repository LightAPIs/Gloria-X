'use strict';

import { expect } from 'chai';
import { normalizeTask } from '@/store/state';

describe('Test state:', function() {
  describe('Method: normalizeTask', function() {
    it('normalize task.', function() {
      const task = {
        id: '06bdc119',
        name: 'Save',
        code: '',
        triggerInterval: 5,
        needInteraction: false,
        onTimeMode: false,
        triggerCount: 2,
        pushCount: 1,
        triggerDate: '2021-03-27T13:02:55.671Z',
        pushDate: '2021-03-27T13:03:03.320Z',
        isEnable: false,
        executionError: 0,
        lastExecutionError: false,
        test: 'some string',
      };
      const result = normalizeTask(task);
      expect(result).to.not.have.property('lastExecutionError');
      expect(result).to.not.have.property('test');
    });
  });
});

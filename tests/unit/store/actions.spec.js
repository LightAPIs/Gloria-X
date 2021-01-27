'use strict';

import { expect } from 'chai';
import chrome from 'sinon-chrome';
import mutations from '@/store/mutations';
import actions from '@/store/actions';

const { handleData } = actions;

describe('Test actions:', function() {
  before(function() {
    global.chrome = chrome;
  });

  describe('Method: handleData', function() {
    it('handleData is normal.', function() {
      const state = {
        reducer: '',
        stages: [],
        configs: {
          notificationShowBadge: false,
          notificationMaxinum: 200,
        },
        tasks: [
          {
            id: 'a',
            name: 'test',
            pushCount: 0,
            pushDate: '',
          },
        ],
        notifications: [],
        unread: 0,
      };
      const commit = (type, payload) => {
        mutations[type](state, payload);
      };
      const context = {
        state,
        commit,
      };
      const commitData1 = {
        taskId: 'a',
        data: [
          {
            title: '1',
          },
        ],
      };
      const commitData2 = {
        taskId: 'a',
        data: [
          {
            title: '0',
          },
        ],
      };

      handleData(context, commitData1);
      expect(state.stages[0].stage).to.lengthOf(1);
      handleData(context, commitData2);
      expect(state.stages[0].stage).to.lengthOf(2);
    });
  });

  after(function() {
    chrome.flush();
    delete global.chrome;
  });
});

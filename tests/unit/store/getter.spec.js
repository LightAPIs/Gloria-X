'use strict';

import { expect } from 'chai';
import getters from '@/store/getters';

const { activeTab, notificationsTitleList, hasInstalledTask, laterCount, laterList, notificationCount } = getters;

describe('Test getters:', function() {
  describe('Attribute: activeTab', function() {
    it('activeTab is normal.', function() {
      const state = {
        lastActiveTab: 'tasks',
      };
      const result1 = activeTab(state);
      expect(result1).to.equal('tasks');
      state.lastActiveTab = 'notifications';
      const result2 = activeTab(state);
      expect(result2).to.equal('notifications');
      state.lastActiveTab = '';
      const result3 = activeTab(state);
      expect(result3).to.equal('tasks');
    });
  });

  describe('Attribute: notificationsTitleList', function() {
    it('notificationsTitleList is normal.', function() {
      const state = {
        notifications: [
          {
            options: {
              contextMessage: 'a',
            },
          },
          {
            options: {
              contextMessage: 'b',
            },
          },
          {
            options: {
              contextMessage: 'c',
            },
          },
          {
            options: {
              contextMessage: 'a',
            },
          },
          {
            options: {
              contextMessage: 'b',
            },
          },
          {
            options: {
              contextMessage: 'c',
            },
          },
          {
            options: {
              contextMessage: 'd',
            },
          },
        ],
      };
      const titleList = notificationsTitleList(state);
      expect(titleList).to.have.lengthOf(4);
    });
  });

  describe('Attribute: hasInstalledTask', function() {
    it('hasInstalledTask is normal.', function() {
      const state = {
        tasks: [
          {
            origin: 'http://a.com',
          },
          {
            origin: 'http://b.com',
          },
          {
            origin: 'http://c.com',
          },
          {
            name: 'http://d.com',
          },
        ],
      };
      const result1 = hasInstalledTask(state)('http://c.com');
      const result2 = hasInstalledTask(state)('http://d.com');
      expect(result1).to.not.be.undefined;
      expect(result2).to.be.undefined;
    });
  });

  describe('Attribute: laterCount', function() {
    it('laterCount is normal.', function() {
      const state = {
        notifications: [
          {
            id: '1',
            later: true,
          },
          {
            id: '2',
            later: false,
          },
        ],
      };
      const result1 = laterCount(state);
      expect(result1).to.equal(1);
      state.notifications[1].later = true;
      const result2 = laterCount(state);
      expect(result2).to.equal(2);
    });
  });

  describe('Attribute: laterList', function() {
    it('laterList is normal.', function() {
      const state = {
        notifications: [
          {
            id: '1',
            later: true,
          },
          {
            id: '2',
            later: false,
          },
          {
            id: '3',
            later: true,
          },
        ],
      };
      const result = laterList(state);
      expect(result).to.lengthOf(2);
    });
  });

  describe('Attribute: notificationCount', function() {
    it('notificationCount is normal.', function() {
      const state = {
        notifications: [
          {
            id: '1',
            options: {
              contextMessage: 'a',
            },
          },
          {
            id: '2',
            options: {
              contextMessage: 'b',
            },
          },
          {
            id: '3',
            options: {
              contextMessage: 'a',
            },
          },
        ],
      };
      const result1 = notificationCount(state)('a');
      const result2 = notificationCount(state)('b');
      expect(result1).to.equal(2);
      expect(result2).to.equal(1);
    });
  });
});

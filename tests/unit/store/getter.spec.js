'use strict';

import { expect } from 'chai';
import getters from '@/store/getters';

const { activeTab, notificationsTitleList, hasInstalledTask } = getters;

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
      console.log(result1);
      expect(result1).to.not.be.undefined;
      expect(result2).to.be.undefined;
    });
  });
});

import { expect } from 'chai';
import chrome from 'sinon-chrome';
import mutations from '@/store/mutations';
import { defaultConfigs } from '@/store/state';

const {
  setImplicitPush,
  updateImplicitPush,
  setConfigs,
  updateConfigs,
  setTasks,
  mergeTasks,
  updateIsEnable,
  updateTaskBasic,
  createTaskBasic,
  removeTaskItem,
  triggerTask,
  clearTasks,
  setStages,
  updateStage,
  addStage,
  clearStages,
  clearExpiredStages,
  addMessageFlow,
  setNotifications,
  updateNotification,
  clearNotifications,
  setReducer,
  updateReducer,
  decreaseUnread,
  clearUnread,
} = mutations;

function createNewConfigs() {
  return {
    lastActiveTab: 'notifications',
    taskOnTimeMode: true,
    taskNeedInteraction: true,
    taskOnTop: true,
    taskShowSearchInput: true,
    taskAutoRemoveStage: true,
    taskTriggerInterval: 1440,
    notificationDetectIcon: true,
    notificationSound: true,
    notificationCustomSound: true,
    notificationShowUrl: true,
    notificationLazyLoading: true,
    notificationShowSearchInput: true,
    notificationShowBadge: false,
    notificationMaximun: 500,
  };
}

describe('Test mutations:', function() {
  before(function() {
    global.chrome = chrome;
  });

  describe('Method: setImplicitPush', function() {
    it('state.implicitPush is set.', function() {
      const state = {
        implicitPush: null,
      };
      setImplicitPush(state, true);
      expect(state.implicitPush).to.be.true;
    });
  });

  describe('Method: updateImplicitPush', function() {
    it('state.implicitPush is update.', function() {
      const state = {
        implicitPush: false,
      };
      updateImplicitPush(state, true);
      expect(state.implicitPush).to.be.true;
    });
  });

  describe('Method: setConfigs', function() {
    const state = {
      configs: {},
    };
    const newConfigs = createNewConfigs();
    const keyLen = Object.keys(newConfigs).length;
    setConfigs(state, newConfigs);
    it('state.configs size is normal.', function() {
      expect(Object.keys(state.configs).length).to.equal(keyLen);
    });
    it('lastActiveTab is set.', function() {
      expect(state.configs.lastActiveTab).to.equal('notifications');
    });
    it('taskOnTimeMode is set.', function() {
      expect(state.configs.taskOnTimeMode).to.be.true;
    });
    it('taskOnTop is set.', function() {
      expect(state.configs.taskOnTop).to.be.true;
    });
    it('taskShowSearchInput is set.', function() {
      expect(state.configs.taskShowSearchInput).to.be.true;
    });
    it('taskAutoRemoveStage is set.', function() {
      expect(state.configs.taskAutoRemoveStage).to.be.true;
    });
    it('taskTriggerInterval is set.', function() {
      expect(state.configs.taskTriggerInterval).to.equal(1440);
    });
    it('notificationDetectIcon is set.', function() {
      expect(state.configs.notificationDetectIcon).to.be.true;
    });
    it('notificationSound is set.', function() {
      expect(state.configs.notificationSound).to.be.true;
    });
    it('notificationCustomSound is set.', function() {
      expect(state.configs.notificationCustomSound).to.be.true;
    });
    it('notificationShowUrl is set.', function() {
      expect(state.configs.notificationShowUrl).to.be.true;
    });
    it('notificationLazyLoading is set.', function() {
      expect(state.configs.notificationLazyLoading).to.be.true;
    });
    it('notificationShowSearchInput is set.', function() {
      expect(state.configs.notificationShowSearchInput).to.be.true;
    });
    it('notificationShowBadge is set.', function() {
      expect(state.configs.notificationShowBadge).to.be.false;
    });
    it('notificationMaximun is set.', function() {
      expect(state.configs.notificationMaximun).to.equal(500);
    });
  });

  describe('Method: updateConfigs', function() {
    it('state.configs is normal.', function() {
      const state = {
        configs: defaultConfigs(),
        notifications: [],
        unread: 5,
      };
      const newConfigs = createNewConfigs();
      for (const key in newConfigs) {
        updateConfigs(state, {
          name: key,
          value: newConfigs[key],
        });
      }
      expect(state.configs).to.deep.equal(newConfigs);
      expect(state.unread).to.equal(0);
    });
  });

  describe('Method: setTasks', function() {
    it('state.tasks is normal.', function() {
      const state = {
        tasks: [],
      };
      setTasks(state, 'test string');
      expect(state.tasks).to.an.instanceof(Array);
    });
  });

  describe('Method: mergeTasks', function() {
    it('state.tasks is normal.', function() {
      const state = {
        tasks: [
          {
            id: '1',
            code: '',
            name: '',
            triggerInterval: 0,
            needInteraction: false,
            origin: '',
            onTimeMode: false,
            isEnable: false,
            triggerCount: 0,
            pushCount: 0,
            triggerDate: '',
            pushDate: '',
          },
        ],
      };
      mergeTasks(state, [
        {
          id: '1',
          code: '',
          name: '',
          triggerInterval: 1,
          needInteraction: false,
          origin: '',
          onTimeMode: false,
          isEnable: false,
          triggerCount: 0,
          pushCount: 0,
          triggerDate: '',
          pushDate: '',
        },
        {
          id: '2',
          code: '',
          name: '',
          triggerInterval: 1,
          needInteraction: false,
          origin: '',
          onTimeMode: false,
          isEnable: false,
          triggerCount: 0,
          pushCount: 0,
          triggerDate: '',
          pushDate: '',
        },
      ]);
      expect(state.tasks.length).to.equal(2);
    });
  });

  describe('Method: updateIsEnable', function() {
    it('isEnable is update.', function() {
      const state = {
        tasks: [
          {
            id: '1',
            isEnable: false,
          },
        ],
        operationTask: null,
      };
      updateIsEnable(state, {
        id: '1',
        checked: true,
      });
      expect(state.tasks[0].isEnable).to.be.true;
      expect(state.operationTask).to.not.be.null;
    });
  });

  describe('Method: updateTaskBasic', function() {
    it('task is update.', function() {
      const state = {
        tasks: [
          {
            id: '1',
            code: '',
            name: '',
            triggerInterval: 1,
            needInteraction: false,
            origin: '',
            onTimeMode: false,
            isEnable: false,
            triggerCount: 0,
            pushCount: 0,
            triggerDate: '',
            pushDate: '',
          },
        ],
        operationTask: null,
      };
      const newTask = {
        id: '1',
        code: 'test code.',
        name: 'test name',
        triggerInterVal: 5,
        needInteraction: true,
        origin: 'https://example.com/',
        onTimeMode: true,
      };
      updateTaskBasic(state, newTask);
      expect(state.tasks[0]).to.have.property('id', newTask.id);
      expect(state.tasks[0]).to.have.property('code', newTask.code);
      expect(state.tasks[0]).to.have.property('triggerInterVal', newTask.triggerInterVal);
      expect(state.tasks[0]).to.have.property('needInteraction', newTask.needInteraction);
      expect(state.tasks[0]).to.have.property('origin', newTask.origin);
      expect(state.tasks[0]).to.have.property('onTimeMode', newTask.onTimeMode);
      expect(state.tasks[0]).to.have.property('isEnable', false);
      expect(state.tasks[0]).to.have.property('triggerCount', 0);
      expect(state.tasks[0]).to.have.property('pushCount', 0);
      expect(state.tasks[0]).to.have.property('triggerDate', '');
      expect(state.tasks[0]).to.have.property('pushDate', '');
      expect(state.operationTask).to.not.be.null;
    });
  });

  describe('Method: createTaskBasic', function() {
    it('task is create.', function() {
      const state = {
        tasks: [
          {
            id: '1',
          },
        ],
        configs: {
          taskOnTop: true,
        },
        operationTask: null,
      };
      createTaskBasic(state, {
        id: '2',
        code: '',
        name: '',
        triggerInterval: 1,
        needInteraction: false,
        origin: '',
        onTimeMode: false,
      });
      expect(state.tasks[0].id).to.equal('2');
      expect(state.operationTask).to.not.be.null;
    });
  });

  describe('Method: removeTaskItem', function() {
    it('task is remove.', function() {
      const state = {
        tasks: [
          {
            id: '1',
          },
        ],
        configs: {
          taskAutoRemoveStage: true,
        },
        stages: [
          {
            id: '1',
          },
        ],
        operationTask: null,
      };
      removeTaskItem(state, '1');
      expect(state.tasks).to.be.empty;
      expect(state.stages).to.be.empty;
      expect(state.operationTask).to.not.be.null;
    });
  });

  describe('Method: triggerTask', function() {
    it('task is trigger.', function() {
      const state = {
        tasks: [
          {
            id: '1',
            triggerCount: 0,
            triggerDate: '',
          },
        ],
      };
      triggerTask(state, '1');
      expect(state.tasks[0].triggerCount).to.equal(1);
      expect(state.tasks[0].triggerDate).to.not.empty;
    });
  });

  describe('Method: clearTasks', function() {
    it('task is clear.', function() {
      const state = {
        tasks: [
          {
            id: '1',
          },
          {
            id: '2',
          },
        ],
        stages: [
          {
            id: '1',
          },
          {
            id: '2',
          },
          {
            id: '3',
          },
        ],
        configs: {
          taskAutoRemoveStage: true,
        },
      };
      clearTasks(state);
      expect(state.tasks).to.be.empty;
      expect(state.stages.length).to.equal(1);
    });
  });

  describe('Method: setStages', function() {
    it('state.stages is normal.', function() {
      const state = {
        stages: [],
      };
      setStages(state, 'test string.');
      expect(state.stages).to.be.an.instanceof(Array);
    });
  });

  describe('Method: updateStage', function() {
    it('state.stages is update.', function() {
      const state = {
        stages: [
          {
            id: '1',
            stage: {},
          },
        ],
      };
      updateStage(state, {
        id: '1',
        stage: [],
      });
      expect(state.stages[0].stage).to.be.an.instanceof(Array);
    });

    it('state.stages is update.', function() {
      const state = {
        stages: [
          {
            id: '1',
            stage: [],
          },
        ],
      };
      updateStage(state, {
        id: '1',
        stage: {},
      });
      expect(state.stages[0].stage).to.not.an.instanceof(Array);
    });
  });

  describe('Method: addStage', function() {
    it('add stages.', function() {
      const state = {
        stages: [],
      };
      addStage(state, {
        id: '1',
        stage: [],
      });
      expect(state.stages).to.not.empty;
    });
  });

  describe('Method: clearStages', function() {
    it('state.stages is clear.', function() {
      const state = {
        stages: [
          {
            id: '1',
          },
          {
            id: '2',
          },
        ],
      };
      clearStages(state);
      expect(state.stages).to.be.empty;
    });
  });

  describe('Method: clearExpiredStages', function() {
    it('clear expired stages.', function() {
      it('state.stages is normal.', function() {
        const state = {
          tasks: [
            {
              id: '1',
            },
          ],
          stages: [
            {
              id: '1',
            },
            {
              id: '2',
            },
            {
              id: '3',
            },
          ],
        };
        clearExpiredStages(state);
        expect(state.stages.length).to.equal(1);
      });
    });
  });

  describe('Method: addMessageFlow', function() {
    it('add message flow.', function() {
      const state = {
        configs: {
          notificationShowBadge: true,
        },
        unread: 0,
        tasks: [
          {
            id: '1',
            name: 'test',
            pushCount: 0,
            pushDate: '',
          },
        ],
        notifications: [],
      };
      addMessageFlow(state, {
        id: '11',
        taskId: '1',
        data: [{}, {}, {}],
      });
      expect(state.unread).to.equal(3);
      expect(state.tasks[0].pushCount).to.equal(3);
      expect(state.tasks[0].pushDate).to.not.empty;
      expect(state.notifications).to.not.empty;
    });
  });

  describe('Method: setNotifications', function() {
    it('state.notifications is normal.', function() {
      const state = {
        notifications: [],
      };
      setNotifications(state, 'test string.');
      expect(state.notifications).to.be.an.instanceof(Array);
    });
  });

  describe('Method: updateNotification', function() {
    it('update notification.', function() {
      const state = {
        notifications: [
          {
            id: '1',
            options: {},
          },
        ],
      };
      updateNotification(state, {
        id: '1',
        options: {
          iconUrl: 'test.png',
        },
      });
      expect(state.notifications[0].options.iconUrl).to.not.empty;
    });
  });

  describe('Method: clearNotifications', function() {
    it('clear notifications.', function() {
      const state = {
        notifications: [
          {
            id: '1',
          },
          {
            id: '2',
          },
          {
            id: '3',
          },
        ],
      };
      clearNotifications(state);
      expect(state.notifications).to.be.empty;
    });
  });

  describe('Method: setReducer', function() {
    it('set reducer.', function() {
      const state = {
        reducer: '',
      };
      setReducer(state, 'test code.');
      expect(state.reducer).to.not.empty;
    });
  });

  describe('Method: updateReducer', function() {
    it('update reducer.', function() {
      const state = {
        reducer: 'test code.',
      };
      updateReducer(state, '');
      expect(state.reducer).to.be.empty;
    });
  });

  describe('Method: decreaseUnread', function() {
    it('decrease unread num.', function() {
      const state = {
        unread: 1,
      };
      decreaseUnread(state);
      expect(state.unread).to.equal(0);
      decreaseUnread(state);
      expect(state.unread).to.equal(0);
    });
  });

  describe('Method: clearUnread', function() {
    it('clear unread num.', function() {
      const state = {
        unread: 5,
      };
      clearUnread(state);
      expect(state.unread).to.equal(0);
    });
  });

  after(function() {
    chrome.flush();
    delete global.chrome;
  });
});

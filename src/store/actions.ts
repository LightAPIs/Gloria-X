import { ActionContext } from 'vuex';
import { diff } from '@/commons/calc';
import { v4 as uuid } from 'uuid';
import { reduceNotification } from './reducer';

export default {
  installTask(context: ActionContext<myStore.VuexState, unknown>, newTask: myStore.GloriaTaskBasic): void {
    const { commit, state } = context;
    const { taskOnTimeMode, taskNeedInteraction, taskTriggerInterval } = state.configs;
    commit(
      'createTaskBasic',
      Object.assign(
        {
          triggerInterval: taskTriggerInterval,
          needInteraction: taskNeedInteraction,
          onTimeMode: taskOnTimeMode,
        },
        newTask
      )
    );
  },
  updateTaskByOrigin(context: ActionContext<myStore.VuexState, unknown>, originData: { url: string; code: myStore.OriginCode }): void {
    const {
      commit,
      state: { tasks },
    } = context;
    const { url, code } = originData;
    const originTasks = tasks.filter(task => task.origin === url);
    originTasks.forEach(item => {
      commit(
        'updateTaskBasic',
        Object.assign({}, item, {
          code,
        })
      );
    });
  },
  removeTaskByOrigin(context: ActionContext<myStore.VuexState, unknown>, origin: string): void {
    const {
      commit,
      state: { tasks },
    } = context;
    const originTasks = tasks.filter(task => task.origin === origin);
    originTasks.forEach(item => {
      commit('removeTaskItem', item.id);
    });
  },

  handleData(
    context: ActionContext<myStore.VuexState, unknown>,
    commitData: { taskId: string; data: myStore.CommitData | myStore.CommitData[] }
  ): void {
    const {
      commit,
      state: { stages, reducer },
    } = context;
    const { taskId: id, data } = commitData;
    let hasId = false;
    for (const stagesItem of stages) {
      if (stagesItem.id === id) {
        hasId = true;
        if (Array.isArray(data)) {
          if (Array.isArray(stagesItem.stage)) {
            //* 处理的数据和 STAGES 中缓存的数据均为数组时
            const diffArray = [],
              pushData = [];
            for (const dataItem of data) {
              let d = true;
              const singleStage: myStore.Stage = {
                id: dataItem.id || '',
                title: dataItem.title || '',
                message: dataItem.message || '',
              };

              for (const item of stagesItem.stage) {
                if (!diff(singleStage, item)) {
                  d = false;
                  break;
                }
              }

              if (d) {
                diffArray.push(singleStage);
                pushData.push(Object.assign({}, dataItem));
              }
            }

            if (diffArray.length > 0) {
              const newStage = [];
              newStage.push(...stagesItem.stage, ...diffArray);
              commit('updateStage', {
                id,
                stage: newStage,
              });
              //* 处理 Reducer 函数
              const reduceArray: myStore.CommitData[] = reduceNotification(pushData, reducer);
              //* 将常规任务的通知推入虚拟消息流中
              reduceArray.length > 0 &&
                commit('addMessageFlow', {
                  id: uuid(),
                  taskId: id,
                  data: reduceArray.map(ele => {
                    return Object.assign(ele, {
                      //* 通知 id，用于标识每条通知
                      notificationId: uuid(),
                    });
                  }),
                });
            }
          } else {
            //* 处理的数据为数组，但 STAGES 中缓存的数据为单一对象时
            commit('updateStage', {
              id,
              stage: data.map(ele => {
                return {
                  id: ele.id || '',
                  title: ele.title || '',
                  message: ele.message || '',
                };
              }),
            });
          }
        } else {
          const singleStage: myStore.Stage = {
            id: data.id || '',
            title: data.title || '',
            message: data.message || '',
          };

          if (Array.isArray(stagesItem.stage)) {
            //* 处理的数据为单一对象，但 STAGES 中缓存缓存的数据为数组时
            commit('updateStage', {
              id,
              stage: singleStage,
            });
          } else {
            //* 处理的数据和 STAGES 中缓存的数据均为单一对象时
            const lhs: myStore.Stage = {
              id: stagesItem.stage.id,
              title: stagesItem.stage.title,
              message: stagesItem.stage.message,
            };

            if (diff(lhs, singleStage)) {
              commit('updateStage', {
                id,
                stage: singleStage,
              });
              //* 处理 Reducer 函数
              const reduceData = reduceNotification(data, reducer);
              //* 将观察任务的通知推入虚拟消息流中
              reduceData &&
                commit('addMessageFlow', {
                  id: uuid(),
                  taskId: id,
                  data: [
                    Object.assign({}, reduceData, {
                      //* 通知 id，用于标识每条通知
                      notificationId: uuid(),
                    }),
                  ],
                });
            }
          }
        }
        break;
      }
    }

    if (!hasId) {
      if (Array.isArray(data)) {
        commit('addStage', {
          id,
          stage: data.map(ele => {
            return {
              id: ele.id || '',
              title: ele.title || '',
              message: ele.message || '',
            };
          }),
        });
      } else {
        commit('addStage', {
          id,
          stage: {
            id: data.id || '',
            title: data.title || '',
            message: data.message || '',
          },
        });
      }
    }
  },
};

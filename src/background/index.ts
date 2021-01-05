import store from '../store';

const devMode = process.env.NODE_ENV !== 'production';

chrome.storage.local.get(['tasks', 'notifications', 'configs'], res => {
  devMode && console.log(res);
  store.commit('setConfigs', res.configs || {});
  store.commit('setTasks', res.tasks || []);
  store.commit('setNotifications', res.notifications || []);
});

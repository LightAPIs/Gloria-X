import { createStore, createLogger } from 'vuex';
import VuexChromePlugin from '../vuex-extensions';
import { defaultConfigs } from './basic';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';

const devMode = process.env.NODE_ENV !== 'production';

const defaultconf = defaultConfigs();

const logger = createLogger({
  collapsed: true,
  filter(mutation) {
    return mutation.type !== 'aBlocklistedMutation';
  },
  actionFilter(action) {
    return action.type !== 'aBlocklistedAction';
  },
  logActions: devMode,
  logMutations: devMode,
});

const store = createStore({
  state() {
    return {
      implicitPush: false,
      lastActiveTab: 'tasks',
      lastCheckTasksUpdate: '',
      tasks: [],
      rules: [],
      operationTask: null,
      notifications: [],
      stages: [],
      configs: defaultconf,
      reducer: '',
      unread: 0,
    } as myStore.VuexState;
  },
  getters,
  mutations,
  actions,
  strict: devMode,
  plugins: [logger, VuexChromePlugin()],
});

export default store;

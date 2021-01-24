import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
import VuexChromePlugin from 'vuex-chrome-plugin';
import { defaultConfigs } from './state';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';

Vue.use(Vuex);

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

export default new Vuex.Store({
  state: {
    implicitPush: false,
    lastActiveTab: 'tasks',
    lastCheckTasksUpdate: '',
    tasks: [],
    operationTask: null,
    notifications: [],
    stages: [],
    configs: defaultconf,
    reducer: '',
    unread: 0,
    laterCount: 0,
  } as store.VuexState,
  getters,
  mutations,
  actions,
  // modules: {},
  strict: devMode,
  plugins: [logger, VuexChromePlugin()],
});

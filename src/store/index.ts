import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
import VuexChromePlugin from 'vuex-chrome-plugin';
import getters from './getters';
import mutations from './mutations';

Vue.use(Vuex);

const devMode = process.env.NODE_ENV !== 'production';

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
    tasks: [],
    notifications: [],
    stages: [],
    configs: {},
  },
  getters,
  mutations,
  actions: {},
  modules: {},
  strict: devMode,
  plugins: [logger, VuexChromePlugin()],
});

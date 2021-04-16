import { createApp } from 'vue';
import App from './App/App.vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import store from '../store';
import * as ui from '../commons/ui';
import * as calc from '../commons/calc';
import {
  ElAside,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElButton,
  ElCol,
  ElContainer,
  ElDivider,
  ElHeader,
  ElInput,
  ElInputNumber,
  ElLink,
  ElMain,
  ElMenu,
  ElMenuItem,
  ElPopconfirm,
  ElPopover,
  ElRow,
  ElScrollbar,
  ElSwitch,
  ElTooltip,
} from 'element-plus';
import 'element-plus/packages/theme-chalk/src/base.scss';
import 'element-plus/packages/theme-chalk/src/popper.scss';
const RouterSettings = () => import(/* webpackChunkName: "options-group" */ '../router/RouterSettings.vue');
const RouterDebug = () => import(/* webpackChunkName: "options-group" */ '../router/RouterDebug.vue');
const RouterState = () => import(/* webpackChunkName: "options-group" */ '../router/RouterState.vue');
const RouterReducer = () => import(/* webpackChunkName: "options-group" */ '../router/RouterReducer.vue');
const RouterAbout = () => import(/* webpackChunkName: "options-group" */ '../router/RouterAbout.vue');

const components = [
  ElAside,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElButton,
  ElCol,
  ElContainer,
  ElDivider,
  ElHeader,
  ElInput,
  ElInputNumber,
  ElLink,
  ElMain,
  ElMenu,
  ElMenuItem,
  ElPopconfirm,
  ElPopover,
  ElRow,
  ElScrollbar,
  ElSwitch,
  ElTooltip,
];

const routes = [
  {
    path: '/settings',
    name: 'RouterSettings',
    component: RouterSettings,
  },
  {
    path: '/debug',
    name: 'RouterDebug',
    component: RouterDebug,
  },
  {
    path: '/state',
    name: 'RouterState',
    component: RouterState,
  },
  {
    path: '/reducer',
    name: 'RouterReducer',
    component: RouterReducer,
  },
  {
    path: '/about',
    name: 'RouterAbout',
    component: RouterAbout,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/settings',
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

const app = createApp(App);

components.forEach(component => {
  app.component(component.name, component);
});

app.use(router);
app.use(store);

app.mixin({
  methods: {
    ...ui,
    ...calc,
  },
});

app.mount('#options-app');

document.title = ui.i18n('optionsTitle');

import { createApp } from 'vue';
import App from './App/App.vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import store from '../store';
import * as ui from '../commons/ui';
import * as calc from '../commons/calc';
import { v4 as uuid } from 'uuid';
import {
  ElAside,
  ElAutocomplete,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElButton,
  ElCheckbox,
  ElCol,
  ElContainer,
  ElDialog,
  ElDivider,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElForm,
  ElFormItem,
  ElHeader,
  ElInput,
  ElInputNumber,
  ElLink,
  ElMain,
  ElMenu,
  ElMenuItem,
  ElPopconfirm,
  ElPopover,
  ElRadioGroup,
  ElRadioButton,
  ElRow,
  ElScrollbar,
  ElSwitch,
  ElTable,
  ElTableColumn,
  ElTag,
  ElTooltip,
  ElTimePicker,
} from 'element-plus';
import 'element-plus/packages/theme-chalk/src/base.scss';
const RouterSettings = () => import(/* webpackChunkName: "options-group" */ '../router/RouterSettings.vue');
const RouterDebug = () => import(/* webpackChunkName: "options-group" */ '../router/RouterDebug.vue');
const RouterState = () => import(/* webpackChunkName: "options-group" */ '../router/RouterState.vue');
const RouterReducer = () => import(/* webpackChunkName: "options-group" */ '../router/RouterReducer.vue');
const RouterHeaders = () => import(/* webpackChunkName: "options-group" */ '../router/RouterHeaders.vue');
const RouterAbout = () => import(/* webpackChunkName: "options-group" */ '../router/RouterAbout.vue');

const components = [
  ElAside,
  ElAutocomplete,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElButton,
  ElCheckbox,
  ElCol,
  ElContainer,
  ElDialog,
  ElDivider,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElForm,
  ElFormItem,
  ElHeader,
  ElInput,
  ElInputNumber,
  ElLink,
  ElMain,
  ElMenu,
  ElMenuItem,
  ElPopconfirm,
  ElPopover,
  ElRadioGroup,
  ElRadioButton,
  ElRow,
  ElScrollbar,
  ElSwitch,
  ElTable,
  ElTableColumn,
  ElTag,
  ElTimePicker,
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
    path: '/headers',
    name: 'RouterHeaders',
    component: RouterHeaders,
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
    uuid,
  },
});

app.mount('#options-app');

document.title = ui.i18n('optionsTitle');

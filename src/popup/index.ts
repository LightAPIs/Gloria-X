import { createApp } from 'vue';
import App from './App/App.vue';
import store from '../store';
import * as ui from '../commons/ui';
import * as calc from '../commons/calc';
import { v4 as uuid } from 'uuid';
import {
  ElAside,
  ElAvatar,
  ElBadge,
  ElButton,
  ElCard,
  ElCheckbox,
  ElCol,
  ElContainer,
  ElDialog,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElForm,
  ElFormItem,
  ElHeader,
  ElImage,
  ElInfiniteScroll,
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
  ElTabPane,
  ElTabs,
  ElTag,
  ElTimeline,
  ElTimelineItem,
} from 'element-plus';
import 'element-plus/packages/theme-chalk/src/base.scss';
import 'element-plus/packages/theme-chalk/src/popper.scss';

const components = [
  ElAside,
  ElAvatar,
  ElBadge,
  ElButton,
  ElCard,
  ElCheckbox,
  ElCol,
  ElContainer,
  ElDialog,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElForm,
  ElFormItem,
  ElHeader,
  ElImage,
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
  ElTabPane,
  ElTabs,
  ElTag,
  ElTimeline,
  ElTimelineItem,
];

const plugins = [ElInfiniteScroll];

calc.dayjsLocale();

const app = createApp(App);

components.forEach(component => {
  app.component(component.name, component);
});

plugins.forEach(plugin => {
  app.use(plugin);
});

app.use(store);

app.mixin({
  methods: {
    ...ui,
    ...calc,
    uuid,
  },
});

app.mount('#popup-app');

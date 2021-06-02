import { createApp } from 'vue';
import App from './App/App.vue';
import store from '../store';
import * as ui from '@/commons/ui';
import * as calc from '@/commons/calc';
import {
  ElButton,
  ElCheckbox,
  ElCol,
  ElContainer,
  ElForm,
  ElFormItem,
  ElHeader,
  ElInput,
  ElInputNumber,
  ElMain,
  ElRadioGroup,
  ElRadioButton,
  ElRow,
  ElStep,
  ElSteps,
  ElTimePicker,
} from 'element-plus';
import 'element-plus/packages/theme-chalk/src/base.scss';

const components = [
  ElButton,
  ElCheckbox,
  ElCol,
  ElContainer,
  ElForm,
  ElFormItem,
  ElHeader,
  ElInput,
  ElInputNumber,
  ElMain,
  ElRadioGroup,
  ElRadioButton,
  ElRow,
  ElStep,
  ElSteps,
  ElTimePicker,
];

const app = createApp(App);

components.forEach(component => {
  app.component(component.name, component);
});

app.mixin({
  methods: {
    ...ui,
    ...calc,
  },
});

app.use(store);

app.mount('#generation-app');

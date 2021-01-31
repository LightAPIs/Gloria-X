import Vue from 'vue';
import App from './App/App.vue';
import store from '../store';
import * as ui from '@/commons/ui';
import * as calc from '@/commons/calc';
import { Button, Checkbox, Col, Container, Form, FormItem, Header, Input, InputNumber, Main, Row } from 'element-ui';

Vue.use(Container);
Vue.use(Header);
Vue.use(Main);
Vue.use(Row);
Vue.use(Col);
Vue.use(Input);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(InputNumber);
Vue.use(Checkbox);
Vue.use(Button);
Vue.config.productionTip = false;
Vue.mixin({
  methods: {
    ...ui,
    ...calc,
  },
});

new Vue({
  el: '#generation-app',
  store,
  components: {
    App,
  },
  render(h) {
    return h(App);
  },
});

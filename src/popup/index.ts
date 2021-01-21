import Vue from 'vue';
import App from './App/App.vue';
import store from '../store';
import * as ui from '../commons/ui';
import * as calc from '../commons/calc';
import { v4 as uuid } from 'uuid';
import VueFab from 'vue-float-action-button';
import {
  Aside,
  Avatar,
  Button,
  Card,
  Checkbox,
  Col,
  Container,
  Dialog,
  Form,
  FormItem,
  Header,
  Image,
  Input,
  InputNumber,
  Link,
  Main,
  Menu,
  MenuItem,
  Message,
  Popconfirm,
  Popover,
  Row,
  Switch,
  TabPane,
  Tabs,
  Tag,
  Timeline,
  TimelineItem,
} from 'element-ui';

Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Card);
Vue.use(Switch);
Vue.use(Button);
Vue.use(Popconfirm);
Vue.use(Popover);
Vue.use(Tag);
Vue.use(Dialog);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Checkbox);
Vue.use(VueFab);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Container);
Vue.use(Aside);
Vue.use(Header);
Vue.use(Main);
Vue.use(Timeline);
Vue.use(TimelineItem);
Vue.use(Avatar);
Vue.use(Row);
Vue.use(Col);
Vue.use(Link);
Vue.use(Image);
Vue.prototype.$message = Message;
Vue.config.productionTip = false;
Vue.mixin({
  methods: {
    ...ui,
    ...calc,
    uuid,
  },
});

calc.momentLocale();

new Vue({
  el: '#popup-app',
  store,
  components: {
    App,
  },
  render(h) {
    return h(App);
  },
});

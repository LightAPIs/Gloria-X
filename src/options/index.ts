import Vue from 'vue';
import App from './App/App.vue';
import VueRouter from 'vue-router';
import store from '../store';
import * as ui from '../commons/ui';
import * as calc from '../commons/calc';
import {
  Aside,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Col,
  Container,
  Divider,
  Header,
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
  Tooltip,
} from 'element-ui';
const RouterSettings = () => import(/* webpackChunkName: "options-group" */ '../router/RouterSettings.vue');
const RouterDebug = () => import(/* webpackChunkName: "options-group" */ '../router/RouterDebug.vue');
const RouterState = () => import(/* webpackChunkName: "options-group" */ '../router/RouterState.vue');
const RouterReducer = () => import(/* webpackChunkName: "options-group" */ '../router/RouterReducer.vue');
const RouterAbout = () => import(/* webpackChunkName: "options-group" */ '../router/RouterAbout.vue');

Vue.use(VueRouter);
Vue.use(Container);
Vue.use(Aside);
Vue.use(Header);
Vue.use(Main);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Divider);
Vue.use(Switch);
Vue.use(InputNumber);
Vue.use(Button);
Vue.use(Tooltip);
Vue.use(Input);
Vue.use(Row);
Vue.use(Col);
Vue.use(Popover);
Vue.use(Popconfirm);
Vue.use(Link);
Vue.prototype.$message = Message;
Vue.config.productionTip = false;
Vue.mixin({
  methods: {
    ...ui,
    ...calc,
  },
});

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
    path: '*',
    redirect: '/settings',
  },
];

const router = new VueRouter({
  routes,
});

document.title = ui.i18n('optionsTitle');

new Vue({
  el: '#options-app',
  store,
  router,
  components: {
    App,
  },
  render(h) {
    return h(App);
  },
});

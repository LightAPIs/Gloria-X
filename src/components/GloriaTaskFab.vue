<template>
  <vue-fab mainBtnColor="#3599DB" icon="reorder">
    <fab-item
      v-for="menu in menus"
      :idx="menu.idx"
      :key="menu.idx"
      :title="menu.title"
      :color="menu.color"
      :icon="menu.icon"
      @clickItem="clickItem"
    ></fab-item>
  </vue-fab>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'gloria-task-fab',
  data() {
    return {
      menus: [
        {
          idx: 0,
          icon: 'add',
          title: this.i18n('popupTaskAdd'),
          color: '#ff9900',
        },
        {
          idx: 1,
          icon: 'settings',
          title: this.i18n('optionsSettingsMenu'),
          color: '#4867a7',
        },
        {
          idx: 2,
          icon: 'code',
          title: this.i18n('optionsDebugMenu'),
          color: '#5c8647',
        },
        {
          idx: 3,
          icon: 'send',
          title: this.i18n('optionsReducerMenu'),
          color: '#965e5e',
        },
        {
          idx: 4,
          icon: 'share',
          title: this.i18n('popupTaskShare'),
          color: '#00bcd4',
        },
        {
          idx: 5,
          icon: 'menu_book',
          title: this.i18n('popupTaskBook'),
          color: '#666',
        },
      ],
    };
  },
  methods: {
    clickItem({ idx }: { idx: number }) {
      switch (idx) {
        case 1:
          chrome.tabs.create({
            url: './options.html#/settings',
          });
          break;
        case 2:
          chrome.tabs.create({
            url: './options.html#/debug',
          });
          break;
        case 3:
          chrome.tabs.create({
            url: './options.html#/reducer',
          });
          break;
        case 4:
          chrome.tabs.create({
            url: 'https://gloria.pub/',
          });
          break;
        case 5:
          chrome.tabs.create({
            url: 'https://github.com/LightAPIs/Gloria-X#使用方法',
          });
          break;
        case 0:
        default:
          this.$emit('add-task');
          break;
      }
    },
  },
});
</script>

<style>
.fab-main-container {
  right: 85px !important;
  bottom: 65px !important;
  z-index: 5 !important;
}
</style>

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
          icon: 'share',
          title: this.i18n('popupTaskShare'),
          color: '#999',
        },
        {
          idx: 2,
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
            url: 'https://gloria.pub/',
          });
          break;
        case 2:
          chrome.tabs.create({
            url: 'https://docs.gloria.pub/',
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

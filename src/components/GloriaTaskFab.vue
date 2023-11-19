<template>
  <el-button
    type="success"
    class="fab-button fab-add-button"
    icon="el-icon-plus"
    circle
    :title="i18n('popupTaskAdd')"
    @click="onClick"
  ></el-button>
  <el-button
    v-if="popupBtn"
    type="primary"
    class="fab-button fab-popup-button"
    icon="el-icon-monitor"
    circle
    :title="i18n('popupTaskOpen')"
    @click="onPopup"
  ></el-button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'GloriaTaskFab',
  emits: ['add-task'],
  setup() {
    const hash = location.hash;
    return {
      popupBtn: hash.includes('popup=1'),
    };
  },
  methods: {
    onClick() {
      this.$emit('add-task');
    },
    onPopup() {
      // 发送命令至后台打开新窗口
      chrome.runtime.sendMessage({
        type: 'open-popup',
        data: '',
      });
      window.close();
    },
  },
});
</script>

<style>
.fab-button {
  position: fixed;
  right: 25px;
}
.fab-add-button {
  bottom: 5px;
}
.fab-button.fab-add-button:hover {
  box-shadow: 0px 0px 5px 2px green;
}
.fab-popup-button {
  bottom: 55px;
}
.fab-button.fab-popup-button:hover {
  box-shadow: 0px 0px 5px 2px blue;
}
</style>

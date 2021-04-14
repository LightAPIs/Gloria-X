<template>
  <div class="gloria-options-menu">
    <div class="options-logo">
      <span class="logo-text">Gloria</span>
      <span class="logo-separator">-</span>
      <span class="logo-x">X</span>
    </div>
    <el-menu
      :default-active="activeIndex"
      class="options-menu"
      router
      background-color="#001529"
      text-color="#ffffff"
      @select="handleSelect"
    >
      <el-menu-item index="settings" class="options-menu-item">{{ i18n('optionsSettingsMenu') }}</el-menu-item>
      <el-menu-item index="debug" class="options-menu-item">{{ i18n('optionsDebugMenu') }}</el-menu-item>
      <el-menu-item index="state" class="options-menu-item">{{ i18n('optionsStateMenu') }}</el-menu-item>
      <el-menu-item index="reducer" class="options-menu-item">{{ i18n('optionsReducerMenu') }}</el-menu-item>
      <el-menu-item index="about" class="opitons-menu-item">{{ i18n('optionsAboutMenu') }}</el-menu-item>
    </el-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'GloriaOptionsMenu',
  props: {
    activeIndex: {
      type: String,
      required: true,
    },
  },
  emits: ['menu-click'],
  methods: {
    handleSelect(index: string) {
      this.$emit('menu-click', index);
    },
  },
});
</script>

<style lang="scss">
.options-logo {
  text-align: center;
  height: 60px;
  line-height: 60px;
  background-image: linear-gradient(to right, #9c7fd0, #4f84af, #9c7fd0);
  font: {
    weight: bold;
    size: 24px;
  }
  .logo-text {
    color: #1e4369;
  }
  .logo-separator {
    color: #5d6473;
  }
  .logo-x {
    color: #ad3860;
  }
}
.options-menu {
  width: 100%;
}
</style>

<template>
  <div id="options-app">
    <el-container class="options-container">
      <el-aside class="options-aside">
        <gloria-options-menu :active-index="activeIndex" @menu-click="menuClick"></gloria-options-menu>
      </el-aside>
      <el-container>
        <el-header class="options-header">
          <gloria-options-breadcrumb :breadcrumb-index="activeIndex"></gloria-options-breadcrumb>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import GloriaOptionsMenu from '@/components/GloriaOptionsMenu.vue';
import GloriaOptionsBreadcrumb from '@/components/GloriaOptionsBreadcrumb.vue';

const { hash } = location;
let activeIndex = 'settings';
if (hash.includes('#/debug')) {
  activeIndex = 'debug';
} else if (hash.includes('#/state')) {
  activeIndex = 'state';
} else if (hash.includes('#/reducer')) {
  activeIndex = 'reducer';
} else if (hash.includes('#/about')) {
  activeIndex = 'about';
} else {
  activeIndex = 'settings';
}

export default Vue.extend({
  name: 'app',
  components: {
    GloriaOptionsMenu,
    GloriaOptionsBreadcrumb,
  },
  data() {
    return {
      activeIndex,
    };
  },
  methods: {
    menuClick(index: string) {
      this.activeIndex = index;
    },
  },
});
</script>

<style lang="scss">
body {
  overflow: hidden;
}
#options-app {
  position: absolute;
  height: 99%;
  width: 99%;
  .options-container {
    height: 100%;
  }
  .options-aside {
    overflow-x: hidden;
    background-color: #001529;
  }
  .options-header {
    padding: 24px;
    background-color: #0b1a29;
  }
}
</style>

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
import { defineComponent, ref } from 'vue';
import GloriaOptionsMenu from '@/components/GloriaOptionsMenu.vue';
import GloriaOptionsBreadcrumb from '@/components/GloriaOptionsBreadcrumb.vue';

export default defineComponent({
  name: 'App',
  components: {
    GloriaOptionsMenu,
    GloriaOptionsBreadcrumb,
  },
  setup() {
    const { hash } = location;
    let activeIndex = ref('settings');
    if (hash.includes('#/debug')) {
      activeIndex.value = 'debug';
    } else if (hash.includes('#/state')) {
      activeIndex.value = 'state';
    } else if (hash.includes('#/reducer')) {
      activeIndex.value = 'reducer';
    } else if (hash.includes('#/about')) {
      activeIndex.value = 'about';
    } else {
      activeIndex.value = 'settings';
    }

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

  .options-tip-icon {
    margin-left: 5px;

    i {
      font-size: 1.25em;
    }
  }
}
</style>

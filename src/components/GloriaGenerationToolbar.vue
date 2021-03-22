<template>
  <div class="gloria-generation-toolbar">
    <div v-show="!minus" class="float-left">
      {{ i18n('generationUsage') }}
    </div>
    <div class="float-right">
      <el-button
        v-show="minus && !floatRight"
        :title="i18n('generationRight')"
        icon="el-icon-d-arrow-right"
        circle
        size="mini"
        @click="onClick('right')"
      ></el-button>
      <el-button
        v-show="minus && floatRight"
        :title="i18n('generationLeft')"
        icon="el-icon-d-arrow-left"
        circle
        size="mini"
        @click="onClick('left')"
      ></el-button>
      <el-button
        v-show="minus"
        :title="i18n('generationRestore')"
        icon="el-icon-plus"
        circle
        size="mini"
        @click="onClick('plus')"
      ></el-button>
      <el-button
        v-show="!minus"
        :title="i18n('generationMinus')"
        icon="el-icon-minus"
        circle
        size="mini"
        @click="onClick('minus')"
      ></el-button>
      <el-button :title="i18n('generationDestroy')" icon="el-icon-close" circle size="mini" @click="onDestroy"></el-button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'gloria-generation-toolbar',
  data() {
    return {
      minus: false,
      floatRight: true,
      isChrome: process.env.VUE_APP_TITLE === 'chrome',
    };
  },
  methods: {
    onClick(type: string) {
      switch (type) {
        case 'minus':
          this.minus = true;
          break;
        case 'plus':
          this.minus = false;
          this.floatRight = true;
          break;
        case 'left':
          this.floatRight = false;
          break;
        case 'right':
          this.floatRight = true;
          break;
      }

      if (this.isChrome) {
        chrome.tabs.query(
          {
            active: true,
            currentWindow: true,
          },
          tabs => {
            if (!chrome.runtime.lastError && tabs && tabs[0] && tabs[0].id) {
              chrome.tabs.sendMessage(tabs[0].id, {
                type: 'float',
                data: type,
              });
            }
          }
        );
      } else {
        chrome.runtime.sendMessage({
          type: 'float-firefox',
          data: type,
        });
      }
    },
    onDestroy() {
      if (this.isChrome) {
        chrome.tabs.query(
          {
            active: true,
            currentWindow: true,
          },
          tabs => {
            if (!chrome.runtime.lastError && tabs && tabs[0] && tabs[0].id) {
              chrome.tabs.sendMessage(tabs[0].id, {
                type: 'destroy',
                data: '',
              });
            }
          }
        );
      } else {
        chrome.runtime.sendMessage({
          type: 'destroy-firefox',
          data: '',
        });
      }
    },
  },
});
</script>

<style lang="scss">
.gloria-generation-toolbar {
  .float-left {
    float: left;
  }
  .float-right {
    float: right;
  }
}
</style>

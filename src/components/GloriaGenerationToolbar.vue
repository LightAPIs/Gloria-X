<template>
  <div class="gloria-generation-toolbar">
    <div v-show="!minus" class="float-left">
      <el-steps :active="active" simple finish-status="success">
        <el-step icon="el-icon-thumb" :title="i18n('generationStep1')"></el-step>
        <el-step icon="el-icon-cpu" :title="i18n('generationStep2')"></el-step>
        <el-step icon="el-icon-document-add" :title="i18n('generationStep3')"></el-step>
      </el-steps>
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
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'GloriaGenerationToolbar',
  props: {
    active: {
      type: Number,
      default: 0,
    },
  },
  setup() {
    const isChrome = process.env.VUE_APP_TITLE === 'chrome';
    return {
      isChrome,
    };
  },
  data() {
    return {
      minus: false,
      floatRight: true,
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
          type: 'firefox-message',
          data: {
            type: 'float',
            data: type,
          },
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
          type: 'firefox-message',
          data: {
            type: 'destroy',
            data: '',
          },
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
    width: 80%;

    .el-steps {
      height: 0px;
    }
  }
  .float-right {
    float: right;
  }
}
</style>

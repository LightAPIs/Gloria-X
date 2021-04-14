<template>
  <div id="debug-router">
    <el-button type="primary" size="small" @click="evalTest">
      {{ i18n('debugTestCode') }}
    </el-button>
    <el-button type="warning" size="small" @click="evalTestNoMsg">
      {{ i18n('debugTestNoMsgCode') }}
    </el-button>
    <el-divider content-position="left">
      {{ i18n('debugTest') }}
    </el-divider>
    <gloria-debug-code :testing="testing" :testing-no-msg="testingNoMsg" @stop-test="stopTest"></gloria-debug-code>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import GloriaDebugCode from '@/components/GloriaDebugCode.vue';

export default defineComponent({
  name: 'RouterDebug',
  components: {
    GloriaDebugCode,
  },
  data() {
    return {
      testing: false,
      testingNoMsg: false,
    };
  },
  methods: {
    evalTest() {
      this.testing = true;
    },
    evalTestNoMsg() {
      this.testingNoMsg = true;
    },
    stopTest() {
      this.testing = false;
      this.testingNoMsg = false;
    },
  },
});
</script>

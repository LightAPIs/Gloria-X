<template>
  <div id="debug-router">
    <el-button type="warning" size="small" @click="evalTest">
      {{ i18n('debugTestCode') }}
    </el-button>
    <el-divider content-position="left">
      {{ i18n('debugTest') }}
    </el-divider>
    <gloria-debug-code :testing="testing" @stop-test="stopTest"></gloria-debug-code>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import GloriaDebugCode from '@/components/GloriaDebugCode.vue';

export default Vue.extend({
  name: 'router-debug',
  components: {
    GloriaDebugCode,
  },
  data() {
    return {
      testing: false,
    };
  },
  methods: {
    evalTest() {
      this.testing = true;
    },
    stopTest() {
      this.testing = false;
    },
  },
});
</script>

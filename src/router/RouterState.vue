<template>
  <div id="state-router">
    <el-button type="danger" size="small" @click="watchState">
      {{ watching ? i18n('stateStopWatch') : i18n('stateWatch') }}
    </el-button>
    <el-divider content-position="left">
      {{ watching ? i18n('stateWatchingLabel') : i18n('stateLabel') }}
    </el-divider>
    <gloria-state-content :watching="watching"></gloria-state-content>
    <el-divider content-position="left">
      {{ i18n('settingsClear') }}
    </el-divider>
    <gloria-settings-clear></gloria-settings-clear>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import GloriaStateContent from '@/components/GloriaStateContent.vue';
import GloriaSettingsClear from '@/components/GloriaSettingsClear.vue';

export default defineComponent({
  name: 'router-state',
  components: {
    GloriaStateContent,
    GloriaSettingsClear,
  },
  data() {
    return {
      watching: false,
    };
  },
  methods: {
    watchState() {
      this.watching = !this.watching;
    },
  },
});
</script>

<template>
  <div id="state-router">
    <el-divider content-position="left">
      {{ i18n('stateLabel') }}
    </el-divider>
    <gloria-state-content></gloria-state-content>
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
  name: 'RouterState',
  components: {
    GloriaStateContent,
    GloriaSettingsClear,
  },
});
</script>

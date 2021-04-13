<template>
  <div id="settings-router">
    <el-divider content-position="left">
      {{ i18n('settingsTask') }}
    </el-divider>
    <gloria-settings-task></gloria-settings-task>
    <el-divider content-position="left">
      {{ i18n('settingsNotification') }}
    </el-divider>
    <gloria-settings-notification></gloria-settings-notification>
    <el-divider content-position="left">
      {{ i18n('settingsImportExport') }}
    </el-divider>
    <gloria-settings-file></gloria-settings-file>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import GloriaSettingsTask from '@/components/GloriaSettingsTask.vue';
import GloriaSettingsNotification from '@/components/GloriaSettingsNotification.vue';

import GloriaSettingsFile from '@/components/GloriaSettingsFile.vue';

export default defineComponent({
  name: 'router-settings',
  components: {
    GloriaSettingsTask,
    GloriaSettingsNotification,

    GloriaSettingsFile,
  },
});
</script>

<style lang="scss">
.margin-top {
  margin-top: 15px;
}
.font-14 {
  font-size: 14px;
}
</style>

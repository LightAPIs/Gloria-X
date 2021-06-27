<template>
  <div id="settings-router">
    <el-divider content-position="left">
      {{ i18n('settingsAppearance') }}
    </el-divider>
    <gloria-settings-appearance></gloria-settings-appearance>
    <el-divider content-position="left">
      {{ i18n('settingsTask') }}
    </el-divider>
    <gloria-settings-task></gloria-settings-task>
    <el-divider content-position="left">
      {{ i18n('settingsNotification') }}
    </el-divider>
    <gloria-settings-notification></gloria-settings-notification>
    <el-divider content-position="left">
      {{ i18n('settingsInternal') }}
    </el-divider>
    <gloria-settings-internal></gloria-settings-internal>
    <el-divider content-position="left">
      {{ i18n('settingsTasksFile') }}
    </el-divider>
    <gloria-settings-file
      :secret-key="secretKey"
      :data="tasks"
      file-name="tasks"
      key-name="name"
      @merge-data="mergeData"
    ></gloria-settings-file>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapMutations, mapState } from 'vuex';
import GloriaSettingsAppearance from '@/components/GloriaSettingsAppearance.vue';
import GloriaSettingsTask from '@/components/GloriaSettingsTask.vue';
import GloriaSettingsNotification from '@/components/GloriaSettingsNotification.vue';
import GloriaSettingsInternal from '@/components/GloriaSettingsInternal.vue';
import GloriaSettingsFile from '@/components/GloriaSettingsFile.vue';

export default defineComponent({
  name: 'RouterSettings',
  components: {
    GloriaSettingsAppearance,
    GloriaSettingsTask,
    GloriaSettingsNotification,
    GloriaSettingsInternal,
    GloriaSettingsFile,
  },
  setup() {
    const secretKey = '048e0efc-da28-4322-a93c-37fa69e84df8';
    return {
      secretKey,
    };
  },
  computed: {
    ...mapState(['tasks']),
  },
  methods: {
    ...mapMutations(['mergeTasks']),
    mergeData(selectData: unknown[]) {
      this.mergeTasks(selectData);
    },
  },
});
</script>

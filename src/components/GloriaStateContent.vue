<template>
  <div class="gloria-state-content">
    <el-row>
      <el-col :span="8" class="padding-col">
        <div class="notifications-state">
          <label class="input-label">
            {{ i18n('stateNotifications') }}
          </label>
          <v-ace-editor
            :value="JSON.stringify(notifications, null, 2)"
            lang="json"
            :theme="
              configs.appearanceInterface === 'dark' || (configs.appearanceInterface !== 'light' && matches) ? 'terminal' : 'sqlserver'
            "
            :placeholder="i18n('stateNotificationsPlaceholder')"
            wrap
            readonly
            :print-margin="false"
            :options="{ tabSize: 2 }"
            style="height: 650px; font-size: 15px; border: 1px solid #a08181"
          />
        </div>
      </el-col>
      <el-col :span="8" class="padding-col">
        <div class="tasks-state">
          <label class="input-label">
            {{ i18n('stateTasks') }}
          </label>
          <v-ace-editor
            :value="JSON.stringify(tasks, null, 2)"
            lang="json"
            :theme="
              configs.appearanceInterface === 'dark' || (configs.appearanceInterface !== 'light' && matches) ? 'terminal' : 'sqlserver'
            "
            :placeholder="i18n('stateTasksPlaceholder')"
            wrap
            readonly
            :print-margin="false"
            :options="{ tabSize: 2 }"
            style="height: 650px; font-size: 15px; border: 1px solid #a08181"
          />
        </div>
      </el-col>
      <el-col :span="8" class="padding-col">
        <div class="stages-state">
          <label class="input-label">
            {{ i18n('stateStages') }}
          </label>
          <v-ace-editor
            :value="JSON.stringify(stages, null, 2)"
            lang="json"
            :theme="
              configs.appearanceInterface === 'dark' || (configs.appearanceInterface !== 'light' && matches) ? 'terminal' : 'sqlserver'
            "
            :placeholder="i18n('stateStagesPlaceholder')"
            wrap
            readonly
            :print-margin="false"
            :options="{ tabSize: 2 }"
            style="height: 650px; font-size: 15px; border: 1px solid #a08181"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import { VAceEditor } from 'vue3-ace-editor';
import ace from 'ace-builds';
ace.config.setModuleUrl('ace/mode/json', 'ace-editor/mode-json.js');
ace.config.setModuleUrl('ace/theme/sqlserver', 'ace-editor/theme-sqlserver.js');
ace.config.setModuleUrl('ace/theme/terminal', 'ace-editor/theme-terminal.js');

export default defineComponent({
  name: 'GloriaStateContent',
  components: {
    VAceEditor,
  },
  setup() {
    const matches = matchMedia('(prefers-color-scheme: dark)').matches;
    return {
      matches,
    };
  },
  computed: {
    ...mapState(['tasks', 'notifications', 'stages', 'configs']),
  },
});
</script>

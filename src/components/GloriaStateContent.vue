<template>
  <div class="gloria-state-content">
    <el-row>
      <el-col :span="8" class="padding-col">
        <div class="notifications-state">
          <label class="input-label">
            {{ i18n('stateNotifications') }}
          </label>
          <v-ace-editor
            :value="notificationsView"
            lang="json"
            theme="sqlserver"
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
            :value="tasksView"
            lang="json"
            theme="sqlserver"
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
            :value="stagesView"
            lang="json"
            theme="sqlserver"
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

export default defineComponent({
  name: 'GloriaStateContent',
  components: {
    VAceEditor,
  },
  props: {
    watching: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    ...mapState(['tasks', 'notifications', 'stages']),
    tasksView() {
      if (this.watching) {
        return JSON.stringify(this.tasks, null, 2);
      }
      return '';
    },
    notificationsView() {
      if (this.watching) {
        return JSON.stringify(this.notifications, null, 2);
      }
      return '';
    },
    stagesView() {
      if (this.watching) {
        return JSON.stringify(this.stages, null, 2);
      }
      return '';
    },
  },
});
</script>

<style lang="scss">
.padding-col {
  padding: 0px 10px;
}
.input-label {
  font-size: 14px;
  margin: 0px 5px;
}
</style>

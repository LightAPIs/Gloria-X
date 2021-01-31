<template>
  <div class="gloria-state-content">
    <el-row>
      <el-col :span="8" class="padding-col">
        <div class="notifications-state">
          <label for="state-notifications-view" class="input-label">
            {{ i18n('stateNotifications') }}
          </label>
          <el-input
            :value="notificationsView"
            id="state-notifications-view"
            type="textarea"
            :rows="30"
            :placeholder="i18n('stateNotificationsPlaceholder')"
            readonly
          ></el-input>
        </div>
      </el-col>
      <el-col :span="8" class="padding-col">
        <div class="tasks-state">
          <label for="satae-tasks-view" class="input-label">
            {{ i18n('stateTasks') }}
          </label>
          <el-input
            :value="tasksView"
            id="satae-tasks-view"
            type="textarea"
            :rows="30"
            :placeholder="i18n('stateTasksPlaceholder')"
            readonly
          ></el-input>
        </div>
      </el-col>
      <el-col :span="8" class="padding-col">
        <div class="stages-state">
          <label for="state-stages-view" class="input-label">
            {{ i18n('stateStages') }}
          </label>
          <el-input
            :value="stagesView"
            id="state-stages-view"
            type="textarea"
            :rows="30"
            :placeholder="i18n('stateStagesPlaceholder')"
            readonly
          ></el-input>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';

export default Vue.extend({
  name: 'gloria-state-content',
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
        return JSON.stringify(this.tasks, null, 4);
      }
      return '';
    },
    notificationsView() {
      if (this.watching) {
        return JSON.stringify(this.notifications, null, 4);
      }
      return '';
    },
    stagesView() {
      if (this.watching) {
        return JSON.stringify(this.stages, null, 4);
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

<template>
  <div>
    <div>
      <el-switch
        :value="configs.taskAutoCheckUpdate"
        :active-text="i18n('settingsTaskAutoCheckUpdate')"
        @change="onChange('taskAutoCheckUpdate', $event)"
      ></el-switch>
    </div>
    <div class="margin-top">
      <el-switch
        :value="configs.taskOnTimeMode"
        :active-text="i18n('settingsTaskOnTimeMode', i18n('popupTaskOnTimeModeText'))"
        @change="onChange('taskOnTimeMode', $event)"
      ></el-switch>
    </div>
    <div v-if="isChrome" class="margin-top">
      <el-switch
        :value="configs.taskNeedInteraction"
        :active-text="i18n('settingsTaskNeedInteraction', i18n('popupTaskNeedInteractionText'))"
        @change="onChange('taskNeedInteraction', $event)"
      ></el-switch>
    </div>
    <div class="margin-top">
      <el-switch :value="configs.taskOnTop" :active-text="i18n('settingsTaskOnTop')" @change="onChange('taskOnTop', $event)"></el-switch>
    </div>
    <div class="margin-top">
      <el-switch
        :value="configs.taskShowSearchInput"
        :active-text="i18n('settingsTaskShowSearchInput')"
        @change="onChange('taskShowSearchInput', $event)"
      ></el-switch>
    </div>
    <div class="margin-top">
      <el-switch
        :value="configs.taskAutoRemoveStage"
        :active-text="i18n('settingsTaskAutoRemoveStage')"
        @change="onChange('taskAutoRemoveStage', $event)"
      ></el-switch>
    </div>
    <div class="margin-top">
      <span class="font-14">
        {{ i18n('settingsTaskTriggerInterval') }}
      </span>
      <el-input-number
        :value="configs.taskTriggerInterval"
        :min="1"
        :max="60 * 24 * 7"
        controls-position="right"
        step-strictly
        @change="onChange('taskTriggerInterval', $event)"
      ></el-input-number>
      <span class="options-trigger-time font-14">
        {{ triggerTime }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapMutations, mapState } from 'vuex';
export default Vue.extend({
  name: 'gloria-settings-task',
  data() {
    return {
      isChrome: process.env.VUE_APP_TITLE === 'chrome',
    };
  },
  computed: {
    ...mapState(['configs']),
    triggerTime() {
      const { taskTriggerInterval } = this.configs;
      let display = '';
      if (taskTriggerInterval) {
        display = this.intervalTime(taskTriggerInterval);
      }
      return display;
    },
  },
  methods: {
    ...mapMutations(['updateConfigs']),
    onChange(name: string, value: boolean | number) {
      let sta = true;
      if (name === 'taskTriggerInterval' && !value) {
        sta = false;
      }
      sta &&
        this.updateConfigs({
          name,
          value,
        });
    },
  },
});
</script>

<style lang="scss">
.options-trigger-time {
  margin-left: 25px;
}
</style>

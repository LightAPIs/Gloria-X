<template>
  <div class="gloria-settings-task">
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
      <el-input-number :model-value="day" :min="0" :max="6" step-strictly @change="onTriggerInterval('day', $event)"></el-input-number>
      {{ ' ' + i18n('dayText') }}
      <el-input-number
        class="time-input-number"
        :model-value="hour"
        :min="0"
        :max="23"
        step-strictly
        @change="onTriggerInterval('hour', $event)"
      ></el-input-number>
      {{ ' ' + i18n('hourText') }}
      <el-input-number
        class="time-input-number"
        :model-value="minute"
        :min="0"
        :max="59"
        step-strictly
        @change="onTriggerInterval('minute', $event)"
      ></el-input-number>
      {{ ' ' + i18n('minuteText') }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapMutations, mapState } from 'vuex';
export default defineComponent({
  name: 'gloria-settings-task',
  data() {
    return {
      day: 0,
      hour: 0,
      minute: 0,
      isChrome: process.env.VUE_APP_TITLE === 'chrome',
    };
  },
  computed: {
    ...mapState(['configs']),
  },
  methods: {
    ...mapMutations(['updateConfigs']),
    onChange(name: string, value: boolean | number) {
      this.updateConfigs({
        name,
        value,
      });
    },
    onTriggerInterval(type: string, value: number) {
      switch (type) {
        case 'day':
          this.day = value;
          break;
        case 'hour':
          this.hour = value;
          break;
        case 'minute':
          this.minute = value;
          break;
      }

      const triggerTime = this.day + this.hour + this.minute > 0 ? this.day * 24 * 60 + this.hour * 60 + this.minute : 1;
      this.updateConfigs({
        name: 'taskTriggerInterval',
        value: triggerTime,
      });
    },
  },
  created() {
    const { taskTriggerInterval } = this.configs;
    this.day = this.days(taskTriggerInterval);
    this.hour = this.hours(taskTriggerInterval);
    this.minute = this.minutes(taskTriggerInterval);
  },
});
</script>

<style lang="scss">
.gloria-settings-task {
  .time-input-number {
    margin-left: 20px;
  }
  .el-input-number {
    width: 140px;
  }
}
</style>

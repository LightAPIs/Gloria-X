<template>
  <el-dialog
    :title="type === 'edit' ? i18n('popupTaskDialogTitle') : i18n('popupTaskDialogCreateTitle')"
    :model-value="dialogVisible"
    fullscreen
    center
    @close="$emit('close-dialog')"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item :label="i18n('popupTaskFormNameLabel')" prop="name">
        <el-input v-model="form.name" clearable :placeholder="i18n('popupTaskFormNamePlaceholder')" prefix-icon="el-icon-view"></el-input>
      </el-form-item>
      <el-form-item :label="i18n('popupTaskFormCodeLabel')" prop="code">
        <el-input
          ref="taskInput"
          v-model="form.code"
          :placeholder="i18n('popupTaskFormCodePlaceholder')"
          type="textarea"
          :rows="8"
          @keydown.tab="textareaTab($refs.taskInput, $event)"
        ></el-input>
      </el-form-item>
      <el-form-item :label="i18n('popupTaskFormTriggerIntervalLabel')">
        <el-input-number v-model="form.day" :min="0" :max="6" step-strictly></el-input-number>
        {{ ' ' + i18n('dayText') }}
        <el-input-number v-model="form.hour" class="time-input-number" :min="0" :max="23" step-strictly></el-input-number>
        {{ ' ' + i18n('hourText') }}
        <el-input-number v-model="form.minute" class="time-input-number" :min="0" :max="59" step-strictly></el-input-number>
        {{ ' ' + i18n('minuteText') }}
      </el-form-item>
      <el-form-item :label="i18n('popupTaskFormOptionalLabel')">
        <el-checkbox v-model="form.onTimeMode">
          {{ i18n('popupTaskOnTimeModeText') }}
        </el-checkbox>
        <br />
        <el-checkbox v-if="isChrome" v-model="form.needInteraction">
          {{ i18n('popupTaskNeedInteractionText') }}
        </el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">
          {{ type === 'edit' ? i18n('popupTaskFormSubmit') : i18n('popupTaskFormCreate') }}
        </el-button>
        <el-button @click="$emit('close-dialog')">
          {{ i18n('cancelText') }}
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ElForm } from 'element-plus';
import { mapMutations, mapState } from 'vuex';

export default defineComponent({
  name: 'GloraiTaskEdit',
  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    code: {
      type: String,
      default: '',
    },
    triggerInterval: {
      type: Number,
      default: 5,
    },
    onTimeMode: {
      type: Boolean,
      default: false,
    },
    needInteraction: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close-dialog'],
  data() {
    return {
      form: {
        id: '',
        name: '',
        code: '',
        day: 0,
        hour: 0,
        minute: 5,
        onTimeMode: false,
        needInteraction: false,
      },
      rules: {
        name: [
          {
            required: true,
            message: this.i18n('popupTaskRulesName'),
            trigger: 'change',
          },
        ],
        code: [
          {
            required: true,
            message: this.i18n('popupTaskRulesCode'),
            trigger: 'change',
          },
        ],
      },
      isChrome: process.env.VUE_APP_TITLE === 'chrome',
    };
  },
  computed: {
    ...mapState(['configs']),
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        const { type, id, name, code, triggerInterval, onTimeMode, needInteraction } = this;
        const day = this.days(triggerInterval);
        const hour = this.hours(triggerInterval);
        const minute = this.minutes(triggerInterval);
        if (type === 'edit') {
          Object.assign(this.form, {
            id,
            name,
            code,
            day,
            hour,
            minute,
            onTimeMode,
            needInteraction,
          });
        } else {
          this.onReset();
          const { taskOnTimeMode, taskNeedInteraction, taskTriggerInterval } = this.configs;
          Object.assign(this.form, {
            id: this.uuid(),
            name: '',
            code: '',
            day: this.days(taskTriggerInterval),
            hour: this.hours(taskTriggerInterval),
            minute: this.minutes(taskTriggerInterval),
            onTimeMode: taskOnTimeMode,
            needInteraction: taskNeedInteraction,
          });
        }
      }
    },
  },
  methods: {
    ...mapMutations(['updateTaskBasic', 'createTaskBasic']),
    onSubmit() {
      (this.$refs.form as InstanceType<typeof ElForm>).validate((valid?: boolean) => {
        if (valid) {
          const {
            form: { id, name, code, day, hour, minute, onTimeMode, needInteraction },
            type,
          } = this;
          const triggerTime = day + hour + minute > 0 ? day * 24 * 60 + hour * 60 + minute : 1;
          if (type === 'edit') {
            this.updateTaskBasic({
              id,
              name,
              code,
              triggerInterval: triggerTime,
              onTimeMode,
              needInteraction,
            });
          } else {
            this.createTaskBasic({
              id,
              name,
              code,
              triggerInterval: triggerTime,
              onTimeMode,
              needInteraction,
            });
          }

          this.$emit('close-dialog');
        } else {
          return false;
        }
      });
    },
    onReset() {
      this.$refs.form && (this.$refs.form as InstanceType<typeof ElForm>).resetFields();
    },
  },
});
</script>

<style>
.time-input-number {
  margin-left: 20px;
}
.el-input-number {
  width: 140px;
}
</style>

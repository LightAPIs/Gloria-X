<template>
  <el-dialog
    :title="editorType === 'edit' ? i18n('popupTaskDialogTitle') : i18n('popupTaskDialogCreateTitle')"
    :model-value="dialogVisible"
    :fullscreen="editorType !== 'testAdd'"
    center
    @close="$emit('close-dialog')"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item :label="i18n('popupTaskFormNameLabel')" prop="name">
        <el-input v-model="form.name" clearable :placeholder="i18n('popupTaskFormNamePlaceholder')" prefix-icon="el-icon-view"></el-input>
      </el-form-item>
      <el-form-item :label="i18n('popupTaskFormCodeLabel')" prop="code">
        <v-ace-editor
          v-model:value="form.code"
          lang="javascript"
          :theme="configs.appearanceInterface === 'dark' || (configs.appearanceInterface !== 'light' && matches) ? 'terminal' : 'sqlserver'"
          :placeholder="i18n('popupTaskFormCodePlaceholder')"
          wrap
          :print-margin="false"
          :options="{ tabSize: 2 }"
          style="height: 165px; font-size: 15px; border: 1px solid #b32929"
        />
      </el-form-item>
      <el-form-item :label="i18n('popupTaskFormType')">
        <el-radio-group v-model="form.type" size="mini" @change="onRadioChange">
          <el-radio-button label="timed">
            {{ i18n('popupTaskFormTimed') }}
          </el-radio-button>
          <el-radio-button label="daily">
            {{ i18n('popupTaskFormDaily') }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="form.type === 'daily'" :label="i18n('popupTaskEarliestTime')">
        <el-time-picker
          v-model="form.eTime"
          class="gloria-time-picker"
          :popper-class="'gloria-time-picker-popper ' + configs.appearanceInterface"
          format="HH:mm"
          size="medium"
          :clearable="false"
        ></el-time-picker>
      </el-form-item>
      <el-form-item v-show="form.type === 'timed'" :label="i18n('popupTaskFormTriggerIntervalLabel')">
        <el-input-number v-model="form.day" :min="0" :max="6" size="medium" step-strictly></el-input-number>
        {{ ' ' + i18n('dayText') }}
        <el-input-number v-model="form.hour" class="time-input-number" :min="0" :max="23" size="medium" step-strictly></el-input-number>
        {{ ' ' + i18n('hourText') }}
        <el-input-number v-model="form.minute" class="time-input-number" :min="0" :max="59" size="medium" step-strictly></el-input-number>
        {{ ' ' + i18n('minuteText') }}
      </el-form-item>
      <el-form-item :label="i18n('popupTaskFormOptionalLabel')">
        <el-checkbox v-if="isChrome" v-model="form.needInteraction" :title="i18n('popupTaskNeedInteractionText')">
          {{ i18n('popupTaskNeedInteractionTag') }}
        </el-checkbox>
        <el-checkbox v-show="form.type === 'timed'" v-model="form.onTimeMode" :title="i18n('popupTaskOnTimeModeText')">
          {{ i18n('popupTaskOnTimeModeTag') }}
        </el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="onSubmit">
          {{ editorType === 'edit' ? i18n('popupTaskFormSubmit') : i18n('popupTaskFormCreate') }}
        </el-button>
        <el-button size="mini" @click="$emit('close-dialog')">
          {{ i18n('cancelText') }}
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ElForm, ElMessage } from 'element-plus';
import { mapMutations, mapState } from 'vuex';
import { VAceEditor } from 'vue3-ace-editor';
import ace from 'ace-builds';
ace.config.setModuleUrl('ace/mode/javascript', 'ace-editor/mode-javascript.js');
ace.config.setModuleUrl('ace/theme/sqlserver', 'ace-editor/theme-sqlserver.js');
ace.config.setModuleUrl('ace/theme/terminal', 'ace-editor/theme-terminal.js');

export default defineComponent({
  name: 'GloriaTaskEdit',
  components: {
    VAceEditor,
  },
  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
    },
    editorType: {
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
    type: {
      type: String,
      default: 'timed',
    },
    triggerInterval: {
      type: Number,
      default: 5,
    },
    earliestTime: {
      type: String,
      default: '',
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
  setup() {
    const isChrome = process.env.VUE_APP_TITLE === 'chrome';
    const matches = matchMedia('(prefers-color-scheme: dark)').matches;
    return {
      isChrome,
      matches,
    };
  },
  data() {
    return {
      form: {
        id: '',
        name: '',
        code: '',
        type: 'timed',
        day: 0,
        hour: 0,
        minute: 5,
        eTime: '',
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
    };
  },
  computed: {
    ...mapState(['configs']),
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        const { editorType, id, name, code, type, triggerInterval, earliestTime, onTimeMode, needInteraction } = this;
        const day = this.days(triggerInterval);
        const hour = this.hours(triggerInterval);
        const minute = this.minutes(triggerInterval);
        const eTime = this.hm2date(earliestTime);
        if (editorType === 'edit') {
          Object.assign(this.form, {
            id,
            name,
            code,
            type,
            day,
            hour,
            minute,
            eTime,
            onTimeMode,
            needInteraction,
          });
        } else {
          this.onReset();
          const { taskOnTimeMode, taskNeedInteraction, taskTriggerInterval, taskEarliestTime } = this.configs;
          Object.assign(this.form, {
            id: this.uuid(),
            name: '',
            code: editorType === 'testAdd' ? code : '',
            type: 'timed',
            day: this.days(taskTriggerInterval),
            hour: this.hours(taskTriggerInterval),
            minute: this.minutes(taskTriggerInterval),
            eTime: this.hm2date(taskEarliestTime),
            onTimeMode: taskOnTimeMode,
            needInteraction: taskNeedInteraction,
          });
        }
      }
    },
  },
  methods: {
    ...mapMutations(['updateTaskBasic', 'createTaskBasic']),
    onRadioChange(val: string) {
      if (val === 'daily') {
        this.form.onTimeMode = true;
        this.form.day = 1;
        this.form.hour = 0;
        this.form.minute = 0;
      }
    },
    onSubmit() {
      (this.$refs.form as InstanceType<typeof ElForm>).validate((valid?: boolean) => {
        if (valid) {
          const {
            form: { id, name, code, type, day, hour, minute, eTime, onTimeMode, needInteraction },
            editorType,
          } = this;
          const triggerTime = day + hour + minute > 0 ? day * 24 * 60 + hour * 60 + minute : 1;
          const earliestTime = this.date2hm(eTime);
          if (editorType === 'edit') {
            this.updateTaskBasic({
              id,
              name,
              code,
              type,
              triggerInterval: triggerTime,
              earliestTime,
              onTimeMode,
              needInteraction,
            });
          } else {
            this.createTaskBasic({
              id,
              name,
              code,
              type,
              triggerInterval: triggerTime,
              earliestTime,
              onTimeMode,
              needInteraction,
            });
          }

          this.$emit('close-dialog');

          editorType === 'testAdd' && ElMessage.success(this.i18n('debugTestCreateTip'));
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

.el-dialog--center .el-dialog__body {
  padding-bottom: 5px;
}
</style>

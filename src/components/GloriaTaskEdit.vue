<template>
  <el-dialog
    :title="type === 'edit' ? i18n('popupTaskDialogTitle') : i18n('popupTaskDialogCreateTitle')"
    :visible="dialogVisible"
    fullscreen
    center
    @close="$emit('close-dialog')"
  >
    <el-form :model="form" :rules="rules" label-width="120px" ref="form">
      <el-form-item :label="i18n('popupTaskFormNameLabel')" prop="name">
        <el-input v-model="form.name" clearable :placeholder="i18n('popupTaskFormNamePlaceholder')" prefix-icon="el-icon-view"></el-input>
      </el-form-item>
      <el-form-item :label="i18n('popupTaskFormCodeLabel')" prop="code">
        <el-input
          v-model="form.code"
          :placeholder="i18n('popupTaskFormCodePlaceholder')"
          type="textarea"
          :rows="8"
          @keydown.native.tab="textareaTab($refs.taskInput, $event)"
          ref="taskInput"
        ></el-input>
      </el-form-item>
      <el-form-item :label="i18n('popupTaskFormTriggerIntervalLabel')" prop="triggerInterval">
        <el-input-number v-model="form.triggerInterval" :min="1" :max="60 * 24 * 7" step-strictly></el-input-number>
        <span class="form-trigger-time">
          {{ triggerTime }}
        </span>
      </el-form-item>
      <el-form-item :label="i18n('popupTaskFormOptionalLabel')">
        <el-checkbox v-model="form.onTimeMode">
          {{ i18n('popupTaskOnTimeModeText') }}
        </el-checkbox>
        <br />
        <el-checkbox v-model="form.needInteraction">
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
import Vue from 'vue';
import { Form as ElForm } from 'element-ui';
import { mapMutations, mapState } from 'vuex';

export default Vue.extend({
  name: 'glorai-task-edit',
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
  data() {
    return {
      form: {
        id: '',
        name: '',
        code: '',
        triggerInterval: 5,
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
        triggerInterval: [
          {
            required: true,
            message: this.i18n('popupTaskRulesTriggerInterval'),
            trigger: 'change',
          },
          {
            type: 'integer',
            message: this.i18n('popupTaskRulesInteger'),
            trigger: 'change',
          },
        ],
      },
    };
  },
  computed: {
    ...mapState(['configs']),
    triggerTime() {
      const { triggerInterval } = this.form;
      let display = '';
      if (triggerInterval) {
        display = this.intervalTime(triggerInterval);
      }
      return display;
    },
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        const { type, id, name, code, triggerInterval, onTimeMode, needInteraction } = this;
        if (type === 'edit') {
          Object.assign(this.form, {
            id,
            name,
            code,
            triggerInterval,
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
            triggerInterval: taskTriggerInterval,
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
      (this.$refs.form as ElForm).validate((valid: boolean) => {
        if (valid) {
          const { form, type } = this;
          if (type === 'edit') {
            this.updateTaskBasic(form);
          } else {
            this.createTaskBasic(form);
          }

          this.$emit('close-dialog');
        } else {
          return false;
        }
      });
    },
    onReset() {
      this.$refs.form && (this.$refs.form as ElForm).resetFields();
    },
  },
});
</script>

<style>
.form-trigger-time {
  margin-left: 25px;
}
</style>

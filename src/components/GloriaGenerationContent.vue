<template>
  <div class="gloria-generation-content">
    <div v-show="progress === 'selection'">
      <el-row>
        <el-col :span="12" class="padding-col">
          <div class="left-content">
            <div class="left-header">{{ i18n('generationSelected') }}</div>
            <div v-for="(item, index) in elements" :key="index">
              <el-input v-model="item.value" class="path-input">
                <template slot="prepend">
                  {{ i18n('generationElement', [(index + 1).toString()]) }}
                </template>
              </el-input>
            </div>
          </div>
        </el-col>
        <el-col :span="12" class="padding-col">
          <div class="right-content">
            <div>
              <el-form :model="selectionForm" label-width="120px">
                <el-form-item label="title" prop="title">
                  <el-input v-model="selectionForm.title" clearable :placeholder="i18n('generationSelectionTitle')"></el-input>
                </el-form-item>
                <el-form-item label="iconUrl" prop="iconUrl">
                  <el-input v-model="selectionForm.iconUrl" clearable :placeholder="i18n('generationSelectionIconUrl')"></el-input>
                </el-form-item>
                <el-form-item label="url" prop="url">
                  <el-input v-model="selectionForm.url" clearable :placeholder="i18n('generationSelectionUrl')"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="small" @click="onSelectionSubmit" :disabled="elements.length === 0">
                    {{ i18n('generationSelectionSubmit') }}
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div v-show="progress === 'test'">
      <el-row>
        <el-col :span="12" class="padding-col">
          <div class="left-content">
            <div class="left-header">{{ i18n('generationCode') }}</div>
            <el-input
              v-model="code"
              id="debug-code-input"
              type="textarea"
              :rows="9"
              @keydown.native.tab="textareaTab($refs.codeInput, $event)"
              @change="onCodeChange"
              ref="codeInput"
            ></el-input>
          </div>
        </el-col>
        <el-col :span="12" class="padding-col">
          <div class="right-content">
            <el-button type="primary" size="small" @click="onTestCode">
              {{ i18n('generationTest') }}
            </el-button>
            <el-button type="warning" size="small" @click="onBackSelection">
              {{ i18n('generationLast') }}
            </el-button>
            <el-button type="success" size="small" @click="onNext" :disabled="!next">
              {{ i18n('generationNext') }}
            </el-button>
            <div class="result">
              <label for="debug-code-result" class="input-label">
                {{ i18n('debugResult') }}
              </label>
              <el-input
                :value="result"
                id="debug-code-result"
                type="textarea"
                :rows="8"
                :placeholder="i18n('debugResultPlaceholder')"
                readonly
              ></el-input>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div v-show="progress === 'task'">
      <el-row>
        <el-col :span="12" class="padding-col">
          <div class="left-content">
            <div class="left-header">{{ i18n('generationCode') }}</div>
            <el-input
              :value="code"
              id="task-code-input"
              type="textarea"
              :rows="9"
              @keydown.native.tab="textareaTab($refs.codeInput, $event)"
              disabled
              readonly
            ></el-input>
          </div>
        </el-col>
        <el-col :span="12" class="padding-col">
          <div class="right-content">
            <el-form :model="taskForm" :rules="taskRules" label-width="120px" ref="taskForm">
              <el-form-item>
                <el-button type="primary" size="small" @click="onTaskSubmit">
                  {{ i18n('generationTaskSubmit') }}
                </el-button>
                <el-button type="warning" size="small" @click="onBackSelection">
                  {{ i18n('generationLast') }}
                </el-button>
              </el-form-item>
              <el-form-item :label="i18n('popupTaskFormNameLabel')" prop="name"
                ><el-input
                  v-model="taskForm.name"
                  clearable
                  :placeholder="i18n('popupTaskFormNamePlaceholder')"
                  prefix-icon="el-icon-view"
                ></el-input
              ></el-form-item>
              <el-form-item :label="i18n('popupTaskFormTriggerIntervalLabel')" prop="triggerInterval">
                <el-input-number v-model="taskForm.triggerInterval" :min="1" :max="60 * 24 * 7" step-strictly></el-input-number>
                <span class="form-trigger-time">
                  {{ triggerTime }}
                </span>
              </el-form-item>
              <el-form-item :label="i18n('popupTaskFormOptionalLabel')">
                <el-checkbox v-model="taskForm.onTimeMode">
                  {{ i18n('popupTaskOnTimeModeText') }}
                </el-checkbox>
                <br />
                <el-checkbox v-model="taskForm.needInteraction">
                  {{ i18n('popupTaskNeedInteractionText') }}
                </el-checkbox>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Form as ElForm } from 'element-ui';
import { mapMutations, mapState } from 'vuex';
import { v4 as uuid } from 'uuid';

export default Vue.extend({
  name: 'gloria-generation-content',
  data() {
    return {
      pageUrl: '',
      progress: 'selection',
      elements: [] as { value: string }[],
      code: '',
      result: '',
      next: false,
      selectionForm: {
        title: '',
        iconUrl: '',
        url: '',
      },
      taskForm: {
        name: 'Task',
        triggerInterval: 5,
        onTimeMode: false,
        needInteraction: false,
      },
      taskRules: {
        name: [
          {
            required: true,
            message: this.i18n('popupTaskRulesName'),
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
      const { triggerInterval } = this.taskForm;
      let display = '';
      if (triggerInterval) {
        display = this.intervalTime(triggerInterval);
      }
      return display;
    },
  },
  methods: {
    ...mapMutations(['createTaskBasic']),
    generationCode() {
      const {
        pageUrl,
        selectionForm: { title, iconUrl, url },
        elements,
      } = this;
      let msg = '',
        message = 'const message = ';
      elements.forEach((el, index) => {
        msg += `\n  const msg${index.toString()} = $("${el.value}").text();`;
        message += message.includes('msg') ? ` + " " + msg${index.toString()}` : `msg${index.toString()}`;
      });

      const templateCode = `(async () => {
  const { cheerio } = await importScripts('gloria-utils');
  const html = await fetch("${pageUrl}").then(res => res.text());
  const $ = cheerio.load(html);
  const title = "${title ? title : ''}";${msg}
  ${message};
  const iconUrl = "${iconUrl ? iconUrl : ''}";
  const url = "${url ? url : ''}";
  return {
    title,
    message,
    iconUrl,
    url,
  }
})().then(commit);`;
      return templateCode;
    },
    onSelectionSubmit() {
      if (this.elements.length > 0) {
        this.disableSelection();
        this.code = this.generationCode();
        this.progress = 'test';
        this.next = false;
      } else {
        return false;
      }
    },
    onCodeChange() {
      if (this.next) {
        this.next = false;
      }
    },
    onTestCode() {
      this.result = '';
      this.next = false;
      if (this.code.trim()) {
        chrome.runtime.sendMessage(
          {
            type: 'testCode',
            data: this.code.trim(),
          },
          res => {
            if (res) {
              const { result, err } = res;
              if (err) {
                this.result = err.message + '\n\n' + this.i18n('generationError');
              } else {
                this.result = JSON.stringify(result, null, 4);
                this.next = true;
              }
            }
          }
        );
      }
    },
    onBackSelection() {
      if (this.progress === 'test') {
        this.progress = 'selection';
        this.enableSelection();
      } else {
        this.progress = 'test';
      }
    },
    onNext() {
      this.progress = 'task';
      const { taskOnTimeMode, taskNeedInteraction, taskTriggerInterval } = this.configs;
      Object.assign(this.taskForm, {
        triggerInterval: taskTriggerInterval,
        onTimeMode: taskOnTimeMode,
        needInteraction: taskNeedInteraction,
      });
    },
    onTaskSubmit() {
      (this.$refs.taskForm as ElForm).validate((valid: boolean) => {
        if (valid) {
          const {
            code,
            taskForm: { name, triggerInterval, onTimeMode, needInteraction },
          } = this;
          this.createTaskBasic({
            id: uuid(),
            name,
            code,
            triggerInterval,
            onTimeMode,
            needInteraction,
          });

          this.taskCompletion();
        } else {
          return false;
        }
      });
    },
    disableSelection() {
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        tabs => {
          if (!chrome.runtime.lastError && tabs && tabs[0] && tabs[0].id) {
            chrome.tabs.sendMessage(tabs[0].id, {
              type: 'directive',
              data: 'disableSelection',
            });
          }
        }
      );
    },
    enableSelection() {
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        tabs => {
          if (!chrome.runtime.lastError && tabs && tabs[0] && tabs[0].id) {
            chrome.tabs.sendMessage(tabs[0].id, {
              type: 'directive',
              data: 'enableSelection',
            });
          }
        }
      );
    },
    getPageUrl() {
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        tabs => {
          if (!chrome.runtime.lastError && tabs && tabs[0] && tabs[0].id) {
            chrome.tabs.sendMessage(
              tabs[0].id,
              {
                type: 'getPageUrl',
                data: '',
              },
              res => {
                if (res) {
                  this.pageUrl = res;
                  if (!this.selectionForm.url) {
                    this.selectionForm.url = this.pageUrl;
                  }
                }
              }
            );
          }
        }
      );
    },
    taskCompletion() {
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        tabs => {
          if (!chrome.runtime.lastError && tabs && tabs[0] && tabs[0].id) {
            chrome.tabs.sendMessage(tabs[0].id, {
              type: 'destroy',
              data: '',
            });
          }
        }
      );
    },
  },
  created() {
    this.getPageUrl();
    chrome.runtime.onMessage.addListener(message => {
      if (message.type === 'path') {
        this.elements = [];
        message.data.forEach((value: string) => {
          this.elements.push({
            value,
          });
        });
      }
    });
  },
});
</script>

<style lang="scss">
.gloria-generation-content {
  .padding-col {
    padding: 0px 10px;
  }
  .left-content {
    .left-header {
      margin-bottom: 10px;
    }
    .path-input {
      margin-bottom: 10px;
      width: 98%;
    }
  }
  .right-content {
    .form-trigger-time {
      margin-left: 25px;
    }
  }
  .result {
    margin-top: 10px;
  }
}
</style>

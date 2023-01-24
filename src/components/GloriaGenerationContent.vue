<template>
  <div class="gloria-generation-content">
    <div v-show="progress === 'selection'">
      <el-row>
        <el-col :span="12" class="padding-col">
          <div class="left-content">
            <div class="select-tip">{{ i18n('generationUsage') }}</div>
            <h3 class="left-header">{{ i18n('generationSelected') }}</h3>
            <div v-for="(item, index) in elements" :key="index">
              <el-input v-model="item.value" class="path-input">
                <template #prepend>
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
                  <el-input v-model="selectionForm.title" clearable size="mini" :placeholder="i18n('generationSelectionTitle')"></el-input>
                </el-form-item>
                <el-form-item label="imageUrl" prop="imageUrl">
                  <el-input
                    v-model="selectionForm.imageUrl"
                    clearable
                    size="mini"
                    :placeholder="i18n('generationSelectionImageUrl')"
                  ></el-input>
                </el-form-item>
                <el-form-item label="iconUrl" prop="iconUrl">
                  <el-input
                    v-model="selectionForm.iconUrl"
                    clearable
                    size="mini"
                    :placeholder="i18n('generationSelectionIconUrl')"
                  ></el-input>
                </el-form-item>
                <el-form-item label="url" prop="url">
                  <el-input v-model="selectionForm.url" clearable size="mini" :placeholder="i18n('generationSelectionUrl')"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="small" :disabled="elements.length === 0" @click="onSelectionSubmit">
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
            <v-ace-editor
              v-model:value="code"
              lang="javascript"
              :theme="
                configs.appearanceInterface === 'dark' || (configs.appearanceInterface !== 'light' && matches) ? 'terminal' : 'sqlserver'
              "
              wrap
              :print-margin="false"
              :options="{ tabSize: 2 }"
              style="height: 210px; font-size: 15px; border: 1px solid #b32929"
              @change="onCodeChange"
            />
          </div>
        </el-col>
        <el-col :span="12" class="padding-col">
          <div class="right-content">
            <el-button type="primary" size="small" @click="onTestCode">
              {{ i18n('generationTest') }}
            </el-button>
            <el-button type="warning" size="small" @click="onBack">
              {{ i18n('generationLast') }}
            </el-button>
            <el-button type="success" size="small" :disabled="!next" :title="i18n('generationNextTip')" @click="onNext">
              {{ i18n('generationNext') }}
            </el-button>
            <div class="result">
              <label class="input-label">
                {{ i18n('debugResult') }}
              </label>
              <v-ace-editor
                :value="result"
                lang="json"
                :theme="
                  configs.appearanceInterface === 'dark' || (configs.appearanceInterface !== 'light' && matches) ? 'terminal' : 'sqlserver'
                "
                :placeholder="i18n('debugResultPlaceholder')"
                wrap
                readonly
                :print-margin="false"
                :options="{ tabSize: 2 }"
                style="height: 180px; font-size: 15px; border: 1px solid #a08181"
              />
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div v-show="progress === 'task'">
      <el-row>
        <el-col :span="12" class="padding-col">
          <div class="left-content">
            <div class="left-header">
              <span>
                {{ i18n('generationCode') }}
              </span>
              <span class="gloria-lock-icon">
                <i class="el-icon-lock"></i>
              </span>
            </div>
            <v-ace-editor
              :value="code"
              lang="javascript"
              :theme="
                configs.appearanceInterface === 'dark' || (configs.appearanceInterface !== 'light' && matches) ? 'terminal' : 'sqlserver'
              "
              wrap
              readonly
              :print-margin="false"
              :options="{ tabSize: 2 }"
              style="height: 210px; font-size: 15px; border: 1px solid #a08181"
            />
          </div>
        </el-col>
        <el-col :span="12" class="padding-col">
          <div class="right-content">
            <el-form ref="taskForm" :model="taskForm" :rules="taskRules" label-width="120px">
              <el-form-item>
                <el-button type="primary" size="small" @click="onTaskSubmit">
                  {{ i18n('generationTaskSubmit') }}
                </el-button>
                <el-button type="warning" size="small" @click="onBack">
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
              <el-form-item :label="i18n('popupTaskFormType')">
                <el-radio-group v-model="taskForm.type" size="mini" @change="onRadioChange">
                  <el-radio-button label="timed">
                    {{ i18n('popupTaskFormTimed') }}
                  </el-radio-button>
                  <el-radio-button label="daily">
                    {{ i18n('popupTaskFormDaily') }}
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-show="taskForm.type === 'daily'" :label="i18n('popupTaskEarliestTime')">
                <el-time-picker
                  v-model="taskForm.eTime"
                  class="gloria-time-picker"
                  :popper-class="'gloria-time-picker-popper ' + configs.appearanceInterface"
                  format="HH:mm"
                  size="medium"
                  :clearable="false"
                ></el-time-picker>
              </el-form-item>
              <el-form-item v-show="taskForm.type === 'timed'" :label="i18n('popupTaskFormTriggerIntervalLabel')">
                <el-input-number v-model="taskForm.day" :min="0" :max="6" size="medium" step-strictly></el-input-number>
                {{ ' ' + i18n('dayText') }}
                <el-input-number
                  v-model="taskForm.hour"
                  class="time-input-number"
                  :min="0"
                  :max="23"
                  size="medium"
                  step-strictly
                ></el-input-number>
                {{ ' ' + i18n('hourText') }}
                <el-input-number
                  v-model="taskForm.minute"
                  class="time-input-number"
                  :min="0"
                  :max="59"
                  size="medium"
                  step-strictly
                ></el-input-number>
                {{ ' ' + i18n('minuteText') }}
              </el-form-item>
              <el-form-item :label="i18n('popupTaskFormOptionalLabel')">
                <el-checkbox v-if="isChrome" v-model="taskForm.needInteraction" :title="i18n('popupTaskNeedInteractionText')">
                  {{ i18n('popupTaskNeedInteractionTag') }}
                </el-checkbox>
                <br />
                <el-checkbox v-show="taskForm.type === 'timed'" v-model="taskForm.onTimeMode" :title="i18n('popupTaskOnTimeModeText')">
                  {{ i18n('popupTaskOnTimeModeTag') }}
                </el-checkbox>
                <br />
                <el-checkbox v-model="taskForm.implicit" :title="i18n('popupTaskImplicitText')">
                  {{ i18n('popupTaskImplicitTag') }}
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
import { defineComponent } from 'vue';
import { ElForm } from 'element-plus';
import { mapMutations, mapState } from 'vuex';
import { v4 as uuid } from 'uuid';
import { VAceEditor } from 'vue3-ace-editor';
import ace from 'ace-builds';
ace.config.setModuleUrl('ace/mode/javascript', 'ace-editor/mode-javascript.js');
ace.config.setModuleUrl('ace/mode/json', 'ace-editor/mode-json.js');
ace.config.setModuleUrl('ace/theme/sqlserver', 'ace-editor/theme-sqlserver.js');
ace.config.setModuleUrl('ace/theme/terminal', 'ace-editor/theme-terminal.js');

export default defineComponent({
  name: 'GloriaGenerationContent',
  components: {
    VAceEditor,
  },
  emits: ['active-index'],
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
      pageUrl: '',
      progress: 'selection',
      elements: [] as { value: string }[],
      code: '',
      result: '',
      next: false,
      selectionForm: {
        title: '',
        imageUrl: '',
        iconUrl: '',
        url: '',
      },
      taskForm: {
        name: 'Task',
        type: 'timed',
        day: 0,
        hour: 0,
        minute: 5,
        eTime: '',
        implicit: false,
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
  methods: {
    ...mapMutations(['createTaskBasic']),
    generationCode() {
      const {
        pageUrl,
        selectionForm: { title, imageUrl, iconUrl, url },
        elements,
      } = this;
      let msg = '',
        message = 'const message = ';
      elements.forEach((el, index) => {
        msg += `\n  const msg${index.toString()} = $("${el.value}").first().text();`;
        message += message.includes('msg') ? ` + " " + msg${index.toString()}` : `msg${index.toString()}`;
      });

      const templateCode = `(async () => {
  const { cheerio } = await importScripts('gloria-utils');
  const html = await fetch("${pageUrl}").then(res => res.text());
  const $ = cheerio.load(html);
  const title = "${title ? title : ''}";${msg}
  ${message};
  const imageUrl = "${imageUrl ? imageUrl : ''}";
  const iconUrl = "${iconUrl ? iconUrl : ''}";
  const url = "${url ? url : ''}";
  return {
    title,
    message,
    imageUrl,
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
        this.$emit('active-index', 1);
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
                this.result = JSON.stringify(result, null, 2) || 'null';
                this.next = true;
              }
            }
          }
        );
      }
    },
    onBack() {
      if (this.progress === 'test') {
        this.progress = 'selection';
        this.result = '';
        this.$emit('active-index', 0);
        this.enableSelection();
      } else {
        this.progress = 'test';
        this.$emit('active-index', 1);
      }
    },
    onNext() {
      this.progress = 'task';
      this.$emit('active-index', 2);
      const { taskImplicit, taskOnTimeMode, taskNeedInteraction, taskTriggerInterval, taskEarliestTime } = this.configs;
      const day = this.days(taskTriggerInterval);
      const hour = this.hours(taskTriggerInterval);
      const minute = this.minutes(taskTriggerInterval);
      const eTime = this.hm2date(taskEarliestTime);
      Object.assign(this.taskForm, {
        day,
        hour,
        minute,
        eTime,
        implicit: taskImplicit,
        onTimeMode: taskOnTimeMode,
        needInteraction: taskNeedInteraction,
      });
    },
    onRadioChange(val: string) {
      if (val === 'daily') {
        this.taskForm.onTimeMode = true;
        this.taskForm.day = 1;
        this.taskForm.hour = 0;
        this.taskForm.minute = 0;
      }
    },
    onTaskSubmit() {
      (this.$refs.taskForm as InstanceType<typeof ElForm>).validate((valid?: boolean) => {
        if (valid) {
          const {
            code,
            taskForm: { name, type, day, hour, minute, eTime, implicit, onTimeMode, needInteraction },
          } = this;
          const triggerTime = day + hour + minute > 0 ? day * 24 * 60 + hour * 60 + minute : 1;
          const earliestTime = this.date2hm(eTime);
          this.createTaskBasic({
            id: uuid(),
            name,
            code,
            type,
            triggerInterval: triggerTime,
            earliestTime,
            implicit,
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
      if (this.isChrome) {
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
      } else {
        chrome.runtime.sendMessage({
          type: 'firefox-message',
          data: {
            type: 'directive',
            data: 'disableSelection',
          },
        });
      }
    },
    enableSelection() {
      if (this.isChrome) {
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
      } else {
        chrome.runtime.sendMessage({
          type: 'firefox-message',
          data: {
            type: 'directive',
            data: 'enableSelection',
          },
        });
      }
    },
    getPageUrl() {
      if (this.isChrome) {
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
      } else {
        chrome.runtime.sendMessage(
          {
            type: 'getPageUrl-firefox',
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
    },
    taskCompletion() {
      if (this.isChrome) {
        chrome.tabs.query(
          {
            active: true,
            currentWindow: true,
          },
          tabs => {
            if (!chrome.runtime.lastError && tabs && tabs[0] && tabs[0].id) {
              chrome.tabs.sendMessage(tabs[0].id, {
                type: 'completion',
                data: '',
              });
            }
          }
        );
      } else {
        chrome.runtime.sendMessage({
          type: 'firefox-message',
          data: {
            type: 'completion',
            data: '',
          },
        });
      }
    },
  },
});
</script>

<style lang="scss">
.gloria-generation-content {
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
    .el-form-item {
      margin-bottom: 9px;
    }
  }
  .result {
    margin-top: 10px;
  }
  .time-input-number {
    margin-left: 20px;
  }
  .el-input-number {
    width: 140px;
  }

  .gloria-lock-icon {
    margin-left: 10px;
  }
}
</style>

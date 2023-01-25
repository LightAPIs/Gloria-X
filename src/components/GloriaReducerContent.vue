<template>
  <div class="gloria-reducer-content">
    <el-row>
      <el-col :span="12" class="padding-col">
        <div class="font-16">
          <el-tooltip placement="right-start">
            <template #content>
              <div>
                {{ i18n('reducerTip') }}
                <br />
                <el-link type="danger" href="https://github.com/LightAPIs/Gloria-X" target="_blank" icon="el-icon-view">
                  {{ i18n('reducerLink') }}
                </el-link>
              </div>
            </template>
            <span class="reducer-tip-icon">
              <i class="el-icon-warning"></i>
            </span>
          </el-tooltip>
          <span class="reducer-label">
            {{ i18n('reducerLabel') }}
          </span>
          <span class="reducer-state" :title="i18n(editable ? 'reducerEditableTip' : 'reducerLocakedTip')">
            <i :class="editable ? 'el-icon-unlock' : 'el-icon-lock'"></i>
            <b>{{ i18n(editable ? 'reducerEditableText' : 'reducerLockedText') }}</b>
          </span>
        </div>
        <div id="reducer-code">
          <v-ace-editor
            v-model:value="currentReducer"
            lang="javascript"
            :theme="
              configs.appearanceInterface === 'dark' || (configs.appearanceInterface !== 'light' && matches) ? 'terminal' : 'sqlserver'
            "
            :placeholder="i18n('reducerPlacehoder')"
            wrap
            :readonly="!editable"
            :print-margin="false"
            :options="{ tabSize: 2 }"
            style="height: 750px; font-size: 15px; border: 1px solid #b32929"
          />
        </div>
        <div class="margin-top">
          <span class="reducer-btn">
            <el-button type="primary" size="small" :disabled="editable" @click="handleEdit">
              {{ i18n('reducerEdit') }}
            </el-button>
          </span>
          <span class="reducer-btn">
            <el-button type="success" size="small" :disabled="!editable" @click="handleSave">
              {{ i18n('reducerSave') }}
            </el-button>
          </span>
          <span class="reducer-btn">
            <el-button type="info" size="small" :disabled="!editable" @click="handleCancel">
              {{ i18n('reducerCancel') }}
            </el-button>
          </span>
        </div>
      </el-col>
      <el-col :span="12" class="padding-col">
        <div class="test-content">
          <label class="input-label">
            {{ i18n('reducerTestContentLabel') }}
          </label>
          <v-ace-editor
            v-model:value="testContent"
            lang="json"
            :theme="
              configs.appearanceInterface === 'dark' || (configs.appearanceInterface !== 'light' && matches) ? 'terminal' : 'sqlserver'
            "
            :placeholder="i18n('reducerTestContent')"
            wrap
            :print-margin="false"
            :options="{ tabSize: 2 }"
            style="height: 350px; font-size: 15px; border: 1px solid #b32929"
          />
        </div>
        <div class="margin-top">
          <el-button type="primary" size="small" :disabled="editable" @click="handleTest('testReducer')">
            {{ i18n('reducerTest') }}
          </el-button>
          <el-button type="warning" size="small" :disabled="editable" @click="handleTest('testReducerNoMsg')">
            {{ i18n('reducerTestNoMsg') }}
          </el-button>
        </div>
        <div class="test-result">
          <label class="input-label">
            {{ i18n('reducerTestResultLabel') }}
          </label>
          <v-ace-editor
            :value="testResult"
            lang="json"
            :theme="
              configs.appearanceInterface === 'dark' || (configs.appearanceInterface !== 'light' && matches) ? 'terminal' : 'sqlserver'
            "
            :placeholder="i18n('reducerTestResult')"
            wrap
            readonly
            :print-margin="false"
            :options="{ tabSize: 2 }"
            style="height: 350px; font-size: 15px; border: 1px solid #a08181"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapMutations, mapState } from 'vuex';
import { VAceEditor } from 'vue3-ace-editor';
import ace from 'ace-builds';
ace.config.setModuleUrl('ace/mode/javascript', 'ace-editor/mode-javascript.js');
ace.config.setModuleUrl('ace/mode/json', 'ace-editor/mode-json.js');
ace.config.setModuleUrl('ace/theme/sqlserver', 'ace-editor/theme-sqlserver.js');
ace.config.setModuleUrl('ace/theme/terminal', 'ace-editor/theme-terminal.js');

export default defineComponent({
  name: 'GloriaReducerContent',
  components: {
    VAceEditor,
  },
  setup() {
    const matches = matchMedia('(prefers-color-scheme: dark)').matches;
    return {
      matches,
    };
  },
  data() {
    return {
      editable: false,
      currentReducer: '',
      testContent: '',
      testResult: '',
    };
  },
  computed: {
    ...mapState(['reducer', 'configs']),
  },
  watch: {
    //? 确保刷新页面后内容存在
    reducer(val) {
      this.currentReducer = val;
    },
  },
  created() {
    //? 确保切换分页后内容存在
    this.currentReducer = this.reducer;
  },
  methods: {
    ...mapMutations(['updateReducer']),
    handleEdit() {
      this.editable = true;
    },
    handleSave() {
      this.editable = false;
      const { currentReducer } = this;
      this.updateReducer(currentReducer.trim());
    },
    handleCancel() {
      this.editable = false;
      this.currentReducer = this.reducer;
    },
    handleTest(type: string) {
      this.testResult = '';
      const { testContent } = this;
      try {
        const testObj = JSON.parse(testContent.trim());
        if (Array.isArray(testObj) || typeof testObj === 'object') {
          chrome.runtime.sendMessage(
            {
              type: type ? type : 'testReducer',
              data: JSON.stringify(testObj),
            },
            res => {
              if (res) {
                const { result, err } = res;
                console.debug(err);
                if (err) {
                  this.testResult = err;
                } else {
                  this.testResult = JSON.stringify(result, null, 2) || 'null';
                }
              }
            }
          );
        } else {
          throw this.i18n('reducerTestError');
        }
      } catch (e) {
        console.error(e);
        const { message, stack } = e as Error;
        this.testResult = message + '\n\n' + stack;
      }
    },
    handleReducer(val: string) {
      this.currentReducer = val;
    },
  },
});
</script>

<style lang="scss">
.test-result {
  margin-top: 15px;
}
.reducer-btn {
  margin-right: 30px;
}

.reducer-label {
  margin-left: 5px;
  margin-right: 15px;
}

.reducer-tip-icon,
.reducer-state {
  cursor: help;
}

.reducer-state b {
  margin: 2px;
}
</style>

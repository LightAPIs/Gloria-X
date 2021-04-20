<template>
  <div class="gloria-debug-code">
    <el-row>
      <el-col :span="12" class="padding-col">
        <div class="test-code">
          <label class="input-label">
            {{ i18n('debugCodeLabel') }}
          </label>
          <v-ace-editor
            v-model:value="code"
            lang="javascript"
            :theme="
              configs.appearanceInterface === 'dark' || (configs.appearanceInterface !== 'light' && matches) ? 'terminal' : 'sqlserver'
            "
            :placeholder="i18n('debugCodePlaceholder')"
            wrap
            :print-margin="false"
            :options="{ tabSize: 2 }"
            style="height: 700px; font-size: 15px; border: 1px solid #b32929"
          />
        </div>
      </el-col>
      <el-col :span="12" class="padding-col">
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
            style="height: 450px; font-size: 15px; border: 1px solid #a08181"
          />
        </div>
        <div class="error">
          <label class="input-label">
            {{ i18n('debugError') }}
          </label>
          <v-ace-editor
            :value="error"
            lang="logtalk"
            :theme="
              configs.appearanceInterface === 'dark' || (configs.appearanceInterface !== 'light' && matches) ? 'terminal' : 'sqlserver'
            "
            :placeholder="i18n('debugErrorPlaceholder')"
            wrap
            readonly
            :print-margin="false"
            :options="{ tabSize: 2 }"
            style="height: 250px; font-size: 15px; border: 1px solid #a08181"
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
ace.config.setModuleUrl('ace/mode/javascript', 'ace-editor/mode-javascript.js');
ace.config.setModuleUrl('ace/mode/json', 'ace-editor/mode-json.js');
ace.config.setModuleUrl('ace/mode/logtalk', 'ace-editor/mode-logtalk.js');
ace.config.setModuleUrl('ace/theme/sqlserver', 'ace-editor/theme-sqlserver.js');
ace.config.setModuleUrl('ace/theme/terminal', 'ace-editor/theme-terminal.js');

export default defineComponent({
  name: 'GloriaDebugCode',
  components: {
    VAceEditor,
  },
  props: {
    testing: {
      type: Boolean,
      required: true,
    },
    testingNoMsg: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['stop-test'],
  setup() {
    const matches = matchMedia('(prefers-color-scheme: dark)').matches;
    return {
      matches,
    };
  },
  data() {
    return {
      code: '',
      result: '',
      error: '',
    };
  },
  computed: {
    ...mapState(['configs']),
  },
  watch: {
    testing(val) {
      if (val) {
        this.result = '';
        this.error = '';
        if (this.code.trim()) {
          chrome.runtime.sendMessage(
            {
              type: 'testCode',
              data: this.code.trim(),
            },
            res => {
              if (res) {
                const { result, err } = res;
                if (result) {
                  this.result = JSON.stringify(result, null, 2);
                }

                if (err) {
                  this.error = err.message + '\n\n' + err.stack;
                }
              }
            }
          );
        }
        this.$emit('stop-test');
      }
    },
    testingNoMsg(val) {
      if (val) {
        this.result = '';
        this.error = '';
        if (this.code.trim()) {
          chrome.runtime.sendMessage(
            {
              type: 'testNoMsgCode',
              data: this.code.trim(),
            },
            res => {
              if (res) {
                const { result, err } = res;
                if (result) {
                  this.result = JSON.stringify(result, null, 2);
                }

                if (err) {
                  this.error = err.message + '\n\n' + err.stack;
                }
              }
            }
          );
        }
        this.$emit('stop-test');
      }
    },
  },
});
</script>

<style lang="scss">
.error {
  margin-top: 15px;
}
</style>

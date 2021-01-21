<template>
  <div class="gloria-debug-code">
    <el-row>
      <el-col :span="12" class="padding-col">
        <div class="test-code">
          <label for="debug-code-input" class="input-label">
            {{ i18n('debugCodeLabel') }}
          </label>
          <el-input
            v-model="code"
            id="debug-code-input"
            type="textarea"
            :rows="32"
            :placeholder="i18n('debugCodePlaceholder')"
            @keydown.native.tab="textareaTab($refs.codeInput, $event)"
            ref="codeInput"
          ></el-input>
        </div>
      </el-col>
      <el-col :span="12" class="padding-col">
        <div class="result">
          <label for="debug-code-result" class="input-label">
            {{ i18n('debugResult') }}
          </label>
          <el-input
            v-model="result"
            id="debug-code-result"
            type="textarea"
            :rows="15"
            :placeholder="i18n('debugResultPlaceholder')"
            readonly
          ></el-input>
        </div>
        <div class="error">
          <label for="debug-code-error" class="input-label">
            {{ i18n('debugError') }}
          </label>
          <el-input v-model="error" id="debug-code-error" type="textarea" :rows="15" :placeholder="i18n('debugErrorPlaceholder')" readonly>
          </el-input>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { trim } from 'lodash';

export default Vue.extend({
  name: 'gloria-debug-code',
  props: {
    testing: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      code: '',
      result: '',
      error: '',
    };
  },
  watch: {
    testing(val) {
      if (val) {
        this.result = '';
        this.error = '';
        if (trim(this.code)) {
          chrome.runtime.sendMessage(
            {
              type: 'testCode',
              data: trim(this.code),
            },
            res => {
              if (res) {
                const { result, err } = res;
                if (result) {
                  this.result = JSON.stringify(result, null, 4);
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
.padding-col {
  padding: 0px 10px;
}
.input-label {
  font-size: 14px;
  margin: 0px 5px;
}
.error {
  margin-top: 15px;
}
</style>

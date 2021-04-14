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
                <el-link type="danger" href="https://github.com/LightAPIs/Gloria-X#通知-Reducer" target="_blank" icon="el-icon-view">
                  {{ i18n('reducerLink') }}
                </el-link>
              </div>
            </template>
            <span>
              <i class="el-icon-warning"></i>
              {{ i18n('reducerLabel') }}
            </span>
          </el-tooltip>
        </div>
        <div>
          <el-input
            id="reducer-code"
            ref="reducerInput"
            :value="currentReducer"
            type="textarea"
            :rows="32"
            :placeholder="i18n('reducerPlacehoder')"
            :disabled="!editable"
            @input="handleReducer"
            @keydown.tab="textareaTab($refs.reducerInput, $event)"
          ></el-input>
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
          <label for="reducer-test-content" class="input-label">
            {{ i18n('reducerTestContentLabel') }}
          </label>
          <el-input
            id="reducer-test-content"
            ref="testInput"
            v-model="testContent"
            type="textarea"
            :rows="15"
            :placeholder="i18n('reducerTestContent', [example])"
            @keydown.tab="textareaTab($refs.testInput, $event)"
          ></el-input>
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
          <label for="reducer-test-result" class="input-label">
            {{ i18n('reducerTestResultLabel') }}
          </label>
          <el-input
            id="reducer-test-result"
            :value="testResult"
            type="textarea"
            :rows="15"
            :placeholder="i18n('reducerTestResult')"
            readonly
          ></el-input>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapMutations, mapState } from 'vuex';
import { APP_ICON_URL } from '@/commons/var';

/* global myStore */

const example: myStore.CommitData = {
  title: 'Test Title',
  message: 'This i a test.',
  iconUrl: APP_ICON_URL,
  imageUrl: APP_ICON_URL,
  url: 'https://github.com/LightAPIs/Gloria-X',
  id: 'Optional',
};

export default defineComponent({
  name: 'GloriaReducerContent',
  data() {
    return {
      example: JSON.stringify(example, null, 4),
      editable: false,
      currentReducer: '',
      testContent: '',
      testResult: '',
    };
  },
  computed: {
    ...mapState(['reducer']),
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
                console.log(err);
                if (result) {
                  this.testResult = JSON.stringify(result, null, 4);
                } else if (err) {
                  this.testResult = err;
                }
              }
            }
          );
        } else {
          throw this.i18n('reducerTestError');
        }
      } catch (e) {
        console.error(e);
        this.testResult = e.message + '\n\n' + e.stack;
      }
    },
    handleReducer(val: string) {
      this.currentReducer = val;
    },
  },
});
</script>

<style lang="scss">
.padding-col {
  padding: 0px 10px;
}
.font-16 {
  font-size: 16px;
}
.test-result {
  margin-top: 15px;
}
.reducer-btn {
  margin-right: 30px;
}
</style>

<template>
  <div class="gloria-reducer-content">
    <el-row>
      <el-col :span="12" class="padding-col">
        <div class="font-16">
          <el-tooltip placement="right-start">
            <div slot="content">
              {{ i18n('reducerTip') }}
              <br />
              <el-link type="danger" href="https://github.com/LightAPIs/Gloria-X#通知-Reducer" target="_blank" icon="el-icon-view">
                {{ i18n('reducerLink') }}
              </el-link>
            </div>
            <span>
              <i class="el-icon-warning"></i>
              {{ i18n('reducerLabel') }}
            </span>
          </el-tooltip>
        </div>
        <div>
          <el-input
            :value="currentReducer"
            id="reducer-code"
            type="textarea"
            :rows="32"
            :placeholder="i18n('reducerPlacehoder')"
            :disabled="!editable"
            @input="handleReducer"
            @keydown.native.tab="textareaTab($refs.reducerInput, $event)"
            ref="reducerInput"
          ></el-input>
        </div>
        <div class="margin-top">
          <span class="reducer-btn">
            <el-button type="primary" size="small" @click="handleEdit" :disabled="editable">
              {{ i18n('reducerEdit') }}
            </el-button>
          </span>
          <span class="reducer-btn">
            <el-button type="success" size="small" @click="handleSave" :disabled="!editable">
              {{ i18n('reducerSave') }}
            </el-button>
          </span>
          <span class="reducer-btn">
            <el-button type="info" size="small" @click="handleCancel" :disabled="!editable">
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
            v-model="testContent"
            id="reducer-test-content"
            type="textarea"
            :rows="15"
            :placeholder="i18n('reducerTestContent', [example])"
            @keydown.native.tab="textareaTab($refs.testInput, $event)"
            ref="testInput"
          ></el-input>
        </div>
        <div class="margin-top">
          <el-button type="warning" size="small" @click="handleTest" :disabled="editable">
            {{ i18n('reducerTest') }}
          </el-button>
        </div>
        <div class="test-result">
          <label for="reducer-test-result" class="input-label">
            {{ i18n('reducerTestResultLabel') }}
          </label>
          <el-input
            v-model="testResult"
            id="reducer-test-result"
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
import Vue from 'vue';
import { mapMutations, mapState } from 'vuex';
import { APP_ICON_URL } from '@/commons/var';

const example: store.CommitData = {
  title: 'Test Title',
  message: 'This i a test.',
  iconUrl: APP_ICON_URL,
  imageUrl: APP_ICON_URL,
  url: 'https://github.com/LightAPIs/Gloria-X',
  id: 'Optional',
};

export default Vue.extend({
  name: 'gloria-reducer-content',
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
    handleTest() {
      this.testResult = '';
      const { testContent } = this;
      try {
        const testObj = JSON.parse(testContent.trim());
        if (Array.isArray(testObj) || typeof testObj === 'object') {
          chrome.runtime.sendMessage(
            {
              type: 'testReducer',
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
  created() {
    //? 确保切换分页后内容存在
    this.currentReducer = this.reducer;
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

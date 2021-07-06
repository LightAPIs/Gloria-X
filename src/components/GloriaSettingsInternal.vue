<template>
  <div class="gloria-settings-internal">
    <div>
      <el-switch
        :value="configs.internalStartDelay"
        :active-text="i18n('settingsInternalStartDelay')"
        @change="onChange('internalStartDelay', $event)"
      ></el-switch>
      <el-tooltip placement="top-start" :enterable="false" :content="i18n('settingsInternalStartDelayTip')">
        <span class="options-tip-icon"><i class="el-icon-question"></i></span>
      </el-tooltip>
    </div>
    <div v-show="configs.internalStartDelay" class="margin-top">
      <span class="font-14">
        {{ i18n('settingsInternalDelayTime') }}
      </span>
      <el-input-number
        :model-value="configs.internalDelayTime"
        :min="3"
        :max="10"
        class="gloria-internal-input-number"
        controls-position="right"
        step-strictly
        size="medium"
        @change="onChange('internalDelayTime', $event)"
      ></el-input-number>
    </div>
    <div class="margin-top">
      <span class="font-14">
        {{ i18n('settingsInternalExecutionLimit') }}
      </span>
      <el-input-number
        :model-value="configs.internalExecutionLimit"
        :min="0"
        :max="10"
        class="gloria-internal-input-number"
        controls-position="right"
        step-strictly
        size="medium"
        @change="onChange('internalExecutionLimit', $event)"
      ></el-input-number>
      <el-tooltip placement="top-start" :enterable="false" :content="i18n('settingsInternalExecutionLimitTip')">
        <span class="options-tip-icon"><i class="el-icon-info"></i></span>
      </el-tooltip>
    </div>
    <div class="margin-top">
      <el-button type="primary" size="small" :disabled="!reloadable" @click="onReload">
        {{ i18n('settingsInternalReload') }}
      </el-button>
      <span v-show="reloadable" class="gloria-internal-reload-tip">
        {{ i18n('settingsInternalReloadTip') }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapMutations, mapState } from 'vuex';
import { ElMessage } from 'element-plus';

export default defineComponent({
  name: 'GloriaSettingsInternal',
  data() {
    return {
      reloadable: false,
    };
  },
  computed: {
    ...mapState(['configs']),
  },
  methods: {
    ...mapMutations(['updateConfigs']),
    onChange(name: string, value: boolean | number) {
      if (value != null) {
        if (name === 'internalExecutionLimit') {
          this.reloadable = true;
        }
        this.updateConfigs({
          name,
          value,
        });
      }
    },
    onReload() {
      this.reloadable = false;
      chrome.runtime.sendMessage(
        {
          type: 'reloadTasks',
          data: this.configs.internalExecutionLimit,
        },
        res => {
          if (res) {
            const { result } = res;
            if (result == 'ok') {
              ElMessage.success(this.i18n('settintsInternalReloadSuccess'));
            } else {
              ElMessage.error(this.i18n('settingsInternalReloadError'));
            }
          }
        }
      );
    },
  },
});
</script>

<style>
.gloria-internal-input-number {
  width: 150px;
}
.gloria-internal-reload-tip {
  margin-left: 20px;
  color: #ef5350;
}
</style>

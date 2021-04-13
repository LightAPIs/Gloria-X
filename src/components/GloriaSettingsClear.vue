<template>
  <div>
    <span v-for="(item, index) in buttonGroup" :key="index" class="clear-btn">
      <el-popconfirm
        placement="top-start"
        :title="i18n(item.tip)"
        :confirm-button-text="i18n('confirmText')"
        :cancel-button-text="i18n('cancelText')"
        @confirm="handleClear(item.key)"
      >
        <template #reference>
          <el-button type="danger" size="small">
            {{ i18n(item.name) }}
          </el-button>
        </template>
      </el-popconfirm>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapMutations } from 'vuex';
import { ElMessage } from 'element-plus';

export default defineComponent({
  name: 'gloria-settings-clear',
  data() {
    return {
      buttonGroup: [
        {
          key: 'notifications',
          name: 'settingsClearNotifications',
          tip: 'settingsClearNotificationsTip',
        },
        {
          key: 'tasks',
          name: 'settingsClearTasks',
          tip: 'settingsClearTasksTip',
        },
        {
          key: 'allStages',
          name: 'settingsClearStages',
          tip: 'settingsClearStagesTip',
        },
        {
          key: 'expiredStages',
          name: 'settingsClearExpiredStages',
          tip: 'settingsClearExpiredStagesTip',
        },
        {
          key: 'caches',
          name: 'settingsClearCaches',
          tip: 'settingsClearCachesTip',
        },
      ],
    };
  },
  methods: {
    ...mapMutations(['clearNotifications', 'clearTasks', 'clearStages', 'clearExpiredStages']),
    handleClear(key: string) {
      switch (key) {
        case 'notifications':
          this.clearNotifications();
          break;
        case 'tasks':
          this.clearTasks();
          break;
        case 'allStages':
          this.clearStages();
          break;
        case 'expiredStages':
          this.clearExpiredStages();
          break;
        case 'caches':
          chrome.runtime.sendMessage({
            type: 'clearCaches',
          });
          break;
      }

      ElMessage.success(this.i18n('settingsClearCompleted'));
    },
  },
});
</script>

<style>
.clear-btn {
  margin-right: 30px;
}
</style>

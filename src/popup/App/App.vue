<template>
  <div id="popup-app">
    <el-tabs :value="activeTab" class="tabs" stretch type="border-card" :before-leave="leaveTab">
      <el-tab-pane class="tab-pane" name="tasks">
        <span slot="label">
          <i class="el-icon-s-order"></i>
          {{ i18n('popupTaskLabel') }}
        </span>
        <lazy-render immediately :time="100">
          <div slot="tip">{{ i18n('redderText') }}</div>
          <gloria-task-tab></gloria-task-tab>
        </lazy-render>
      </el-tab-pane>
      <el-tab-pane class="tab-pane" name="notifications">
        <span slot="label">
          <i class="el-icon-notebook-2"></i>
          {{ i18n('popupNotificationLabel') }}
        </span>
        <lazy-render immediately :time="100">
          <div slot="tip">{{ i18n('redderText') }}</div>
          <gloria-notification-tab></gloria-notification-tab>
        </lazy-render>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapMutations, mapGetters } from 'vuex';
import GloriaTaskTab from '@/components/GloriaTaskTab.vue';
import GloriaNotificationTab from '@/components/GloriaNotificationTab.vue';

export default Vue.extend({
  name: 'app',
  components: { GloriaTaskTab, GloriaNotificationTab },
  computed: {
    ...mapGetters(['activeTab']),
  },
  methods: {
    ...mapMutations(['updateLastActiveTab', 'clearUnread']),
    leaveTab(activeName: string) {
      //? 由于机制原因，若开始时 activeTab 中保存的值为 'tasks'，则不会触发这个事件
      if (activeName === 'notifications') {
        this.clearUnread();
      }

      activeName !== this.activeTab && this.updateLastActiveTab(activeName);
    },
  },
});
</script>

<style lang="scss">
#popup-app {
  width: 750px;
  height: 580px;
  .tab-pane {
    height: 510px;
    overflow: auto;
  }
  .tab-content {
    min-height: 510px;
  }
  .el-dialog__header {
    padding-bottom: 5px;
  }
}
</style>

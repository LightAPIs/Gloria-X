<template>
  <div id="popup-app">
    <el-tabs :value="activeTab" class="tabs" stretch type="border-card" :before-leave="leaveTab">
      <el-tab-pane class="tab-pane" name="tasks">
        <span slot="label">
          <i class="el-icon-s-order"></i>
          {{ i18n('popupTaskLabel') }}
        </span>
        <gloria-task-tab></gloria-task-tab>
      </el-tab-pane>
      <el-tab-pane class="tab-pane" name="notifications">
        <span slot="label">
          <i class="el-icon-notebook-2"></i>
          {{ i18n('popupNotificationLabel') }}
        </span>
        <gloria-notification-tab></gloria-notification-tab>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { mapMutations, mapGetters } from 'vuex';
import Vue from 'vue';
import GloriaTaskTab from './GloriaTaskTab.vue';
import GloriaNotificationTab from './GloriaNotificationTab.vue';

export default Vue.extend({
  name: 'app',
  components: { GloriaTaskTab, GloriaNotificationTab },
  computed: {
    ...mapGetters(['activeTab']),
  },
  methods: {
    ...mapMutations(['updateConfigsLastActiveTab']),
    leaveTab(activeName: string) {
      activeName !== this.activeTab && this.updateConfigsLastActiveTab(activeName);
      // 这里后续还需要处理清空未读通知数，仅在 activeName 为 "notifications" 时
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
  .form-trigger-time {
    margin-left: 25px;
  }
}
</style>

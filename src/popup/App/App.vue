<template>
  <div id="gloria-popup-app" class="gloria-theme" :class="configs.appearanceInterface">
    <el-tabs :model-value="activeTab" class="gloria-tabs" stretch type="border-card" :before-leave="leaveTab">
      <el-tab-pane class="tab-pane" name="tasks" lazy>
        <template #label>
          <span>
            <i class="el-icon-s-order"></i>
            {{ i18n('popupTaskLabel') }}
          </span>
        </template>
        <template #tip>
          <div>{{ i18n('redderText') }}</div>
        </template>
        <gloria-task-tab></gloria-task-tab>
      </el-tab-pane>
      <el-tab-pane class="tab-pane" name="notifications" lazy>
        <template #label>
          <span>
            <i class="el-icon-notebook-2"></i>
            {{ i18n('popupNotificationLabel') }}
          </span>
        </template>
        <template #tip>
          <div>{{ i18n('redderText') }}</div>
        </template>
        <gloria-notification-tab></gloria-notification-tab>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapMutations, mapGetters } from 'vuex';
import GloriaTaskTab from '@/components/GloriaTaskTab.vue';
import GloriaNotificationTab from '@/components/GloriaNotificationTab.vue';

export default defineComponent({
  name: 'App',
  components: { GloriaTaskTab, GloriaNotificationTab },
  computed: {
    ...mapState(['configs']),
    ...mapGetters(['activeTab']),
  },
  created() {
    //? 还原 Chromium 中全局网页缩放比例，防止弹出窗口内容溢出；Firefox 中的弹出窗口本身不受全局缩放影响
    document.body.setAttribute('style', 'zoom: ' + (1 / window.devicePixelRatio) * 100 + '%');
  },
  methods: {
    ...mapMutations(['updateLastActiveTab', 'clearUnread']),
    leaveTab(activeName: string): void {
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
@import '~@/scss/index.scss';

#gloria-popup-app {
  width: 750px;
  height: 580px;
  .gloria-tabs {
    border: 0px;
  }
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
  .context-menu {
    position: fixed;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    background-color: #ffffff;
    border-radius: 4px;
    padding: 8px 0;
    z-index: 2;
    min-width: 150px;

    .menu-body {
      display: block;

      .menu-item {
        list-style: none;
        line-height: 32px;
        padding: 0 16px;
        margin: 0px;
        font-size: 13px;
        outline: 0;
        display: flex;
        align-items: center;
        transition: 0.2s;
        border-bottom: 1px solid #00000000;
        cursor: pointer;

        .menu-item-icon {
          margin-right: 8px;
          width: 13px;
        }

        .menu-item-label {
          flex: 1;
        }

        &:hover {
          background: #ecf5ff;
          color: #409eff;
        }
      }

      .menu-divided {
        border-bottom-color: #d3d7df;
      }
    }
  }

  .el-scrollbar__thumb {
    background-color: rgba(144, 147, 194, 0.6);

    &:hover {
      background-color: rgba(144, 147, 194, 0.9);
    }
  }
}
</style>

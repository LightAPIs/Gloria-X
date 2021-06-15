<template>
  <el-card
    v-show="
      itemShow &&
      ((filterType === 'enabled' && isEnable) ||
        (filterType === 'disabled' && !isEnable) ||
        (filterType === 'timed' && type === 'timed') ||
        (filterType === 'daily' && type === 'daily') ||
        (filterType === 'onTime' && type === 'timed' && onTimeMode) ||
        (filterType === 'needInteraction' && needInteraction) ||
        (filterType === 'error' && executionError > 0) ||
        (filterType === 'install' && origin) ||
        (filterType === 'local' && !origin) ||
        filterType === 'all')
    "
    class="tab-card"
    shadow="hover"
    @contextmenu.prevent="onContextmenu"
  >
    <template #header>
      <span>
        <gloria-text-highlight class-name="header-text" :text="name" :keyword="filterText"></gloria-text-highlight>
        <el-tag v-if="type === 'timed'" size="mini" effect="dark" :title="i18n('popupTaskTimedText')" class="tag">
          {{ i18n('popupTaskFormTimed') }}
        </el-tag>
        <el-tag v-if="type === 'daily'" type="success" size="mini" effect="dark" :title="i18n('popupTaskDailyText')" class="tag">
          {{ i18n('popupTaskFormDaily') }}
        </el-tag>
        <el-tag
          v-if="type === 'timed' && onTimeMode"
          type="info"
          size="mini"
          effect="dark"
          :title="i18n('popupTaskOnTimeModeText')"
          class="tag"
        >
          {{ i18n('popupTaskOnTimeModeTag') }}
        </el-tag>
        <el-tag
          v-if="needInteraction && isChrome"
          type="warning"
          size="mini"
          effect="dark"
          :title="i18n('popupTaskNeedInteractionText')"
          class="tag"
        >
          {{ i18n('popupTaskNeedInteractionTag') }}
        </el-tag>
        <el-tag
          v-if="executionError > 0"
          type="danger"
          size="mini"
          effect="dark"
          :title="i18n('popupTaskLastExecutionErrorText', executionError.toString())"
          class="tag"
        >
          {{ i18n('popupTaskLastExecutionErrorTag', executionError.toString()) }}
        </el-tag>
        <span class="float-right">
          <el-popconfirm
            v-if="origin"
            class="disconnect-btn"
            effect="dark"
            :title="i18n('popupTaskDisconnectConfirm')"
            :confirm-button-text="i18n('popupTaskDisconnectOk')"
            confirm-button-type="warning"
            :cancel-button-text="i18n('cancelText')"
            @confirm="onDisconnect"
          >
            <template #reference>
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-scissors"
                circle
                class="card-button"
                :title="i18n('popupTaskDisconnect')"
              ></el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm
            class="delete-btn"
            effect="dark"
            :title="i18n('popupTaskDeleteConfirm')"
            :confirm-button-text="i18n('popupTaskDeleteOk')"
            confirm-button-type="danger"
            :cancel-button-text="i18n('cancelText')"
            icon="el-icon-warning"
            @confirm="onDelete"
          >
            <template #reference>
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                circle
                class="card-button"
                :title="i18n('popupTaskDelete')"
              ></el-button>
            </template>
          </el-popconfirm>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            circle
            class="card-button"
            :title="i18n('popupTaskEdit')"
            @click="onEdit"
          ></el-button>
          <el-switch :value="isEnable" active-color="#13ce66" inactive-color="#ff4949" class="switch" @change="onSwitchChange"></el-switch>
        </span>
      </span>
    </template>
    <div>
      <span v-if="type === 'daily'">
        {{ i18n('popupTaskEarliestTimeTitle') + earliestTime }}
      </span>
      <span v-else>
        {{ i18n('popupTaskTriggerInterval') + intervalTime(triggerInterval) }}
      </span>
      <span class="float-right">
        {{ i18n('popupTaskOrigin') }}
        <a v-if="origin" target="_blank" :href="origin">
          {{ origin }}
        </a>
        <span v-else>
          {{ i18n('popupTaskNoOrigin') }}
        </span>
      </span>
    </div>
    <div>
      <span>
        {{ i18n('popupTaskTriggerCount') + triggerCount }}
      </span>
      <span class="float-right">
        {{ i18n('popupTaskPushCount') + pushCount }}
      </span>
    </div>
    <div>
      <span>
        {{ i18n('popupTaskTriggerDate') + displayTime(triggerDate) }}
      </span>
      <span class="float-right">
        {{ i18n('popupTaskPushDate') + displayTime(pushDate) }}
      </span>
    </div>
  </el-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters, mapMutations } from 'vuex';
import { ElMessage } from 'element-plus';
import GloriaTextHighlight from './GloriaTextHighlight.vue';

export default defineComponent({
  name: 'GloriaTaskItem',
  components: {
    GloriaTextHighlight,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    isEnable: {
      type: Boolean,
      required: true,
    },
    triggerInterval: {
      type: Number,
      required: true,
    },
    earliestTime: {
      type: String,
      required: true,
    },
    triggerCount: {
      type: Number,
      default: 0,
    },
    pushCount: {
      type: Number,
      default: 0,
    },
    triggerDate: {
      type: String,
      default: '',
    },
    pushDate: {
      type: String,
      default: '',
    },
    origin: {
      type: String,
      default: '',
    },
    needInteraction: {
      type: Boolean,
      required: true,
    },
    onTimeMode: {
      type: Boolean,
      default: false,
    },
    executionError: {
      type: Number,
      default: 0,
    },
    filterText: {
      type: String,
      default: '',
    },
    filterType: {
      type: String,
      default: 'all',
    },
  },
  emits: ['task-edit', 'task-contextmenu'],
  setup() {
    const isChrome = process.env.VUE_APP_TITLE === 'chrome';
    return {
      isChrome,
    };
  },
  computed: {
    ...mapGetters(['taskCode']),
    itemShow() {
      const { filterText, name } = this;
      let show = false;
      if (!filterText || name.toLowerCase().includes(filterText.toLowerCase())) {
        show = true;
      }
      return show;
    },
  },
  methods: {
    ...mapMutations(['updateIsEnable', 'removeTaskItem', 'disconnectTask', 'updateTaskBasic', 'removeStageItem']),
    onEdit() {
      const { id } = this;
      this.$emit('task-edit', id);
    },
    onSwitchChange(checked: boolean) {
      const { id } = this;
      this.updateIsEnable({
        id,
        checked,
      });
    },
    onDelete() {
      const { id } = this;
      this.removeTaskItem(id);
    },
    onDisconnect() {
      const { id } = this;
      this.disconnectTask(id);
    },
    onContextmenu(event: MouseEvent) {
      const { id, name, type, isEnable, onTimeMode, needInteraction, origin, isChrome } = this;
      const items = [
        isEnable
          ? {
              label: this.i18n('popupContextExecuteTask'),
              icon: 'el-icon-video-play',
              divided: true,
              onClick: () => {
                chrome.runtime.sendMessage(
                  {
                    type: 'executeTask',
                    data: id,
                  },
                  res => {
                    if (res) {
                      ElMessage.success(this.i18n('popupContextExecuteTaskSuccess'));
                    } else {
                      ElMessage.success(this.i18n('popupContextExecuteTaskError'));
                    }
                  }
                );
              },
            }
          : {},
        {
          label: this.i18n('popupContextTaskCopyName'),
          icon: 'el-icon-copy-document',
          onClick: () => {
            this.copyToClip(
              name,
              () => {
                ElMessage.success(this.i18n('popupContextTaskCopyNameCompleted'));
              },
              () => {
                ElMessage.error(this.i18n('popupContextNotificationItemCopyError'));
              }
            );
          },
        },
        {
          label: this.i18n('popupContextTaskCopyCode'),
          icon: 'el-icon-document-copy',
          onClick: () => {
            this.copyToClip(
              this.taskCode(id),
              () => {
                ElMessage.success(this.i18n('popupContextTaskCopyCodeCompleted'));
              },
              () => {
                ElMessage.error(this.i18n('popupContextNotificationItemCopyError'));
              }
            );
          },
        },
        {
          label: this.i18n('popupContextTaskCopyId'),
          icon: 'el-icon-user',
          divided: true,
          onClick: () => {
            this.copyToClip(
              id,
              () => {
                ElMessage.success(this.i18n('popupContextTaskCopyIdCompleted'));
              },
              () => {
                ElMessage.error(this.i18n('popupContextNotificationItemCopyError'));
              }
            );
          },
        },
        type === 'timed'
          ? {
              label: onTimeMode ? this.i18n('popupContextTaskOnTimeDisable') : this.i18n('popupContextTaskOnTimeEnable'),
              icon: 'el-icon-alarm-clock',
              divided: false,
              onClick: () => {
                this.updateTaskBasic({
                  id,
                  onTimeMode: !onTimeMode,
                });
              },
            }
          : {},
        isChrome
          ? {
              label: needInteraction
                ? this.i18n('popupContextTaskNeedInteractionDisable')
                : this.i18n('popupContextTaskNeedInteractionEnable'),
              icon: 'el-icon-thumb',
              divided: false,
              onClick: () => {
                this.updateTaskBasic({
                  id,
                  needInteraction: !needInteraction,
                });
              },
            }
          : {},
        {
          label: this.i18n('popupContextTaskRemoveStage'),
          icon: 'el-icon-delete',
          divided: true,
          onClick: () => {
            this.removeStageItem(id);
            ElMessage.success(this.i18n('popupContextTaskRemoveStageCompleted'));
          },
        },
        {
          label: this.i18n('popupContextTaskDebug'),
          icon: 'el-icon-view',
          onClick: () => {
            chrome.runtime.sendMessage(
              {
                type: 'testCode',
                data: this.taskCode(id),
              },
              res => {
                if (res) {
                  const { err } = res;
                  if (err) {
                    ElMessage.error(this.i18n('popupContextTaskDebugError'));
                  } else {
                    ElMessage.success(this.i18n('popupContextTaskDebugCompleted'));
                  }
                }
              }
            );
          },
        },
        origin
          ? {
              label: this.i18n('popupContextTaskCheckUpdate'),
              icon: 'el-icon-link',
              onClick: () => {
                chrome.runtime.sendMessage(
                  {
                    type: 'manuallyCheckUpdate',
                    data: origin.replace('gloria.pub', 'api.gloria.pub'),
                  },
                  res => {
                    if (res) {
                      const { result, err } = res;
                      if (result) {
                        if (result === this.taskCode(id).trim()) {
                          ElMessage.info(this.i18n('popupContextTaskCheckUpdateNo'));
                        } else {
                          ElMessage.success(this.i18n('popupContextTaskCheckUpdateYes'));
                        }
                      } else {
                        if (err) {
                          ElMessage.error(this.i18n('popupContextTaskCheckUpdateError'));
                        } else {
                          ElMessage.warning(this.i18n('popupContextTaskCheckUpdateEmpty'));
                        }
                      }
                    }
                  }
                );
              },
            }
          : {},
      ];

      this.$emit('task-contextmenu', {
        items,
        event,
      });
      return false;
    },
  },
});
</script>

<style lang="scss">
.tab-card {
  margin-bottom: 10px;
  background-color: #b8dbff;
  .header-text {
    font: {
      size: 1.25em;
      weight: bold;
    }
  }
  .float-left {
    float: left;
  }
  .float-right {
    float: right;
  }
  .switch {
    margin-left: 10px;
  }
  .tag {
    margin-left: 5px;
  }
}
</style>

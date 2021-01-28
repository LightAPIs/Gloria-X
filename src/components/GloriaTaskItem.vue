<template>
  <el-card v-show="itemShow" class="tab-card" shadow="hover" @contextmenu.native.prevent="onContextmenu">
    <span slot="header">
      <span class="header-text">
        {{ name }}
      </span>
      <el-tag v-if="onTimeMode" type="info" size="mini" effect="dark" :title="i18n('popupTaskOnTimeModeText')" class="tag">
        {{ i18n('popupTaskOnTimeModeTag') }}
      </el-tag>
      <el-tag v-if="needInteraction" type="info" size="mini" effect="dark" :title="i18n('popupTaskNeedInteractionText')" class="tag">
        {{ i18n('popupTaskNeedInteractionTag') }}
      </el-tag>
      <span class="float-right">
        <el-popconfirm
          v-if="origin"
          class="disconnect-btn"
          :title="i18n('popupTaskDisconnectConfirm')"
          :confirm-button-text="i18n('popupTaskDisconnectOk')"
          confirm-button-type="warning"
          :cancel-button-text="i18n('cancelText')"
          @confirm="onDisconnect"
        >
          <el-button
            slot="reference"
            type="warning"
            size="mini"
            icon="el-icon-scissors"
            circle
            class="card-button"
            :title="i18n('popupTaskDisconnect')"
          ></el-button>
        </el-popconfirm>
        <el-popconfirm
          class="delete-btn"
          :title="i18n('popupTaskDeleteConfirm')"
          :confirm-button-text="i18n('popupTaskDeleteOk')"
          confirm-button-type="danger"
          :cancel-button-text="i18n('cancelText')"
          icon="el-icon-warning"
          @confirm="onDelete"
        >
          <el-button
            slot="reference"
            type="danger"
            size="mini"
            icon="el-icon-delete"
            circle
            class="card-button"
            :title="i18n('popupTaskDelete')"
          ></el-button>
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
    <div>
      <span>
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
import Vue from 'vue';
import { mapGetters, mapMutations } from 'vuex';

export default Vue.extend({
  name: 'gloria-task-item',
  props: {
    id: {
      type: String,
      required: true,
    },
    name: {
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
    filterText: {
      type: String,
      default: '',
    },
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
    ...mapMutations(['updateIsEnable', 'removeTaskItem', 'disconnectTask', 'updateTaskBasic']),
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
    onContextmenu(event: Event) {
      const { id, name, isEnable, onTimeMode, needInteraction, origin } = this;
      const items = [
        {
          label: this.i18n('popupContextTaskCopyName'),
          icon: 'el-icon-copy-document',
          onClick: () => {
            this.copyToClip(name, () => {
              this.$message.success(this.i18n('popupContextTaskCopyNameCompleted'));
            });
          },
        },
        {
          label: this.i18n('popupContextTaskCopyCode'),
          icon: 'el-icon-document-copy',
          divided: true,
          onClick: () => {
            this.copyToClip(this.taskCode(id), () => {
              this.$message.success(this.i18n('popupContextTaskCopyCodeCompleted'));
            });
          },
        },
        {
          label: isEnable ? this.i18n('popupContextTaskDisable') : this.i18n('popupContextTaskEnable'),
          icon: 'el-icon-switch-button',
          onClick: () => {
            this.updateIsEnable({
              id,
              checked: !isEnable,
            });
          },
        },
        {
          label: onTimeMode ? this.i18n('popupContextTaskOnTimeDisable') : this.i18n('popupContextTaskOnTimeEnable'),
          icon: 'el-icon-alarm-clock',
          onClick: () => {
            this.updateTaskBasic({
              id,
              onTimeMode: !onTimeMode,
            });
          },
        },
        {
          label: needInteraction ? this.i18n('popupContextTaskNeedInteractionDisable') : this.i18n('popupContextTaskNeedInteractionEnable'),
          icon: 'el-icon-thumb',
          divided: true,
          onClick: () => {
            this.updateTaskBasic({
              id,
              needInteraction: !needInteraction,
            });
          },
        },
        {
          label: this.i18n('popupContextTaskEdit'),
          icon: 'el-icon-edit-outline',
          onClick: () => {
            this.$emit('task-edit', id);
          },
        },
      ];

      origin &&
        items.push({
          label: this.i18n('popupContextTaskDisconnect'),
          icon: 'el-icon-connection',
          onClick: () => {
            this.disconnectTask(id);
          },
        });

      items.push({
        label: this.i18n('popupContextTaskDelete'),
        icon: 'el-icon-delete',
        onClick: () => {
          this.removeTaskItem(id);
        },
      });

      this.$contextmenu({
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
  .delete-btn,
  .disconnect-btn {
    margin-right: 10px;
  }
  .tag {
    margin-right: 5px;
  }
}
</style>

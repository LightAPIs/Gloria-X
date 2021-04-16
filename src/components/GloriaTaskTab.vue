<template>
  <div class="tab-content">
    <el-container class="task-container" direction="vertical">
      <el-header v-if="configs.taskShowSearchInput" height="32px">
        <gloria-search-input type="tasks" @filter-text="onFilterText" @filter-type="onFilterType"></gloria-search-input>
      </el-header>
      <el-scrollbar :native="false" :noresize="false" tag="div">
        <el-main>
          <gloria-task-item
            v-for="task in tasks"
            :id="task.id"
            :key="task.id"
            :name="task.name"
            :is-enable="task.isEnable"
            :trigger-interval="task.triggerInterval"
            :trigger-count="task.triggerCount"
            :trigger-date="task.triggerDate"
            :push-count="task.pushCount"
            :push-date="task.pushDate"
            :origin="task.origin"
            :need-interaction="task.needInteraction"
            :on-time-mode="task.onTimeMode"
            :execution-error="task.executionError"
            :filter-text="filterText"
            :filter-type="filterType"
            @task-edit="onTaskEdit"
            @task-contextmenu="onTaskContextmenu"
          ></gloria-task-item>
        </el-main>
      </el-scrollbar>
    </el-container>
    <gloria-task-fab @add-task="onAddTask"></gloria-task-fab>
    <gloria-context-menu
      :is-show="context.isShow"
      :items="context.items"
      :context-event="context.event"
      @close="onContextmenuClose"
    ></gloria-context-menu>
    <gloria-task-edit
      :id="form.id"
      :dialog-visible="dialogVisible"
      :type="formType"
      :name="form.name"
      :code="form.code"
      :trigger-interval="form.triggerInterval"
      :on-time-mode="form.onTimeMode"
      :need-interaction="form.needInteraction"
      @close-dialog="dialogVisible = false"
    ></gloria-task-edit>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapMutations } from 'vuex';
import GloriaTaskItem from './GloriaTaskItem.vue';
import GloriaTaskFab from './GloriaTaskFab.vue';
import GloriaTaskEdit from './GloriaTaskEdit.vue';
import GloriaSearchInput from './GloriaSearchInput.vue';
import GloriaContextMenu from './GloriaContextMenu.vue';
import { ElMessage } from 'element-plus';

export default defineComponent({
  name: 'GloriaTaskTab',
  components: {
    GloriaTaskItem,
    GloriaTaskFab,
    GloriaTaskEdit,
    GloriaSearchInput,
    GloriaContextMenu,
  },
  data() {
    return {
      dialogVisible: false,
      formType: 'add',
      form: {
        id: '',
        name: '',
        code: '',
        triggerInterval: 5,
        onTimeMode: false,
        needInteraction: false,
      },
      filterText: '',
      filterType: 'all',
      context: {
        isShow: false,
        items: [],
        event: null,
      },
    };
  },
  computed: {
    ...mapState(['tasks', 'configs']),
  },
  methods: {
    ...mapMutations(['updateIsEnable', 'updateTaskBasic']),
    onAddTask() {
      this.formType = 'add';
      this.dialogVisible = true;
    },
    onTaskEdit(id: string) {
      const { tasks } = this;
      let editStatus = false;
      for (const item of tasks) {
        if (item.id === id) {
          const { name, code, triggerInterval, onTimeMode, needInteraction } = item;
          this.formType = 'edit';
          Object.assign(this.form, {
            id,
            name,
            code,
            triggerInterval,
            onTimeMode,
            needInteraction,
          });
          this.dialogVisible = true;
          editStatus = true;
          break;
        }
      }

      !editStatus && ElMessage.error(this.i18n('popupTaskErrorEdit'));
    },
    onFilterText(text: string) {
      this.filterText = text;
    },
    onFilterType(command: string) {
      this.filterType = command;
    },
    onTaskContextmenu(context: unknown) {
      Object.assign(this.context, context, {
        isShow: true,
      });
    },
    onContextmenuClose() {
      this.context.isShow = false;
    },
  },
});
</script>

<style lang="scss">
.task-container {
  height: 510px;
}
</style>

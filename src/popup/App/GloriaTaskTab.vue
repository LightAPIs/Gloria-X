<template>
  <div class="tab-content">
    <gloria-task-item
      v-for="task in tasks"
      :key="task.id"
      :id="task.id"
      :name="task.name"
      :is-enable="task.isEnable"
      :trigger-interval="task.triggerInterval"
      :trigger-count="task.triggerCount"
      :trigger-date="task.triggerDate"
      :push-count="task.pushCount"
      :push-date="task.pushDate"
      :origin="task.origin"
      :need-interaction="task.needInteraction"
      :strict-mode="task.strictMode"
      @task-edit="onTaskEdit"
    ></gloria-task-item>
    <gloria-task-fab @add-task="onAddTask"></gloria-task-fab>
    <gloria-task-edit
      :dialog-visible="dialogVisible"
      :type="formType"
      :id="form.id"
      :name="form.name"
      :code="form.code"
      :trigger-interval="form.triggerInterval"
      :strict-mode="form.strictMode"
      :need-interaction="form.needInteraction"
      @close-dialog="dialogVisible = false"
    ></gloria-task-edit>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapMutations } from 'vuex';
import GloriaTaskItem from './GloriaTaskItem.vue';
import GloriaTaskFab from './GloriaTaskFab.vue';
import GloriaTaskEdit from './GloriaTaskEdit.vue';

export default Vue.extend({
  name: 'gloria-task-tab',
  components: { GloriaTaskItem, GloriaTaskFab, GloriaTaskEdit },
  data() {
    return {
      dialogVisible: false,
      formType: 'add',
      form: {
        id: '',
        name: '',
        code: '',
        triggerInterval: 5,
        strictMode: false,
        needInteraction: false,
      },
    };
  },
  computed: {
    ...mapState(['tasks', 'notifications', 'configs']),
  },
  methods: {
    ...mapMutations(['updateIsEnable', 'updateTaskBasis']),
    onAddTask() {
      this.formType = 'add';
      this.dialogVisible = true;
    },
    onTaskEdit(id: string) {
      const { tasks } = this;
      let editStatus = false;
      for (const item of tasks) {
        if (item.id === id) {
          const { name, code, triggerInterval, strictMode, needInteraction } = item;
          this.formType = 'edit';
          Object.assign(this.form, {
            id,
            name,
            code,
            triggerInterval,
            strictMode,
            needInteraction,
          });
          this.dialogVisible = true;
          editStatus = true;
          break;
        }
      }

      !editStatus && this.$message.error(this.i18n('popupTaskErrorEdit'));
    },
  },
});
</script>

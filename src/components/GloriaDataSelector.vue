<template>
  <el-dialog :model-value="visible" :title="title" center destroy-on-close @close="onClose">
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      height="50vh"
      border
      :row-class-name="tableRowClassName"
      @selection-change="handleSelectChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column :prop="keyName">
        <template #header>
          <span>
            {{ i18n('settingsTableName') }}
          </span>
          <span>
            <gloria-search-input class-name="gloria-table-header-input" type="file" @filter-text="onFilterText"></gloria-search-input>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <div class="gloria-table-button-group">
      <el-button @click="onSelection">
        {{ i18n('settingsTableOk') }}
      </el-button>
      <el-button @click="toggleSelection">
        {{ i18n('settingsTableToggle') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import GloriaSearchInput from './GloriaSearchInput.vue';
import { ElTable } from 'element-plus';

export default defineComponent({
  name: 'GloriaDataSelector',
  components: {
    GloriaSearchInput,
  },
  props: {
    tableData: {
      type: Array,
      required: true,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    keyName: {
      type: String,
      default: 'name',
    },
  },
  emits: ['close-selector', 'on-selection'],
  data() {
    return {
      search: '',
      selectData: [] as unknown[],
    };
  },
  methods: {
    onClose() {
      this.$emit('close-selector');
    },
    tableRowClassName({ row }: unknown) {
      const { search, keyName } = this;
      if (!search || row[keyName].toLowerCase().includes(search.toLowerCase())) {
        return '';
      }
      return 'gloria-row-hide';
    },
    onFilterText(text: string) {
      this.search = text;
    },
    handleSelectChange(val: unknown[]) {
      this.selectData = val;
    },
    onSelection() {
      this.$emit('on-selection', this.selectData);
    },
    toggleSelection() {
      (this.$refs.multipleTable as InstanceType<typeof ElTable>).clearSelection();
    },
  },
});
</script>

<style lang="scss">
.gloria-table-header-input {
  margin-left: 50px;
  width: 50%;
}

.el-table {
  .gloria-row-hide {
    display: none;
  }
}

.gloria-table-button-group {
  margin-top: 20px;
}
</style>

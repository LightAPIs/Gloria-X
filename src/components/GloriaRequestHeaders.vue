<template>
  <div class="gloria-request-headers">
    <el-button type="primary" size="small" @click="createRule">
      {{ i18n('headersCreateRule') }}
    </el-button>
    <el-divider content-position="left">
      {{ i18n('headersTable') }}
    </el-divider>

    <el-table :data="rules" tooltip-effect="dark" height="70vh" border :row-class-name="tableRowClassName">
      <el-table-column prop="domain" width="300">
        <template #header>
          <span>
            {{ i18n('headersTableDomain') }}
          </span>
          <span>
            <gloria-search-input class-name="gloria-request-header-input" type="file" @filter-text="onFilterText"></gloria-search-input>
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="i18n('headersTableNameList')">
        <template #default="scope">
          <span v-for="(item, index) in scope.row.headers" :key="index" class="gloria-request-header-tag">
            <el-tooltip effect="dark" :enterable="false" placement="top-start" :content="item.name + ': ' + item.value">
              <el-tag size="medium">{{ item.name }}</el-tag>
            </el-tooltip>
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="i18n('headersTableOperation')" width="200">
        <template #default="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)">{{ i18n('headersTableEdit') }}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">{{ i18n('headersTableDelete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <gloria-rule-edit :id="id" :dialog-visible="dialogVisible" :type="type" @close-dialog="closeDialog"></gloria-rule-edit>
  </div>
</template>

<script lang="ts">
import { ElMessage } from 'element-plus';
import { defineComponent } from 'vue';
import { mapState, mapMutations } from 'vuex';
import GloriaSearchInput from './GloriaSearchInput.vue';
import GloriaRuleEdit from './GloriaRuleEdit.vue';

export default defineComponent({
  name: 'GloriaDebugCode',
  components: {
    GloriaSearchInput,
    GloriaRuleEdit,
  },
  data() {
    return {
      dialogVisible: false,
      type: '',
      id: '',
      search: '',
    };
  },
  computed: {
    ...mapState(['rules']),
  },
  methods: {
    ...mapMutations(['removeRule']),
    createRule() {
      this.type = 'add';
      this.id = this.uuid();
      this.dialogVisible = true;
    },
    handleEdit(id: string) {
      if (id) {
        this.type = 'edit';
        this.id = id;
        this.dialogVisible = true;
      }
    },
    handleDelete(id: string) {
      if (id) {
        this.removeRule(id);
        ElMessage.success(this.i18n('headersDeleteTipSuccess'));
      } else {
        ElMessage.error(this.i18n('headersDeleteTipError'));
      }
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    tableRowClassName({ row }: unknown) {
      const { search } = this;
      if (!search || row.domain.toLowerCase().includes(search.toLowerCase())) {
        return '';
      }
      return 'gloria-row-hide';
    },
    onFilterText(text: string) {
      this.search = text;
    },
  },
});
</script>

<style lang="scss">
.gloria-request-header-tag {
  margin-left: 5px;
}

.gloria-request-header-input {
  margin-left: 25px;
  width: 65%;
}

.el-table {
  .gloria-row-hide {
    display: none;
  }
}
</style>

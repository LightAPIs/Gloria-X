<template>
  <div class="gloria-settings-file">
    <span class="file-btn">
      <el-tooltip placement="top-start" :enterable="false" :content="i18n('settingsImportTooltip')">
        <el-button type="primary" size="small" @click="onImport">
          {{ i18n('settingsImport') }}
        </el-button>
      </el-tooltip>
    </span>

    <span class="file-btn">
      <el-tooltip placement="top-start" :enterable="false" :content="i18n('settingsExportJsonTooltip')">
        <el-button type="info" size="small" @click="onExoprtJson">
          {{ i18n('settingsExportJson') }}
        </el-button>
      </el-tooltip>
    </span>

    <span class="file-btn">
      <el-tooltip placement="top-start" :enterable="false" :content="i18n('settingsExportTextTooltip')">
        <el-button type="info" size="small" @click="onExportText">
          {{ i18n('settingsExportText') }}
        </el-button>
      </el-tooltip>
    </span>
    <gloria-data-selector
      :visible="visible"
      :title="title"
      :table-data="tableData"
      :key-name="keyName"
      @close-selector="closeSelector"
      @on-selection="onSelection"
    ></gloria-data-selector>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ElMessage } from 'element-plus';
import GloriaDataSelector from './GloriaDataSelector.vue';
import AES from 'crypto-js/aes';
import encUtf8 from 'crypto-js/enc-utf8';
import { exportFile, importFile } from '@/commons/file';

export default defineComponent({
  name: 'GloriaSettingsFile',
  components: {
    GloriaDataSelector,
  },
  props: {
    secretKey: {
      type: String,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    keyName: {
      type: String,
      required: true,
    },
  },
  emits: ['merge-data'],
  setup() {
    return {
      exportFile,
      importFile,
    };
  },
  data() {
    return {
      type: '',
      title: '',
      visible: false,
      tableData: [] as unknown[],
    };
  },
  methods: {
    onImport() {
      try {
        this.importFile((status, content) => {
          if (status) {
            if (content) {
              if (/^\[/.test(content)) {
                this.handleImport(content);
              } else {
                const bytes = AES.decrypt(content, this.secretKey);
                const originalText = bytes.toString(encUtf8);
                this.handleImport(originalText);
              }
            } else {
              ElMessage.error(this.i18n('settingsImportEmpty'));
            }
          } else {
            content === 'no file' && ElMessage.warning(this.i18n('settingsImoprtNoFile'));
            content === 'invalid' && ElMessage.error(this.i18n('settingsImportInvalid'));
          }
        });
      } catch (e) {
        console.error(e);
        ElMessage.error(this.i18n('settingsImportUnkown'));
      }
    },
    handleImport(content: string) {
      try {
        const importArr = JSON.parse(content);
        if (Array.isArray(importArr)) {
          this.title = this.i18n('settingsImport');
          this.type = 'import';
          this.tableData = importArr;
          this.visible = true;
        } else {
          ElMessage.warning(this.i18n('settingsImportNoArray'));
        }
      } catch (e) {
        console.error(e);
        ElMessage.error(this.i18n('settingsImportUnkown'));
      }
    },
    onExoprtJson() {
      const { data } = this;
      this.title = this.i18n('settingsExportJson');
      this.type = 'exportJson';
      this.tableData = data;
      this.visible = true;
    },
    onExportText() {
      const { data } = this;
      this.title = this.i18n('settingsExportText');
      this.type = 'exportText';
      this.tableData = data;
      this.visible = true;
    },
    closeSelector() {
      this.visible = false;
    },
    onSelection(selectData: unknown[]) {
      const { type, fileName } = this;
      this.visible = false;
      switch (type) {
        case 'exportJson':
          this.exportFile(JSON.stringify(selectData, null, 2), `${fileName || 'no-name'}.json`, () => {
            ElMessage.success(this.i18n('settingsExportJsonSuccess'));
          });
          break;
        case 'exportText':
          this.exportFile(AES.encrypt(JSON.stringify(selectData), this.secretKey).toString(), `${fileName || 'no-name'}.txt`, () => {
            ElMessage.success(this.i18n('settingsExportTextSuccess'));
          });
          break;
        case 'import':
          this.$emit('merge-data', selectData);
          ElMessage.success(this.i18n('settingsImportSuccess'));
      }
    },
  },
});
</script>

<style>
.file-btn {
  margin-right: 30px;
}
</style>

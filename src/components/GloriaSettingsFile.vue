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
    <gloria-task-selector
      :visible="visible"
      :title="title"
      :table-data="tableData"
      @close-selector="closeSelector"
      @on-selection="onSelection"
    ></gloria-task-selector>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapMutations, mapState } from 'vuex';
import { ElMessage } from 'element-plus';
import GloriaTaskSelector from './GloriaTaskSelector.vue';
import AES from 'crypto-js/aes';
import encUtf8 from 'crypto-js/enc-utf8';

const secretKey = '048e0efc-da28-4322-a93c-37fa69e84df8';

export default defineComponent({
  name: 'GloriaSettingsFile',
  components: {
    GloriaTaskSelector,
  },
  setup() {
    const exportFile = (content: string, filename: string, completed?: () => void) => {
      const exportBlob = new Blob([content]);
      const saveLink = document.createElement('a');
      saveLink.href = URL.createObjectURL(exportBlob);
      saveLink.download = filename;

      /** MouseEvent 鼠标事件构造器 */
      const ev = new MouseEvent('click', {
        bubbles: true,
        cancelable: false,
        screenX: 0,
        screenY: 0,
        clientX: 0,
        clientY: 0,
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false,
        button: 0,
        relatedTarget: null,
      });
      saveLink.dispatchEvent(ev);

      typeof completed === 'function' && completed();
    };

    const importFile = (callback: (status: boolean, content: string) => void) => {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.txt, .text, .json, .conf, .config';
      fileInput.style.display = 'none';

      fileInput.addEventListener('change', () => {
        if (!fileInput.value) {
          callback(false, 'no file');
          return;
        }

        if (fileInput.files) {
          const file = fileInput.files[0];
          const { type } = file;

          if (type !== 'application/json' && type !== 'application/xml' && type !== 'text/plain') {
            callback(false, 'invalid');
            return;
          }

          const reader = new FileReader();
          reader.onload = function (e) {
            const { target } = e;
            if (target) {
              const data = target.result;
              callback(true, data as string);
            }
            return;
          };

          reader.readAsText(file);
        }
      });

      fileInput.click();
    };

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
  computed: {
    ...mapState(['tasks']),
  },
  methods: {
    ...mapMutations(['mergeTasks']),
    onImport() {
      try {
        this.importFile((status, content) => {
          if (status) {
            if (content) {
              if (/^\[/.test(content)) {
                this.handleImport(content);
              } else {
                const bytes = AES.decrypt(content, secretKey);
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
      const { tasks } = this;
      this.title = this.i18n('settingsExportJson');
      this.type = 'exportJson';
      this.tableData = tasks;
      this.visible = true;
    },
    onExportText() {
      const { tasks } = this;
      this.type = 'exportText';
      this.tableData = tasks;
      this.visible = true;
    },
    closeSelector() {
      this.visible = false;
    },
    onSelection(selectData: unknown[]) {
      const { type } = this;
      this.visible = false;
      switch (type) {
        case 'exportJson':
          this.exportFile(JSON.stringify(selectData, null, 2), 'tasks.json', () => {
            ElMessage.success(this.i18n('settingsExportJsonSuccess'));
          });
          break;
        case 'exportText':
          this.exportFile(AES.encrypt(JSON.stringify(selectData), secretKey).toString(), 'tasks.txt', () => {
            ElMessage.success(this.i18n('settingsExportTextSuccess'));
          });
          break;
        case 'import':
          this.mergeTasks(selectData);
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

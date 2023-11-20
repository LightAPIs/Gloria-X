<template>
  <div id="gloria-options-app" class="gloria-theme" :class="configs.appearanceInterface">
    <el-container class="options-container">
      <el-aside class="options-aside">
        <gloria-options-menu :active-index="activeIndex" @menu-click="menuClick"></gloria-options-menu>
      </el-aside>
      <el-container>
        <el-header class="options-header">
          <el-row>
            <el-col :span="12">
              <gloria-options-breadcrumb :breadcrumb-index="activeIndex"></gloria-options-breadcrumb>
            </el-col>
            <el-col :span="12">
              <div style="text-align: right">
                <span class="gloria-config-button" :title="i18n('settingsConfigExportTip')" @click="onExport">
                  {{ i18n('settingsConfigExport') }}
                </span>
                <el-popconfirm
                  placement="left-start"
                  effect="dark"
                  :title="i18n('settingsConfigImportWarn')"
                  :confirm-button-text="i18n('confirmText')"
                  :cancel-button-text="i18n('cancelText')"
                  @confirm="onImport"
                >
                  <template #reference>
                    <span class="gloria-config-button" :title="i18n('settingsConfigImportTip')">
                      {{ i18n('settingsConfigImport') }}
                    </span>
                  </template>
                </el-popconfirm>
              </div>
            </el-col>
          </el-row>
        </el-header>
        <el-scrollbar :native="false" :noresize="false" tag="div">
          <el-main>
            <router-view></router-view>
          </el-main>
        </el-scrollbar>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { mapState, mapGetters, mapMutations } from 'vuex';
import { ElMessage } from 'element-plus';
import GloriaOptionsMenu from '@/components/GloriaOptionsMenu.vue';
import GloriaOptionsBreadcrumb from '@/components/GloriaOptionsBreadcrumb.vue';
import { exportFile, importFile } from '@/commons/file';
import { defaultConfigs } from '@/store/basic';

export default defineComponent({
  name: 'App',
  components: {
    GloriaOptionsMenu,
    GloriaOptionsBreadcrumb,
  },
  setup() {
    const { hash } = location;
    let activeIndex = ref('settings');
    if (hash.includes('#/debug')) {
      activeIndex.value = 'debug';
    } else if (hash.includes('#/state')) {
      activeIndex.value = 'state';
    } else if (hash.includes('#/headers')) {
      activeIndex.value = 'headers';
    } else if (hash.includes('#/reducer')) {
      activeIndex.value = 'reducer';
    } else if (hash.includes('#/about')) {
      activeIndex.value = 'about';
    } else {
      activeIndex.value = 'settings';
    }

    return {
      activeIndex,
      exportFile,
      importFile,
    };
  },
  computed: {
    ...mapState(['configs']),
    ...mapGetters(['exportConetnt']),
  },
  methods: {
    ...mapMutations(['updateImplicitPush', 'saveConfigs', 'saveReducer', 'saveRules', 'saveTasks']),
    menuClick(index: string) {
      this.activeIndex = index;
    },
    onExport() {
      this.exportFile(this.exportConetnt, 'gloria_x.txt', () => {
        ElMessage.success(this.i18n('settingsExportJsonSuccess'));
      });
    },
    onImport() {
      try {
        this.importFile((status, content) => {
          if (status) {
            if (content) {
              if (/^{"implicitPush":/.test(content)) {
                try {
                  const importObj = JSON.parse(content);
                  if (typeof importObj === 'object' && importObj) {
                    const { implicitPush = false, tasks = [], rules = [], reducer = '', configs = defaultConfigs() } = importObj;
                    this.updateImplicitPush(implicitPush);
                    this.saveConfigs(configs);
                    this.saveReducer(reducer);
                    this.saveRules(rules);
                    this.saveTasks(tasks);
                  }
                } catch (e) {
                  console.error(e);
                  ElMessage.error(this.i18n('settingsImportUnkown'));
                }
              } else {
                ElMessage.error(this.i18n('settingsImportInvalid'));
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
  },
});
</script>

<style lang="scss">
@import '~@/scss/index.scss';

#gloria-options-app {
  position: absolute;
  height: 100%;
  width: 100%;
  .options-container {
    height: 100%;
  }
  .options-aside {
    overflow-x: hidden;
    background-color: #001529;
  }
  .options-header {
    padding: 24px;
    background-color: #0b1a29;
  }

  .options-tip-icon {
    margin-left: 5px;

    i {
      font-size: 1.25em;
      cursor: help;
    }
  }

  .gloria-config-button {
    color: #9a9aff;
    margin: 0 10px;
    cursor: pointer;
  }
}

.el-scrollbar__thumb {
  background-color: rgb(36, 46, 68, 0.5);

  &:hover {
    background-color: rgb(36, 46, 68, 0.8);
  }
}
</style>

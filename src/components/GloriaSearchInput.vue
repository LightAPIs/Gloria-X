<template>
  <el-input
    size="mini"
    :prefix-icon="searching ? 'el-icon-loading' : 'el-icon-search'"
    :placeholder="type === 'tasks' ? i18n('searchTaskPlaceholder') : i18n('searchNotificationPlaceholder')"
    v-model="filterText"
    clearable
  >
    <template #append v-if="type === 'tasks'">
      <el-dropdown split-button trigger="click" @command="handleCommand">
        <span>{{ dropdownText }}</span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="all">
              {{ i18n('searchTaskFilterAll') }}
            </el-dropdown-item>
            <el-dropdown-item command="enabled">
              {{ i18n('searchTaskFilterEnabled') }}
            </el-dropdown-item>
            <el-dropdown-item command="disabled">
              {{ i18n('searchTaskFilterDisabled') }}
            </el-dropdown-item>
            <el-dropdown-item command="onTime">
              {{ i18n('popupTaskOnTimeModeTag') }}
            </el-dropdown-item>
            <el-dropdown-item command="needInteraction">
              {{ i18n('popupTaskNeedInteractionTag') }}
            </el-dropdown-item>
            <el-dropdown-item command="error">
              {{ i18n('searchTaskFilterError') }}
            </el-dropdown-item>
            <el-dropdown-item command="install">
              {{ i18n('searchTaskFilterInstall') }}
            </el-dropdown-item>
            <el-dropdown-item command="local">
              {{ i18n('searchTaskFilterLocal') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </template>
  </el-input>
</template>

<script lang="ts">
import { defineComponent, nextTick } from 'vue';
import debounce from 'lodash.debounce';

export default defineComponent({
  name: 'gloria-search-input',
  props: {
    type: {
      type: String,
      required: true,
    },
  },
  setup() {
    const getRemote = debounce(
      function (func) {
        func();
      },
      1000,
      {
        trailing: true,
      }
    );

    return {
      getRemote,
    };
  },
  emits: ['filter-text', 'filter-type'],
  data() {
    return {
      filterText: '',
      filterType: 'all',
      dropdownText: this.i18n('searchTaskFilterAll'),
      searching: false,
    };
  },
  watch: {
    filterText(val: string) {
      this.searching = true;
      this.getRemote(() => {
        this.$emit('filter-text', val);
        nextTick(() => {
          this.searching = false;
        });
      });
    },
  },
  methods: {
    handleCommand(command: string) {
      this.filterType = command || 'all';

      switch (this.filterType) {
        case 'enabled':
          this.dropdownText = this.i18n('searchTaskFilterEnabled');
          break;
        case 'disabled':
          this.dropdownText = this.i18n('searchTaskFilterDisabled');
          break;
        case 'onTime':
          this.dropdownText = this.i18n('popupTaskOnTimeModeTag');
          break;
        case 'needInteraction':
          this.dropdownText = this.i18n('popupTaskNeedInteractionTag');
          break;
        case 'error':
          this.dropdownText = this.i18n('searchTaskFilterError');
          break;
        case 'install':
          this.dropdownText = this.i18n('searchTaskFilterInstall');
          break;
        case 'local':
          this.dropdownText = this.i18n('searchTaskFilterLocal');
          break;
        case 'all':
        default:
          this.dropdownText = this.i18n('searchTaskFilterAll');
          break;
      }

      this.$emit('filter-type', this.filterType);
    },
  },
});
</script>

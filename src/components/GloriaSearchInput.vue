<template>
  <el-input
    size="mini"
    :prefix-icon="searching ? 'el-icon-loading' : 'el-icon-search'"
    :placeholder="type === 'tasks' ? i18n('searchTaskPlaceholder') : i18n('searchNotificationPlaceholder')"
    v-model="filterText"
    clearable
  ></el-input>
</template>

<script lang="ts">
import Vue from 'vue';
import { debounce } from 'lodash';

export default Vue.extend({
  name: 'gloria-search-input',
  props: {
    type: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      filterText: '',
      searching: false,
    };
  },
  watch: {
    filterText(val) {
      this.searching = true;
      this.getRemote(() => {
        this.$emit('filter', val);
        this.$nextTick(() => {
          this.searching = false;
        });
      });
    },
  },
  methods: {
    getRemote: debounce(
      function(func) {
        func();
      },
      1000,
      {
        trailing: true,
      }
    ),
  },
});
</script>

<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item>
      {{ i18n('optionsTitle') }}
    </el-breadcrumb-item>
    <el-breadcrumb-item>
      {{ breadcrumbItem }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'GloriaOptionsHeader',
  props: {
    breadcrumbIndex: {
      type: String,
      required: true,
    },
  },
  computed: {
    breadcrumbItem() {
      const { breadcrumbIndex } = this;
      let itemText = '';
      switch (breadcrumbIndex) {
        case 'debug':
          itemText = this.i18n('optionsDebugMenu');
          break;
        case 'state':
          itemText = this.i18n('optionsStateMenu');
          break;
        case 'reducer':
          itemText = this.i18n('optionsReducerMenu');
          break;
        case 'about':
          itemText = this.i18n('optionsAboutMenu');
          break;
        case 'settings':
        default:
          itemText = this.i18n('optionsSettingsMenu');
          break;
      }
      return itemText;
    },
  },
});
</script>

<template>
  <el-button type="success" class="fab-button" icon="el-icon-plus" circle :title="i18n('popupTaskAdd')" @click="onClick"></el-button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'GloriaTaskFab',
  emits: ['add-task'],
  methods: {
    onClick() {
      this.$emit('add-task');
    },
  },
});
</script>

<style>
.fab-button {
  position: fixed;
  right: 45px;
  bottom: 15px;
}
</style>

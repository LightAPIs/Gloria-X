<template>
  <div id="generation-app">
    <el-container>
      <el-header height="30px">
        <gloria-generation-toolbar></gloria-generation-toolbar>
      </el-header>
      <el-main class="generation-main">
        <gloria-generation-content></gloria-generation-content>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import GloriaGenerationContent from '@/components/GloriaGenerationContent.vue';
import GloriaGenerationToolbar from '@/components/GloriaGenerationToolbar.vue';

export default Vue.extend({
  name: 'app',
  components: {
    GloriaGenerationContent,
    GloriaGenerationToolbar,
  },
});
</script>

<style>
body {
  background: #ffffff;
  overflow: hidden;
}
.generation-main {
  overflow: auto;
  max-height: 260px;
  padding: 8px 10px 4px 10px;
}
</style>

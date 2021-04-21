<template>
  <div id="gloria-generation-app" class="gloria-theme" :class="configs.appearanceInterface">
    <el-container>
      <el-header height="32px" style="margin-top: 4px">
        <gloria-generation-toolbar :active="active"></gloria-generation-toolbar>
      </el-header>
      <el-main class="generation-main">
        <gloria-generation-content @active-index="onActiveIndex"></gloria-generation-content>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import GloriaGenerationContent from '@/components/GloriaGenerationContent.vue';
import GloriaGenerationToolbar from '@/components/GloriaGenerationToolbar.vue';

export default defineComponent({
  name: 'App',
  components: {
    GloriaGenerationContent,
    GloriaGenerationToolbar,
  },
  data() {
    return {
      active: 0,
    };
  },
  computed: {
    ...mapState(['configs']),
  },
  methods: {
    onActiveIndex(index: number) {
      this.active = index;
    },
  },
});
</script>

<style lang="scss">
@import '~@/scss/index.scss';

body {
  background: #ffffff;
}

.generation-main {
  overflow: auto;
  max-height: 260px;
  padding: 8px 10px 4px 10px;
}
</style>

<template>
  <div id="debug-router">
    <gloria-debug-code></gloria-debug-code>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import GloriaDebugCode from '@/components/GloriaDebugCode.vue';

export default defineComponent({
  name: 'RouterDebug',
  components: {
    GloriaDebugCode,
  },
});
</script>

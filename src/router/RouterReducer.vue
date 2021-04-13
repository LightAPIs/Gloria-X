<template>
  <div id="reducer-router">
    <gloria-reducer-content></gloria-reducer-content>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import GloriaReducerContent from '@/components/GloriaReducerContent.vue';

export default defineComponent({
  name: 'router-reducer',
  components: {
    GloriaReducerContent,
  },
});
</script>

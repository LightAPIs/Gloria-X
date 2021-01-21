<template>
  <div id="reducer-router">
    <gloria-reducer-content></gloria-reducer-content>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import GloriaReducerContent from '@/components/GloriaReducerContent.vue';

export default Vue.extend({
  name: 'router-reducer',
  components: {
    GloriaReducerContent,
  },
});
</script>

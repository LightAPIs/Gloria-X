<template>
  <div id="about-router">
    <gloria-about-content></gloria-about-content>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import GloriaAboutContent from '@/components/GloriaAboutContent.vue';

export default defineComponent({
  name: 'router-about',
  components: {
    GloriaAboutContent,
  },
});
</script>

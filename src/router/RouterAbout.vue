<template>
  <div id="about-router">
    <gloria-about-content></gloria-about-content>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import GloriaAboutContent from '@/components/GloriaAboutContent.vue';

export default Vue.extend({
  name: 'router-about',
  components: {
    GloriaAboutContent,
  },
});
</script>

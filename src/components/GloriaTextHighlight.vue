<template>
  <span :class="className" class="gloria-text-content">
    <template v-for="(item, index) in htmlText" :key="index">
      <span v-if="item.normal" class="gloria-normal-text">
        {{ item.normal }}
      </span>
      <b v-if="item.highlight" class="gloria-highlight-text">
        {{ item.highlight }}
      </b>
    </template>
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'GloriaTextHighlight',
  props: {
    text: {
      type: String,
      required: true,
    },
    keyword: {
      type: String,
      default: '',
    },
    className: {
      type: String,
      default: '',
    },
  },
  computed: {
    htmlText(): { normal: string; highlight: string }[] {
      const { text, keyword } = this;
      const resText = [];
      if (keyword) {
        const find = this.findAll(text.toLowerCase(), keyword.toLowerCase());
        if (find.length > 0) {
          const len = keyword.length;
          let start = 0,
            normal = '',
            highlight = '';

          for (const index of find) {
            normal = text.substring(start, index);
            highlight = text.substring(index, index + len);
            resText.push({
              normal,
              highlight,
            });
            start = index + len;
          }

          if (start < text.length) {
            resText.push({
              normal: text.substring(start),
              highlight: '',
            });
          }
        } else {
          resText.push({
            normal: text,
            highlight: '',
          });
        }
      } else {
        resText.push({
          normal: text,
          highlight: '',
        });
      }

      return resText;
    },
  },
});
</script>

<style>
.gloria-text-content {
  word-break: break-all;
}
</style>

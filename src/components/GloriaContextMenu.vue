<template>
  <div
    v-if="isShow"
    class="context-menu gloria-context-menu"
    :style="{ left: left + 'px', top: top + 'px' }"
    ref="menu"
    @contextmenu="e => e.preventDefault()"
  >
    <div class="menu-body">
      <template v-for="(item, index) in items">
        <div :key="index" v-if="item.label" class="menu-item" :class="{ 'menu-divided': item.divided }" @click="item.onClick">
          <i class="menu-item-icon" :class="item.icon"></i>
          <span>{{ item.label }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick } from 'vue';

export default defineComponent({
  name: 'gloria-context-menu',
  props: {
    isShow: {
      type: Boolean,
      required: false,
    },
    items: {
      type: Array,
      required: true,
    },
    contextEvent: {
      type: MouseEvent,
    },
  },
  emits: ['close'],
  data() {
    return {
      mosueListening: false,
      left: 0,
      top: 0,
    };
  },
  computed: {
    x() {
      const { contextEvent } = this;
      let temp = 0;
      if (contextEvent) {
        temp = contextEvent.clientX;
      }
      return temp;
    },
    y() {
      const { contextEvent } = this;
      let temp = 0;
      if (contextEvent) {
        temp = contextEvent.clientY;
      }
      return temp;
    },
  },
  methods: {
    mouseClickListener() {
      this.$emit('close');
    },
    mouseWheelListener() {
      this.$emit('close');
    },
    addListener() {
      if (!this.mosueListening) {
        document.addEventListener('click', this.mouseClickListener);
        document.addEventListener('mousewheel', this.mouseWheelListener);
        this.mosueListening = true;
      }
    },
    removeListener() {
      if (this.mosueListening) {
        document.removeEventListener('click', this.mouseClickListener);
        document.removeEventListener('mousewheel', this.mouseWheelListener);
        this.mosueListening = false;
      }
    },
  },
  mounted() {
    this.addListener();
  },
  updated() {
    if (this.isShow) {
      nextTick(() => {
        const windowWidth = document.documentElement.clientWidth;
        const windowHeight = document.documentElement.clientHeight;
        const menu = this.$refs.menu as HTMLElement;
        const menuWidth = menu.offsetWidth;
        const menuHeight = menu.offsetHeight;

        if (this.x + menuWidth > windowWidth) {
          this.left = this.x - menuWidth;
        } else {
          this.left = this.x;
        }

        if (this.y + menuHeight > windowHeight) {
          this.top = this.y - menuHeight;
        } else {
          this.top = this.y;
        }
      });
    }
  },
  unmounted() {
    this.removeListener();
  },
});
</script>
